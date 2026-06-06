import { notFound } from 'next/navigation';
import { queryAllGamesOnDate, getAllTeams, getCalendarMeta } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';
import HomeClient from '@/components/HomeClient';

interface Props {
  dateParam: string;
}

export default function LocalizedTimesTodosPage({ dateParam }: Props) {
  const isoDate = parseDateParam(dateParam);
  if (!isoDate) notFound();

  const result = queryAllGamesOnDate(isoDate, true);
  const teams = getAllTeams(true);
  const meta = getCalendarMeta(true);

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
        isClubs={true}
      />
    </>
  );
}
