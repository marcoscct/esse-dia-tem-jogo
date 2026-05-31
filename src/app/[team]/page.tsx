/**
 * /[team] — Team overview page
 * Lists all matches for a team.
 * Statically generated for all known team slugs.
 */

import Link from "next/link";
import { notFound } from 'next/navigation';
import { getAllTeamSlugs, getTeamBySlug } from '@/lib/calendar';
import { formatDateLong, formatTimeBRT } from '@/lib/date-utils';
import { getTeamMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ team: string }>;
}

// ── Static generation ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllTeamSlugs().map((slug) => ({ team: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { team: slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};
  return getTeamMetadata(team);
}

// ── Page ──────────────────────────────────────────────────────────────────────

import { getAllTeams, getCalendarMeta } from '@/lib/calendar';
import HomeClient from '@/components/HomeClient';

export default async function TeamPage({ params }: Props) {
  const { team: slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) notFound();

  const sortedMatches = [...team.matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const teams = getAllTeams();
  const meta = getCalendarMeta();

  return (
    <>
      <script
        id="__TEAM_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ team, matches: sortedMatches }),
        }}
      />
      <HomeClient 
        teams={teams} 
        lastUpdated={meta.last_updated} 
        initialTeam={team.slug} 
      />
    </>
  );
}
