import { getAllStaticRoutes, getTeamBySlug, queryDate } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';
import { getDatePageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import LocalizedTimesDatePage from '../../../../_localized/times-date-page';

interface Props {
  params: Promise<{ team: string; date: string }>;
}

export async function generateStaticParams() {
  return getAllStaticRoutes(true).map((r) => ({
    team: r.team,
    date: r.date,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { team: slug, date: dateParam } = await params;
  const team = getTeamBySlug(slug, true);
  if (!team) return {};
  const isoDate = parseDateParam(dateParam);
  if (!isoDate) return {};
  const result = queryDate(team.code, isoDate, true);
  return getDatePageMetadata(team, isoDate, result, 'en', true);
}

export default async function Page({ params }: Props) {
  const { team: slug, date: dateParam } = await params;
  return <LocalizedTimesDatePage teamSlug={slug} dateParam={dateParam} />;
}
