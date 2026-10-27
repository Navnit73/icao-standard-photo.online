import "server-only";
import type { ClientInfo } from "./photos";

export function clientInfo(request: Request): ClientInfo {
  const h = request.headers;
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return {
    ip: forwarded || h.get("x-real-ip") || null,
    userAgent: h.get("user-agent"),
    country: h.get("x-vercel-ip-country") ?? h.get("cf-ipcountry"),
  };
}

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
