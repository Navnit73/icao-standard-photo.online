import { proxyImage } from "@/lib/image-proxy";
import { getPhoto, recordDownload } from "@/lib/photos";
import { clientInfo, jsonError } from "@/lib/request";
import { isPhotoId, normalizeEmail } from "@/lib/validation";

export async function POST(request: Request, ctx: RouteContext<"/api/photos/[id]/download">) {
  const { id } = await ctx.params;
  if (!isPhotoId(id)) return jsonError("Not found.", 404);

  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    marketingConsent?: unknown;
  } | null;
  const email = normalizeEmail(body?.email);
  if (!email) return jsonError("Please enter a valid email address.", 400);

  const photo = await getPhoto(id);
  if (!photo?.result) return jsonError("Photo not found or not processed yet.", 404);

  await recordDownload({
    photoId: id,
    email,
    marketingConsent: body?.marketingConsent === true,
    client: clientInfo(request),
  });

  const ext = (photo.result.format || "jpeg").toLowerCase() === "png" ? "png" : "jpg";
  return proxyImage(photo.result.imageUrl, {
    filename: `icao-passport-photo-${photo.countryCode.toLowerCase()}-${id.slice(0, 8)}.${ext}`,
    cacheControl: "private, no-store",
  });
}
