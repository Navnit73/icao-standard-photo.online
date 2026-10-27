import { createPhoto, markPhotoFailed, markPhotoProcessed } from "@/lib/photos";
import { PixPassportError, processPhoto } from "@/lib/pixpassport";
import { clientInfo, jsonError } from "@/lib/request";
import { isCountryCode, validateImageFile } from "@/lib/validation";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError("Invalid upload.", 400);
  }

  const image = form.get("image");
  const fileError = validateImageFile(image);
  if (fileError) return jsonError(fileError, 400);
  const file = image as File;

  const countryCode = String(form.get("country_code") ?? "US").toUpperCase();
  if (!isCountryCode(countryCode)) return jsonError("Unsupported country.", 400);
  const documentType = "passport";

  const publicId = crypto.randomUUID();
  await createPhoto({
    publicId,
    countryCode,
    documentType,
    original: { filename: file.name, mimeType: file.type, sizeBytes: file.size },
    client: clientInfo(request),
  });

  try {
    const result = await processPhoto({
      image: file,
      filename: file.name || "photo.jpg",
      countryCode,
      documentType,
    });
    await markPhotoProcessed(publicId, result);
    return Response.json({ id: publicId });
  } catch (err) {
    const status = err instanceof PixPassportError ? err.status : 500;
    const message =
      err instanceof PixPassportError
        ? err.message
        : "We couldn't process this photo. Please try again.";
    await markPhotoFailed(publicId, {
      message: err instanceof Error ? err.message : String(err),
      status,
      body: err instanceof PixPassportError ? err.body : null,
    });
    // 4xx from the API means the photo itself was rejected (no face, etc.)
    return jsonError(message, status >= 400 && status < 500 ? 422 : 502);
  }
}
