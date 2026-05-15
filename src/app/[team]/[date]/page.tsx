/**
 * /[team]/[date] — Date-specific match query page
 * THE CORE PAGE: "Esse dia tem jogo?"
 *
 * Statically generated for all confirmed + possible match dates per team.
 * Returns a structured result that the Design Lead will render.
 */

import Link from "next/link";
import { notFound } from 'next/navigation';
import { getAllStaticRoutes, getTeamBySlug, queryDate } from '@/lib/calendar';
import { formatDateLong, formatTimeBRT, parseDateParam } from '@/lib/date-utils';
import { getDatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ team: string; date: string }>;
}

// ── Static generation ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllStaticRoutes().map((r) => ({
    team: r.team,
    date: r.date,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { team: slug, date: dateParam } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};
  const isoDate = parseDateParam(dateParam);
  if (!isoDate) return {};
  const result = queryDate(team.code, isoDate);
  return getDatePageMetadata(team, isoDate, result);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function DatePage({ params }: Props) {
  const { team: slug, date: dateParam } = await params;

  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const isoDate = parseDateParam(dateParam);
  if (!isoDate) notFound();

  const result = queryDate(team.code, isoDate);

  const pageData = {
    team: { ...team },
    date: isoDate,
    hasGame: result.hasGame,
    matches: result.matches,
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 ${result.hasGame ? 'bg-green-600 text-white' : 'bg-zinc-950 text-zinc-400'}`}>
      <main className="flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
        <Link href={`/${team.slug}`} className="mb-12 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
          ← Voltar para {team.name}
        </Link>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold uppercase tracking-[0.2em] opacity-80">
            {formatDateLong(isoDate)}
          </h2>
          
          <h1 className="text-[12rem] sm:text-[16rem] font-black leading-none tracking-tighter uppercase select-none">
            {result.hasGame ? 'Sim' : 'Não'}
          </h1>

          {result.hasGame && result.matches.length > 0 && (
            <div className="mt-8 space-y-6">
              {result.matches.map((match, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-3xl font-bold">vs {match.opponent_name}</div>
                  <div className="text-xl mt-2 font-mono">{formatTimeBRT(match.time_brt)} BRT</div>
                  <div className="mt-4 px-4 py-1 bg-white/20 rounded-full text-sm font-bold uppercase tracking-widest">
                    {match.venue}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!result.hasGame && (
            <p className="text-2xl font-medium mt-8 text-zinc-600 italic">
              Pode ficar tranquilo.
            </p>
          )}
        </div>

        <script
          id="__PAGE_DATA__"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pageData) }}
        />
      </main>
    </div>
  );
}
