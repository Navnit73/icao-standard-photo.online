/**
 * Payment MongoDB Collection Schema & Helpers
 */

import type { Collection, IndexDescription, ObjectId } from "mongodb";
import { ensureIndexes, getDb } from "@/lib/server/db";

export interface PaymentImage {
  /** PixPassport result_id, also the photo_results _id */
  resultId: string;
  /** Full-resolution photo on our Cloudinary account */
  imageUrl: string;
  previewUrl?: string;
  format?: string;
  dimensions?: string;
  sizeKb?: number;
}

export interface PaymentInvoice {
  invoiceNumber?: string;
  invoicePdfUrl?: string;
  cloudinaryPublicId?: string;
  generatedAt?: Date;
}

export interface PaymentEmailDelivery {
  status: "pending" | "sending" | "sent" | "failed";
  messageId?: string;
  attempts: number;
  lastError?: string;
  sentAt?: Date;
}

export type PaymentStatus = "pending" | "authorized" | "paid" | "failed" | "refunded" | "cancelled";

export type FulfillmentStatus = "pending" | "processing" | "completed" | "failed";

export interface PaymentDocument {
  _id?: ObjectId;

  /** Internal UUID for the payment */
  paymentId: string;
  email: string;

  /** Razorpay references */
  razorpayOrderId: string;
  razorpayPaymentId?: string;

  /** Amount in smallest currency unit (cents) */
  amount: number;
  currency: string;

  status: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;

  productType: string;
  planType: "standard" | "expert_edit";
  /** Expert edit orders: progress of the manual retouch */
  expertReviewStatus?: "pending" | "in_review" | "completed";
  /** Set once the team has been alerted about an expert edit order */
  expertNotifiedAt?: Date;

  image: PaymentImage;

  invoice: PaymentInvoice;

  emailDelivery: PaymentEmailDelivery;

  downloadToken?: string;
  downloadTokenExpiresAt?: Date;

  metadata: {
    userAgent?: string;
    ipHash?: string;
    countryCode?: string;
    countryName?: string;
    /** Visitor's geo-IP country used to pick the charged currency */
    geoCountry?: string;
    failureReason?: string;
  };

  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
}

const COLLECTION_NAME = "payments";

const INDEXES: IndexDescription[] = [
  { key: { paymentId: 1 }, unique: true },
  { key: { razorpayOrderId: 1 }, unique: true },
  { key: { email: 1 } },
  { key: { status: 1 } },
  { key: { createdAt: -1 } },
  { key: { "image.resultId": 1 } },
  { key: { downloadToken: 1 }, sparse: true },
];

export async function getPaymentCollection(): Promise<Collection<PaymentDocument>> {
  const col = (await getDb()).collection<PaymentDocument>(COLLECTION_NAME);
  // Indexes already exist after the first deploy; don't make page loads wait on them
  void ensureIndexes(col, INDEXES);
  return col;
}
