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

const CLUB_BADGES: Record<string, string> = {
  PAL: "https://s.sde.globo.com/media/organizations/2019/07/06/Palmeiras.svg",
  FLA: "https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg",
  FLU: "https://s.sde.globo.com/media/organizations/2018/03/11/fluminense.svg",
  CAP: "https://s.sde.globo.com/media/organizations/2026/01/07/Athletico-PR.svg",
  RBB: "https://s.sde.globo.com/media/organizations/2021/06/28/bragantino.svg",
  BAH: "https://s.sde.globo.com/media/organizations/2018/03/11/bahia.svg",
  CFC: "https://s.sde.globo.com/media/organizations/2019/02/18/caracas-svg-13084.svg",
  SAO: "https://s.sde.globo.com/media/organizations/2018/03/11/sao-paulo.svg",
  CAM: "https://s.sde.globo.com/media/organizations/2018/03/10/atletico-mg.svg",
  COR: "https://s.sde.globo.com/media/organizations/2024/10/09/Corinthians_2024_Q4ahot4.svg",
  CRU: "https://s.sde.globo.com/media/organizations/2021/02/13/cruzeiro_2021.svg",
  BOT: "https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg",
  VIT: "https://s.sde.globo.com/media/organizations/2025/12/18/Vitoria_2025.svg",
  INT: "https://s.sde.globo.com/media/organizations/2018/03/11/internacional.svg",
  SAN: "https://s.sde.globo.com/media/organizations/2018/03/12/santos.svg",
  GRE: "https://s.sde.globo.com/media/organizations/2018/03/12/gremio.svg",
  VAS: "https://s.sde.globo.com/media/organizations/2021/09/04/vasco_SVG.svg",
  REM: "https://s.sde.globo.com/media/organizations/2021/02/25/Remo-PA.svg",
  MIR: "https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg",
  CHA: "https://s.sde.globo.com/media/organizations/2021/06/21/CHAPECOENSE-2018.svg",
  SPT: "https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg",
  VNO: "https://s.sde.globo.com/media/organizations/2021/04/07/vilanova.svg",
  SBD: "https://s.sde.globo.com/media/organizations/2022/01/20/Sao_Bernardo.svg",
  NAU: "https://s.sde.globo.com/media/organizations/2019/01/03/Nautico.svg",
  FOR: "https://s.sde.globo.com/media/organizations/2021/09/19/Fortaleza_2021_1.svg",
  GOI: "https://s.sde.globo.com/media/organizations/2021/03/01/GOIAS-2021.svg",
  NOV: "https://s.sde.globo.com/media/organizations/2019/01/08/Novohorizontino.svg",
  CRI: "https://s.sde.globo.com/media/teams/2026/01/16/criciuma-2026-svg-79692.svg",
  ATH: "https://s.sde.globo.com/media/organizations/2025/01/22/Athletic_Club-mineiro.svg",
  JUV: "https://s.sde.globo.com/media/organizations/2021/04/29/Juventude-2021-01.svg",
  OPE: "https://s.sde.globo.com/media/organizations/2018/12/27/Operário-PR.svg",
  CRB: "https://s.sde.globo.com/media/organizations/2018/03/11/crb.svg",
  CEA: "https://s.sde.globo.com/media/organizations/2019/10/10/ceara.svg",
  ACG: "https://s.sde.globo.com/media/organizations/2020/07/02/atletico-go-2020.svg",
  CUI: "https://s.sde.globo.com/media/organizations/2018/12/26/Cuiaba_EC.svg",
  BSP: "https://s.sde.globo.com/media/organizations/2024/05/15/BFC.svg",
  AVA: "https://s.sde.globo.com/media/organizations/2024/05/12/avaí.svg",
  LEC: "https://s.sde.globo.com/media/organizations/2018/03/11/londrina.svg",
  PON: "https://s.sde.globo.com/media/organizations/2019/03/17/ponte-preta.svg",
  AME: "https://s.sde.globo.com/media/organizations/2024/05/07/America-MG-branco.svg",
  EST: "https://s.sde.globo.com/media/organizations/2025/09/18/Novo_Escudo_Estudiantes.svg",
  CAT: "https://s.sde.globo.com/media/organizations/2019/02/18/universidad-catolica-svg-13106.svg",
  RCE: "https://s.sde.globo.com/media/organizations/2024/03/26/ROSARIO_CENTRAL.svg",
  TOL: "https://s.sde.globo.com/media/organizations/2023/05/01/tolima-svg-60445.svg",
  IDV: "https://s.sde.globo.com/media/organizations/2025/09/23/independiente_del_valle.svg",
  LDU: "https://s.sde.globo.com/media/organizations/2019/02/19/ldu-svg-13094.svg",
  CCP: "https://s.sde.globo.com/media/organizations/2024/03/26/CERRO_PORTEÑO.svg",
  PLA: "https://s.sde.globo.com/media/organizations/2025/06/25/Platense.svg",
  COQ: "https://s.sde.globo.com/media/organizations/2024/03/29/Coquimbo_Unido.svg",
  CIR: "https://s.sde.globo.com/media/organizations/2025/12/18/club-sportivo-independiente-rivadavia-svg-79360.svg",
  BOC: "https://s.sde.globo.com/media/organizations/2019/02/19/boca-juniors-svg-13083.svg",
  OHI: "https://s.sde.globo.com/media/organizations/2026/02/14/OHiggins.svg",
  BOL: "https://s.sde.globo.com/media/organizations/2023/05/01/Bolívar.svg",
  SFE: "https://s.sde.globo.com/media/organizations/2023/05/01/Santa_Fe.svg",
  DIM: "https://s.sde.globo.com/media/organizations/2024/03/29/Independiente_Medellín.svg",
  SCR: "https://s.sde.globo.com/media/organizations/2019/02/19/sporting-cristal-svg-13103.svg",
  UCV: "https://s.sde.globo.com/media/organizations/2024/12/23/universidad-central-fc-svg-74496.svg",
  NAC: "https://s.sde.globo.com/media/organizations/2024/03/26/NACIONAL-01.svg",
  TIG: "https://s.sde.globo.com/media/organizations/2023/05/01/Tigre.svg",
  LAN: "https://s.sde.globo.com/media/organizations/2024/03/29/Lanus.svg",
  CIE: "https://s.sde.globo.com/media/organizations/2025/03/31/Ciensiano.svg",
  LAG: "https://s.sde.globo.com/media/organizations/2026/03/23/la-guaira-svg-80300.svg",
  BSC: "https://s.sde.globo.com/media/organizations/2023/03/22/barcelona_SC.svg",
  ALW: "https://s.sde.globo.com/media/organizations/2019/12/26/always-ready-23152.svg",
  UNI: "https://s.sde.globo.com/media/organizations/2023/05/01/Universitario.svg",
  CUS: "https://s.sde.globo.com/media/teams/2026/03/30/cusco-svg-80418.svg",
  JUN: "https://s.sde.globo.com/media/organizations/2024/03/26/JUNIOR_BARRANQUILLA_copy.svg",
  LIB: "https://s.sde.globo.com/media/organizations/2024/03/26/LIBERTAD.svg",
  PEN: "https://s.sde.globo.com/media/organizations/2019/02/18/penarol-svg-13099.svg",
  SLB: "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg",
  RIV: "https://upload.wikimedia.org/wikipedia/commons/4/43/Club_Atl%C3%A9tico_River_Plate_logo.svg",
  LAU: "https://upload.wikimedia.org/wikipedia/commons/0/0d/FC_Lausanne-Sport_logo.svg",
  NIG: "https://upload.wikimedia.org/wikipedia/pt/7/7a/NovaIguacuFC.png",
  TUN: "https://upload.wikimedia.org/wikipedia/commons/0/01/Tuna_Luso_1903.svg",
  CAS: "https://upload.wikimedia.org/wikipedia/pt/2/29/FC_Cascavel.png",
};

/**
 * Returns the circular flag SVG URL for a given team code.
 * Falls back to a generic globe if not found.
 */
export function getFlagUrl(teamCode: string): string {
  const code = teamCode.toUpperCase();
    if (CLUB_BADGES[code]) {
    const ext = ['NIG', 'CAS'].includes(code) ? 'png' : 'svg';
    return `/badges/${code.toLowerCase()}.${ext}`;
  }
  const iso = TEAM_TO_ISO[code];
  if (!iso) return "/flags/xx.svg";
  if (code === "CGO") {
    return "/flags/cod.svg";
  }
  return `/flags/${code.toLowerCase()}.svg`;
}

/**
 * Returns whether a given team code belongs to a club.
 */
export function isClubCode(teamCode: string): boolean {
  return !!CLUB_BADGES[teamCode.toUpperCase()];
}
