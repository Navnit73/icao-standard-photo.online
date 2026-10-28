/**
 * Pricing configuration.
 * Price points per currency live in src/lib/currency.ts; the charged currency is
 * resolved server-side from the visitor's geo-IP country.
 * Never accept payment amounts directly from client-side input — always derive from here.
 */

import { siteConfig } from "@/config/site";
import { BASE_CURRENCY, CURRENCIES, formatMoney, getPriceInMinorUnits, type CurrencyCode, type PlanType } from "@/lib/currency";

export type { PlanType };

export const PRICING = {
  /** Product identifiers */
  productType: "digital_icao_photo",
  expertProductType: "expert_edit_icao_photo",
  /** Product display name */
  productName: "ICAO Standard Passport Photo",
  businessName: siteConfig.name,
  supportEmail: siteConfig.supportEmail,
  siteUrl: siteConfig.url,
} as const;

export type PlanPricing = ReturnType<typeof getPlanPricing>;

export function getPlanPricing(plan: PlanType = "standard", currency: CurrencyCode = BASE_CURRENCY) {
  const isExpert = plan === "expert_edit";
  const subunits = getPriceInMinorUnits(currency, plan);

  return {
    planType: plan,
    title: isExpert ? "Expert edit" : "Standard",
    amountFormatted: formatMoney(subunits, currency, { trimWholeNumbers: true }),
    amountInSubunits: subunits,
    currency,
    currencySymbol: CURRENCIES[currency].symbol,
    productType: isExpert ? PRICING.expertProductType : PRICING.productType,
    features: isExpert
      ? [
          "Everything in Standard",
          "Manual review by a photo specialist",
          "Hand retouch of lighting, shadows and background",
          "Final version emailed to you",
        ]
      : [
          "Checked against ICAO 9303",
          "Instant digital download",
          "Full-resolution JPG for online forms or printing",
          "Photo and invoice by email",
          `Money-back guarantee if rejected`,
        ],
  };
}
