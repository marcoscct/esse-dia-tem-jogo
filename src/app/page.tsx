import Link from "next/link";
import { getCalendar, queryDate } from "@/lib/calendar";
import { getTodayBRT, formatDateLong } from "@/lib/date-utils";

export default async function Home() {
  const calendar = getCalendar();
  const today = getTodayBRT();
  const teams = Object.values(calendar.teams).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <main className="mx-auto max-w-4xl px-6 py-20">
        <header className="mb-16 text-center sm:text-left">
          <h1 className="text-5xl font-black tracking-tight mb-4 uppercase">
            Esse dia tem jogo?
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            O calendário definitivo da Copa do Mundo 2026.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6">
            Hoje: {formatDateLong(today)}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => {
              const result = queryDate(team.code, today);
              return (
                <Link
                  key={team.code}
                  href={`/${team.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{team.name}</span>
                    <span className={`h-3 w-3 rounded-full ${result.hasGame ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                  </div>
                  <div className="mt-2 text-sm text-zinc-500">
                    {result.hasGame ? '⚽ Tem jogo hoje!' : '😌 Sem jogo hoje'}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-20 border-t border-zinc-200 pt-8 dark:border-zinc-800 text-center sm:text-left">
          <p className="text-sm text-zinc-500">
            Dados atualizados: {calendar.meta.lastUpdated} | v{calendar.meta.version}
          </p>
        </footer>
      </main>
    </div>
  );
}
