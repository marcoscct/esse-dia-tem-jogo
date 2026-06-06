import { getAllTeams, getCalendarMeta } from "@/lib/calendar";
import HomeClient from "@/components/HomeClient";

export default function LocalizedTimesPage() {
  const teams = getAllTeams(true);
  const meta = getCalendarMeta(true);
  return <HomeClient teams={teams} lastUpdated={meta.last_updated} isClubs={true} />;
}
