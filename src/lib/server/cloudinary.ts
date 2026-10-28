import { createHash } from "node:crypto";

const FOLDER = "icao-photo-tool/results";

/** Copy a remote image into our Cloudinary account and return its secure URL */
export async function saveToCloudinary(sourceUrl: string, publicId: string): Promise<string> {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary env vars are not set");
  }

  // Signed upload: SHA-1 of the sorted params followed by the API secret
  const params = { folder: FOLDER, public_id: publicId, timestamp: String(Math.floor(Date.now() / 1000)) };
  const toSign = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + CLOUDINARY_API_SECRET).digest("hex");

  const body = new FormData();
  body.append("file", sourceUrl);
  for (const [k, v] of Object.entries(params)) body.append(k, v);
  body.append("api_key", CLOUDINARY_API_KEY);
  body.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body,
    signal: AbortSignal.timeout(30_000),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary upload failed: ${data?.error?.message ?? res.status}`);
  return data.secure_url as string;
}
