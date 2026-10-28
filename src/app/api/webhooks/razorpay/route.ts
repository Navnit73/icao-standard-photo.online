/**
 * POST /api/webhooks/razorpay
 * Razorpay webhook endpoint for independent payment confirmation — fulfils orders even if the
 * customer closes the tab before /api/payments/verify runs.
 *
 * Configure in Razorpay Dashboard → Settings → Webhooks:
 *   https://icao-standard-photo.online/api/webhooks/razorpay
 *   Events: payment.captured, payment.failed
 *   Secret: RAZORPAY_WEBHOOK_SECRET
 */

import { after } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { markPaymentFailed, markPaymentPaid } from "@/lib/payments/payment-service";
import { fulfillPayment } from "@/lib/payments/fulfillment-service";
import { getWebhookEventCollection } from "@/lib/models/WebhookEvent";
import { logActivity } from "@/lib/logging/activity-logger";

const isDuplicateKey = (e: unknown) => typeof e === "object" && e !== null && (e as { code?: number }).code === 11000;

export async function POST(request: Request) {
  // Raw body is required for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";

  if (!signature) return Response.json({ error: "Missing webhook signature." }, { status: 400 });
  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error("[webhook] Invalid Razorpay webhook signature.");
    return Response.json({ error: "Invalid signature." }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);
    // Razorpay sends the event id as a header; it stays the same across retries
    const eventId = request.headers.get("x-razorpay-event-id") ?? event.id ?? "";
    const eventType: string = event.event ?? "";

    const paymentEntity = event.payload?.payment?.entity;
    const razorpayOrderId: string = paymentEntity?.order_id ?? "";
    const razorpayPaymentId: string = paymentEntity?.id ?? "";

    // Atomic deduplication — unique index on eventId blocks concurrent duplicates
    const webhookCol = await getWebhookEventCollection();
    if (eventId) {
      try {
        await webhookCol.insertOne({
          eventId,
          eventType,
          razorpayPaymentId,
          razorpayOrderId,
          status: "processing",
          createdAt: new Date(),
        });
      } catch (insertErr) {
        if (isDuplicateKey(insertErr)) return Response.json({ status: "already_processed" });
        throw insertErr;
      }
    }

    const markProcessed = (metadata?: Record<string, unknown>) =>
      eventId
        ? webhookCol.updateOne({ eventId }, { $set: { status: "processed", processedAt: new Date(), metadata } })
        : Promise.resolve();

    await logActivity({
      event: "payment_webhook_received",
      status: eventType,
      metadata: { eventId, razorpayOrderId, razorpayPaymentId },
    });

    if (eventType === "payment.captured" && razorpayOrderId) {
      const { payment } = await markPaymentPaid({ razorpayOrderId, razorpayPaymentId });
      await markProcessed();

      // after() keeps the function alive until fulfillment finishes; a bare un-awaited promise
      // can be frozen once the response is sent
      if (payment) {
        after(async () => {
          try {
            await fulfillPayment(payment.paymentId);
          } catch (err) {
            console.error("[webhook] Fulfillment error:", err);
          }
        });
      }
      return Response.json({ status: "captured" });
    }

    if (eventType === "payment.failed" && razorpayOrderId) {
      await markPaymentFailed({
        razorpayOrderId,
        razorpayPaymentId,
        reason: paymentEntity?.error_description || "Payment failed",
      });
      await markProcessed();
      return Response.json({ status: "failed_recorded" });
    }

    // Unhandled event type — acknowledge receipt
    await markProcessed({ note: "Unhandled event type" });
    return Response.json({ status: "acknowledged" });
  } catch (e) {
    // 500 makes Razorpay retry; the dedupe record is removed so the retry isn't skipped
    console.error("[webhook] Error processing Razorpay webhook:", e);
    const eventId = request.headers.get("x-razorpay-event-id");
    if (eventId) {
      await getWebhookEventCollection()
        .then((col) => col.deleteOne({ eventId, status: "processing" }))
        .catch(() => {});
    }
    return Response.json({ error: "Internal processing error." }, { status: 500 });
  }
}
