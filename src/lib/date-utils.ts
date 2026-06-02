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
