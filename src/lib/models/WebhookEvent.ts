/**
 * Webhook Event — prevents duplicate processing of Razorpay webhooks
 */

import type { Collection, IndexDescription } from "mongodb";
import { ensureIndexes, getDb } from "@/lib/server/db";

export interface WebhookEventDocument {
  /** Razorpay event ID (x-razorpay-event-id header) */
  eventId: string;
  eventType: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  status: "processing" | "processed" | "failed";
  metadata?: Record<string, unknown>;
  processedAt?: Date;
  createdAt: Date;
}

const COLLECTION_NAME = "webhook_events";

const INDEXES: IndexDescription[] = [
  // Unique eventId dedupes retried webhooks, so wait for it
  { key: { eventId: 1 }, unique: true },
  { key: { razorpayOrderId: 1 }, sparse: true },
  { key: { createdAt: -1 } },
];

export async function getWebhookEventCollection(): Promise<Collection<WebhookEventDocument>> {
  const col = (await getDb()).collection<WebhookEventDocument>(COLLECTION_NAME);
  await ensureIndexes(col, INDEXES);
  return col;
}
