// Convert ISO-2 country code to flag emoji
const toFlag = (cc: string) =>
  cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

// Common country names (TR + EN) -> ISO2
const MAP: Record<string, string> = {
  turkiye: "TR", türkiye: "TR", turkey: "TR",
  kenya: "KE", nijerya: "NG", nigeria: "NG",
  gana: "GH", ghana: "GH",
  misir: "EG", mısır: "EG", egypt: "EG",
  fas: "MA", morocco: "MA",
  guneyafrika: "ZA", "south africa": "ZA", "güney afrika": "ZA",
  etiyopya: "ET", ethiopia: "ET",
  uganda: "UG", tanzanya: "TZ", tanzania: "TZ",
  ruanda: "RW", rwanda: "RW",
  senegal: "SN", "fildişi sahili": "CI", "ivory coast": "CI",
  almanya: "DE", germany: "DE",
  fransa: "FR", france: "FR",
  ingiltere: "GB", "birleşik krallık": "GB", uk: "GB", "united kingdom": "GB",
  abd: "US", "amerika": "US", usa: "US", "united states": "US",
  hindistan: "IN", india: "IN",
  cin: "CN", çin: "CN", china: "CN",
  japonya: "JP", japan: "JP",
  brezilya: "BR", brazil: "BR",
  meksika: "MX", mexico: "MX",
  ispanya: "ES", spain: "ES",
  italya: "IT", italy: "IT",
  hollanda: "NL", netherlands: "NL",
  isvecre: "CH", isviçre: "CH", switzerland: "CH",
  kanada: "CA", canada: "CA",
  avustralya: "AU", australia: "AU",
};

export function countryFlag(country?: string | null): string {
  if (!country) return "";
  const key = country.trim().toLowerCase();
  // Direct ISO2 input
  if (/^[a-z]{2}$/.test(key)) return toFlag(key);
  const code = MAP[key] || MAP[key.replace(/\s+/g, "")];
  return code ? toFlag(code) : "🌍";
}
