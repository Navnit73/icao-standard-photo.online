export type Country = {
  country_code: string;
  country_name: string;
  document_type: string;
  dimensions: string;
};

// Used only if the PixPassport /countries endpoint is unreachable.
export const FALLBACK_COUNTRIES: Country[] = [
  { country_code: "AU", country_name: "Australia", document_type: "passport", dimensions: "413x531" },
  { country_code: "CA", country_name: "Canada", document_type: "passport", dimensions: "1200x1800" },
  { country_code: "FR", country_name: "France", document_type: "passport", dimensions: "630x810" },
  { country_code: "DE", country_name: "Germany", document_type: "passport", dimensions: "413x531" },
  { country_code: "IN", country_name: "India", document_type: "passport", dimensions: "630x810" },
  { country_code: "IE", country_name: "Ireland", document_type: "passport", dimensions: "715x951" },
  { country_code: "IT", country_name: "Italy", document_type: "passport", dimensions: "413x531" },
  { country_code: "GB", country_name: "United Kingdom", document_type: "passport", dimensions: "900x1200" },
  { country_code: "US", country_name: "United States", document_type: "passport", dimensions: "600x600" },
];

export const DEFAULT_COUNTRY = "US";
