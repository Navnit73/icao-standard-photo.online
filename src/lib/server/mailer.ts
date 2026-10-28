import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "@/config/site";
import { formatMoney } from "@/lib/currency";

const globalForMail = globalThis as unknown as { mailer?: Transporter };

function transporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) throw new Error("SMTP_HOST is not set");
  globalForMail.mailer ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: SMTP_SECURE === "true",
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return globalForMail.mailer;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * Payment confirmation: the finished photo and invoice PDF as attachments, plus download and invoice links.
 * Returns the SMTP message id.
 */
export async function sendPaymentSuccessEmail({
  to,
  photoUrl,
  countryName,
  dimensions,
  amount,
  currency,
  invoiceNumber,
  razorpayPaymentId,
  downloadUrl,
  invoiceUrl,
  invoicePdf,
  isExpertEdit,
}: {
  to: string;
  photoUrl: string;
  countryName: string;
  dimensions: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  razorpayPaymentId: string;
  downloadUrl: string;
  invoiceUrl: string;
  invoicePdf?: Buffer;
  isExpertEdit?: boolean;
}): Promise<string> {
  const res = await fetch(photoUrl, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`Could not fetch photo (${res.status})`);
  const photo = Buffer.from(await res.arrayBuffer());

  const subject = `Your ${countryName} passport photo is ready`;
  const country = escapeHtml(countryName);
  const paid = formatMoney(amount, currency);
  const { linkExpiryMinutes } = siteConfig.privacy;
  const expertNote = "Expert edit: a photo specialist is now reviewing and retouching your photo by hand. We'll email you the final version.";

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:#6b7280">${label}</td>
      <td style="padding:6px 0;text-align:right;color:#111;font-weight:600">${value}</td>
    </tr>`;

  const info = await transporter().sendMail({
    from: process.env.MAIL_FROM,
    to,
    replyTo: siteConfig.supportEmail,
    subject,
    text: [
      `Hi,`,
      ``,
      `Thanks for your payment of ${paid}. Your ${countryName} passport photo (${dimensions} px) is attached to this email, along with your invoice ${invoiceNumber}.`,
      `You can also download it here (link valid for ${linkExpiryMinutes} minutes): ${downloadUrl}`,
      `View your invoice: ${invoiceUrl}`,
      ...(isExpertEdit ? [``, expertNote] : []),
      ``,
      `Print tip: print on 4×6 in photo paper at any pharmacy or photo lab, then cut along the edges.`,
      ``,
      `Payment reference: ${razorpayPaymentId}`,
      `Questions? Reply to this email or write to ${siteConfig.supportEmail}.`,
      ``,
      `— ${siteConfig.name}`,
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
        <h1 style="font-size:20px;margin:0 0 12px">Payment received — your photo is ready</h1>
        <p style="font-size:15px;line-height:24px;color:#4b5563;margin:0 0 20px">
          Your <strong>${country}</strong> passport photo (${dimensions} px) is attached to this email, along with your invoice.
        </p>
        ${isExpertEdit ? `<p style="font-size:14px;line-height:22px;color:#3f6212;background:#f7fee7;border:1px solid #d9f99d;border-radius:8px;padding:12px 16px;margin:0 0 20px">${expertNote}</p>` : ""}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:0 0 20px">
          ${row("Amount paid", escapeHtml(paid))}
          ${row("Invoice", escapeHtml(invoiceNumber))}
          ${row("Payment ref", `<span style="font-family:monospace;font-size:12px">${escapeHtml(razorpayPaymentId)}</span>`)}
        </table>
        <a href="${downloadUrl}" style="display:inline-block;background:#65a30d;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px">
          Download photo
        </a>
        <p style="font-size:12px;line-height:18px;color:#9ca3af;margin:8px 0 0">Link valid for ${linkExpiryMinutes} minutes. The attachment doesn't expire.</p>
        <p style="font-size:13px;line-height:20px;margin:16px 0 0">
          <a href="${invoiceUrl}" style="color:#4d7c0f">View invoice ${escapeHtml(invoiceNumber)}</a>
        </p>
        <p style="font-size:13px;line-height:20px;color:#6b7280;margin:24px 0 0">
          Print tip: print on 4×6 in photo paper at any pharmacy or photo lab, then cut along the edges.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
        <p style="font-size:12px;line-height:18px;color:#9ca3af;margin:0">
          Questions? Reply to this email or write to ${siteConfig.supportEmail}.<br />${siteConfig.name}
        </p>
      </div>`,
    attachments: [
      { filename: `passport-photo-${dimensions}.jpg`, content: photo, contentType: "image/jpeg" },
      ...(invoicePdf
        ? [{ filename: `Invoice-${invoiceNumber}.pdf`, content: invoicePdf, contentType: "application/pdf" }]
        : []),
    ],
  });
  return info.messageId;
}

/** Tell the team a paid expert-edit order is waiting for manual review */
export async function sendExpertEditNotification({
  customerEmail,
  paymentId,
  razorpayPaymentId,
  amount,
  currency,
  countryName,
  dimensions,
  photoUrl,
}: {
  customerEmail: string;
  paymentId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  countryName: string;
  dimensions: string;
  photoUrl: string;
}): Promise<string> {
  const to = process.env.MAIL_TO || siteConfig.supportEmail;
  const paid = formatMoney(amount, currency);
  const rows: [string, string][] = [
    ["Customer", customerEmail],
    ["Country", countryName],
    ["Dimensions", `${dimensions} px`],
    ["Amount", paid],
    ["Payment ID", paymentId],
    ["Razorpay ID", razorpayPaymentId],
  ];

  const info = await transporter().sendMail({
    from: process.env.MAIL_FROM,
    to,
    // Reply goes straight to the customer
    replyTo: customerEmail,
    subject: `[Expert edit] ${countryName} photo for ${customerEmail}`,
    text: [
      `New expert edit order. Retouch the photo and email the final version to the customer.`,
      ``,
      ...rows.map(([k, v]) => `${k}: ${v}`),
      `Photo: ${photoUrl}`,
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111">
        <h1 style="font-size:18px;margin:0 0 8px">New expert edit order</h1>
        <p style="font-size:14px;line-height:22px;color:#4b5563;margin:0 0 16px">
          Retouch the photo and email the final version to the customer (reply to this email).
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;margin:0 0 16px">
          ${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#6b7280">${k}</td><td style="padding:4px 0">${escapeHtml(v)}</td></tr>`).join("")}
        </table>
        <a href="${escapeHtml(photoUrl)}" style="color:#4d7c0f">Open full-resolution photo</a>
      </div>`,
  });
  return info.messageId;
}
