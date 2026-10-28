/**
 * GET /api/invoices/[paymentId]
 * Invoice for a paid order: HTML by default, PDF with ?format=pdf.
 */

import type { NextRequest } from "next/server";
import { getPaymentById } from "@/lib/payments/payment-service";
import { generateInvoiceHtml, type InvoiceData } from "@/lib/invoices/invoice-service";
import { generateInvoicePdfBuffer } from "@/lib/invoices/invoice-pdf";
import { extractCustomerName, fetchRazorpayPayment } from "@/lib/payments/razorpay";

const NO_STORE = "private, no-cache, no-store";

export async function GET(request: NextRequest, { params }: RouteContext<"/api/invoices/[paymentId]">) {
  const { paymentId } = await params;

  try {
    const payment = await getPaymentById(paymentId);
    if (!payment) return Response.json({ error: "Invoice not found." }, { status: 404 });
    // Invoice number is assigned during fulfillment, which runs right after payment
    if (payment.status !== "paid" || !payment.invoice?.invoiceNumber) {
      return Response.json({ error: "Invoice is only available for paid orders." }, { status: 403 });
    }

    // Customer name from Razorpay payment details, falling back to the email
    const rzPayment = payment.razorpayPaymentId ? await fetchRazorpayPayment(payment.razorpayPaymentId) : null;

    const data: InvoiceData = {
      invoiceNumber: payment.invoice.invoiceNumber,
      email: payment.email,
      customerName: extractCustomerName(rzPayment, payment.email),
      amount: payment.amount,
      currency: payment.currency,
      razorpayPaymentId: payment.razorpayPaymentId || "N/A",
      razorpayOrderId: payment.razorpayOrderId,
      paidAt: payment.paidAt || payment.updatedAt,
      countryName: payment.metadata?.countryName,
      dimensions: payment.image?.dimensions,
      planType: payment.planType,
    };

    if (request.nextUrl.searchParams.get("format") === "pdf") {
      const pdf = await generateInvoicePdfBuffer(data);
      return new Response(new Uint8Array(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Invoice-${data.invoiceNumber}.pdf"`,
          "Cache-Control": NO_STORE,
        },
      });
    }

    return new Response(generateInvoiceHtml(data), {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": NO_STORE },
    });
  } catch (e) {
    console.error("[invoice] Error:", e);
    return Response.json({ error: "Failed to generate invoice." }, { status: 500 });
  }
}
