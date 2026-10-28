import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "@/config/site";

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

/** Email the finished photo as an attachment, with a download link as a fallback */
export async function sendPhotoEmail({
  to,
  photoUrl,
  countryName,
  dimensions,
}: {
  to: string;
  photoUrl: string;
  countryName: string;
  dimensions: string;
}) {
  const res = await fetch(photoUrl, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`Could not fetch photo (${res.status})`);
  const photo = Buffer.from(await res.arrayBuffer());

  const subject = `Your ${countryName} passport photo is ready`;
  const country = escapeHtml(countryName);

  await transporter().sendMail({
    from: process.env.MAIL_FROM,
    to,
    replyTo: siteConfig.supportEmail,
    subject,
    text: [
      `Hi,`,
      ``,
      `Your ${countryName} passport photo (${dimensions} px) is attached to this email.`,
      `You can also download it here: ${photoUrl}`,
      ``,
      `Print tip: print on 4×6 in photo paper at any pharmacy or photo lab, then cut along the edges.`,
      ``,
      `Questions? Reply to this email or write to ${siteConfig.supportEmail}.`,
      ``,
      `— ${siteConfig.name}`,
    ].join("\n"),
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
        <h1 style="font-size:20px;margin:0 0 12px">Your passport photo is ready</h1>
        <p style="font-size:15px;line-height:24px;color:#4b5563;margin:0 0 20px">
          Your <strong>${country}</strong> passport photo (${dimensions} px) is attached to this email.
        </p>
        <a href="${photoUrl}" style="display:inline-block;background:#65a30d;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px">
          Download photo
        </a>
        <p style="font-size:13px;line-height:20px;color:#6b7280;margin:24px 0 0">
          Print tip: print on 4×6 in photo paper at any pharmacy or photo lab, then cut along the edges.
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
        <p style="font-size:12px;line-height:18px;color:#9ca3af;margin:0">
          Questions? Reply to this email or write to ${siteConfig.supportEmail}.<br />${siteConfig.name}
        </p>
      </div>`,
    attachments: [{ filename: `passport-photo-${dimensions}.jpg`, content: photo, contentType: "image/jpeg" }],
  });
}
