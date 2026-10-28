/**
 * GET /api/download/[token]
 * Protected photo download — validates token, payment status and expiry.
 */

import { getPaymentCollection } from "@/lib/models/Payment";
import { logActivity } from "@/lib/logging/activity-logger";

const error = (message: string, status: number) => Response.json({ error: message }, { status });

export async function GET(_request: Request, { params }: RouteContext<"/api/download/[token]">) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) return error("Invalid download link.", 400);

  try {
    const payment = await (await getPaymentCollection()).findOne({ downloadToken: token });
    if (!payment) return error("Download link not found or has expired.", 404);
    if (payment.status !== "paid") return error("Payment not completed.", 403);

    if (payment.downloadTokenExpiresAt && payment.downloadTokenExpiresAt < new Date()) {
      await logActivity({
        event: "download_link_expired",
        status: "expired",
        paymentId: payment.paymentId,
        email: payment.email,
      });
      return error("This download link has expired. The photo is also attached to your confirmation email.", 410);
    }

    const image = await fetch(payment.image.imageUrl, { signal: AbortSignal.timeout(20_000) });
    if (!image.ok) return error("Failed to retrieve photo.", 502);

    const countryCode = payment.metadata?.countryCode?.toLowerCase() || "photo";
    const filename = `passport-photo-${countryCode}-${payment.paymentId.slice(0, 8)}.jpg`;

    await logActivity({ event: "image_downloaded", status: "success", paymentId: payment.paymentId, email: payment.email });

    return new Response(image.body, {
      headers: {
        "Content-Type": image.headers.get("content-type") || "image/jpeg",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-cache, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    console.error("[download] Error:", e);
    return error("Download failed. Please try again.", 500);
  }
}
