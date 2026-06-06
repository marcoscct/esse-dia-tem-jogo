import { getAllTeamSlugs, getTeamBySlug } from '@/lib/calendar';
import { getTeamMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import LocalizedTimesTeamPage from '../../../_localized/times-team-page';

interface Props {
  params: Promise<{ team: string }>;
}

export async function generateStaticParams() {
  return getAllTeamSlugs(true).map((slug) => ({ team: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { team: slug } = await params;
  const team = getTeamBySlug(slug, true);
  if (!team) return {};
  return getTeamMetadata(team, 'pt', true);
}

export default async function Page({ params }: Props) {
  const { team: slug } = await params;
  return <LocalizedTimesTeamPage teamSlug={slug} />;
}
