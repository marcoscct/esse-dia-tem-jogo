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

export default async function TeamPage({ params }: Props) {
  const { team: slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) notFound();

  const sortedMatches = [...team.matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto max-w-2xl px-6 py-20">
        <Link href="/" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 mb-8 inline-block">
          ← Voltar para o início
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tight">{team.name}</h1>
          <p className="text-zinc-500 mt-2">Calendário de jogos na Copa 2026</p>
        </header>

        <section className="space-y-4">
          {sortedMatches.map((match, i) => (
            <Link 
              key={`${match.date}-${i}`}
              href={`/${team.slug}/${match.date}`}
              className="flex items-center justify-between p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <div>
                <div className="font-bold text-lg">{match.opponent_name}</div>
                <div className="text-sm text-zinc-500">{formatDateLong(match.date)}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xl font-bold">{formatTimeBRT(match.time_brt)}</div>
                <div className="text-xs uppercase tracking-widest text-zinc-400">{match.venue}</div>
              </div>
            </Link>
          ))}
        </section>

        <script
          id="__TEAM_DATA__"
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ team, matches: sortedMatches }),
          }}
        />
      </main>
    </div>
  );
}
