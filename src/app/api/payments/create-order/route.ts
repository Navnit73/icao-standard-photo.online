/**
 * POST /api/payments/create-order
 * Creates a Razorpay order and a pending payment record.
 */

import { hashIp } from "@/lib/server/db";
import { createPaymentOrder, PaymentError } from "@/lib/payments/payment-service";
import { logActivity } from "@/lib/logging/activity-logger";
import { getPlanPricing, type PlanType } from "@/lib/config/pricing";
import { resolveCurrencyFromHeaders } from "@/lib/currency";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PLANS: PlanType[] = ["standard", "expert_edit"];

const error = (message: string, status: number) => Response.json({ success: false, error: message }, { status });

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const resultId = String(body?.resultId ?? "");
  const planType = (body?.planType ?? "standard") as PlanType;

  if (!EMAIL_RE.test(email) || email.length > 254) return error("Please enter a valid email address.", 422);
  if (!resultId) return error("Photo id is required.", 422);
  if (!PLANS.includes(planType)) return error("Please choose a plan.", 422);

  // Currency is resolved server-side: country header, else the browser's timezone (no header only)
  const timeZone = typeof body?.timeZone === "string" ? body.timeZone : undefined;
  const { country: geoCountry, currency } = resolveCurrencyFromHeaders(request.headers, timeZone);

  // Never charge a different price than the customer was shown
  const expectedCurrency = typeof body?.expectedCurrency === "string" ? body.expectedCurrency.toUpperCase() : undefined;
  const expectedAmount = typeof body?.expectedAmount === "number" ? body.expectedAmount : undefined;
  const chargedAmount = getPlanPricing(planType, currency).amountInSubunits;
  if ((expectedCurrency && expectedCurrency !== currency) || (expectedAmount !== undefined && expectedAmount !== chargedAmount)) {
    return Response.json(
      {
        success: false,
        code: "PRICE_CHANGED",
        currency,
        error: "Prices have been updated for your region. Please review the new price and try again.",
      },
      { status: 409 }
    );
  }

  // Hash IP for analytics — never store raw IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? request.headers.get("x-real-ip") ?? "unknown";

  try {
    await logActivity({ event: "checkout_initiated", status: "started", email, metadata: { resultId, planType, currency } });

    const order = await createPaymentOrder({
      email,
      resultId,
      planType,
      currency,
      geoCountry,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ipHash: hashIp(ip),
    });

    return Response.json({ success: true, ...order });
  } catch (e) {
    if (e instanceof PaymentError) {
      return Response.json({ success: false, error: e.message, paidPaymentId: e.paidPaymentId }, { status: e.status });
    }
    console.error("[create-order] Error:", e);
    return error("We couldn't start the payment. Please try again.", 500);
  }
}
