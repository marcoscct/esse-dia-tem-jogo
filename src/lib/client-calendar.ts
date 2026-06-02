import type { Calendar, DateQueryResult, MatchWithTeam } from "./types";

let cachedCalendar: Calendar | null = null;
let fetchPromise: Promise<Calendar> | null = null;

/**
 * Fetch calendar.json from client-side and cache it in memory.
 */
export async function getClientCalendar(): Promise<Calendar> {
  if (cachedCalendar) return cachedCalendar;

  if (!fetchPromise) {
    fetchPromise = fetch("/data/calendar.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load calendar data on client");
        return res.json() as Promise<Calendar>;
      })
      .then((calendar) => {
        cachedCalendar = calendar;
        return calendar;
      })
      .catch((err) => {
        fetchPromise = null; // Reset promise so we can retry if it failed
        throw err;
      });
  }

  return fetchPromise;
}

/**
 * Client-side query: checks if a team (by slug) has a game on a given date or range.
 */
export async function queryDateClient(teamSlug: string, startDate: string, endDate?: string): Promise<DateQueryResult> {
  const calendar = await getClientCalendar();

  // Find the team by slug
  const entry = Object.entries(calendar.teams).find(
    ([, team]) => team.slug === teamSlug.toLowerCase()
  );

  if (!entry) {
    return {
      hasGame: false,
      date: startDate,
      matches: [],
    };
  }

  const [teamCode, team] = entry;
  const matches: MatchWithTeam[] = [];

  if (team.status !== "eliminated") {
    const dayMatches = team.matches.filter((m) => {
      if (m.status === "eliminated") return false;
      if (endDate) {
        return m.date >= startDate && m.date <= endDate;
      }
      return m.date === startDate;
    });

    for (const match of dayMatches) {
      matches.push({
        ...match,
        team_code: teamCode,
        team_name: team.name,
        team_flag: team.flag,
      });
    }
  }

  return {
    hasGame: matches.length > 0,
    date: startDate,
    matches,
  };
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
 * Client-side query: returns all games from all active teams on a given date or range.
 */
export async function queryAllGamesOnDateClient(startDate: string, endDate?: string): Promise<DateQueryResult> {
  const calendar = await getClientCalendar();
  const matches: MatchWithTeam[] = [];
  const seenMatches = new Set<string>();

  for (const [teamCode, team] of Object.entries(calendar.teams)) {
    if (team.status === "eliminated") continue;

    const dayMatches = team.matches.filter((m) => {
      if (m.status === "eliminated") return false;
      if (endDate) {
        return m.date >= startDate && m.date <= endDate;
      }
      return m.date === startDate;
    });

    for (const match of dayMatches) {
      const matchKey = match.match_number ? String(match.match_number) : `${match.date}-${teamCode}-${match.opponent_code}`;
      if (!seenMatches.has(matchKey)) {
        seenMatches.add(matchKey);
        
        if (match.phase_slug !== 'group_stage' && match.status === 'possible' && match.match_number) {
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
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    if (!a.time_brt) return 1;
    if (!b.time_brt) return -1;
    return a.time_brt.localeCompare(b.time_brt);
  });

  return {
    hasGame: matches.length > 0,
    date: startDate,
    matches,
  };
}
