/**
 * GET /api/teams
 * Returns a list of all available teams with summary information.
 * Used to populate the team selector on the home page.
 *
 * Response: TeamSummary[]
 */

import { NextResponse } from 'next/server';
import { getAllTeams } from '@/lib/calendar';

export const dynamic = 'force-static';

export async function GET() {
  const teams = getAllTeams();

  return NextResponse.json(teams, {
    headers: {
      // This data changes infrequently — cache for 1 hour at the CDN
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
