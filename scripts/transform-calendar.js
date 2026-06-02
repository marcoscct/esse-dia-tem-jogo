#!/usr/bin/env node
/**
 * scripts/transform-calendar.js
 *
 * Fase 2 automation script.
 * Fetches raw data from OpenFootball worldcup.json and transforms it
 * into our canonical calendar.json format (BRT timezone, per-team structure).
 * Also generates possible knockout stage matches and prunes them dynamically.
 */

'use strict';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// ─── CLI args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : null;
};

const INPUT_PATH = getArg('--input') || '/tmp/worldcup_raw.json';
const OUTPUT_PATH =
  getArg('--output') ||
  path.join(__dirname, '..', 'public', 'data', 'calendar.json');

// ─── Timezone conversion ──────────────────────────────────────────────────────
function parseTimeToBRT(timeStr) {
  if (!timeStr) return null;

  const match = timeStr.match(/^(\d{2}):(\d{2})\s+UTC([+-]\d{1,2})$/);
  if (!match) {
    const bareMatch = timeStr.match(/^(\d{2}):(\d{2})$/);
    if (bareMatch) {
      const utcHour = parseInt(bareMatch[1], 10);
      const minute = parseInt(bareMatch[2], 10);
      const brtHour = ((utcHour - 3) % 24 + 24) % 24;
      return `${String(brtHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    return null;
  }

  const localHour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const offsetHours = parseInt(match[3], 10);

  const utcHour = ((localHour - offsetHours) % 24 + 24) % 24;
  const brtHour = ((utcHour - 3) % 24 + 24) % 24;

  return `${String(brtHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// ─── Team map ─────────────────────────────────────────────────────────────────
const TEAM_MAP = {
  'Mexico': { code: 'MEX', name: 'México', flag: '🇲🇽', slug: 'mexico', group: 'A' },
  'South Africa': { code: 'RSA', name: 'África do Sul', flag: '🇿🇦', slug: 'africa-do-sul', group: 'A' },
  'South Korea': { code: 'KOR', name: 'Coreia do Sul', flag: '🇰🇷', slug: 'coreia-do-sul', group: 'A' },
  'Czech Republic': { code: 'CZE', name: 'República Tcheca', flag: '🇨🇿', slug: 'republica-tcheca', group: 'A' },
  
  'Canada': { code: 'CAN', name: 'Canadá', flag: '🇨🇦', slug: 'canada', group: 'B' },
  'Bosnia & Herzegovina': { code: 'BIH', name: 'Bósnia e Herzegovina', flag: '🇧🇦', slug: 'bosnia-e-herzegovina', group: 'B' },
  'Qatar': { code: 'QAT', name: 'Catar', flag: '🇶🇦', slug: 'catar', group: 'B' },
  'Switzerland': { code: 'SUI', name: 'Suíça', flag: '🇨🇭', slug: 'suica', group: 'B' },
  
  'Brazil': { code: 'BRA', name: 'Brasil', flag: '🇧🇷', slug: 'brasil', group: 'C' },
  'Morocco': { code: 'MAR', name: 'Marrocos', flag: '🇲🇦', slug: 'marrocos', group: 'C' },
  'Haiti': { code: 'HAI', name: 'Haiti', flag: '🇭🇹', slug: 'haiti', group: 'C' },
  'Scotland': { code: 'SCO', name: 'Escócia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', slug: 'escocia', group: 'C' },
  
  'USA': { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', slug: 'estados-unidos', group: 'D' },
  'Paraguay': { code: 'PAR', name: 'Paraguai', flag: '🇵🇾', slug: 'paraguai', group: 'D' },
  'Australia': { code: 'AUS', name: 'Austrália', flag: '🇦🇺', slug: 'australia', group: 'D' },
  'Turkey': { code: 'TUR', name: 'Turquia', flag: '🇹🇷', slug: 'turquia', group: 'D' },
  
  'Germany': { code: 'GER', name: 'Alemanha', flag: '🇩🇪', slug: 'alemanha', group: 'E' },
  'Curaçao': { code: 'CUW', name: 'Curaçau', flag: '🇨🇼', slug: 'curacau', group: 'E' },
  'Ivory Coast': { code: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮', slug: 'costa-do-marfim', group: 'E' },
  'Ecuador': { code: 'ECU', name: 'Equador', flag: '🇪🇨', slug: 'equador', group: 'E' },
  
  'Netherlands': { code: 'NED', name: 'Holanda', flag: '🇳🇱', slug: 'holanda', group: 'F' },
  'Japan': { code: 'JPN', name: 'Japão', flag: '🇯🇵', slug: 'japao', group: 'F' },
  'Sweden': { code: 'SWE', name: 'Suécia', flag: '🇸🇪', slug: 'suecia', group: 'F' },
  'Tunisia': { code: 'TUN', name: 'Tunísia', flag: '🇹🇳', slug: 'tunisia', group: 'F' },
  
  'Belgium': { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', slug: 'belgica', group: 'G' },
  'Egypt': { code: 'EGY', name: 'Egito', flag: '🇪🇬', slug: 'egito', group: 'G' },
  'Iran': { code: 'IRN', name: 'Irã', flag: '🇮🇷', slug: 'ira', group: 'G' },
  'New Zealand': { code: 'NZL', name: 'Nova Zelândia', flag: '🇳🇿', slug: 'nova-zelandia', group: 'G' },
  
  'Spain': { code: 'ESP', name: 'Espanha', flag: '🇪🇸', slug: 'espanha', group: 'H' },
  'Cape Verde': { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', slug: 'cabo-verde', group: 'H' },
  'Saudi Arabia': { code: 'KSA', name: 'Arábia Saudita', flag: '🇸🇦', slug: 'arabia-saudita', group: 'H' },
  'Uruguay': { code: 'URU', name: 'Uruguai', flag: '🇺🇾', slug: 'uruguai', group: 'H' },
  
  'France': { code: 'FRA', name: 'França', flag: '🇫🇷', slug: 'franca', group: 'I' },
  'Senegal': { code: 'SEN', name: 'Senegal', flag: '🇸🇳', slug: 'senegal', group: 'I' },
  'Iraq': { code: 'IRQ', name: 'Iraque', flag: '🇮🇶', slug: 'iraque', group: 'I' },
  'Norway': { code: 'NOR', name: 'Noruega', flag: '🇳🇴', slug: 'noruega', group: 'I' },
  
  'Argentina': { code: 'ARG', name: 'Argentina', flag: '🇦🇷', slug: 'argentina', group: 'J' },
  'Algeria': { code: 'ALG', name: 'Argélia', flag: '🇩🇿', slug: 'argelia', group: 'J' },
  'Austria': { code: 'AUT', name: 'Áustria', flag: '🇦🇹', slug: 'austria', group: 'J' },
  'Jordan': { code: 'JOR', name: 'Jordânia', flag: '🇯🇴', slug: 'jordania', group: 'J' },
  
  'Portugal': { code: 'POR', name: 'Portugal', flag: '🇵🇹', slug: 'portugal', group: 'K' },
  'DR Congo': { code: 'CGO', name: 'RD Congo', flag: '🇨🇩', slug: 'rd-congo', group: 'K' },
  'Uzbekistan': { code: 'UZB', name: 'Uzbequistão', flag: '🇺🇿', slug: 'uzbequistao', group: 'K' },
  'Colombia': { code: 'COL', name: 'Colômbia', flag: '🇨🇴', slug: 'colombia', group: 'K' },
  
  'England': { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', slug: 'inglaterra', group: 'L' },
  'Croatia': { code: 'CRO', name: 'Croácia', flag: '🇭🇷', slug: 'croacia', group: 'L' },
  'Ghana': { code: 'GHA', name: 'Gana', flag: '🇬🇭', slug: 'gana', group: 'L' },
  'Panama': { code: 'PAN', name: 'Panamá', flag: '🇵🇦', slug: 'panama', group: 'L' }
};

function resolveOpponent(name) {
  const team = TEAM_MAP[name];
  if (team) {
    return { code: team.code, name: team.name, flag: team.flag };
  }
  return { code: null, name: name || 'A definir', flag: null };
}

function slugifyPhase(round) {
  if (!round) return 'group_stage';
  const r = round.toLowerCase();
  if (r.includes('matchday') || r.includes('group')) return 'group_stage';
  if (r.includes('round of 32') || r.includes('32')) return 'round_of_32';
  if (r.includes('round of 16') || r.includes('16')) return 'round_of_16';
  if (r.includes('quarter')) return 'quarter_finals';
  if (r.includes('semi')) return 'semi_finals';
  if (r.includes('third') || r.includes('3rd')) return 'third_place';
  if (r.includes('final')) return 'final';
  return 'group_stage';
}

// ─── Knockout Bracket Data ────────────────────────────────────────────────────
const KNOCKOUT_BRACKET = [
  // --- Round of 32 ---
  { matchNumber: 73, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-06-28', time_brt: '16:00', venue: 'Los Angeles Stadium', city: 'Los Angeles', slotA: { type: '2nd', group: 'A' }, slotB: { type: '2nd', group: 'B' }, nextMatch: 90 },
  { matchNumber: 74, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-06-29', time_brt: '17:30', venue: 'Boston Stadium', city: 'Boston', slotA: { type: '1st', group: 'E' }, slotB: { type: '3rd', pool: ['A', 'B', 'C', 'D', 'F'] }, nextMatch: 89 },
  { matchNumber: 75, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-06-29', time_brt: '22:00', venue: 'Estadio Monterrey', city: 'Monterrey', slotA: { type: '1st', group: 'F' }, slotB: { type: '2nd', group: 'C' }, nextMatch: 90 },
  { matchNumber: 76, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-06-29', time_brt: '14:00', venue: 'Houston Stadium', city: 'Houston', slotA: { type: '1st', group: 'C' }, slotB: { type: '2nd', group: 'F' }, nextMatch: 91 },
  { matchNumber: 77, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-06-30', time_brt: '18:00', venue: 'New York New Jersey Stadium', city: 'Nova York/NJ', slotA: { type: '1st', group: 'I' }, slotB: { type: '3rd', pool: ['C', 'D', 'F', 'G', 'H'] }, nextMatch: 89 },
  { matchNumber: 78, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-06-30', time_brt: '14:00', venue: 'Dallas Stadium', city: 'Dallas', slotA: { type: '2nd', group: 'E' }, slotB: { type: '2nd', group: 'I' }, nextMatch: 91 },
  { matchNumber: 79, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-06-30', time_brt: '22:00', venue: 'Estadio Azteca', city: 'Cidade do México', slotA: { type: '1st', group: 'A' }, slotB: { type: '3rd', pool: ['C', 'E', 'F', 'H', 'I'] }, nextMatch: 92 },
  { matchNumber: 80, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-01', time_brt: '13:00', venue: 'Atlanta Stadium', city: 'Atlanta', slotA: { type: '1st', group: 'L' }, slotB: { type: '3rd', pool: ['E', 'H', 'I', 'J', 'K'] }, nextMatch: 92 },
  { matchNumber: 81, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-01', time_brt: '21:00', venue: "Levi's Stadium", city: 'San Francisco', slotA: { type: '1st', group: 'D' }, slotB: { type: '3rd', pool: ['B', 'E', 'F', 'I', 'J'] }, nextMatch: 94 },
  { matchNumber: 82, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-01', time_brt: '17:00', venue: 'Lumen Field', city: 'Seattle', slotA: { type: '1st', group: 'G' }, slotB: { type: '3rd', pool: ['A', 'E', 'H', 'I', 'J'] }, nextMatch: 94 },
  { matchNumber: 83, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-02', time_brt: '20:00', venue: 'BMO Field', city: 'Toronto', slotA: { type: '2nd', group: 'K' }, slotB: { type: '2nd', group: 'L' }, nextMatch: 93 },
  { matchNumber: 84, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-02', time_brt: '16:00', venue: 'SoFi Stadium', city: 'Los Angeles', slotA: { type: '1st', group: 'H' }, slotB: { type: '2nd', group: 'J' }, nextMatch: 93 },
  { matchNumber: 85, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-02', time_brt: '00:00', venue: 'BC Place', city: 'Vancouver', slotA: { type: '1st', group: 'B' }, slotB: { type: '3rd', pool: ['E', 'F', 'G', 'I', 'J'] }, nextMatch: 96 },
  { matchNumber: 86, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-03', time_brt: '19:00', venue: 'Hard Rock Stadium', city: 'Miami', slotA: { type: '1st', group: 'J' }, slotB: { type: '2nd', group: 'H' }, nextMatch: 95 },
  { matchNumber: 87, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-03', time_brt: '22:30', venue: 'Kansas City Stadium', city: 'Kansas City', slotA: { type: '1st', group: 'K' }, slotB: { type: '3rd', pool: ['D', 'E', 'I', 'J', 'L'] }, nextMatch: 96 },
  { matchNumber: 88, phase_slug: 'round_of_32', phase: '32 avos de Final', date: '2026-07-03', time_brt: '15:00', venue: 'Dallas Stadium', city: 'Dallas', slotA: { type: '2nd', group: 'D' }, slotB: { type: '2nd', group: 'G' }, nextMatch: 95 },

  // --- Round of 16 ---
  { matchNumber: 89, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-04', time_brt: '18:00', venue: 'Lincoln Financial Field', city: 'Filadélfia', slotA: { type: 'winner', matchNumber: 74 }, slotB: { type: 'winner', matchNumber: 77 }, nextMatch: 97 },
  { matchNumber: 90, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-04', time_brt: '14:00', venue: 'NRG Stadium', city: 'Houston', slotA: { type: 'winner', matchNumber: 73 }, slotB: { type: 'winner', matchNumber: 75 }, nextMatch: 97 },
  { matchNumber: 91, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-05', time_brt: '17:00', venue: 'New York New Jersey Stadium', city: 'Nova York/NJ', slotA: { type: 'winner', matchNumber: 76 }, slotB: { type: 'winner', matchNumber: 78 }, nextMatch: 99 },
  { matchNumber: 92, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-05', time_brt: '21:00', venue: 'Estadio Azteca', city: 'Cidade do México', slotA: { type: 'winner', matchNumber: 79 }, slotB: { type: 'winner', matchNumber: 80 }, nextMatch: 99 },
  { matchNumber: 93, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-06', time_brt: '16:00', venue: 'Dallas Stadium', city: 'Dallas', slotA: { type: 'winner', matchNumber: 83 }, slotB: { type: 'winner', matchNumber: 84 }, nextMatch: 98 },
  { matchNumber: 94, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-06', time_brt: '21:00', venue: 'Lumen Field', city: 'Seattle', slotA: { type: 'winner', matchNumber: 81 }, slotB: { type: 'winner', matchNumber: 82 }, nextMatch: 98 },
  { matchNumber: 95, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-07', time_brt: '13:00', venue: 'Mercedes-Benz Stadium', city: 'Atlanta', slotA: { type: 'winner', matchNumber: 86 }, slotB: { type: 'winner', matchNumber: 88 }, nextMatch: 100 },
  { matchNumber: 96, phase_slug: 'round_of_16', phase: 'Oitavas de Final', date: '2026-07-07', time_brt: '17:00', venue: 'BC Place', city: 'Vancouver', slotA: { type: 'winner', matchNumber: 85 }, slotB: { type: 'winner', matchNumber: 87 }, nextMatch: 100 },

  // --- Quarter-finals ---
  { matchNumber: 97, phase_slug: 'quarter_finals', phase: 'Quartas de Final', date: '2026-07-09', time_brt: '17:00', venue: 'Boston Stadium', city: 'Boston', slotA: { type: 'winner', matchNumber: 89 }, slotB: { type: 'winner', matchNumber: 90 }, nextMatch: 101 },
  { matchNumber: 98, phase_slug: 'quarter_finals', phase: 'Quartas de Final', date: '2026-07-10', time_brt: '16:00', venue: 'SoFi Stadium', city: 'Los Angeles', slotA: { type: 'winner', matchNumber: 93 }, slotB: { type: 'winner', matchNumber: 94 }, nextMatch: 101 },
  { matchNumber: 99, phase_slug: 'quarter_finals', phase: 'Quartas de Final', date: '2026-07-11', time_brt: '18:00', venue: 'Hard Rock Stadium', city: 'Miami', slotA: { type: 'winner', matchNumber: 91 }, slotB: { type: 'winner', matchNumber: 92 }, nextMatch: 102 },
  { matchNumber: 100, phase_slug: 'quarter_finals', phase: 'Quartas de Final', date: '2026-07-11', time_brt: '22:00', venue: 'Kansas City Stadium', city: 'Kansas City', slotA: { type: 'winner', matchNumber: 95 }, slotB: { type: 'winner', matchNumber: 96 }, nextMatch: 102 },

  // --- Semi-finals ---
  { matchNumber: 101, phase_slug: 'semi_finals', phase: 'Semifinal', date: '2026-07-14', time_brt: '16:00', venue: 'Dallas Stadium', city: 'Dallas', slotA: { type: 'winner', matchNumber: 97 }, slotB: { type: 'winner', matchNumber: 98 }, nextMatch: 104 },
  { matchNumber: 102, phase_slug: 'semi_finals', phase: 'Semifinal', date: '2026-07-15', time_brt: '16:00', venue: 'Atlanta Stadium', city: 'Atlanta', slotA: { type: 'winner', matchNumber: 99 }, slotB: { type: 'winner', matchNumber: 100 }, nextMatch: 104 },

  // --- Third-place ---
  { matchNumber: 103, phase_slug: 'third_place', phase: 'Disputa de 3º Lugar', date: '2026-07-18', time_brt: '18:00', venue: 'Miami Stadium', city: 'Miami', slotA: { type: 'loser', matchNumber: 101 }, slotB: { type: 'loser', matchNumber: 102 }, nextMatch: null },

  // --- Final ---
  { matchNumber: 104, phase_slug: 'final', phase: 'Final', date: '2026-07-19', time_brt: '16:00', venue: 'New York New Jersey Stadium', city: 'Nova York/NJ', slotA: { type: 'winner', matchNumber: 101 }, slotB: { type: 'winner', matchNumber: 102 }, nextMatch: null }
];

function tracePath(startMatchNumber) {
  const pathList = [];
  let current = startMatchNumber;
  while (current !== null) {
    pathList.push(current);
    const match = KNOCKOUT_BRACKET.find(m => m.matchNumber === current);
    current = match ? match.nextMatch : null;
  }
  return pathList;
}

function getTeamKnockoutPaths(groupLetter) {
  const g = groupLetter.toUpperCase();

  const match1st = KNOCKOUT_BRACKET.find(
    m => m.phase_slug === 'round_of_32' &&
      ((m.slotA.type === '1st' && m.slotA.group === g) ||
        (m.slotB.type === '1st' && m.slotB.group === g))
  );

  const match2nd = KNOCKOUT_BRACKET.find(
    m => m.phase_slug === 'round_of_32' &&
      ((m.slotA.type === '2nd' && m.slotA.group === g) ||
        (m.slotB.type === '2nd' && m.slotB.group === g))
  );

  const matches3rd = KNOCKOUT_BRACKET.filter(
    m => m.phase_slug === 'round_of_32' &&
      ((m.slotA.type === '3rd' && m.slotA.pool?.includes(g)) ||
        (m.slotB.type === '3rd' && m.slotB.pool?.includes(g)))
  );

  return {
    group_1st: match1st ? tracePath(match1st.matchNumber) : [],
    group_2nd: match2nd ? tracePath(match2nd.matchNumber) : [],
    group_3rd: matches3rd.map(m => tracePath(m.matchNumber))
  };
}

function formatSlotOpponent(slot) {
  if (slot.type === '1st') return `1º do Grupo ${slot.group}`;
  if (slot.type === '2nd') return `2º do Grupo ${slot.group}`;
  if (slot.type === '3rd') return `3º do Grupo ${slot.pool.join('/')}`;
  if (slot.type === 'winner') return `Vencedor da Partida ${slot.matchNumber}`;
  if (slot.type === 'loser') return `Perdedor da Partida ${slot.matchNumber}`;
  return 'A definir';
}

function getOpponentDescription(match, teamPath, teamGroup, conditionType) {
  const isSlotAOnPath = isSlotOnPath(match.slotA, teamPath, match.matchNumber, teamGroup, conditionType);
  const opponentSlot = isSlotAOnPath ? match.slotB : match.slotA;
  return formatSlotOpponent(opponentSlot);
}

function isSlotOnPath(slot, teamPath, currentMatchNumber, teamGroup, conditionType) {
  const isFirstMatch = currentMatchNumber === teamPath[0];
  if (isFirstMatch) {
    if (conditionType === 'group_1st' && slot.type === '1st' && slot.group === teamGroup) return true;
    if (conditionType === 'group_2nd' && slot.type === '2nd' && slot.group === teamGroup) return true;
    if (conditionType === 'group_3rd' && slot.type === '3rd' && slot.pool?.includes(teamGroup)) return true;
  }
  if (slot.type === 'winner' || slot.type === 'loser') {
    return teamPath.includes(slot.matchNumber);
  }
  return false;
}

// ─── Group Standings Calculator ───────────────────────────────────────────────
function calculateGroupStandings(groupLetter, rawMatches) {
  const g = groupLetter.toUpperCase();
  const groupTeams = Object.values(TEAM_MAP)
    .filter(t => t.group === g)
    .map(t => t.code);

  const groupMatches = rawMatches.filter(m => {
    const t1 = TEAM_MAP[m.team1];
    const t2 = TEAM_MAP[m.team2];
    return t1 && t2 && t1.group === g && t2.group === g;
  });

  const isFullyPlayed = groupMatches.length === 6 && groupMatches.every(m => m.score);
  if (!isFullyPlayed) return null; // Keep all possible paths

  const table = {};
  groupTeams.forEach(code => {
    table[code] = { code, points: 0, gd: 0, gs: 0 };
  });

  groupMatches.forEach(m => {
    const t1Code = TEAM_MAP[m.team1].code;
    const t2Code = TEAM_MAP[m.team2].code;
    const s1 = m.score.ft[0];
    const s2 = m.score.ft[1];

    table[t1Code].gs += s1;
    table[t2Code].gs += s2;
    table[t1Code].gd += (s1 - s2);
    table[t2Code].gd += (s2 - s1);

    if (s1 > s2) {
      table[t1Code].points += 3;
    } else if (s2 > s1) {
      table[t2Code].points += 3;
    } else {
      table[t1Code].points += 1;
      table[t2Code].points += 1;
    }
  });

  const sorted = Object.values(table).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gs - a.gs;
  });

  const standings = {};
  sorted.forEach((team, index) => {
    standings[team.code] = index + 1; // 1, 2, 3, 4
  });

  return standings;
}

// ─── Main transform ───────────────────────────────────────────────────────────
function transform(rawJson) {
  const TRACKED_CODES = new Set(Object.values(TEAM_MAP).map((t) => t.code));
  const teams = {};

  for (const [, meta] of Object.entries(TEAM_MAP)) {
    teams[meta.code] = {
      name: meta.name,
      slug: meta.slug,
      flag: meta.flag,
      group: meta.group,
      type: 'national_team',
      status: 'active',
      matches: [],
    };
  }

  const matches = rawJson.matches || [];
  let matchIndex = 0;

  // 1. Process Group Stage Matches
  for (const rawMatch of matches) {
    const team1Meta = TEAM_MAP[rawMatch.team1];
    const team2Meta = TEAM_MAP[rawMatch.team2];
    if (!team1Meta && !team2Meta) continue;

    const phaseSlug = slugifyPhase(rawMatch.round);
    if (phaseSlug !== 'group_stage') continue; // Handled separately

    const date = rawMatch.date || null;
    const timeBrt = parseTimeToBRT(rawMatch.time);
    const venue = rawMatch.ground || 'A definir';
    const id = `wc2026-${String(++matchIndex).padStart(3, '0')}`;

    if (team1Meta && TRACKED_CODES.has(team1Meta.code)) {
      const opponent = resolveOpponent(rawMatch.team2);
      teams[team1Meta.code].matches.push({
        id: `${id}-${team1Meta.code.toLowerCase()}`,
        date,
        time_brt: timeBrt,
        opponent_code: opponent.code,
        opponent_name: opponent.name,
        opponent_flag: opponent.flag,
        phase: rawMatch.round || 'Fase de Grupos',
        phase_slug: 'group_stage',
        venue,
        city: venue,
        country: 'EUA/México/Canadá',
        status: rawMatch.score ? 'played' : 'confirmed',
        result: rawMatch.score
          ? { goals_home: rawMatch.score.ft?.[0] ?? null, goals_away: rawMatch.score.ft?.[1] ?? null, winner_code: null }
          : null,
        condition: null,
        condition_type: null,
        match_number: matchIndex
      });
    }

    if (team2Meta && TRACKED_CODES.has(team2Meta.code)) {
      const opponent = resolveOpponent(rawMatch.team1);
      teams[team2Meta.code].matches.push({
        id: `${id}-${team2Meta.code.toLowerCase()}`,
        date,
        time_brt: timeBrt,
        opponent_code: opponent.code,
        opponent_name: opponent.name,
        opponent_flag: opponent.flag,
        phase: rawMatch.round || 'Fase de Grupos',
        phase_slug: 'group_stage',
        venue,
        city: venue,
        country: 'EUA/México/Canadá',
        status: rawMatch.score ? 'played' : 'confirmed',
        result: rawMatch.score
          ? { goals_home: rawMatch.score.ft?.[1] ?? null, goals_away: rawMatch.score.ft?.[0] ?? null, winner_code: null }
          : null,
        condition: null,
        condition_type: null,
        match_number: matchIndex
      });
    }
  }

  // 2. Resolve Group Standings & 3rd Place qualifiers if fully played
  const groupStandings = {};
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  letters.forEach(letter => {
    groupStandings[letter] = calculateGroupStandings(letter, matches);
  });

  // Calculate 3rd place rankings if all groups are done
  let thirdPlaceRankings = null;
  const allGroupsDone = letters.every(l => groupStandings[l] !== null);
  if (allGroupsDone) {
    const thirdPlaceTeams = [];
    letters.forEach(l => {
      const standings = groupStandings[l];
      const teamCode = Object.keys(standings).find(code => standings[code] === 3);
      
      const teamMatches = matches.filter(m => {
        const t1 = TEAM_MAP[m.team1];
        const t2 = TEAM_MAP[m.team2];
        return t1 && t2 && (t1.code === teamCode || t2.code === teamCode) && slugifyPhase(m.round) === 'group_stage';
      });

      let pts = 0, gd = 0, gs = 0;
      teamMatches.forEach(m => {
        const t1Code = TEAM_MAP[m.team1].code;
        const s1 = m.score.ft[0];
        const s2 = m.score.ft[1];
        if (t1Code === teamCode) {
          gs += s1;
          gd += (s1 - s2);
          if (s1 > s2) pts += 3;
          else if (s1 === s2) pts += 1;
        } else {
          gs += s2;
          gd += (s2 - s1);
          if (s2 > s1) pts += 3;
          else if (s1 === s2) pts += 1;
        }
      });

      thirdPlaceTeams.push({ code: teamCode, group: l, points: pts, gd, gs });
    });

    thirdPlaceTeams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gs - a.gs;
    });

    thirdPlaceRankings = new Set(thirdPlaceTeams.slice(0, 8).map(t => t.code));
  }

  // 3. Process Confirmed Knockout Matches in raw JSON if they are present
  const confirmedKnockouts = [];
  const rawKnockouts = matches.filter(m => slugifyPhase(m.round) !== 'group_stage');
  
  rawKnockouts.forEach(rawMatch => {
    const team1Meta = TEAM_MAP[rawMatch.team1];
    const team2Meta = TEAM_MAP[rawMatch.team2];
    if (team1Meta && team2Meta) {
      const roundSlug = slugifyPhase(rawMatch.round);
      const possibleMatches = KNOCKOUT_BRACKET.filter(m => m.phase_slug === roundSlug);
      const matchedBracket = possibleMatches.find(m => {
        return true;
      });

      if (matchedBracket) {
        confirmedKnockouts.push({
          matchNumber: matchedBracket.matchNumber,
          team1Code: team1Meta.code,
          team2Code: team2Meta.code,
          rawMatch
        });
      }
    }
  });

  // 4. Generate Possible Knockout Matches
  for (const teamCode of Object.keys(teams)) {
    const team = teams[teamCode];
    const standings = groupStandings[team.group];
    
    // Determine allowed position paths for this team
    let allowedPositions = ['1st', '2nd', '3rd'];
    if (standings !== null) {
      const position = standings[teamCode];
      if (position === 1) allowedPositions = ['1st'];
      else if (position === 2) allowedPositions = ['2nd'];
      else if (position === 3) {
        if (thirdPlaceRankings === null || thirdPlaceRankings.has(teamCode)) {
          allowedPositions = ['3rd'];
        } else {
          allowedPositions = [];
          team.status = 'eliminated';
        }
      } else {
        allowedPositions = [];
        team.status = 'eliminated';
      }
    }

    if (allowedPositions.length === 0) continue; // Eliminated, no knockout matches

    const paths = getTeamKnockoutPaths(team.group);
    
    // Map of unique matchNumber -> { conditionType, pathMatches }
    const uniqueMatchSpecs = new Map();

    allowedPositions.forEach(pos => {
      if (pos === '1st') {
        paths.group_1st.forEach(matchNumber => {
          if (!uniqueMatchSpecs.has(matchNumber)) {
            uniqueMatchSpecs.set(matchNumber, {
              conditionType: 'group_1st',
              pathMatches: paths.group_1st
            });
          }
        });
        // Also add Match 103 (3rd place play-off)
        if (!uniqueMatchSpecs.has(103)) {
          uniqueMatchSpecs.set(103, {
            conditionType: 'group_1st',
            pathMatches: [...paths.group_1st.slice(0, 4), 103]
          });
        }
      } else if (pos === '2nd') {
        paths.group_2nd.forEach(matchNumber => {
          if (!uniqueMatchSpecs.has(matchNumber)) {
            uniqueMatchSpecs.set(matchNumber, {
              conditionType: 'group_2nd',
              pathMatches: paths.group_2nd
            });
          }
        });
        // Also add Match 103
        if (!uniqueMatchSpecs.has(103)) {
          uniqueMatchSpecs.set(103, {
            conditionType: 'group_2nd',
            pathMatches: [...paths.group_2nd.slice(0, 4), 103]
          });
        }
      } else if (pos === '3rd') {
        paths.group_3rd.forEach(tp => {
          tp.forEach(matchNumber => {
            if (!uniqueMatchSpecs.has(matchNumber)) {
              uniqueMatchSpecs.set(matchNumber, {
                conditionType: 'group_3rd',
                pathMatches: tp
              });
            }
          });
          // Also add Match 103
          if (!uniqueMatchSpecs.has(103)) {
            uniqueMatchSpecs.set(103, {
              conditionType: 'group_3rd',
              pathMatches: [...tp.slice(0, 4), 103]
            });
          }
        });
      }
    });

    // Generate matches without duplicates
    for (const [matchNumber, spec] of uniqueMatchSpecs.entries()) {
      const isAlreadyConfirmedDifferent = confirmedKnockouts.some(
        ck => ck.matchNumber === matchNumber && ck.team1Code !== teamCode && ck.team2Code !== teamCode
      );
      if (isAlreadyConfirmedDifferent) continue;

      const isConfirmedThisTeam = confirmedKnockouts.find(
        ck => ck.matchNumber === matchNumber && (ck.team1Code === teamCode || ck.team2Code === teamCode)
      );

      const bMatch = KNOCKOUT_BRACKET.find(m => m.matchNumber === matchNumber);
      if (!bMatch) continue;

      if (isConfirmedThisTeam) {
        const rawMatch = isConfirmedThisTeam.rawMatch;
        const isTeam1 = isConfirmedThisTeam.team1Code === teamCode;
        const oppCode = isTeam1 ? isConfirmedThisTeam.team2Code : isConfirmedThisTeam.team1Code;
        const oppMeta = TEAM_MAP[isTeam1 ? rawMatch.team2 : rawMatch.team1];
        
        team.matches.push({
          id: `wc2026-${matchNumber}-${teamCode.toLowerCase()}`,
          date: rawMatch.date || bMatch.date,
          time_brt: parseTimeToBRT(rawMatch.time) || bMatch.time_brt || null,
          opponent_code: oppCode,
          opponent_name: oppMeta ? oppMeta.name : (isTeam1 ? rawMatch.team2 : rawMatch.team1),
          opponent_flag: oppMeta ? oppMeta.flag : null,
          phase: bMatch.phase,
          phase_slug: bMatch.phase_slug,
          venue: rawMatch.ground || bMatch.venue,
          city: bMatch.city,
          country: 'EUA/México/Canadá',
          status: rawMatch.score ? 'played' : 'confirmed',
          result: rawMatch.score
            ? {
                goals_home: isTeam1 ? rawMatch.score.ft[0] : rawMatch.score.ft[1],
                goals_away: isTeam1 ? rawMatch.score.ft[1] : rawMatch.score.ft[0],
                winner_code: null
              }
            : null,
          condition: null,
          condition_type: null,
          match_number: matchNumber
        });
      } else {
        let cond = '';
        let condType = spec.conditionType;

        const isFirstMatch = matchNumber === spec.pathMatches[0];
        if (isFirstMatch) {
          if (condType === 'group_1st') cond = `Caso passe em 1º do Grupo ${team.group}`;
          else if (condType === 'group_2nd') cond = `Caso passe em 2º do Grupo ${team.group}`;
          else if (condType === 'group_3rd') cond = `Caso passe como melhor 3º do Grupo ${team.group}`;
        } else {
          condType = 'knockout_advance';
          if (bMatch.phase_slug === 'round_of_16') cond = 'Caso avance para as Oitavas de Final';
          else if (bMatch.phase_slug === 'quarter_finals') cond = 'Caso avance para as Quartas de Final';
          else if (bMatch.phase_slug === 'semi_finals') cond = 'Caso avance para a Semifinal';
          else if (bMatch.phase_slug === 'third_place') cond = 'Caso dispute o 3º lugar';
          else if (bMatch.phase_slug === 'final') cond = 'Caso avance para a Final';
        }

        const opponentName = getOpponentDescription(bMatch, spec.pathMatches, team.group, spec.conditionType);

        team.matches.push({
          id: `wc2026-${matchNumber}-${teamCode.toLowerCase()}-possible`,
          date: bMatch.date,
          time_brt: bMatch.time_brt || null,
          opponent_code: null,
          opponent_name: opponentName,
          opponent_flag: null,
          phase: bMatch.phase,
          phase_slug: bMatch.phase_slug,
          venue: bMatch.venue,
          city: bMatch.city,
          country: 'EUA/México/Canadá',
          status: 'possible',
          result: null,
          condition: cond,
          condition_type: condType,
          match_number: matchNumber
        });
      }
    }
  }

  // 5. Inject International Friendlies from scripts/friendlies.json
  const friendliesPath = path.join(__dirname, 'friendlies.json');
  if (fs.existsSync(friendliesPath)) {
    console.log(`📥 Loading friendlies from: ${friendliesPath}`);
    const friendliesRaw = fs.readFileSync(friendliesPath, 'utf-8');
    const friendlies = JSON.parse(friendliesRaw);

    const resolveFriendlyTeam = (teamRef) => {
      if (typeof teamRef === 'string') {
        const code = teamRef.toUpperCase();
        // Try to find by code in TEAM_MAP
        const entry = Object.entries(TEAM_MAP).find(([, meta]) => meta.code === code);
        if (entry) {
          return { code: entry[1].code, name: entry[1].name, flag: entry[1].flag };
        }
        return { code, name: teamRef, flag: null };
      }
      return {
        code: teamRef.code ? teamRef.code.toUpperCase() : null,
        name: teamRef.name || 'A definir',
        flag: teamRef.flag || null
      };
    };

    for (const f of friendlies) {
      const home = resolveFriendlyTeam(f.home_team);
      const away = resolveFriendlyTeam(f.away_team);

      if (!home.code || !away.code) continue;

      if (teams[home.code]) {
        teams[home.code].matches.push({
          id: f.id || `friendly-${f.date}-${home.code.toLowerCase()}-${away.code.toLowerCase()}`,
          date: f.date,
          time_brt: f.time_brt || null,
          opponent_code: away.code,
          opponent_name: away.name,
          opponent_flag: away.flag,
          phase: 'Amistoso Internacional',
          phase_slug: 'friendly',
          venue: f.venue || 'A definir',
          city: f.city || 'A definir',
          country: f.country || 'A definir',
          status: f.status || 'confirmed',
          result: f.result || null,
          condition: null,
          condition_type: null,
          match_number: null
        });
      }

      if (teams[away.code]) {
        teams[away.code].matches.push({
          id: f.id || `friendly-${f.date}-${away.code.toLowerCase()}-${home.code.toLowerCase()}`,
          date: f.date,
          time_brt: f.time_brt || null,
          opponent_code: home.code,
          opponent_name: home.name,
          opponent_flag: home.flag,
          phase: 'Amistoso Internacional',
          phase_slug: 'friendly',
          venue: f.venue || 'A definir',
          city: f.city || 'A definir',
          country: f.country || 'A definir',
          status: f.status || 'confirmed',
          result: f.result || null,
          condition: null,
          condition_type: null,
          match_number: null
        });
      }
    }
  }

  // Sort matches by date for each team
  for (const team of Object.values(teams)) {
    team.matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());

  return {
    meta: {
      version: '1.2',
      last_updated: today,
      source: 'OpenFootball worldcup.json (auto-transform + dynamic bracket)',
      competition: 'FIFA World Cup 2026',
      competition_slug: 'world_cup_2026',
      timezone: 'America/Sao_Paulo',
      notes: 'Gerado automaticamente por scripts/transform-calendar.js com suporte a jogos possíveis',
    },
    teams,
  };
}

// ─── Run ──────────────────────────────────────────────────────────────────────
async function run() {
  try {
    let rawJson;
    if (fs.existsSync(INPUT_PATH)) {
      console.log(`📥 Reading raw data from: ${INPUT_PATH}`);
      const rawContent = fs.readFileSync(INPUT_PATH, 'utf-8');
      rawJson = JSON.parse(rawContent);
    } else {
      const url = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json';
      console.log(`🌐 Fetching raw data from: ${url}`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      rawJson = await res.json();
    }

    console.log(`⚙️  Transforming ${rawJson.matches?.length ?? 0} matches…`);
    const calendar = transform(rawJson);

    const teamCount = Object.keys(calendar.teams).length;
    const matchCount = Object.values(calendar.teams).reduce(
      (sum, t) => sum + t.matches.length, 0
    );
    console.log(`✅ Transformed: ${teamCount} teams, ${matchCount} match entries`);

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(calendar, null, 2), 'utf-8');
    console.log(`💾 Saved to: ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('❌ Transform failed:', err.message, err.stack);
    process.exit(1);
  }
}

run();
