import { getAllTeamSlugs, getTeamBySlug } from '@/lib/calendar';
import { getTeamMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import LocalizedTeamPage from '../../_localized/team-page';

interface Props {
  params: Promise<{ team: string }>;
}

export async function generateStaticParams() {
  return getAllTeamSlugs().map((slug) => ({ team: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { team: slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return {};
  return getTeamMetadata(team, 'es');
}

export default async function Page({ params }: Props) {
  const { team: slug } = await params;
  return <LocalizedTeamPage teamSlug={slug} />;
}
