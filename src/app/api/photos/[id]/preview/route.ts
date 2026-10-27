import { proxyImage } from "@/lib/image-proxy";
import { getPhoto } from "@/lib/photos";
import { jsonError } from "@/lib/request";
import { isPhotoId } from "@/lib/validation";

export async function GET(_request: Request, ctx: RouteContext<"/api/photos/[id]/preview">) {
  const { id } = await ctx.params;
  if (!isPhotoId(id)) return jsonError("Not found.", 404);

  const photo = await getPhoto(id);
  if (!photo?.result) return jsonError("Not found.", 404);

  return proxyImage(photo.result.previewUrl ?? photo.result.imageUrl, {
    cacheControl: "private, max-age=3600",
  });
}
