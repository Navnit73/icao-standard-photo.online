import { headers } from "next/headers";
import { getCountry } from "@/config/countries";
import { saveToCloudinary } from "@/lib/server/cloudinary";
import { hashIp, photos } from "@/lib/server/db";
import { PixPassportError, processPhoto } from "@/lib/server/pixpassport";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const HOURLY_LIMIT = 20;

const error = (message: string, status: number) => Response.json({ error: message }, { status });

/** Process an uploaded photo and return the id of its preview page */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const image = form?.get("image");
  const country = getCountry(String(form?.get("country_code") ?? ""));

  if (!country) return error("Please choose a country.", 400);
  if (!(image instanceof File) || image.size === 0) return error("Please upload a photo.", 400);
  if (image.size > MAX_BYTES) return error("Photo is larger than 10 MB. Please upload a smaller file.", 413);
  if (image.type && !ACCEPTED_TYPES.includes(image.type)) {
    return error("Please upload a JPG, PNG, WebP or HEIC photo.", 415);
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? h.get("x-real-ip") ?? "unknown";
  const ipHash = hashIp(ip);
  const collection = await photos();

  // Each call costs API credits, so cap uploads per visitor
  const recent = await collection.countDocuments({ ipHash, createdAt: { $gt: new Date(Date.now() - 3_600_000) } });
  if (recent >= HOURLY_LIMIT) return error("Too many photos in the last hour. Please try again later.", 429);

  try {
    const result = await processPhoto(image, country.code);
    const imageUrl = await saveToCloudinary(result.image_url, result.result_id);

    await collection.insertOne({
      _id: result.result_id,
      countryCode: country.code,
      documentType: "passport",
      dimensions: result.dimensions,
      format: result.format,
      sizeKb: result.size_kb,
      metrics: result.metrics,
      imageUrl,
      previewUrl: result.preview_url,
      ipHash,
      userAgent: h.get("user-agent") ?? "",
      createdAt: new Date(),
      emailCount: 0,
      emails: [],
    });

    return Response.json({ id: result.result_id });
  } catch (e) {
    if (e instanceof PixPassportError) return error(`We couldn't process this photo: ${e.message}`, 422);
    console.error("Photo processing failed", e);
    return error("Something went wrong on our side. Please try again.", 500);
  }
}
