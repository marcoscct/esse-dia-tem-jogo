import { AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon } from "lucide-react";
import type { MatchWithTeam } from "@/lib/types";
import { formatTimeBRT } from "@/lib/date-utils";
import { getFlagUrl } from "@/lib/flag-codes";

interface ResultCardProps {
  hasGame: boolean;
  matches?: MatchWithTeam[];
}

export default function ResultCard({ hasGame, matches = [] }: ResultCardProps) {
  if (hasGame && matches.length > 0) {
    const match = matches[0];
    return (
      <div className="w-full bg-[#1a1a1a] rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-[#ffcc00] flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-14 h-14 md:w-20 md:h-20 text-[#ffcc00]" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-[#ffcc00] font-black italic text-3xl uppercase tracking-tighter leading-none mb-1">
            Tem Jogo!
          </h2>
          <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-2">
            Tome Cuidado!
          </h3>
          <p className="text-zinc-400 text-sm md:text-base leading-tight">
            Evite marcar compromissos nesse dia.
          </p>
        </div>

        <div className="hidden md:block w-px h-24 bg-zinc-800 mx-4" />
        <div className="block md:hidden w-full h-px bg-zinc-800" />

        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
            {match.phase === "Fase de Grupos" ? "Copa do Mundo 2026" : match.phase}
          </div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-700">
              <img
                src={getFlagUrl(match.team_code)}
                alt={match.team_name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-zinc-500 font-bold text-lg">X</span>
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-700">
              <img
                src={match.opponent_code ? getFlagUrl(match.opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg"}
                alt={match.opponent_name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="font-bold uppercase tracking-wide text-sm md:text-base mb-2">
            {match.team_name} x {match.opponent_name}
          </div>
          <div className="flex items-center gap-2 text-[#ffcc00] font-bold">
            <Clock className="w-4 h-4" />
            <span>{match.time_brt ? formatTimeBRT(match.time_brt) : "A Definir"}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#1a1a1a] rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-[#2ecc71] flex flex-col md:flex-row gap-6 items-center">
      <div className="flex-shrink-0">
        <CheckCircle2 className="w-14 h-14 md:w-20 md:h-20 text-[#2ecc71]" />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-[#2ecc71] font-black italic text-3xl uppercase tracking-tighter leading-none mb-1">
          Não Tem Jogo!
        </h2>
        <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-2">
          Tudo Certo!
        </h3>
        <p className="text-zinc-400 text-sm md:text-base leading-tight">
          Dia livre para marcar seus eventos.
        </p>
      </div>

      <div className="hidden md:block w-px h-24 bg-zinc-800 mx-4" />
      <div className="block md:hidden w-full h-px bg-zinc-800" />

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 mb-2 text-[#2ecc71]">
          <CalendarIcon className="w-full h-full" />
        </div>
        <div className="text-[#2ecc71] font-black italic text-xl uppercase tracking-wide">
          Dia Livre!
        </div>
      </div>
    </div>
  );
}
