import { getAllTeams, getCalendarMeta } from "@/lib/calendar";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const teams = getAllTeams().sort((a, b) => a.name.localeCompare(b.name));
  const meta = getCalendarMeta();

  return <HomeClient teams={teams} lastUpdated={meta.last_updated} />;
}
