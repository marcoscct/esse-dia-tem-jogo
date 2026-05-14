/**
 * date-utils.ts
 * Pure date/time utilities — no external dependencies.
 * All formatting targets Brazilian users (pt-BR locale, BRT timezone).
 */

/** BRT timezone identifier */
export const BRT_TIMEZONE = 'America/Sao_Paulo';

/** Locale for all user-facing formatting */
export const PT_BR = 'pt-BR';

/**
 * Formats an ISO date string (YYYY-MM-DD) into a localized Brazilian string.
 * @example "2026-06-13" → "sábado, 13 de junho de 2026"
 */
export function formatDateLong(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day); // local date — no TZ shift
  return date.toLocaleDateString(PT_BR, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats an ISO date string into a short Brazilian string.
 * @example "2026-06-13" → "13/06/2026"
 */
export function formatDateShort(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(PT_BR, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Returns the weekday name in Portuguese.
 * @example "2026-06-13" → "sábado"
 */
export function getWeekday(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(PT_BR, { weekday: 'long' });
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
 * @example "19:00" → "19h00 (horário de Brasília)"
 */
export function formatTimeBRT(timeBrt: string | null): string {
  if (!timeBrt) return 'Horário a confirmar';
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
