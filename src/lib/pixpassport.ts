import "server-only";
import { cacheLife } from "next/cache";
import { env } from "./env";
import { FALLBACK_COUNTRIES, type Country } from "./countries";

export type ProcessMetrics = {
  head_height_pct: number;
  eye_position_pct: number;
  top_margin_pct: number;
  background_valid: boolean;
  background_corrected: boolean;
};

export type ProcessResponse = {
  status: string;
  result_id: string;
  image_url: string;
  preview_url: string | null;
  dimensions: string;
  format: string;
  size_kb: number;
  metrics: ProcessMetrics;
};

export class PixPassportError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "PixPassportError";
  }
}

function errorMessageFrom(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;
  const b = body as Record<string, unknown>;
  if (typeof b.details === "string" && b.details) return b.details;
  if (typeof b.error === "string" && b.error) return b.error;
  if (Array.isArray(b.detail) && b.detail.length > 0) {
    const first = b.detail[0] as { msg?: string };
    if (first?.msg) return first.msg;
  }
  return undefined;
}

/**
 * Server-side proxy to the PixPassport /process endpoint.
 * The API key never leaves the server.
 */
export async function processPhoto(input: {
  image: Blob;
  filename: string;
  countryCode: string;
  documentType: string;
}): Promise<ProcessResponse> {
  const form = new FormData();
  form.append("image", input.image, input.filename);
  form.append("country_code", input.countryCode);
  form.append("document_type", input.documentType);

  const res = await fetch(`${env.pixpassportApiUrl}/process`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "X-API-Key": env.pixpassportApiKey,
    },
    body: form,
    signal: AbortSignal.timeout(90_000),
  });

  const body: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    throw new PixPassportError(
      errorMessageFrom(body) ?? `Photo processing failed (HTTP ${res.status})`,
      res.status,
      body,
    );
  }

  const data = body as ProcessResponse;
  if (!data?.result_id || !data?.image_url) {
    throw new PixPassportError("Unexpected response from processing API", 502, body);
  }
  return data;
}

/** Supported countries, cached for a day. Falls back to a bundled list. */
export async function getCountries(): Promise<Country[]> {
  "use cache";
  cacheLife("days");

  try {
    const res = await fetch(`${env.pixpassportApiUrl}/countries`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return FALLBACK_COUNTRIES;
    const list = (await res.json()) as Country[];
    if (!Array.isArray(list) || list.length === 0) return FALLBACK_COUNTRIES;
    return list
      .filter((c) => c.document_type === "passport")
      .sort((a, b) => a.country_name.localeCompare(b.country_name));
  } catch {
    return FALLBACK_COUNTRIES;
  }
}
