/**
 * calendar.ts
 * Core data access layer — reads calendar.json and exposes typed query helpers.
 * All functions are pure (no side effects) and safe to call from Server Components,
 * generateStaticParams, and API Routes.
 *
 * ARCHITECTURE NOTE:
 * The calendar.json lives in /public/data/calendar.json.
 * - On the CLIENT: fetch('/data/calendar.json') works naturally (served as static file).
 * - On the SERVER (Next.js build/SSR): we import the JSON directly via Node's fs
 *   so we don't need a running HTTP server at build time.
 */

import type {
  Calendar,
  DateQueryResult,
  Match,
  MatchWithTeam,
  StaticRoute,
  Team,
  TeamSummary,
} from './types';

// ─── Internal cache (singleton per build/runtime) ────────────────────────────

let _calendar: Calendar | null = null;

/**
 * Returns the parsed Calendar object.
 * Uses a module-level cache so the JSON is only parsed once per server process.
 * On the client, call `fetchCalendar()` instead.
 */
export function getCalendar(): Calendar {
  if (_calendar) return _calendar;

  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'calendar.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    _calendar = JSON.parse(raw) as Calendar;
  } catch (err) {
    // Fallback to require for environments where fs might be tricky (like some edge cases)
    // but process.cwd() should work in Next.js build
    console.warn('Fallback to require for calendar.json');
    _calendar = require('../../public/data/calendar.json') as Calendar;
  }
  
  return _calendar;
}

/**
 * Fetches calendar.json from the public directory.
 * Use this on the CLIENT SIDE where `require` is not available.
 */
export async function fetchCalendar(): Promise<Calendar> {
  const res = await fetch('/data/calendar.json', {
    // Cache aggressively — revalidate every 5 minutes in production
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to load calendar data');
  return res.json() as Promise<Calendar>;
}

// ─── Team Helpers ─────────────────────────────────────────────────────────────

/** Returns all teams as an array of TeamSummary objects. */
export function getAllTeams(): TeamSummary[] {
  const calendar = getCalendar();
  return Object.entries(calendar.teams).map(([code, team]) => ({
    code,
    name: team.name,
    slug: team.slug,
    flag: team.flag,
    group: team.group,
    type: team.type,
    status: team.status,
    total_matches: team.matches.length,
    confirmed_matches: team.matches.filter((m) => m.status === 'confirmed').length,
  }));
}

/** Returns a team by its 3-letter ISO code (e.g. "BRA"). Returns null if not found. */
export function getTeamByCode(code: string): Team | null {
  const calendar = getCalendar();
  return calendar.teams[code.toUpperCase()] ?? null;
}

/** Returns a team by its URL slug (e.g. "brasil"). Returns null if not found. */
export function getTeamBySlug(slug: string): (Team & { code: string }) | null {
  const calendar = getCalendar();
  const entry = Object.entries(calendar.teams).find(
    ([, team]) => team.slug === slug.toLowerCase()
  );
  if (!entry) return null;
  const [code, team] = entry;
  return { ...team, code };
}

// ─── Date Query ───────────────────────────────────────────────────────────────

/**
 * Core query: checks if a team (or multiple teams) has a game on a given date.
 *
 * @param teamCodes - One or more 3-letter ISO team codes ("BRA", "ARG", …)
 * @param date      - ISO date string "YYYY-MM-DD"
 * @returns         - DateQueryResult with hasGame flag and match details
 */
export function queryDate(teamCodes: string | string[], date: string): DateQueryResult {
  const calendar = getCalendar();
  const codes = Array.isArray(teamCodes)
    ? teamCodes.map((c) => c.toUpperCase())
    : [teamCodes.toUpperCase()];

  const matches: MatchWithTeam[] = [];

  for (const code of codes) {
    const team = calendar.teams[code];
    if (!team || team.status === 'eliminated') continue;

    const dayMatches = team.matches.filter(
      (m) => m.date === date && m.status !== 'eliminated'
    );

    for (const match of dayMatches) {
      matches.push({
        ...match,
        team_code: code,
        team_name: team.name,
        team_flag: team.flag,
      });
    }
  }

  return {
    hasGame: matches.length > 0,
    date,
    matches,
  };
}

/**
 * Returns all matches for a team ordered by date.
 * Optionally filter by status.
 */
export function getTeamMatches(
  code: string,
  options?: { status?: Match['status'] }
): Match[] {
  const team = getTeamByCode(code);
  if (!team) return [];

  let matches = [...team.matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  if (options?.status) {
    matches = matches.filter((m) => m.status === options.status);
  }

  return matches;
}

/**
 * Returns all confirmed match dates for a team.
 * Useful for highlighting dates in a calendar picker.
 */
export function getTeamGameDates(code: string): string[] {
  const team = getTeamByCode(code);
  if (!team) return [];
  return team.matches
    .filter((m) => m.status !== 'eliminated')
    .map((m) => m.date)
    .sort();
}

// ─── SEO / Static Params ─────────────────────────────────────────────────────

/**
 * Generates all team+date route pairs for Next.js generateStaticParams.
 * Includes both confirmed and possible matches so SEO pages exist for all scenarios.
 */
export function getAllStaticRoutes(): StaticRoute[] {
  const calendar = getCalendar();
  const routes: StaticRoute[] = [];

  for (const team of Object.values(calendar.teams)) {
    for (const match of team.matches) {
      if (match.status !== 'eliminated') {
        routes.push({ team: team.slug, date: match.date });
      }
    }
  }

  return routes;
}

/**
 * Returns a list of all unique team slugs.
 * Used to generate /[team] static pages.
 */
export function getAllTeamSlugs(): string[] {
  const calendar = getCalendar();
  return Object.values(calendar.teams).map((t) => t.slug);
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export function getCalendarMeta() {
  return getCalendar().meta;
}
