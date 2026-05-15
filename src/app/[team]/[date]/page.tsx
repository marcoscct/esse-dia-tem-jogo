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

import { getAllTeams, getCalendarMeta } from '@/lib/calendar';
import HomeClient from '@/components/HomeClient';

export default async function DatePage({ params }: Props) {
  const { team: slug, date: dateParam } = await params;

  const team = getTeamBySlug(slug);
  if (!team) notFound();

  const isoDate = parseDateParam(dateParam);
  if (!isoDate) notFound();

  const result = queryDate(team.code, isoDate);

  const teams = getAllTeams().sort((a, b) => a.name.localeCompare(b.name));
  const meta = getCalendarMeta();

  return (
    <>
      <script
        id="__PAGE_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ team, date: isoDate, hasGame: result.hasGame, matches: result.matches }) }}
      />
      <HomeClient 
        teams={teams} 
        lastUpdated={meta.last_updated} 
        initialTeam={team.slug} 
        initialDate={isoDate} 
        result={{ hasGame: result.hasGame, matches: result.matches }} 
      />
    </>
  );
}
