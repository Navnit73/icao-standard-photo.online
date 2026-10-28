/**
 * Activity Logger — centralised event tracking
 * All user/system events go through here to avoid scattered DB calls.
 */

import { getActivityLogCollection } from "@/lib/models/UserActivityLog";

export type ActivityEvent =
  | "checkout_initiated"
  | "razorpay_order_created"
  | "payment_success"
  | "payment_failed"
  | "payment_webhook_received"
  | "invoice_generated"
  | "email_sent"
  | "email_failed"
  | "image_downloaded"
  | "download_link_expired";

export async function logActivity(params: {
  event: ActivityEvent;
  status: string;
  paymentId?: string;
  email?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    const col = await getActivityLogCollection();
    await col.insertOne({ ...params, createdAt: new Date() });
  } catch (err) {
    // Never let logging failures break the main flow
    console.error("[ActivityLogger] Failed to log event:", params.event, err);
  }
}
