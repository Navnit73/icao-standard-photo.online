/**
 * Fulfillment Service
 * Orchestrates: generate invoice & PDF → upload to Cloudinary → create download token → send email with photo + PDF.
 * Idempotent — safe to call multiple times for the same payment (verify route and webhook both call it).
 */

import crypto from "node:crypto";
import { getPaymentCollection, type FulfillmentStatus } from "@/lib/models/Payment";
import { getPaymentById } from "@/lib/payments/payment-service";
import { generateInvoiceNumber } from "@/lib/invoices/invoice-service";
import { generateInvoicePdfBuffer } from "@/lib/invoices/invoice-pdf";
import { uploadInvoicePdf } from "@/lib/server/cloudinary";
import { sendExpertEditNotification, sendPaymentSuccessEmail } from "@/lib/server/mailer";
import { logActivity } from "@/lib/logging/activity-logger";
import { siteConfig } from "@/config/site";

/** A "processing"/"sending" lock older than this is treated as abandoned (e.g. a killed function). */
const STALE_LOCK_MS = 5 * 60 * 1000;

/** Download links follow the published policy (siteConfig.privacy.linkExpiryMinutes) */
const DOWNLOAD_TOKEN_TTL_MS = siteConfig.privacy.linkExpiryMinutes * 60 * 1000;

/** After this many failed sends, fulfillment completes without the email (download still works) */
const MAX_EMAIL_ATTEMPTS = 3;

export interface FulfillmentResult {
  downloadToken?: string;
  invoiceNumber?: string;
  invoicePdfUrl?: string;
  fulfillmentStatus: FulfillmentStatus;
}

/**
 * Create (or reuse while still valid) the download token for a paid payment.
 */
export async function ensureDownloadToken(paymentId: string): Promise<string | undefined> {
  const col = await getPaymentCollection();
  const now = new Date();

  // Only replace a missing or expired token, atomically — concurrent callers (verify, webhook,
  // status polling) must all end up with the same token, or an emailed link could be overwritten
  await col.updateOne(
    {
      paymentId,
      status: "paid",
      $or: [{ downloadToken: { $exists: false } }, { downloadTokenExpiresAt: { $lte: now } }],
    },
    {
      $set: {
        downloadToken: crypto.randomBytes(32).toString("hex"),
        downloadTokenExpiresAt: new Date(now.getTime() + DOWNLOAD_TOKEN_TTL_MS),
      },
    }
  );

  const payment = await col.findOne({ paymentId, status: "paid" }, { projection: { downloadToken: 1 } });
  return payment?.downloadToken;
}

/**
 * Full fulfillment pipeline. Idempotent — checks each step before executing.
 */
export async function fulfillPayment(paymentId: string): Promise<FulfillmentResult> {
  const col = await getPaymentCollection();
  const payment = await getPaymentById(paymentId);

  if (!payment) {
    console.error(`[fulfillment] Payment ${paymentId} not found.`);
    return { fulfillmentStatus: "failed" };
  }

  if (payment.status !== "paid") {
    console.error(`[fulfillment] Payment ${paymentId} is not paid (status: ${payment.status}).`);
    return { fulfillmentStatus: "failed" };
  }

  // If already completed, return existing credentials immediately
  if (payment.fulfillmentStatus === "completed") {
    return {
      downloadToken: await ensureDownloadToken(paymentId),
      invoiceNumber: payment.invoice?.invoiceNumber,
      invoicePdfUrl: payment.invoice?.invoicePdfUrl,
      fulfillmentStatus: "completed",
    };
  }

  // Claim fulfillment lock atomically (also reclaims a stale "processing" lock)
  const staleBefore = new Date(Date.now() - STALE_LOCK_MS);
  const lockResult = await col.updateOne(
    {
      paymentId,
      $or: [
        { fulfillmentStatus: { $in: ["pending", "failed"] as FulfillmentStatus[] } },
        { fulfillmentStatus: "processing", updatedAt: { $lt: staleBefore } },
      ],
    },
    { $set: { fulfillmentStatus: "processing" as FulfillmentStatus, updatedAt: new Date() } }
  );

  // Another process has claimed or completed the lock — return latest state immediately
  if (lockResult.modifiedCount === 0) {
    const latest = await getPaymentById(paymentId);
    return {
      downloadToken: await ensureDownloadToken(paymentId),
      invoiceNumber: latest?.invoice?.invoiceNumber,
      invoicePdfUrl: latest?.invoice?.invoicePdfUrl,
      fulfillmentStatus: latest?.fulfillmentStatus || "processing",
    };
  }

  try {
    // 1. Invoice number (persisted before anything else so retries reuse it)
    let invoiceNumber = payment.invoice?.invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = await generateInvoiceNumber();
      await col.updateOne(
        { paymentId },
        { $set: { "invoice.invoiceNumber": invoiceNumber, "invoice.generatedAt": new Date(), updatedAt: new Date() } }
      );
    }

    // 2. Invoice PDF
    let invoicePdf: Buffer | undefined;
    let invoicePdfUrl = payment.invoice?.invoicePdfUrl;
    try {
      invoicePdf = await generateInvoicePdfBuffer({
        invoiceNumber,
        email: payment.email,
        amount: payment.amount,
        currency: payment.currency,
        razorpayPaymentId: payment.razorpayPaymentId || "N/A",
        razorpayOrderId: payment.razorpayOrderId,
        paidAt: payment.paidAt || payment.updatedAt,
        countryName: payment.metadata?.countryName,
        dimensions: payment.image?.dimensions,
        planType: payment.planType,
      });
    } catch (pdfErr) {
      console.error("[fulfillment] PDF generation error:", pdfErr);
    }

    // 3. Upload invoice PDF to Cloudinary (if not already uploaded)
    if (invoicePdf && !invoicePdfUrl) {
      try {
        const upload = await uploadInvoicePdf(invoicePdf, invoiceNumber);
        invoicePdfUrl = upload.secureUrl;
        await col.updateOne(
          { paymentId },
          { $set: { "invoice.invoicePdfUrl": upload.secureUrl, "invoice.cloudinaryPublicId": upload.publicId } }
        );
      } catch (uploadErr) {
        console.warn("[fulfillment] Cloudinary invoice upload warning:", uploadErr);
      }
    }

    await logActivity({
      event: "invoice_generated",
      status: "success",
      paymentId,
      email: payment.email,
      metadata: { invoiceNumber, invoicePdfUrl },
    });

    // 4. Download token
    const downloadToken = await ensureDownloadToken(paymentId);

    // 5. Send email (atomic lock — strictly prevents duplicate emails)
    const emailLock = await col.findOneAndUpdate(
      {
        paymentId,
        $or: [
          { "emailDelivery.status": { $in: ["pending", "failed"] } },
          { "emailDelivery.status": "sending", updatedAt: { $lt: staleBefore } },
        ],
      },
      { $set: { "emailDelivery.status": "sending", updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (emailLock) {
      try {
        const messageId = await sendPaymentSuccessEmail({
          to: payment.email,
          photoUrl: payment.image.imageUrl,
          countryName: payment.metadata?.countryName ?? "",
          dimensions: payment.image.dimensions ?? "",
          amount: payment.amount,
          currency: payment.currency,
          invoiceNumber,
          razorpayPaymentId: payment.razorpayPaymentId || "",
          downloadUrl: `${siteConfig.url}/api/download/${downloadToken}`,
          invoiceUrl: `${siteConfig.url}/api/invoices/${paymentId}`,
          invoicePdf,
          isExpertEdit: payment.planType === "expert_edit",
        });

        await col.updateOne(
          { paymentId },
          {
            $set: {
              "emailDelivery.status": "sent",
              "emailDelivery.messageId": messageId,
              "emailDelivery.sentAt": new Date(),
              updatedAt: new Date(),
            },
            $inc: { "emailDelivery.attempts": 1 },
          }
        );

        await logActivity({
          event: "email_sent",
          status: "success",
          paymentId,
          email: payment.email,
          metadata: { messageId, invoiceNumber, hasInvoice: !!invoicePdf },
        });
      } catch (emailErr) {
        const errMsg = emailErr instanceof Error ? emailErr.message : "Unknown email error";
        await col.updateOne(
          { paymentId },
          {
            $set: { "emailDelivery.status": "failed", "emailDelivery.lastError": errMsg, updatedAt: new Date() },
            $inc: { "emailDelivery.attempts": 1 },
          }
        );

        await logActivity({
          event: "email_failed",
          status: "error",
          paymentId,
          email: payment.email,
          metadata: { error: errMsg },
        });

        console.warn(`[fulfillment] Email delivery warning for ${paymentId}:`, errMsg);

        // Leave fulfillment retryable so the next call (status polling) resends the email
        if (emailLock.emailDelivery.attempts + 1 < MAX_EMAIL_ATTEMPTS) {
          await col.updateOne(
            { paymentId },
            { $set: { fulfillmentStatus: "failed" as FulfillmentStatus, updatedAt: new Date() } }
          );
          return { downloadToken, invoiceNumber, invoicePdfUrl, fulfillmentStatus: "failed" };
        }
      }
    }

    // Expert edit: alert the team once, independent of the customer email, so a paid order is never dropped
    if (payment.planType === "expert_edit") {
      const claim = await col.updateOne(
        { paymentId, expertNotifiedAt: { $exists: false } },
        { $set: { expertNotifiedAt: new Date() } }
      );
      if (claim.modifiedCount === 1) {
        try {
          await sendExpertEditNotification({
            customerEmail: payment.email,
            paymentId,
            razorpayPaymentId: payment.razorpayPaymentId || "",
            amount: payment.amount,
            currency: payment.currency,
            countryName: payment.metadata?.countryName ?? "",
            dimensions: payment.image.dimensions ?? "",
            photoUrl: payment.image.imageUrl,
          });
        } catch (alertErr) {
          // Release the claim so the next fulfillment run retries the alert
          await col.updateOne({ paymentId }, { $unset: { expertNotifiedAt: "" } });
          await logActivity({
            event: "email_failed",
            status: "error",
            paymentId,
            email: payment.email,
            metadata: { type: "expert_edit_alert", error: alertErr instanceof Error ? alertErr.message : String(alertErr) },
          });
          console.error("[fulfillment] Expert edit team alert failed:", alertErr);
          await col.updateOne(
            { paymentId },
            { $set: { fulfillmentStatus: "failed" as FulfillmentStatus, updatedAt: new Date() } }
          );
          return { downloadToken, invoiceNumber, invoicePdfUrl, fulfillmentStatus: "failed" };
        }
      }
    }

    // 6. Mark fulfillment as completed
    await col.updateOne(
      { paymentId },
      { $set: { fulfillmentStatus: "completed" as FulfillmentStatus, updatedAt: new Date() } }
    );

    return { downloadToken, invoiceNumber, invoicePdfUrl, fulfillmentStatus: "completed" };
  } catch (err) {
    console.error(`[fulfillment] Critical error for ${paymentId}:`, err);
    await col.updateOne(
      { paymentId },
      { $set: { fulfillmentStatus: "failed" as FulfillmentStatus, updatedAt: new Date() } }
    );
    return { fulfillmentStatus: "failed" };
  }
}
