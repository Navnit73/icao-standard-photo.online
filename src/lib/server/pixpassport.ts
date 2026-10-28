import type { PhotoMetrics } from "./db";

export type ProcessResult = {
  status: "success";
  result_id: string;
  image_url: string;
  preview_url: string;
  dimensions: string;
  format: string;
  size_kb: number;
  metrics: PhotoMetrics;
};

export class PixPassportError extends Error {}

/** Send a photo to PixPassport for background removal, cropping and checks */
export async function processPhoto(image: File, countryCode: string): Promise<ProcessResult> {
  const { PIXPASSPORT_API_URL, PIXPASSPORT_API_KEY } = process.env;
  if (!PIXPASSPORT_API_URL || !PIXPASSPORT_API_KEY) throw new Error("PixPassport env vars are not set");

  const body = new FormData();
  body.append("image", image, image.name);
  body.append("country_code", countryCode);
  body.append("document_type", "passport");

  const res = await fetch(`${PIXPASSPORT_API_URL.replace(/\/$/, "")}/process`, {
    method: "POST",
    headers: { accept: "*/*", "X-API-Key": PIXPASSPORT_API_KEY },
    body,
    signal: AbortSignal.timeout(60_000),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || data?.status !== "success") {
    // Pass the API's message through when it explains the problem (e.g. no face found)
    const message = data?.detail ?? data?.message ?? data?.error;
    throw new PixPassportError(typeof message === "string" ? message : `PixPassport returned ${res.status}`);
  }
  return data as ProcessResult;
}
