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
 * Client-side query: checks if a team (by slug) has a game on a given date.
 */
export async function queryDateClient(teamSlug: string, date: string): Promise<DateQueryResult> {
  const calendar = await getClientCalendar();

  // Find the team by slug
  const entry = Object.entries(calendar.teams).find(
    ([, team]) => team.slug === teamSlug.toLowerCase()
  );

  if (!entry) {
    return {
      hasGame: false,
      date,
      matches: [],
    };
  }

  const [teamCode, team] = entry;
  const matches: MatchWithTeam[] = [];

  if (team.status !== "eliminated") {
    const dayMatches = team.matches.filter(
      (m) => m.date === date && m.status !== "eliminated"
    );

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
    date,
    matches,
  };
}
