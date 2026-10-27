export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COUNTRY_CODE_RE = /^[A-Z0-9*\-]{2,10}$/;

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
}

export function isPhotoId(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

export function isCountryCode(value: unknown): value is string {
  return typeof value === "string" && COUNTRY_CODE_RE.test(value);
}

export function validateImageFile(file: unknown): string | null {
  if (!(file instanceof File) || file.size === 0) return "Please choose a photo to upload.";
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Only JPG, PNG or WEBP photos are supported.";
  }
  if (file.size > MAX_UPLOAD_BYTES) return "Photo must be 10 MB or smaller.";
  return null;
}

export function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
