/**
 * GET /api/payments/status/[paymentId]
 * Payment status — polled by the thank-you page after checkout.
 * Also retries fulfillment for a paid order that hasn't completed (e.g. the email failed).
 */

import { after } from "next/server";
import { getPaymentById } from "@/lib/payments/payment-service";
import { ensureDownloadToken, fulfillPayment } from "@/lib/payments/fulfillment-service";

export async function GET(_request: Request, { params }: RouteContext<"/api/payments/status/[paymentId]">) {
  const { paymentId } = await params;

  try {
    const payment = await getPaymentById(paymentId);
    if (!payment) return Response.json({ success: false, error: "Payment not found." }, { status: 404 });

    const isPaid = payment.status === "paid";
    // fulfillPayment holds its own lock, so overlapping polls can't run it twice
    if (isPaid && (payment.fulfillmentStatus === "pending" || payment.fulfillmentStatus === "failed")) {
      after(() => fulfillPayment(paymentId).catch((err) => console.error("[payment-status] Fulfillment retry:", err)));
    }

    return Response.json({
      success: true,
      paymentId: payment.paymentId,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      planType: payment.planType ?? "standard",
      fulfillmentStatus: payment.fulfillmentStatus,
      emailStatus: payment.emailDelivery.status,
      downloadToken: isPaid ? await ensureDownloadToken(paymentId) : undefined,
      invoiceNumber: payment.invoice?.invoiceNumber,
      paidAt: payment.paidAt,
    });
  } catch (e) {
    console.error("[payment-status] Error:", e);
    return Response.json({ success: false, error: "Failed to check payment status." }, { status: 500 });
  }
}
