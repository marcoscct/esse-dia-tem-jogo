import { notFound } from 'next/navigation';
import { getTeamBySlug, queryDate, getAllTeams, getCalendarMeta } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';
import HomeClient from '@/components/HomeClient';

interface Props {
  teamSlug: string;
  dateParam: string;
}

export default function LocalizedTimesDatePage({ teamSlug, dateParam }: Props) {
  const team = getTeamBySlug(teamSlug, true);
  if (!team) notFound();

  const isoDate = parseDateParam(dateParam);
  if (!isoDate) notFound();

  const result = queryDate(team.code, isoDate, true);
  const teams = getAllTeams(true);
  const meta = getCalendarMeta(true);

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
        isClubs={true}
      />
    </>
  );
}
