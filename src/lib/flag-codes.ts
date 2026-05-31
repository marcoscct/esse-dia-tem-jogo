/**
 * Maps team 3-letter codes to ISO 3166-1 alpha-2 codes
 * used by the circle-flags CDN (https://hatscripts.github.io/circle-flags/).
 */
const TEAM_TO_ISO: Record<string, string> = {
  BRA: "br",
  ARG: "ar",
  POR: "pt",
  ESP: "es",
  FRA: "fr",
  GER: "de",
  ENG: "gb-eng",
  ITA: "it",
  USA: "us",
  NED: "nl",
  JPN: "jp",
  MAR: "ma",
  MEX: "mx",
  URU: "uy",
  // opponents
  HAI: "ht",
  SCO: "gb-sct",
  ALG: "dz",
  AUT: "at",
  JOR: "jo",
  CGO: "cd",
  UZB: "uz",
  COL: "co",
  CPV: "cv",
  KSA: "sa",
  SEN: "sn",
  IRQ: "iq",
  NOR: "no",
  CUW: "cw",
  CIV: "ci",
  ECU: "ec",
  CRO: "hr",
  GHA: "gh",
  PAN: "pa",
  WAL: "gb-wls",
  AUS: "au",
  CHI: "cl",
  NGA: "ng",
  KOR: "kr",
  BEL: "be",
  BIH: "ba",
  CAN: "ca",
  CZE: "cz",
  EGY: "eg",
  IRN: "ir",
  NZL: "nz",
  PAR: "py",
  QAT: "qa",
  RSA: "za",
  SWE: "se",
  SUI: "ch",
  TUN: "tn",
  TUR: "tr"
};

/**
 * Returns the circular flag SVG URL for a given team code.
 * Falls back to a generic globe if not found.
 */
export function getFlagUrl(teamCode: string): string {
  const iso = TEAM_TO_ISO[teamCode.toUpperCase()];
  if (!iso) return "https://hatscripts.github.io/circle-flags/flags/xx.svg";
  return `https://hatscripts.github.io/circle-flags/flags/${iso}.svg`;
}
