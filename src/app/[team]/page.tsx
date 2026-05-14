/**
 * /[team] — Team overview page
 * Lists all matches for a team.
 * Statically generated for all known team slugs.
 */

import { notFound } from 'next/navigation';
import { getAllTeamSlugs, getTeamBySlug } from '@/lib/calendar';
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

export default async function TeamPage({ params }: Props) {
  const { team: slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) notFound();

  // Sort matches chronologically
  const sortedMatches = [...team.matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Pass structured data to the Design Lead's component
  return (
    <main data-page="team" data-team-code={team.code} data-team-slug={team.slug}>
      {/* 
        Design Lead: render the team overview UI here.
        Data is available via the exported teamData object below (used in Server Components),
        or can be fetched from /api/teams/{code}.
      */}
      <script
        id="__TEAM_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ team, matches: sortedMatches }),
        }}
      />
    </main>
  );
}
