/**
 * Razorpay Server SDK Wrapper
 * Keeps the secret key exclusively on the server.
 */

import Razorpay from "razorpay";
import crypto from "node:crypto";

const KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

let _instance: Razorpay | null = null;

export function getRazorpayInstance(): Razorpay {
  if (!KEY_ID || !KEY_SECRET) {
    throw new Error("Razorpay credentials are not configured.");
  }
  _instance ??= new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });
  return _instance;
}

export const getRazorpayKeyId = () => KEY_ID;

/**
 * Create a Razorpay order.
 */
export async function createRazorpayOrder(params: {
  amount: number; // in smallest unit
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  return getRazorpayInstance().orders.create({
    amount: params.amount,
    currency: params.currency,
    receipt: params.receipt,
    notes: params.notes || {},
  });
}

/** Timing-safe comparison of two hex HMAC digests */
function safeEqualHex(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}

/**
 * Verify Razorpay checkout signature: HMAC-SHA256(order_id|payment_id, key_secret).
 */
export function verifyPaymentSignature(params: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): boolean {
  if (!KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${params.razorpayOrderId}|${params.razorpayPaymentId}`)
    .digest("hex");
  return safeEqualHex(params.razorpaySignature, expected);
}

/**
 * Verify Razorpay webhook signature: HMAC-SHA256(raw body, webhook_secret).
 */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return false;
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  return safeEqualHex(signature, expected);
}

/**
 * Fetch full payment details from Razorpay API.
 */
export async function fetchRazorpayPayment(razorpayPaymentId: string) {
  try {
    return await getRazorpayInstance().payments.fetch(razorpayPaymentId);
  } catch (err) {
    console.warn(`[razorpay] Could not fetch payment ${razorpayPaymentId}:`, err);
    return null;
  }
}

type RazorpayPaymentLike = {
  card?: { name?: string } | null;
  acquirer_data?: Record<string, unknown>;
  notes?: Record<string, unknown> | unknown[];
};

/**
 * Customer name for invoices: from the Razorpay payment entity if available, else from the email.
 */
export function extractCustomerName(rzPayment?: RazorpayPaymentLike | null, fallbackEmail?: string): string {
  const notes = (rzPayment?.notes && !Array.isArray(rzPayment.notes) ? rzPayment.notes : {}) as Record<string, unknown>;
  const candidates = [
    rzPayment?.card?.name,
    rzPayment?.acquirer_data?.card_holder_name,
    rzPayment?.acquirer_data?.payer_name,
    notes.customerName,
    notes.name,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }

  if (!fallbackEmail) return "Verified Customer";

  // Clean the email prefix into a human-ish name: "john.smith42" → "John Smith"
  const prefix = fallbackEmail.split("@")[0] || "";
  const words = (prefix.replace(/\d+$/, "") || prefix)
    .replace(/[._\-+]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return words || "Verified Customer";
}
