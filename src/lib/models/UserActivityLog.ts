/**
 * User Activity Log — tracks user events for analytics and debugging
 */

import type { Collection, IndexDescription } from "mongodb";
import { ensureIndexes, getDb } from "@/lib/server/db";

export interface UserActivityLogDocument {
  paymentId?: string;
  email?: string;
  event: string;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const COLLECTION_NAME = "user_activity_logs";

const INDEXES: IndexDescription[] = [
  { key: { paymentId: 1 }, sparse: true },
  { key: { email: 1 }, sparse: true },
  { key: { event: 1 } },
  // TTL: auto-delete logs older than 90 days
  { key: { createdAt: 1 }, expireAfterSeconds: 90 * 86400 },
];

export async function getActivityLogCollection(): Promise<Collection<UserActivityLogDocument>> {
  const col = (await getDb()).collection<UserActivityLogDocument>(COLLECTION_NAME);
  void ensureIndexes(col, INDEXES);
  return col;
}
