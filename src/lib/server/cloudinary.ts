import { createHash } from "node:crypto";

const FOLDER = "icao-photo-tool/results";
const INVOICE_FOLDER = "icao-photo-tool/invoices";

/** Signed upload: SHA-1 of the sorted params followed by the API secret */
async function signedUpload(
  resourceType: "image" | "raw",
  file: string | Blob,
  params: Record<string, string>
): Promise<{ secure_url: string; public_id: string }> {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars are not set");
  }

  const signed = { ...params, timestamp: String(Math.floor(Date.now() / 1000)) };
  const toSign = Object.entries(signed)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + CLOUDINARY_API_SECRET).digest("hex");

  const body = new FormData();
  body.append("file", file);
  for (const [k, v] of Object.entries(signed)) body.append(k, v);
  body.append("api_key", CLOUDINARY_API_KEY);
  body.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(30_000),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${data?.error?.message ?? res.status}`);
  return data;
}

/** Copy a remote image into our Cloudinary account and return its secure URL */
export async function saveToCloudinary(sourceUrl: string, publicId: string): Promise<string> {
  const data = await signedUpload("image", sourceUrl, { folder: FOLDER, public_id: publicId });
  return data.secure_url;
}

/** Upload an invoice PDF and return its URL and public id */
export async function uploadInvoicePdf(pdf: Buffer, invoiceNumber: string) {
  const data = await signedUpload("raw", new Blob([new Uint8Array(pdf)], { type: "application/pdf" }), {
    folder: INVOICE_FOLDER,
    public_id: `${invoiceNumber}.pdf`,
    overwrite: "true",
  });
  return { secureUrl: data.secure_url, publicId: data.public_id };
}
