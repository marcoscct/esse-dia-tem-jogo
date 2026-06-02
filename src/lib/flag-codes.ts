/**
 * Maps team 3-letter FIFA/IOC codes to ISO 3166-1 alpha-2 codes
 * used by the circle-flags CDN (https://hatscripts.github.io/circle-flags/).
 * Includes all 211 FIFA member associations and other common teams.
 */
const TEAM_TO_ISO: Record<string, string> = {
  // A
  AFG: "af",
  ALB: "al",
  ALG: "dz",
  ASA: "as",
  AND: "ad",
  ANG: "ao",
  AIA: "ai",
  ATG: "ag",
  ARG: "ar",
  ARM: "am",
  ARU: "aw",
  AUS: "au",
  AUT: "at",
  AZE: "az",

  // B
  BAH: "bs",
  BHR: "bh",
  BAN: "bd",
  BAR: "bb",
  BLR: "by",
  BEL: "be",
  BLZ: "bz",
  BEN: "bj",
  BER: "bm",
  BHU: "bt",
  BOL: "bo",
  BIH: "ba",
  BOT: "bw",
  BRA: "br",
  VGB: "vg",
  BRU: "bn",
  BUL: "bg",
  BFA: "bf",
  BDI: "bi",

  // C
  CAM: "kh",
  CMR: "cm",
  CAN: "ca",
  CPV: "cv",
  CAY: "ky",
  CTA: "cf",
  CHA: "td",
  CHI: "cl",
  CHN: "cn",
  TPE: "tw",
  COL: "co",
  COM: "km",
  CGO: "cg",
  COD: "cd",
  COK: "ck",
  CRC: "cr",
  CRO: "hr",
  CUB: "cu",
  CUW: "cw",
  CYP: "cy",
  CZE: "cz",

  // D
  DEN: "dk",
  DJI: "dj",
  DMA: "dm",
  DOM: "do",

  // E
  ECU: "ec",
  EGY: "eg",
  SLV: "sv",
  ENG: "gb-eng",
  EQG: "gq",
  ERI: "er",
  EST: "ee",
  SWZ: "sz",
  ETH: "et",

  // F
  FRO: "fo",
  FIJ: "fj",
  FIN: "fi",
  FRA: "fr",

  // G
  GAB: "ga",
  GAM: "gm",
  GEO: "ge",
  GER: "de",
  GHA: "gh",
  GIB: "gi",
  GRE: "gr",
  GRN: "gd",
  GUM: "gu",
  GUA: "gt",
  GUI: "gn",
  GNB: "gw",
  GUY: "gy",

  // H
  HAI: "ht",
  HON: "hn",
  HKG: "hk",
  HUN: "hu",

  // I
  ISL: "is",
  IND: "in",
  IDN: "id",
  IRN: "ir",
  IRQ: "iq",
  ISR: "il",
  ITA: "it",
  CIV: "ci",

  // J
  JAM: "jm",
  JPN: "jp",
  JOR: "jo",

  // K
  KAZ: "kz",
  KEN: "ke",
  KVX: "xk",
  KUW: "kw",
  KGZ: "kg",

  // L
  LAO: "la",
  LAT: "lv",
  LBN: "lb",
  LES: "ls",
  LBR: "lr",
  LBY: "ly",
  LIE: "li",
  LTU: "lt",
  LUX: "lu",

  // M
  MAC: "mo",
  MAD: "mg",
  MWI: "mw",
  MAS: "my",
  MDV: "mv",
  MLI: "ml",
  MLT: "mt",
  MTN: "mr",
  MRI: "mu",
  MEX: "mx",
  MDA: "md",
  MNG: "mn",
  MNE: "me",
  MSR: "ms",
  MAR: "ma",
  MOZ: "mz",
  MYA: "mm",

  // N
  NAM: "na",
  NEP: "np",
  NED: "nl",
  NCL: "nc",
  NZL: "nz",
  NCA: "ni",
  NIG: "ne",
  NGA: "ng",
  PRK: "kp",
  MKD: "mk",
  NIR: "gb-nir",
  NOR: "no",

  // O
  OMA: "om",

  // P
  PAK: "pk",
  PLE: "ps",
  PAN: "pa",
  PNG: "pg",
  PAR: "py",
  PER: "pe",
  PHI: "ph",
  POL: "pl",
  POR: "pt",
  PUR: "pr",

  // Q
  QAT: "qa",

  // R
  IRL: "ie",
  ROU: "ro",
  RUS: "ru",
  RWA: "rw",

  // S
  SAM: "ws",
  SMR: "sm",
  STP: "st",
  KSA: "sa",
  SCO: "gb-sct",
  SEN: "sn",
  SRB: "rs",
  SEY: "sc",
  SLE: "sl",
  SGP: "sg",
  SVK: "sk",
  SVN: "si",
  SOL: "sb",
  SOM: "so",
  RSA: "za",
  KOR: "kr",
  SSD: "ss",
  ESP: "es",
  SRI: "lk",
  SDN: "sd",
  SUR: "sr",
  SWE: "se",
  SUI: "ch",
  SYR: "sy",

  // T
  TAH: "pf",
  TJK: "tj",
  TAN: "tz",
  THA: "th",
  TLS: "tl",
  TOG: "tg",
  TGA: "to",
  TRI: "tt",
  TUN: "tn",
  TUR: "tr",
  TKM: "tm",
  TCA: "tc",

  // U
  UGA: "ug",
  UKR: "ua",
  UAE: "ae",
  USA: "us",
  URU: "uy",
  VIR: "vi",
  UZB: "uz",

  // V
  VAN: "vu",
  VEN: "ve",
  VIE: "vn",

  // W
  WAL: "gb-wls",

  // Y
  YEM: "ye",

  // Z
  ZAM: "zm",
  ZIM: "zw"
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
