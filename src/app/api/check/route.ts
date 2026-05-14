/**
 * GET /api/check
 * Core query endpoint: checks if a team has a game on a given date.
 *
 * Query params:
 *   team  — 3-letter ISO code or slug (required) — can be comma-separated for multiple
 *   date  — YYYY-MM-DD (required)
 *
 * Example:
 *   /api/check?team=BRA&date=2026-06-13
 *   /api/check?team=BRA,ARG&date=2026-06-13
 *
 * Response: DateQueryResult JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTeamBySlug, queryDate } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';

export const dynamic = 'force-static'; // pre-render at build time when possible

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // ── Validate `team` ──────────────────────────────────────────────────────
  const teamParam = searchParams.get('team');
  if (!teamParam) {
    return NextResponse.json(
      { error: 'Missing required query param: team' },
      { status: 400 }
    );
  }

  // ── Validate `date` ──────────────────────────────────────────────────────
  const dateParam = searchParams.get('date');
  if (!dateParam) {
    return NextResponse.json(
      { error: 'Missing required query param: date' },
      { status: 400 }
    );
  }

  const isoDate = parseDateParam(dateParam);
  if (!isoDate) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD.' },
      { status: 400 }
    );
  }

  // ── Resolve team codes ────────────────────────────────────────────────────
  const rawCodes = teamParam.split(',').map((t) => t.trim());
  const resolvedCodes: string[] = [];

  for (const raw of rawCodes) {
    const upper = raw.toUpperCase();
    // Try as 3-letter code first (BRA, ARG, …)
    if (/^[A-Z]{2,4}$/.test(upper)) {
      resolvedCodes.push(upper);
    } else {
      // Try as slug (brasil, argentina, …)
      const team = getTeamBySlug(raw);
      if (team) resolvedCodes.push(team.code);
    }
  }

  if (resolvedCodes.length === 0) {
    return NextResponse.json(
      { error: `Team not found: ${teamParam}` },
      { status: 404 }
    );
  }

  // ── Query ─────────────────────────────────────────────────────────────────
  const result = queryDate(resolvedCodes, isoDate);

  return NextResponse.json(result, {
    headers: {
      // Cache at CDN edge for 5 minutes — balance freshness vs. load
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
