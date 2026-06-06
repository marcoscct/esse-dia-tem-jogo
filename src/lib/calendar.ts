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
let _clubsCalendar: Calendar | null = null;

/**
 * Returns the parsed Calendar object.
 * Uses a module-level cache so the JSON is only parsed once per server process.
 * On the client, call `fetchCalendar()` instead.
 */
export function getCalendar(isClubs: boolean = false): Calendar {
  if (isClubs) {
    if (_clubsCalendar) return _clubsCalendar;

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', 'data', 'clubs_calendar.json');
      const raw = fs.readFileSync(filePath, 'utf-8');
      _clubsCalendar = JSON.parse(raw) as Calendar;
    } catch {
      console.warn('Fallback to require for clubs_calendar.json');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      _clubsCalendar = require('../../public/data/clubs_calendar.json') as Calendar;
    }
    return _clubsCalendar;
  }

  if (_calendar) return _calendar;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', 'data', 'calendar.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    _calendar = JSON.parse(raw) as Calendar;
  } catch {
    // Fallback to require for environments where fs might be tricky (like some edge cases)
    // but process.cwd() should work in Next.js build
    console.warn('Fallback to require for calendar.json');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _calendar = require('../../public/data/calendar.json') as Calendar;
  }
  
  return _calendar;
}

/**
 * Fetches calendar.json from the public directory.
 * Use this on the CLIENT SIDE where `require` is not available.
 */
export async function fetchCalendar(isClubs: boolean = false): Promise<Calendar> {
  const url = isClubs ? '/data/clubs_calendar.json' : '/data/calendar.json';
  const res = await fetch(url, {
    // Cache aggressively — revalidate every 5 minutes in production
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to load calendar data');
  return res.json() as Promise<Calendar>;
}

// ─── Team Helpers ─────────────────────────────────────────────────────────────

/** Returns all teams as an array of TeamSummary objects, sorted alphabetically with Brasil first. */
export function getAllTeams(isClubs: boolean = false): TeamSummary[] {
  const calendar = getCalendar(isClubs);
  const list = Object.entries(calendar.teams).map(([code, team]) => ({
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

  return list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

/** Returns a team by its 3-letter ISO code (e.g. "BRA"). Returns null if not found. */
export function getTeamByCode(code: string, isClubs: boolean = false): Team | null {
  const calendar = getCalendar(isClubs);
  return calendar.teams[code.toUpperCase()] ?? null;
}

/** Returns a team by its URL slug (e.g. "brasil"). Returns null if not found. */
export function getTeamBySlug(slug: string, isClubs: boolean = false): (Team & { code: string }) | null {
  const calendar = getCalendar(isClubs);
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
export function queryDate(teamCodes: string | string[], date: string, isClubs: boolean = false): DateQueryResult {
  const calendar = getCalendar(isClubs);
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
  options?: { status?: Match['status'] },
  isClubs: boolean = false
): Match[] {
  const team = getTeamByCode(code, isClubs);
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
export function getTeamGameDates(code: string, isClubs: boolean = false): string[] {
  const team = getTeamByCode(code, isClubs);
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
export function getAllStaticRoutes(isClubs: boolean = false): StaticRoute[] {
  const calendar = getCalendar(isClubs);
  const routes: StaticRoute[] = [];
  const seen = new Set<string>();

  for (const team of Object.values(calendar.teams)) {
    for (const match of team.matches) {
      if (match.status !== 'eliminated') {
        const key = `${team.slug}_${match.date}`;
        if (!seen.has(key)) {
          seen.add(key);
          routes.push({ team: team.slug, date: match.date });
        }
      }
    }
  }

  return routes;
}

/**
 * Returns a list of all unique team slugs.
 * Used to generate /[team] static pages.
 */
export function getAllTeamSlugs(isClubs: boolean = false): string[] {
  const calendar = getCalendar(isClubs);
  return Object.values(calendar.teams).map((t) => t.slug);
}

/**
 * Returns all unique dates in the calendar.
 * Used for sitemaps and static generation.
 */
export function getAllDates(isClubs: boolean = false): string[] {
  const routes = getAllStaticRoutes(isClubs);
  const dates = routes.map((r) => r.date);
  return Array.from(new Set(dates)).sort();
}

/**
 * Helper to retrieve generic bracket slot names for a given possible knockout match.
 * Scans all teams to find the two distinct opponent names mapped to this match number.
 */
function getKnockoutGenericTeams(calendar: Calendar, matchNumber: number): [string, string] {
  const opponents = new Set<string>();
  for (const team of Object.values(calendar.teams)) {
    for (const m of team.matches) {
      if (m.match_number === matchNumber && m.opponent_name) {
        opponents.add(m.opponent_name);
      }
    }
  }
  const arr = Array.from(opponents).sort();
  if (arr.length === 2) {
    return [arr[0], arr[1]];
  }
  if (arr.length === 1) {
    return [arr[0], "A definir"];
  }
  return ["A definir", "A definir"];
}

/**
 * Server-side query: returns all games from all active teams on a given date.
 */
export function queryAllGamesOnDate(date: string, isClubs: boolean = false): DateQueryResult {
  const calendar = getCalendar(isClubs);
  const matches: MatchWithTeam[] = [];
  const seenMatches = new Set<string>();

  for (const [teamCode, team] of Object.entries(calendar.teams)) {
    if (team.status === 'eliminated') continue;

    const dayMatches = team.matches.filter(
      (m) => m.date === date && m.status !== 'eliminated'
    );

    for (const match of dayMatches) {
      const matchKey = match.match_number
        ? String(match.match_number)
        : `${match.date}-${[teamCode, match.opponent_code || ''].sort().join('-')}`;
      if (!seenMatches.has(matchKey)) {
        seenMatches.add(matchKey);
        
        if (!isClubs && match.phase_slug !== 'group_stage' && match.status === 'possible' && match.match_number) {
          const [sideA, sideB] = getKnockoutGenericTeams(calendar, match.match_number);
          matches.push({
            ...match,
            team_code: 'TBD',
            team_name: sideA,
            team_flag: '🏳️',
            opponent_code: 'TBD',
            opponent_name: sideB,
            opponent_flag: null,
            condition: null,
          });
        } else {
          matches.push({
            ...match,
            team_code: teamCode,
            team_name: team.name,
            team_flag: team.flag,
          });
        }
      }
    }
  }

  matches.sort((a, b) => {
    if (!a.time_brt) return 1;
    if (!b.time_brt) return -1;
    return a.time_brt.localeCompare(b.time_brt);
  });

  return {
    hasGame: matches.length > 0,
    date,
    matches,
  };
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export function getCalendarMeta(isClubs: boolean = false) {
  return getCalendar(isClubs).meta;
}
