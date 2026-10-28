/**
 * Invoice Service — generates invoice numbers and the printable HTML invoice.
 * Uses verified Razorpay payment data, never client-supplied amounts.
 */

import { getDb } from "@/lib/server/db";
import { PRICING } from "@/lib/config/pricing";
import { formatMoney } from "@/lib/currency";
import { siteConfig } from "@/config/site";
import { extractCustomerName } from "@/lib/payments/razorpay";

/**
 * Next sequential invoice number from an atomic Mongo counter, so numbers never collide
 * across serverless instances. Format: INV-YYYY-XXXXXX (e.g. INV-2026-000111)
 */
export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const counter = await (await getDb())
    .collection<{ _id: string; seq: number }>("counters")
    .findOneAndUpdate({ _id: `invoice-${year}` }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return `INV-${year}-${String(counter!.seq).padStart(6, "0")}`;
}

export interface InvoiceData {
  invoiceNumber: string;
  email: string;
  customerName?: string;
  amount: number; // in smallest unit
  currency: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  paidAt: Date;
  countryName?: string;
  dimensions?: string;
  planType?: "standard" | "expert_edit";
}

/** Fields shared by the HTML and PDF invoice */
export function invoiceFields(params: InvoiceData) {
  const { business } = siteConfig;
  return {
    seller: {
      name: siteConfig.name,
      address: `${business.locality}, ${business.region}, ${business.country}`,
      email: siteConfig.supportEmail,
      website: siteConfig.url.replace(/^https?:\/\//, ""),
    },
    customerName: params.customerName || extractCustomerName(undefined, params.email),
    amountFormatted: formatMoney(params.amount, params.currency),
    zeroFormatted: formatMoney(0, params.currency),
    paidDate: new Date(params.paidAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
    itemTitle: `${params.countryName ? `${params.countryName} ` : ""}${PRICING.productName}${params.planType === "expert_edit" ? " + Expert edit" : ""}`,
    itemDescription: `Digital photo${params.dimensions ? ` (${params.dimensions} px)` : ""} checked against ICAO 9303.${params.planType === "expert_edit" ? " Includes manual review and retouch by a photo specialist." : ""}`,
  };
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Printable HTML invoice (served by /api/invoices/[paymentId]).
 */
export function generateInvoiceHtml(params: InvoiceData): string {
  const f = invoiceFields(params);
  const e = escapeHtml;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="robots" content="noindex"/>
  <title>Invoice ${e(params.invoiceNumber)} — ${e(f.seller.name)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f9fafb; color: #111; line-height: 1.5; padding: 24px 16px; }
    .bar, .card { max-width: 760px; margin: 0 auto; }
    .bar { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
    .btn { display: inline-flex; align-items: center; padding: 10px 16px; font-weight: 600; font-size: 14px; font-family: inherit; border-radius: 8px; cursor: pointer; text-decoration: none; border: 1px solid #e5e7eb; background: #fff; color: #111; }
    .btn-primary { background: #65a30d; border-color: #65a30d; color: #fff; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 32px; box-shadow: 0 1px 2px rgba(0,0,0,.05); }
    .head { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; }
    h1 { font-size: 20px; } .muted { color: #6b7280; font-size: 13px; }
    .right { text-align: right; } .mono { font-family: ui-monospace, Menlo, monospace; font-size: 12px; }
    .badge { display: inline-block; margin-top: 6px; padding: 2px 10px; border-radius: 6px; background: rgba(101,163,13,.1); color: #4d7c0f; font-size: 12px; font-weight: 700; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
    .box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 13px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #6b7280; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    td { padding: 14px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    .totals { margin-left: auto; width: 280px; margin-top: 16px; font-size: 13px; }
    .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
    .total { font-weight: 700; font-size: 15px; border-top: 1px solid #e5e7eb; margin-top: 6px; padding-top: 10px !important; }
    .foot { margin-top: 32px; text-align: center; }
    @media print { body { background: #fff; padding: 0; } .bar { display: none; } .card { border: none; box-shadow: none; padding: 0; } }
    @media (max-width: 600px) { .card { padding: 20px 16px; } .head { flex-direction: column; } .right { text-align: left; } .grid { grid-template-columns: 1fr; } .totals { width: 100%; } }
  </style>
</head>
<body>
  <div class="bar">
    <a class="btn" href="${e(siteConfig.url)}">← ${e(f.seller.name)}</a>
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="card">
    <div class="head">
      <div>
        <h1>${e(f.seller.name)}</h1>
        <p class="muted">${e(f.seller.address)}</p>
        <p class="muted">${e(f.seller.email)} · ${e(f.seller.website)}</p>
      </div>
      <div class="right">
        <h1>Invoice</h1>
        <p class="mono">${e(params.invoiceNumber)}</p>
        <span class="badge">PAID</span>
        <p class="muted">Date: ${e(f.paidDate)}</p>
      </div>
    </div>
    <div class="grid">
      <div class="box">
        <p class="label">Billed to</p>
        <p><strong>${e(f.customerName)}</strong></p>
        <p>${e(params.email)}</p>
      </div>
      <div class="box">
        <p class="label">Payment</p>
        <p>Razorpay</p>
        <p>Payment ID: <span class="mono">${e(params.razorpayPaymentId)}</span></p>
        <p>Order ID: <span class="mono">${e(params.razorpayOrderId || "N/A")}</span></p>
      </div>
    </div>
    <table>
      <thead><tr><th>Item</th><th class="right">Qty</th><th class="right">Amount</th></tr></thead>
      <tbody>
        <tr>
          <td><strong>${e(f.itemTitle)}</strong><br/><span class="muted">${e(f.itemDescription)}</span></td>
          <td class="right">1</td>
          <td class="right">${e(f.amountFormatted)}</td>
        </tr>
      </tbody>
    </table>
    <div class="totals">
      <div><span>Subtotal</span><span>${e(f.amountFormatted)}</span></div>
      <div><span>Tax</span><span>${e(f.zeroFormatted)}</span></div>
      <div class="total"><span>Total paid</span><span>${e(f.amountFormatted)}</span></div>
    </div>
    <p class="muted foot">Computer-generated invoice; no signature required. Questions? ${e(f.seller.email)}</p>
  </div>
</body>
</html>`;
}
