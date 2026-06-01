import { notFound } from 'next/navigation';
import { getAllDates, queryAllGamesOnDate, getAllTeams, getCalendarMeta } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';
import HomeClient from '@/components/HomeClient';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
  return getAllDates().map((d) => ({
    date: d,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date: dateParam } = await params;
  const isoDate = parseDateParam(dateParam);
  if (!isoDate) return {};
  
  return {
    title: "Esse Dia Tem Jogo?",
    description: `Confira todos os jogos que ocorrem no dia ${isoDate}.`,
  };
}

export default async function TodosPage({ params }: Props) {
  const { date: dateParam } = await params;
  const isoDate = parseDateParam(dateParam);
  if (!isoDate) notFound();

  const result = queryAllGamesOnDate(isoDate);
  const teams = getAllTeams();
  const meta = getCalendarMeta();

  return (
    <>
      <script
        id="__TODOS_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ date: isoDate, hasGame: result.hasGame, matches: result.matches }) }}
      />
      <HomeClient 
        teams={teams} 
        lastUpdated={meta.last_updated} 
        initialDate={isoDate} 
        initialMode="date-only"
        result={{ hasGame: result.hasGame, matches: result.matches }} 
      />
    </>
  );
}
