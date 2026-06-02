import { getAllTeams, getCalendarMeta } from "@/lib/calendar";
import HomeClient from "@/components/HomeClient";

export default function LocalizedHomePage() {
  const teams = getAllTeams();
  const meta = getCalendarMeta();
  return <HomeClient teams={teams} lastUpdated={meta.last_updated} />;
}
