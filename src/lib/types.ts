// ─────────────────────────────────────────
// Types — Esse Dia Tem Jogo
// ─────────────────────────────────────────

export type MatchStatus = 'confirmed' | 'possible' | 'eliminated' | 'played';
export type PhaseSlug =
  | 'group_stage'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_finals'
  | 'semi_finals'
  | 'third_place'
  | 'final'
  | 'friendly';

export type TeamType = 'national_team' | 'club';
export type TeamStatus = 'active' | 'eliminated';

export interface MatchResult {
  goals_home: number | null;
  goals_away: number | null;
  winner_code: string | null;
}

export interface Match {
  id: string;
  /** ISO date string — YYYY-MM-DD */
  date: string;
  /** Time in BRT (America/Sao_Paulo), e.g. "19:00". Null when not confirmed yet. */
  time_brt: string | null;
  opponent_code: string | null;
  opponent_name: string;
  opponent_flag: string | null;
  phase: string;
  phase_slug: PhaseSlug;
  venue: string;
  city: string;
  country: string;
  status: MatchStatus;
  result: MatchResult | null;
  condition: string | null;
  condition_type: ConditionType | null;
  match_number: number | null;
  broadcasts?: string[];
}

export type ConditionType = 
  | 'group_1st'
  | 'group_2nd'
  | 'group_3rd'
  | 'knockout_advance';

export interface Team {
  name: string;
  slug: string;
  flag: string;
  group: string;
  type: TeamType;
  status: TeamStatus;
  matches: Match[];
}

export interface CalendarMeta {
  version: string;
  last_updated: string;
  source: string;
  competition: string;
  competition_slug: string;
  timezone: string;
  notes?: string;
}

export interface Calendar {
  meta: CalendarMeta;
  teams: Record<string, Team>;
}

// ─── Query Result Types ───────────────────

/** The result returned by queryDate() */
export interface DateQueryResult {
  hasGame: boolean;
  date: string;
  /** All confirmed+possible matches found for the queried team(s) on the given date */
  matches: MatchWithTeam[];
}

/** A match enriched with the home team info */
export interface MatchWithTeam extends Match {
  team_code: string;
  team_name: string;
  team_flag: string;
}

/** Summary info about a team (used in selectors, SEO pages, etc.) */
export interface TeamSummary {
  code: string;
  name: string;
  slug: string;
  flag: string;
  group: string;
  type: TeamType;
  status: TeamStatus;
  total_matches: number;
  confirmed_matches: number;
}

/** All possible date + team pairs (used for generateStaticParams) */
export interface StaticRoute {
  team: string;   // slug
  date: string;   // YYYY-MM-DD
}
