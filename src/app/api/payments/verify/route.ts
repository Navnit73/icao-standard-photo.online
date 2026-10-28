/**
 * POST /api/payments/verify
 * Verifies the Razorpay checkout signature, marks the payment as paid and triggers fulfillment.
 */

import { verifyPaymentSignature } from "@/lib/payments/razorpay";
import { getPaymentByOrderId, markPaymentPaid } from "@/lib/payments/payment-service";
import { fulfillPayment } from "@/lib/payments/fulfillment-service";
import { logActivity } from "@/lib/logging/activity-logger";

const error = (message: string, status: number) => Response.json({ success: false, error: message }, { status });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const paymentId = String(body?.paymentId ?? "");
  const razorpayOrderId = String(body?.razorpayOrderId ?? "");
  const razorpayPaymentId = String(body?.razorpayPaymentId ?? "");
  const razorpaySignature = String(body?.razorpaySignature ?? "");

  if (!paymentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return error("Invalid verification data.", 422);
  }

  try {
    if (!verifyPaymentSignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature })) {
      await logActivity({
        event: "payment_failed",
        status: "invalid_signature",
        paymentId,
        metadata: { razorpayOrderId },
      });
      return error("Payment verification failed.", 400);
    }

    // The order must belong to the payment the client claims before we touch it
    const existing = await getPaymentByOrderId(razorpayOrderId);
    if (!existing || existing.paymentId !== paymentId) return error("Payment record not found.", 404);

    // Mark as paid (idempotent)
    const { transitioned, payment } = await markPaymentPaid({ razorpayOrderId, razorpayPaymentId });
    if (payment?.status !== "paid") return error("This payment is no longer active. Please contact support.", 409);

    await logActivity({
      event: "payment_success",
      status: transitioned ? "newly_paid" : "already_paid",
      paymentId,
      email: payment.email,
      metadata: { razorpayOrderId, razorpayPaymentId },
    });

    // Fulfillment (invoice, download token, email). Its failure must not fail a paid checkout:
    // the webhook retries it and the thank-you page polls status.
    let downloadToken: string | undefined;
    let invoiceNumber = payment.invoice?.invoiceNumber;
    try {
      const fulfillment = await fulfillPayment(paymentId);
      downloadToken = fulfillment.downloadToken;
      invoiceNumber = fulfillment.invoiceNumber || invoiceNumber;
    } catch (fulfillErr) {
      console.error("[verify] Fulfillment error:", fulfillErr);
    }

    return Response.json({ success: true, paymentId, status: "paid", downloadToken, invoiceNumber });
  } catch (e) {
    console.error("[verify] Error:", e);
    return error("Payment verification failed. Please contact support.", 500);
  }
}
