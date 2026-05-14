/**
 * GET /api/teams/[code]
 * Returns full team data including all matches.
 *
 * Path param:
 *   code — 3-letter ISO code (BRA) or slug (brasil)
 *
 * Response: Team & { code: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllTeams, getTeamByCode, getTeamBySlug } from '@/lib/calendar';

export const dynamic = 'force-static';

/** Required for output: export — pre-generate all team routes */
export function generateStaticParams() {
  const teams = getAllTeams();
  // Pre-generate by both code and slug for flexibility
  return teams.flatMap((t) => [{ code: t.code }, { code: t.slug }]);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // Try as ISO code first (BRA), then as slug (brasil)
  const team =
    getTeamByCode(code) ??
    getTeamBySlug(code);

  if (!team) {
    return NextResponse.json({ error: `Team not found: ${code}` }, { status: 404 });
  }

  return NextResponse.json(team, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
