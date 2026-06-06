import { getAllTeams, getCalendarMeta } from "@/lib/calendar";
import HomeClient from "@/components/HomeClient";
import { getHomeMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return getHomeMetadata('pt', true);
}

export default async function Page() {
  const teams = getAllTeams(true);
  const meta = getCalendarMeta(true);

  return <HomeClient teams={teams} lastUpdated={meta.last_updated} isClubs={true} />;
}
