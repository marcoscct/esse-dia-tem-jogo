import { notFound } from 'next/navigation';
import { getTeamBySlug, getAllTeams, getCalendarMeta } from '@/lib/calendar';
import HomeClient from '@/components/HomeClient';

interface Props {
  teamSlug: string;
}

export default function LocalizedTeamPage({ teamSlug }: Props) {
  const team = getTeamBySlug(teamSlug);
  if (!team) notFound();

  const sortedMatches = [...team.matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const teams = getAllTeams();
  const meta = getCalendarMeta();

  return (
    <>
      <script
        id="__TEAM_DATA__"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ team, matches: sortedMatches }),
        }}
      />
      <HomeClient 
        teams={teams} 
        lastUpdated={meta.last_updated} 
        initialTeam={team.slug} 
        initialMatches={sortedMatches}
      />
    </>
  );
}
