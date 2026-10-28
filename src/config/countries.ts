export type Country = {
  /** Code the PixPassport API expects */
  code: string;
  name: string;
  /** Output size in pixels, width × height */
  dimensions: string;
  /** ISO 3166 code for the flag, when it differs from `code` */
  flag?: string;
};

/** Passport sizes supported by the PixPassport API, sorted by name */
export const countries: Country[] = [
  { code: "DZ", name: "Algeria", dimensions: "413x531" },
  { code: "AR", name: "Argentina", dimensions: "945x945" },
  { code: "AU", name: "Australia", dimensions: "413x531" },
  { code: "AT", name: "Austria", dimensions: "413x531" },
  { code: "BH", name: "Bahrain", dimensions: "945x1417" },
  { code: "BE", name: "Belgium", dimensions: "413x531" },
  { code: "BT", name: "Bhutan", dimensions: "413x531" },
  { code: "BR", name: "Brazil", dimensions: "591x827" },
  { code: "BR-3*4", name: "Brazil (Foto 3×4)", dimensions: "354x472", flag: "BR" },
  { code: "BG", name: "Bulgaria", dimensions: "413x531" },
  { code: "CA", name: "Canada", dimensions: "1200x1800" },
  { code: "CN", name: "China", dimensions: "420x560" },
  { code: "CO", name: "Colombia", dimensions: "709x945" },
  { code: "HR", name: "Croatia", dimensions: "413x531" },
  { code: "CZ", name: "Czechia", dimensions: "413x531" },
  { code: "DK", name: "Denmark", dimensions: "413x531" },
  { code: "EE", name: "Estonia", dimensions: "1300x1600" },
  { code: "FI", name: "Finland", dimensions: "500x653" },
  { code: "FR", name: "France", dimensions: "630x810" },
  { code: "DE", name: "Germany", dimensions: "413x531" },
  { code: "GR", name: "Greece", dimensions: "413x531" },
  { code: "HK", name: "Hong Kong", dimensions: "1280x1600" },
  { code: "HU", name: "Hungary", dimensions: "413x531" },
  { code: "IS", name: "Iceland", dimensions: "827x1063" },
  { code: "IN", name: "India", dimensions: "630x810" },
  { code: "ID", name: "Indonesia", dimensions: "400x600" },
  { code: "IR", name: "Iran", dimensions: "600x400" },
  { code: "IQ", name: "Iraq", dimensions: "413x531" },
  { code: "IE", name: "Ireland", dimensions: "715x951" },
  { code: "IT", name: "Italy", dimensions: "413x531" },
  { code: "JP", name: "Japan", dimensions: "827x1063" },
  { code: "KZ", name: "Kazakhstan", dimensions: "413x531" },
  { code: "LV", name: "Latvia", dimensions: "413x531" },
  { code: "LT", name: "Lithuania", dimensions: "413x531" },
  { code: "LU", name: "Luxembourg", dimensions: "413x531" },
  { code: "MW", name: "Malawi", dimensions: "413x531" },
  { code: "MY", name: "Malaysia", dimensions: "827x1181" },
  { code: "MT", name: "Malta", dimensions: "413x531" },
  { code: "MX", name: "Mexico", dimensions: "413x531" },
  { code: "NP", name: "Nepal", dimensions: "413x531" },
  { code: "NL", name: "Netherlands", dimensions: "413x531" },
  { code: "NZ", name: "New Zealand", dimensions: "900x1200" },
  // The API uses NI for Nigeria (ISO: NG)
  { code: "NI", name: "Nigeria", dimensions: "600x800", flag: "NG" },
  { code: "NO", name: "Norway", dimensions: "413x531" },
  { code: "PER", name: "Peru", dimensions: "413x531", flag: "PE" },
  { code: "PH", name: "Philippines", dimensions: "827x1063" },
  { code: "PL", name: "Poland", dimensions: "413x531" },
  { code: "PT", name: "Portugal", dimensions: "413x531" },
  { code: "RO", name: "Romania", dimensions: "413x531" },
  { code: "EU", name: "Schengen Area", dimensions: "630x810" },
  { code: "SG", name: "Singapore", dimensions: "400x514" },
  { code: "SK", name: "Slovakia", dimensions: "413x531" },
  { code: "SI", name: "Slovenia", dimensions: "413x531" },
  { code: "ZA", name: "South Africa", dimensions: "413x531" },
  { code: "KR", name: "South Korea", dimensions: "413x531" },
  { code: "ES", name: "Spain", dimensions: "413x531" },
  { code: "LK", name: "Sri Lanka", dimensions: "413x531" },
  { code: "SE", name: "Sweden", dimensions: "413x531" },
  { code: "CHE", name: "Switzerland", dimensions: "413x531", flag: "CH" },
  { code: "TJ", name: "Tajikistan", dimensions: "413x531" },
  { code: "TH", name: "Thailand", dimensions: "413x531" },
  { code: "TR", name: "Turkey", dimensions: "591x709" },
  { code: "AE", name: "United Arab Emirates", dimensions: "413x531" },
  { code: "GB", name: "United Kingdom", dimensions: "600x750" },
  { code: "US", name: "United States", dimensions: "600x600" },
];

export const getCountry = (code: string) => countries.find((c) => c.code === code);

/** Emoji flag from a two-letter region code */
export const flagEmoji = (country: Country) =>
  String.fromCodePoint(...[...(country.flag ?? country.code)].map((c) => 0x1f1a5 + c.charCodeAt(0)));