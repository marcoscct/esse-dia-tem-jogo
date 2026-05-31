import type { PhaseSlug } from './types';

export interface BracketSlot {
  type: '1st' | '2nd' | '3rd' | 'winner' | 'loser';
  group?: string; // For 1st, 2nd, 3rd (e.g., 'C')
  matchNumber?: number; // For winner/loser of a previous match
  pool?: string[]; // Groups that can populate this 3rd-place slot
}

export interface KnockoutMatch {
  matchNumber: number; // 73 to 104
  phase_slug: PhaseSlug;
  phase: string;
  date: string; // YYYY-MM-DD
  time_brt: string | null;
  venue: string;
  city: string;
  slotA: BracketSlot;
  slotB: BracketSlot;
  nextMatch: number | null; // Match number of the next round
}

export const KNOCKOUT_BRACKET: KnockoutMatch[] = [
  // --- Round of 32 (Matches 73 - 88) ---
  {
    matchNumber: 73,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-06-28',
    time_brt: null,
    venue: 'Los Angeles Stadium',
    city: 'Los Angeles',
    slotA: { type: '2nd', group: 'A' },
    slotB: { type: '2nd', group: 'B' },
    nextMatch: 90
  },
  {
    matchNumber: 74,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-06-29',
    time_brt: null,
    venue: 'Boston Stadium',
    city: 'Boston',
    slotA: { type: '1st', group: 'E' },
    slotB: { type: '3rd', pool: ['A', 'B', 'C', 'D', 'F'] },
    nextMatch: 89
  },
  {
    matchNumber: 75,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-06-29',
    time_brt: null,
    venue: 'Estadio Monterrey',
    city: 'Monterrey',
    slotA: { type: '1st', group: 'F' },
    slotB: { type: '2nd', group: 'C' },
    nextMatch: 90
  },
  {
    matchNumber: 76,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-06-29',
    time_brt: null,
    venue: 'Houston Stadium',
    city: 'Houston',
    slotA: { type: '1st', group: 'C' },
    slotB: { type: '2nd', group: 'F' },
    nextMatch: 91
  },
  {
    matchNumber: 77,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-06-30',
    time_brt: null,
    venue: 'New York New Jersey Stadium',
    city: 'Nova York/NJ',
    slotA: { type: '1st', group: 'I' },
    slotB: { type: '3rd', pool: ['C', 'D', 'F', 'G', 'H'] },
    nextMatch: 89
  },
  {
    matchNumber: 78,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-06-30',
    time_brt: null,
    venue: 'Dallas Stadium',
    city: 'Dallas',
    slotA: { type: '2nd', group: 'E' },
    slotB: { type: '2nd', group: 'I' },
    nextMatch: 91
  },
  {
    matchNumber: 79,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-06-30',
    time_brt: null,
    venue: 'Estadio Azteca',
    city: 'Cidade do México',
    slotA: { type: '1st', group: 'A' },
    slotB: { type: '3rd', pool: ['C', 'E', 'F', 'H', 'I'] },
    nextMatch: 92
  },
  {
    matchNumber: 80,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-01',
    time_brt: null,
    venue: 'Atlanta Stadium',
    city: 'Atlanta',
    slotA: { type: '1st', group: 'L' },
    slotB: { type: '3rd', pool: ['E', 'H', 'I', 'J', 'K'] },
    nextMatch: 92
  },
  {
    matchNumber: 81,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-01',
    time_brt: null,
    venue: "Levi's Stadium",
    city: 'San Francisco',
    slotA: { type: '1st', group: 'D' },
    slotB: { type: '3rd', pool: ['B', 'E', 'F', 'I', 'J'] },
    nextMatch: 94
  },
  {
    matchNumber: 82,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-01',
    time_brt: null,
    venue: 'Lumen Field',
    city: 'Seattle',
    slotA: { type: '1st', group: 'G' },
    slotB: { type: '3rd', pool: ['A', 'E', 'H', 'I', 'J'] },
    nextMatch: 94
  },
  {
    matchNumber: 83,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-02',
    time_brt: null,
    venue: 'BMO Field',
    city: 'Toronto',
    slotA: { type: '2nd', group: 'K' },
    slotB: { type: '2nd', group: 'L' },
    nextMatch: 93
  },
  {
    matchNumber: 84,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-02',
    time_brt: null,
    venue: 'SoFi Stadium',
    city: 'Los Angeles',
    slotA: { type: '1st', group: 'H' },
    slotB: { type: '2nd', group: 'J' },
    nextMatch: 93
  },
  {
    matchNumber: 85,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-02',
    time_brt: null,
    venue: 'BC Place',
    city: 'Vancouver',
    slotA: { type: '1st', group: 'B' },
    slotB: { type: '3rd', pool: ['E', 'F', 'G', 'I', 'J'] },
    nextMatch: 96
  },
  {
    matchNumber: 86,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-03',
    time_brt: null,
    venue: 'Hard Rock Stadium',
    city: 'Miami',
    slotA: { type: '1st', group: 'J' },
    slotB: { type: '2nd', group: 'H' },
    nextMatch: 95
  },
  {
    matchNumber: 87,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-03',
    time_brt: null,
    venue: 'Kansas City Stadium',
    city: 'Kansas City',
    slotA: { type: '1st', group: 'K' },
    slotB: { type: '3rd', pool: ['D', 'E', 'I', 'J', 'L'] },
    nextMatch: 96
  },
  {
    matchNumber: 88,
    phase_slug: 'round_of_32',
    phase: '32 avos de Final',
    date: '2026-07-03',
    time_brt: null,
    venue: 'Dallas Stadium',
    city: 'Dallas',
    slotA: { type: '2nd', group: 'D' },
    slotB: { type: '2nd', group: 'G' },
    nextMatch: 95
  },

  // --- Round of 16 (Matches 89 - 96) ---
  {
    matchNumber: 89,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-04',
    time_brt: null,
    venue: 'Lincoln Financial Field',
    city: 'Filadélfia',
    slotA: { type: 'winner', matchNumber: 74 },
    slotB: { type: 'winner', matchNumber: 77 },
    nextMatch: 97
  },
  {
    matchNumber: 90,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-04',
    time_brt: null,
    venue: 'NRG Stadium',
    city: 'Houston',
    slotA: { type: 'winner', matchNumber: 73 },
    slotB: { type: 'winner', matchNumber: 75 },
    nextMatch: 97
  },
  {
    matchNumber: 91,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-05',
    time_brt: null,
    venue: 'New York New Jersey Stadium',
    city: 'Nova York/NJ',
    slotA: { type: 'winner', matchNumber: 76 },
    slotB: { type: 'winner', matchNumber: 78 },
    nextMatch: 99
  },
  {
    matchNumber: 92,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-05',
    time_brt: null,
    venue: 'Estadio Azteca',
    city: 'Cidade do México',
    slotA: { type: 'winner', matchNumber: 79 },
    slotB: { type: 'winner', matchNumber: 80 },
    nextMatch: 99
  },
  {
    matchNumber: 93,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-06',
    time_brt: null,
    venue: 'Dallas Stadium',
    city: 'Dallas',
    slotA: { type: 'winner', matchNumber: 83 },
    slotB: { type: 'winner', matchNumber: 84 },
    nextMatch: 98
  },
  {
    matchNumber: 94,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-06',
    time_brt: null,
    venue: 'Lumen Field',
    city: 'Seattle',
    slotA: { type: 'winner', matchNumber: 81 },
    slotB: { type: 'winner', matchNumber: 82 },
    nextMatch: 98
  },
  {
    matchNumber: 95,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-07',
    time_brt: null,
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    slotA: { type: 'winner', matchNumber: 86 },
    slotB: { type: 'winner', matchNumber: 88 },
    nextMatch: 100
  },
  {
    matchNumber: 96,
    phase_slug: 'round_of_16',
    phase: 'Oitavas de Final',
    date: '2026-07-07',
    time_brt: null,
    venue: 'BC Place',
    city: 'Vancouver',
    slotA: { type: 'winner', matchNumber: 85 },
    slotB: { type: 'winner', matchNumber: 87 },
    nextMatch: 100
  },

  // --- Quarter-finals (Matches 97 - 100) ---
  {
    matchNumber: 97,
    phase_slug: 'quarter_finals',
    phase: 'Quartas de Final',
    date: '2026-07-09',
    time_brt: null,
    venue: 'Boston Stadium',
    city: 'Boston',
    slotA: { type: 'winner', matchNumber: 89 },
    slotB: { type: 'winner', matchNumber: 90 },
    nextMatch: 101
  },
  {
    matchNumber: 98,
    phase_slug: 'quarter_finals',
    phase: 'Quartas de Final',
    date: '2026-07-10',
    time_brt: null,
    venue: 'SoFi Stadium',
    city: 'Los Angeles',
    slotA: { type: 'winner', matchNumber: 93 },
    slotB: { type: 'winner', matchNumber: 94 },
    nextMatch: 101
  },
  {
    matchNumber: 99,
    phase_slug: 'quarter_finals',
    phase: 'Quartas de Final',
    date: '2026-07-11',
    time_brt: null,
    venue: 'Hard Rock Stadium',
    city: 'Miami',
    slotA: { type: 'winner', matchNumber: 91 },
    slotB: { type: 'winner', matchNumber: 92 },
    nextMatch: 102
  },
  {
    matchNumber: 100,
    phase_slug: 'quarter_finals',
    phase: 'Quartas de Final',
    date: '2026-07-11',
    time_brt: null,
    venue: 'Kansas City Stadium',
    city: 'Kansas City',
    slotA: { type: 'winner', matchNumber: 95 },
    slotB: { type: 'winner', matchNumber: 96 },
    nextMatch: 102
  },

  // --- Semi-finals (Matches 101 - 102) ---
  {
    matchNumber: 101,
    phase_slug: 'semi_finals',
    phase: 'Semifinal',
    date: '2026-07-14',
    time_brt: null,
    venue: 'Dallas Stadium',
    city: 'Dallas',
    slotA: { type: 'winner', matchNumber: 97 },
    slotB: { type: 'winner', matchNumber: 98 },
    nextMatch: 104
  },
  {
    matchNumber: 102,
    phase_slug: 'semi_finals',
    phase: 'Semifinal',
    date: '2026-07-15',
    time_brt: null,
    venue: 'Atlanta Stadium',
    city: 'Atlanta',
    slotA: { type: 'winner', matchNumber: 99 },
    slotB: { type: 'winner', matchNumber: 100 },
    nextMatch: 104
  },

  // --- Third-place match (Match 103) ---
  {
    matchNumber: 103,
    phase_slug: 'third_place',
    phase: 'Disputa de 3º Lugar',
    date: '2026-07-18',
    time_brt: null,
    venue: 'Miami Stadium',
    city: 'Miami',
    slotA: { type: 'loser', matchNumber: 101 },
    slotB: { type: 'loser', matchNumber: 102 },
    nextMatch: null
  },

  // --- Final (Match 104) ---
  {
    matchNumber: 104,
    phase_slug: 'final',
    phase: 'Final',
    date: '2026-07-19',
    time_brt: null,
    venue: 'New York New Jersey Stadium',
    city: 'Nova York/NJ',
    slotA: { type: 'winner', matchNumber: 101 },
    slotB: { type: 'winner', matchNumber: 102 },
    nextMatch: null
  }
];

/**
 * Helper to trace all matches along a single pathway from a starting match number.
 */
function tracePath(startMatchNumber: number): number[] {
  const path: number[] = [];
  let current: number | null = startMatchNumber;
  while (current !== null) {
    path.push(current);
    const match = KNOCKOUT_BRACKET.find(m => m.matchNumber === current);
    current = match ? match.nextMatch : null;
  }
  return path;
}

/**
 * Traces paths for all possible third place matches for a group.
 */
export function getTeamKnockoutPaths(groupLetter: string): {
  group_1st: number[];
  group_2nd: number[];
  group_3rd: number[][];
} {
  const g = groupLetter.toUpperCase();

  // Find R32 match for 1st place
  const match1st = KNOCKOUT_BRACKET.find(
    m =>
      m.phase_slug === 'round_of_32' &&
      ((m.slotA.type === '1st' && m.slotA.group === g) ||
        (m.slotB.type === '1st' && m.slotB.group === g))
  );

  // Find R32 match for 2nd place
  const match2nd = KNOCKOUT_BRACKET.find(
    m =>
      m.phase_slug === 'round_of_32' &&
      ((m.slotA.type === '2nd' && m.slotA.group === g) ||
        (m.slotB.type === '2nd' && m.slotB.group === g))
  );

  // Find all possible R32 matches for 3rd place
  const matches3rd = KNOCKOUT_BRACKET.filter(
    m =>
      m.phase_slug === 'round_of_32' &&
      ((m.slotA.type === '3rd' && m.slotA.pool?.includes(g)) ||
        (m.slotB.type === '3rd' && m.slotB.pool?.includes(g)))
  );

  return {
    group_1st: match1st ? tracePath(match1st.matchNumber) : [],
    group_2nd: match2nd ? tracePath(match2nd.matchNumber) : [],
    group_3rd: matches3rd.map(m => tracePath(m.matchNumber))
  };
}
