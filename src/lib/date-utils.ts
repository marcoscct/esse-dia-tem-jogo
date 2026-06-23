/**
 * date-utils.ts
 * Pure date/time utilities — no external dependencies.
 * All formatting targets Brazilian users (pt-BR locale, BRT timezone), localized by language.
 */

import type { Language } from "@/locales/i18n-utils";

/** BRT timezone identifier */
export const BRT_TIMEZONE = 'America/Sao_Paulo';

const localesMap: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES'
};

/**
 * Formats an ISO date string (YYYY-MM-DD) into a localized string.
 * @example "2026-06-13" → "sábado, 13 de junho de 2026" (pt)
 */
export function formatDateLong(isoDate: string, lang: Language = 'pt'): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day); // local date — no TZ shift
  return date.toLocaleDateString(localesMap[lang], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats an ISO date string into a short localized string.
 * @example "2026-06-13" → "13/06/2026" (pt/es) / "06/13/2026" (en)
 */
export function formatDateShort(isoDate: string, lang: Language = 'pt'): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(localesMap[lang], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Returns the weekday name in the active language.
 * @example "2026-06-13" → "sábado" (pt) / "Saturday" (en)
 */
export function getWeekday(isoDate: string, lang: Language = 'pt'): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(localesMap[lang], { weekday: 'long' });
}

/**
 * Converts a Date object to an ISO date string in YYYY-MM-DD format,
 * respecting the local date (no UTC conversion).
 */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns today's date as a YYYY-MM-DD string in BRT timezone.
 * Safe to call on both server and client.
 */
export function getTodayBRT(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: BRT_TIMEZONE }).format(new Date());
}

/**
 * Returns tomorrow's date as a YYYY-MM-DD string in BRT timezone.
 */
export function getTomorrowBRT(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return new Intl.DateTimeFormat('sv-SE', { timeZone: BRT_TIMEZONE }).format(tomorrow);
}

/**
 * Checks if a given ISO date is today (in BRT).
 */
export function isToday(isoDate: string): boolean {
  return isoDate === getTodayBRT();
}

/**
 * Checks if a given ISO date is in the past (in BRT).
 */
export function isPast(isoDate: string): boolean {
  return isoDate < getTodayBRT();
}

/**
 * Checks if a given ISO date is in the future (in BRT).
 */
export function isFuture(isoDate: string): boolean {
  return isoDate > getTodayBRT();
}

/**
 * Given a time_brt string (e.g. "19:00"), returns a human-friendly label.
 * @example "19:00" → "19h00 (horário de Brasília)" (pt)
 */
export function formatTimeBRT(timeBrt: string | null, lang: Language = 'pt'): string {
  if (!timeBrt) {
    return lang === 'en' ? 'Time to be confirmed' : 'Horário a confirmar';
  }
  
  if (lang === 'en') {
    const [h, m] = timeBrt.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const mStr = String(m).padStart(2, '0');
    return `${h12}:${mStr} ${ampm} (Brasília time)`;
  }
  
  if (lang === 'es') {
    const [h, m] = timeBrt.split(':');
    return `${h}:${m} (hora de Brasilia)`;
  }

  // Default pt
  const [h, m] = timeBrt.split(':');
  return `${h}h${m} (horário de Brasília)`;
}

/**
 * Parses a date from URL param format (YYYY-MM-DD or DD-MM-YYYY).
 * Returns null if invalid.
 */
export function parseDateParam(param: string): string | null {
  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(param)) {
    const d = new Date(param + 'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return param;
  }
  // Try DD-MM-YYYY (URL-friendly legacy)
  if (/^\d{2}-\d{2}-\d{4}$/.test(param)) {
    const [day, month, year] = param.split('-');
    const iso = `${year}-${month}-${day}`;
    const d = new Date(iso + 'T12:00:00');
    if (isNaN(d.getTime())) return null;
    return iso;
  }
  return null;
}

/**
 * Builds the canonical URL-safe date string for routes.
 * @example "2026-06-13" → "2026-06-13"
 */
export function toRouteDate(isoDate: string): string {
  return isoDate; // YYYY-MM-DD — already URL safe
}

export function getVenueIanaTimezone(city: string, venue: string): string {
  const c = (city || '').toLowerCase();
  const v = (venue || '').toLowerCase();

  // Pacific Time (America/Vancouver, America/Los_Angeles)
  if (c.includes('vancouver') || v.includes('bc place')) {
    return 'America/Vancouver';
  }
  if (
    c.includes('los angeles') || v.includes('sofi') ||
    c.includes('seattle') || v.includes('lumen') ||
    c.includes('san francisco') || c.includes('santa clara') || v.includes('levi')
  ) {
    return 'America/Los_Angeles';
  }

  // CST (Mexico CST/MDT - America/Mexico_City, America/Monterrey)
  if (c.includes('monterrey') || c.includes('guadalupe')) {
    return 'America/Monterrey';
  }
  if (
    c.includes('mexico') || c.includes('méxico') || v.includes('azteca') ||
    c.includes('guadalajara') || c.includes('zapopan')
  ) {
    return 'America/Mexico_City';
  }

  // Central Time (America/Chicago)
  if (
    c.includes('dallas') || c.includes('arlington') || v.includes('att') ||
    c.includes('houston') || v.includes('nrg') ||
    c.includes('kansas') || v.includes('arrowhead')
  ) {
    return 'America/Chicago';
  }

  // Eastern Time (America/New_York, America/Toronto)
  if (c.includes('toronto') || v.includes('bmo field')) {
    return 'America/Toronto';
  }
  if (
    c.includes('atlanta') || v.includes('mercedes') ||
    c.includes('boston') || c.includes('foxborough') || v.includes('gillette') ||
    c.includes('miami') || v.includes('hard rock') ||
    c.includes('nova york') || c.includes('new york') || c.includes('nj') || v.includes('metlife') ||
    c.includes('filadélfia') || c.includes('philadelphia') || v.includes('lincoln')
  ) {
    return 'America/New_York';
  }

  // Default to Brasília
  return 'America/Sao_Paulo';
}

export function getTimezoneAbbreviation(timezone: string, date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(date);
    const part = parts.find(p => p.type === 'timeZoneName');
    return part ? part.value : '';
  } catch {
    return '';
  }
}

export function formatMatchTimeInTimezone(timeBrt: string, dateStr: string, targetTz: string, lang: Language = 'pt'): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeBrt.split(':').map(Number);
  
  // Original is BRT (UTC-3), we add 3 hours to get UTC date object
  const matchDate = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0));
  
  const localesMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
  
  let timeString = matchDate.toLocaleTimeString(localesMap[lang], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: targetTz,
    hour12: false
  });
  
  if (lang === 'en') {
    timeString = matchDate.toLocaleTimeString(localesMap[lang], {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: targetTz,
      hour12: true
    });
  }
  
  const abbr = getTimezoneAbbreviation(targetTz, matchDate);
  return `${timeString} (${abbr})`;
}

export function formatMatchDateInTimezone(timeBrt: string | null, dateStr: string, targetTz: string, lang: Language = 'pt'): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeBrt ? timeBrt.split(':').map(Number) : [12, 0];
  
  // Original is BRT (UTC-3), we add 3 hours to get UTC date object
  const matchDate = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0));
  
  const localesMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
  
  const formatter = new Intl.DateTimeFormat(localesMap[lang], {
    day: '2-digit',
    month: '2-digit',
    weekday: 'short',
    timeZone: targetTz
  });
  
  const parts = formatter.formatToParts(matchDate);
  const day = parts.find(p => p.type === 'day')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const weekdayRaw = parts.find(p => p.type === 'weekday')?.value || '';
  const weekday = weekdayRaw.replace(/\.$/, '');
  
  const dateFormatted = lang === 'en' ? `${month}/${day}` : `${day}/${month}`;
  return `${dateFormatted} (${weekday.toUpperCase()})`;
}
