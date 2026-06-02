import { getAllStaticRoutes, getTeamBySlug, queryDate } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';
import { getDatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import LocalizedDatePage from '../../../_localized/date-page';

interface Props {
  params: Promise<{ team: string; date: string }>;
}

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
  return getDatePageMetadata(team, isoDate, result, 'en');
}

export default async function Page({ params }: Props) {
  const { team: slug, date: dateParam } = await params;
  return <LocalizedDatePage teamSlug={slug} dateParam={dateParam} />;
}
