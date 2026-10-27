import "server-only";

const ALLOWED_HOSTS = new Set(["res.cloudinary.com"]);

/** Streams a remote result image through our server without exposing its URL. */
export async function proxyImage(
  url: string,
  init: { filename?: string; cacheControl: string },
): Promise<Response> {
  const target = new URL(url);
  if (target.protocol !== "https:" || !ALLOWED_HOSTS.has(target.hostname)) {
    return Response.json({ error: "Image unavailable." }, { status: 502 });
  }

  const upstream = await fetch(target, { signal: AbortSignal.timeout(30_000) });
  if (!upstream.ok || !upstream.body) {
    return Response.json({ error: "Image unavailable." }, { status: 502 });
  }

  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
    "Cache-Control": init.cacheControl,
    "X-Content-Type-Options": "nosniff",
  });
  const length = upstream.headers.get("content-length");
  if (length) headers.set("Content-Length", length);
  if (init.filename) {
    headers.set("Content-Disposition", `attachment; filename="${init.filename}"`);
  }
  return new Response(upstream.body, { headers });
}
