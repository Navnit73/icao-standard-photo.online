/**
 * Currency & Geo Pricing Module
 *
 * Single source of truth for:
 *  - Which Razorpay currencies we accept and their price points
 *  - Mapping a visitor's country (from CDN geo-IP headers) to a currency
 *  - Formatting money amounts consistently across UI, emails and invoices
 *
 * Prices are hand-set price points stored as integer minor units (cents/pence/paise) —
 * never converted from FX rates, so the price a customer sees is exactly what Razorpay charges.
 *
 * This module is isomorphic (no Node APIs) so client components can format money.
 */

export type PlanType = "standard" | "expert_edit";

export interface CurrencyDefinition {
  code: string;
  symbol: string;
  /** Number of minor-unit digits (Razorpay expects amounts in minor units) */
  exponent: number;
  /** Plan prices in minor units */
  prices: Record<PlanType, number>;
}

export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", exponent: 2, prices: { standard: 799, expert_edit: 1399 } },
  GBP: { code: "GBP", symbol: "£", exponent: 2, prices: { standard: 799, expert_edit: 1399 } },
  EUR: { code: "EUR", symbol: "€", exponent: 2, prices: { standard: 799, expert_edit: 1299 } },
  INR: { code: "INR", symbol: "₹", exponent: 2, prices: { standard: 1990, expert_edit: 1990 } },
} as const satisfies Record<string, CurrencyDefinition>;

export type CurrencyCode = keyof typeof CURRENCIES;

/** Exact-match check — callers must upper-case user/env input first. */
export function isSupportedCurrency(code: string | null | undefined): code is CurrencyCode {
  return !!code && Object.prototype.hasOwnProperty.call(CURRENCIES, code);
}

/**
 * Fallback currency: used when the country is unknown, has no dedicated currency, or its
 * currency isn't enabled on the Razorpay account. USD unless NEXT_PUBLIC_PAYMENT_CURRENCY is set.
 */
export const BASE_CURRENCY: CurrencyCode = (() => {
  const env = (process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || "USD").toUpperCase();
  return isSupportedCurrency(env) ? env : "USD";
})();

// ---------------------------------------------------------------------------
// Country → currency mapping (ISO 3166-1 alpha-2). Everything else pays BASE_CURRENCY.
// ---------------------------------------------------------------------------

const GBP_COUNTRIES = ["GB", "IM", "JE", "GG", "GI", "FK", "SH"];

/**
 * All EU member states (incl. non-euro members, which are billed in EUR),
 * EEA members, euro-using microstates and euro-using overseas territories.
 */
const EUR_COUNTRIES = [
  // Eurozone (Bulgaria joined 1 Jan 2026)
  "AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
  // EU members outside the eurozone
  "CZ", "DK", "HU", "PL", "RO", "SE",
  // EEA (non-EU)
  "IS", "NO",
  // Euro-using microstates & others
  "AD", "MC", "SM", "VA", "ME", "XK",
  // Euro-using territories
  "AX", "GF", "GP", "MQ", "RE", "YT", "PM", "BL", "MF",
];

const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  ...Object.fromEntries(GBP_COUNTRIES.map((c) => [c, "GBP" as const])),
  ...Object.fromEntries(EUR_COUNTRIES.map((c) => [c, "EUR" as const])),
  IN: "INR",
};

// ---------------------------------------------------------------------------
// Runtime configuration (server env)
// ---------------------------------------------------------------------------

/**
 * Currencies enabled on the Razorpay account. Comma-separated
 * PAYMENT_ENABLED_CURRENCIES (e.g. "USD,GBP,EUR"); defaults to all supported.
 * The base currency is always enabled.
 */
function getEnabledCurrencies(): Set<CurrencyCode> {
  const raw = process.env.PAYMENT_ENABLED_CURRENCIES;
  const list = raw
    ? raw.split(",").map((s) => s.trim().toUpperCase()).filter(isSupportedCurrency)
    : (Object.keys(CURRENCIES) as CurrencyCode[]);
  return new Set<CurrencyCode>([...list, BASE_CURRENCY]);
}

function isGeoPricingEnabled(): boolean {
  return process.env.GEO_PRICING_ENABLED !== "false";
}

// ---------------------------------------------------------------------------
// Geo detection
// ---------------------------------------------------------------------------

interface HeaderSource {
  get(name: string): string | null;
}

export function normalizeCountryCode(value: string | null | undefined): string | null {
  if (!value) return null;
  const code = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}

/**
 * Visitor's country from the x-vercel-ip-country header.
 * GEO_COUNTRY_OVERRIDE (non-production only) forces a country for local testing.
 */
export function detectCountry(headers: HeaderSource): string | null {
  if (process.env.NODE_ENV !== "production") {
    const override = normalizeCountryCode(process.env.GEO_COUNTRY_OVERRIDE);
    if (override) return override;
  }
  return normalizeCountryCode(headers.get("x-vercel-ip-country"));
}

export function getCurrencyForCountry(country: string | null): CurrencyCode {
  if (!isGeoPricingEnabled() || !country) return BASE_CURRENCY;
  const mapped = COUNTRY_CURRENCY[country];
  return mapped && getEnabledCurrencies().has(mapped) ? mapped : BASE_CURRENCY;
}

/**
 * Guess the currency from an IANA timezone (e.g. the browser's). Used only when the
 * request carries no country header, e.g. local dev.
 */
export function getTimezoneCurrency(timeZone: string | null | undefined): CurrencyCode | null {
  if (!timeZone) return null;
  if (INR_TIMEZONES.has(timeZone)) return "INR";
  if (GBP_TIMEZONES.has(timeZone)) return "GBP";
  if (EUR_ATLANTIC_TIMEZONES.has(timeZone)) return "EUR";
  // Europe/* is billed in EUR, except zones outside the EU/EEA mapping above
  if (timeZone.startsWith("Europe/") && !NON_EUR_EUROPE_TIMEZONES.has(timeZone.slice(7))) return "EUR";
  return null;
}

const INR_TIMEZONES = new Set(["Asia/Kolkata", "Asia/Calcutta"]);
const GBP_TIMEZONES = new Set(["Europe/London", "Europe/Isle_of_Man", "Europe/Jersey", "Europe/Guernsey", "Europe/Gibraltar", "Atlantic/Stanley"]);
const EUR_ATLANTIC_TIMEZONES = new Set(["Atlantic/Reykjavik", "Atlantic/Canary", "Atlantic/Madeira", "Atlantic/Azores"]);
const NON_EUR_EUROPE_TIMEZONES = new Set([
  "Zurich", "Vaduz", "Istanbul", "Moscow", "Kiev", "Kyiv", "Minsk", "Belgrade", "Sarajevo", "Skopje",
  "Tirane", "Chisinau", "Simferopol", "Kaliningrad", "Samara", "Ulyanovsk", "Volgograd", "Astrakhan",
  "Saratov", "Kirov",
]);

/**
 * Charged currency: from the country header when present, else from the browser's timezone
 * (only possible without a header, so a visitor can't pick a cheaper price by changing it).
 */
export function resolveCurrencyFromHeaders(
  headers: HeaderSource,
  timeZone?: string | null
): {
  country: string | null;
  currency: CurrencyCode;
} {
  const country = detectCountry(headers);
  if (country) return { country, currency: getCurrencyForCountry(country) };

  const tzCurrency = isGeoPricingEnabled() ? getTimezoneCurrency(timeZone) : null;
  return { country: null, currency: tzCurrency && getEnabledCurrencies().has(tzCurrency) ? tzCurrency : BASE_CURRENCY };
}

// ---------------------------------------------------------------------------
// Prices & formatting
// ---------------------------------------------------------------------------

/**
 * Plan price in minor units. NEXT_PUBLIC_PAYMENT_AMOUNT / NEXT_PUBLIC_EXPERT_EDIT_AMOUNT
 * override the base currency only — useful for low-value Razorpay test payments.
 */
export function getPriceInMinorUnits(currency: CurrencyCode, plan: PlanType): number {
  const def = CURRENCIES[currency];
  if (currency === BASE_CURRENCY) {
    const raw = plan === "expert_edit" ? process.env.NEXT_PUBLIC_EXPERT_EDIT_AMOUNT : process.env.NEXT_PUBLIC_PAYMENT_AMOUNT;
    const parsed = raw ? parseFloat(raw) : NaN;
    if (!isNaN(parsed) && parsed > 0) return Math.round(parsed * 10 ** def.exponent);
  }
  return def.prices[plan];
}

export function getCurrencySymbol(currency: string): string {
  const code = currency?.toUpperCase();
  return isSupportedCurrency(code) ? CURRENCIES[code].symbol : `${code} `;
}

/**
 * Format a minor-unit amount, e.g. formatMoney(799, "GBP") → "£7.99".
 * Whole amounts drop the decimals when trimWholeNumbers is set (₹199).
 */
export function formatMoney(
  minorUnits: number,
  currency: string,
  { trimWholeNumbers = false }: { trimWholeNumbers?: boolean } = {}
): string {
  const code = (currency || BASE_CURRENCY).toUpperCase();
  const exponent = isSupportedCurrency(code) ? CURRENCIES[code].exponent : 2;
  const major = minorUnits / 10 ** exponent;
  const isWhole = minorUnits % 10 ** exponent === 0;
  const digits = trimWholeNumbers && isWhole ? 0 : exponent;

  const number = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(major);

  return `${getCurrencySymbol(code)}${number}`;
}
