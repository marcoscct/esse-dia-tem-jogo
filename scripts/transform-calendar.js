#!/usr/bin/env node
/**
 * scripts/transform-calendar.js
 *
 * Fase 2 automation script.
 * Fetches raw data from OpenFootball worldcup.json and transforms it
 * into our canonical calendar.json format (BRT timezone, per-team structure).
 *
 * Usage:
 *   node scripts/transform-calendar.js [--input /tmp/worldcup_raw.json] [--output public/data/calendar.json]
 *
 * Called by GitHub Actions workflow .github/workflows/update-calendar.yml
 */

'use strict';

const fs = require('fs');
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
// BRT = UTC-3.  OpenFootball format: "13:00 UTC-6" means local time at venue.
// We convert to absolute UTC then to BRT.

/**
 * Parses OpenFootball time string and converts to BRT.
 * @param {string|undefined} timeStr — e.g. "13:00 UTC-6" or "19:00"
 * @returns {string|null} — "HH:MM" in BRT, or null if unparseable
 */
function parseTimeToBRT(timeStr) {
  if (!timeStr) return null;

  // Match "HH:MM UTC±H" or "HH:MM UTC±HH"
  const match = timeStr.match(/^(\d{2}):(\d{2})\s+UTC([+-]\d{1,2})$/);
  if (!match) {
    // Try bare "HH:MM" — assume UTC
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

  // Convert local venue time → UTC → BRT (UTC-3)
  const utcHour = ((localHour - offsetHours) % 24 + 24) % 24;
  const brtHour = ((utcHour - 3) % 24 + 24) % 24;

  return `${String(brtHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// ─── Team name normalization map ──────────────────────────────────────────────
// Maps OpenFootball English names → our codes and metadata
const TEAM_MAP = {
  'Brazil':      { code: 'BRA', name: 'Brasil',    flag: '🇧🇷', slug: 'brasil',    group: 'C' },
  'Argentina':   { code: 'ARG', name: 'Argentina', flag: '🇦🇷', slug: 'argentina', group: 'J' },
  'Portugal':    { code: 'POR', name: 'Portugal',  flag: '🇵🇹', slug: 'portugal',  group: 'K' },
  'Spain':       { code: 'ESP', name: 'Espanha',   flag: '🇪🇸', slug: 'espanha',   group: 'H' },
  'France':      { code: 'FRA', name: 'França',    flag: '🇫🇷', slug: 'franca',    group: 'I' },
  'Germany':     { code: 'GER', name: 'Alemanha',  flag: '🇩🇪', slug: 'alemanha',  group: 'E' },
  'England':     { code: 'ENG', name: 'Inglaterra',flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', slug: 'inglaterra',group: 'L' },
  'Italy':       { code: 'ITA', name: 'Itália',    flag: '🇮🇹', slug: 'italia',    group: 'A' },
};

const OPPONENT_MAP = {
  'Morocco':     { code: 'MAR', name: 'Marrocos',       flag: '🇲🇦' },
  'Haiti':       { code: 'HAI', name: 'Haiti',           flag: '🇭🇹' },
  'Scotland':    { code: 'SCO', name: 'Escócia',         flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'Algeria':     { code: 'ALG', name: 'Argélia',         flag: '🇩🇿' },
  'Austria':     { code: 'AUT', name: 'Áustria',         flag: '🇦🇹' },
  'Jordan':      { code: 'JOR', name: 'Jordânia',        flag: '🇯🇴' },
  'DR Congo':    { code: 'CGO', name: 'RD Congo',        flag: '🇨🇩' },
  'Uzbekistan':  { code: 'UZB', name: 'Uzbequistão',     flag: '🇺🇿' },
  'Colombia':    { code: 'COL', name: 'Colômbia',        flag: '🇨🇴' },
  'Cape Verde':  { code: 'CPV', name: 'Cabo Verde',      flag: '🇨🇻' },
  'Saudi Arabia':{ code: 'KSA', name: 'Arábia Saudita',  flag: '🇸🇦' },
  'Uruguay':     { code: 'URU', name: 'Uruguai',         flag: '🇺🇾' },
  'Senegal':     { code: 'SEN', name: 'Senegal',         flag: '🇸🇳' },
  'Iraq':        { code: 'IRQ', name: 'Iraque',          flag: '🇮🇶' },
  'Norway':      { code: 'NOR', name: 'Noruega',         flag: '🇳🇴' },
  'Curacao':     { code: 'CUW', name: 'Curaçau',         flag: '🇨🇼' },
  "Côte d'Ivoire":{ code: 'CIV', name: 'Costa do Marfim', flag: '🇨🇮' },
  'Ecuador':     { code: 'ECU', name: 'Equador',         flag: '🇪🇨' },
  'Croatia':     { code: 'CRO', name: 'Croácia',         flag: '🇭🇷' },
  'Ghana':       { code: 'GHA', name: 'Gana',            flag: '🇬🇭' },
  'Panama':      { code: 'PAN', name: 'Panamá',          flag: '🇵🇦' },
};

function resolveOpponent(name) {
  return OPPONENT_MAP[name] || { code: null, name: name || 'A definir', flag: null };
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

// ─── Main transform ───────────────────────────────────────────────────────────

function transform(rawJson) {
  const TRACKED_CODES = new Set(Object.values(TEAM_MAP).map((t) => t.code));
  const teams = {};

  // Initialize team entries
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

  // Process each match from the raw JSON
  const matches = rawJson.matches || [];
  let matchIndex = 0;

  for (const rawMatch of matches) {
    const team1Meta = TEAM_MAP[rawMatch.team1];
    const team2Meta = TEAM_MAP[rawMatch.team2];

    // Only process if at least one side is a tracked team
    if (!team1Meta && !team2Meta) continue;

    const date = rawMatch.date || null;
    const timeBrt = parseTimeToBRT(rawMatch.time);
    const phaseSlug = slugifyPhase(rawMatch.round);
    const venue = rawMatch.ground || 'A definir';
    const id = `wc2026-${String(++matchIndex).padStart(3, '0')}`;

    // Add match to team1 side (if tracked)
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
        phase_slug: phaseSlug,
        venue,
        city: venue,
        country: 'EUA/México/Canadá',
        status: rawMatch.score ? 'played' : 'confirmed',
        result: rawMatch.score
          ? { goals_home: rawMatch.score.ft?.[0] ?? null, goals_away: rawMatch.score.ft?.[1] ?? null, winner_code: null }
          : null,
      });
    }

    // Add match to team2 side (if tracked)
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
        phase_slug: phaseSlug,
        venue,
        city: venue,
        country: 'EUA/México/Canadá',
        status: rawMatch.score ? 'played' : 'confirmed',
        result: rawMatch.score
          ? { goals_home: rawMatch.score.ft?.[1] ?? null, goals_away: rawMatch.score.ft?.[0] ?? null, winner_code: null }
          : null,
      });
    }
  }

  // Sort matches by date for each team
  for (const team of Object.values(teams)) {
    team.matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());

  return {
    meta: {
      version: '1.1',
      last_updated: today,
      source: 'OpenFootball worldcup.json (auto-transform)',
      competition: 'FIFA World Cup 2026',
      competition_slug: 'world_cup_2026',
      timezone: 'America/Sao_Paulo',
      notes: 'Gerado automaticamente por scripts/transform-calendar.js',
    },
    teams,
  };
}

// ─── Run ──────────────────────────────────────────────────────────────────────

try {
  console.log(`📥 Reading raw data from: ${INPUT_PATH}`);
  const rawContent = fs.readFileSync(INPUT_PATH, 'utf-8');
  const rawJson = JSON.parse(rawContent);

  console.log(`⚙️  Transforming ${rawJson.matches?.length ?? 0} matches…`);
  const calendar = transform(rawJson);

  const teamCount = Object.keys(calendar.teams).length;
  const matchCount = Object.values(calendar.teams).reduce(
    (sum, t) => sum + t.matches.length, 0
  );
  console.log(`✅ Transformed: ${teamCount} teams, ${matchCount} match entries`);

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(calendar, null, 2), 'utf-8');
  console.log(`💾 Saved to: ${OUTPUT_PATH}`);
} catch (err) {
  console.error('❌ Transform failed:', err.message);
  process.exit(1);
}
