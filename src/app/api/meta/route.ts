/**
 * GET /api/meta
 * Returns calendar metadata (version, last_updated, competition info).
 * Used by the admin panel and monitoring scripts.
 */

import { NextResponse } from 'next/server';
import { getCalendarMeta } from '@/lib/calendar';

export const dynamic = 'force-static';

export async function GET() {
  const meta = getCalendarMeta();
  return NextResponse.json(meta, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
