#!/usr/bin/env node
/**
 * scripts/validate-calendar.js
 *
 * Validates the calendar.json schema before deploy.
 * Run in CI to catch corrupted or malformed data early.
 *
 * Usage:
 *   node scripts/validate-calendar.js [path/to/calendar.json]
 *
 * Exit codes:
 *   0 — valid
 *   1 — invalid (errors printed to stderr)
 */

'use strict';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

const CALENDAR_PATH =
  process.argv[2] ||
  path.join(__dirname, '..', 'public', 'data', 'calendar.json');

const VALID_STATUSES = new Set(['confirmed', 'possible', 'eliminated', 'played']);
const VALID_PHASE_SLUGS = new Set([
  'group_stage', 'round_of_32', 'round_of_16',
  'quarter_finals', 'semi_finals', 'third_place', 'final',
  'friendly',
]);
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^\d{2}:\d{2}$/;

const errors = [];
const warnings = [];

function error(msg) { errors.push(`❌ ${msg}`); }
function warn(msg)  { warnings.push(`⚠️  ${msg}`); }

try {
  const raw = fs.readFileSync(CALENDAR_PATH, 'utf-8');
  const calendar = JSON.parse(raw);

  // ── Meta ──────────────────────────────────────────────────────────────────
  if (!calendar.meta) error('Missing "meta" object');
  else {
    if (!calendar.meta.version) error('meta.version is required');
    if (!calendar.meta.last_updated) error('meta.last_updated is required');
    if (!DATE_REGEX.test(calendar.meta.last_updated))
      error(`meta.last_updated must be YYYY-MM-DD, got: ${calendar.meta.last_updated}`);
    if (!calendar.meta.competition_slug) error('meta.competition_slug is required');
    if (!calendar.meta.timezone) error('meta.timezone is required');
  }

  // ── Teams ─────────────────────────────────────────────────────────────────
  if (!calendar.teams || typeof calendar.teams !== 'object')
    error('Missing "teams" object');
  else {
    const teamCodes = Object.keys(calendar.teams);
    if (teamCodes.length === 0) error('teams object is empty');

    for (const [code, team] of Object.entries(calendar.teams)) {
      const prefix = `teams.${code}`;

      if (!team.name) error(`${prefix}.name is required`);
      if (!team.slug) error(`${prefix}.slug is required`);
      if (!team.flag) warn(`${prefix}.flag is missing`);
      if (!team.group) warn(`${prefix}.group is missing`);
      if (!['active', 'eliminated'].includes(team.status))
        error(`${prefix}.status must be "active" or "eliminated"`);

      if (!Array.isArray(team.matches))
        error(`${prefix}.matches must be an array`);
      else {
        const seenIds = new Set();
        for (const [i, match] of team.matches.entries()) {
          const mp = `${prefix}.matches[${i}]`;

          if (!match.id) error(`${mp}.id is required`);
          else if (seenIds.has(match.id)) error(`Duplicate match ID: ${match.id}`);
          else seenIds.add(match.id);

          if (!match.date) error(`${mp}.date is required`);
          else if (!DATE_REGEX.test(match.date))
            error(`${mp}.date must be YYYY-MM-DD, got: ${match.date}`);

          if (match.time_brt !== null && !TIME_REGEX.test(match.time_brt))
            error(`${mp}.time_brt must be HH:MM or null, got: ${match.time_brt}`);

          if (!match.phase) error(`${mp}.phase is required`);
          if (!VALID_PHASE_SLUGS.has(match.phase_slug))
            error(`${mp}.phase_slug invalid: "${match.phase_slug}"`);
          if (!VALID_STATUSES.has(match.status))
            error(`${mp}.status invalid: "${match.status}"`);

          const VALID_CONDITION_TYPES = new Set(['group_1st', 'group_2nd', 'group_3rd', 'knockout_advance']);

          // Condition checks
          if (match.status === 'possible') {
            if (match.condition === null || typeof match.condition !== 'string' || match.condition.trim() === '') {
              error(`${mp}.condition is required and must be a non-empty string when status is "possible"`);
            }
            if (!VALID_CONDITION_TYPES.has(match.condition_type)) {
              error(`${mp}.condition_type is invalid or missing for possible match: "${match.condition_type}"`);
            }
          } else if (match.status === 'confirmed' || match.status === 'played') {
            if (match.condition !== null && match.condition !== undefined) {
              error(`${mp}.condition must be null when status is "${match.status}", got: ${match.condition}`);
            }
            if (match.condition_type !== null && match.condition_type !== undefined) {
              error(`${mp}.condition_type must be null when status is "${match.status}", got: ${match.condition_type}`);
            }
          }

          // Match number checks
          if (match.match_number !== null && match.match_number !== undefined) {
            if (typeof match.match_number !== 'number') {
              error(`${mp}.match_number must be a number or null, got: ${typeof match.match_number}`);
            } else if (match.phase_slug !== 'group_stage' && (match.match_number < 73 || match.match_number > 104)) {
              error(`${mp}.match_number must be between 73 and 104 for knockout matches, got: ${match.match_number}`);
            }
          }
        }
      }
    }
  }

  // ── Report ────────────────────────────────────────────────────────────────
  if (warnings.length > 0) {
    console.warn('\nWarnings:');
    warnings.forEach((w) => console.warn(' ', w));
  }

  if (errors.length > 0) {
    console.error('\nValidation FAILED:');
    errors.forEach((e) => console.error(' ', e));
    console.error(`\n${errors.length} error(s) found in ${CALENDAR_PATH}`);
    process.exit(1);
  }

  const teamCount = Object.keys(calendar.teams).length;
  const matchCount = Object.values(calendar.teams).reduce(
    (sum, t) => sum + t.matches.length, 0
  );
  console.log(`✅ calendar.json is valid`);
  console.log(`   Teams: ${teamCount} | Matches: ${matchCount}`);
  console.log(`   Last updated: ${calendar.meta.last_updated}`);

} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(`❌ File not found: ${CALENDAR_PATH}`);
  } else if (err instanceof SyntaxError) {
    console.error(`❌ Invalid JSON: ${err.message}`);
  } else {
    console.error(`❌ Unexpected error: ${err.message}`);
  }
  process.exit(1);
}
