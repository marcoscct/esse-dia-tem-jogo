import { AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon, HelpCircle } from "lucide-react";
import type { MatchWithTeam } from "@/lib/types";
import { formatTimeBRT } from "@/lib/date-utils";
import { getFlagUrl } from "@/lib/flag-codes";

interface ResultCardProps {
  hasGame: boolean;
  matches?: MatchWithTeam[];
}

export default function ResultCard({ hasGame, matches = [] }: ResultCardProps) {
  const gameState: 'confirmed' | 'possible' | 'none' = 
    matches.length === 0 
      ? 'none' 
      : matches.some(m => m.status === 'confirmed' || m.status === 'played')
        ? 'confirmed'
        : 'possible';

  const config = {
    confirmed: {
      borderColor: "border-[#ffcc00] shadow-[#ffcc00]/10",
      themeColor: "text-[#ffcc00]",
      bgTheme: "bg-[#ffcc00]/10",
      heading: "Tem Jogo!",
      subheading: "Tome Cuidado!",
      description: "Evite marcar compromissos nesse dia.",
      icon: <AlertTriangle className="w-14 h-14 md:w-20 md:h-20 text-[#ffcc00]" />
    },
    possible: {
      borderColor: "border-[#ff8c00] shadow-[#ff8c00]/10",
      themeColor: "text-[#ff8c00]",
      bgTheme: "bg-[#ff8c00]/10",
      heading: "Possível Jogo!",
      subheading: "Fique Atento!",
      description: "Esta seleção pode jogar neste dia.",
      icon: <HelpCircle className="w-14 h-14 md:w-20 md:h-20 text-[#ff8c00]" />
    },
    none: {
      borderColor: "border-[#2ecc71] shadow-[#2ecc71]/10",
      themeColor: "text-[#2ecc71]",
      bgTheme: "bg-[#2ecc71]/10",
      heading: "Não Tem Jogo!",
      subheading: "Tudo Certo!",
      description: "Dia livre para marcar seus eventos.",
      icon: <CheckCircle2 className="w-14 h-14 md:w-20 md:h-20 text-[#2ecc71]" />
    }
  }[gameState];

  return (
    <div className={`w-full bg-[#111] rounded-3xl p-6 md:p-8 shadow-2xl border-2 ${config.borderColor} flex flex-col md:flex-row gap-6 items-stretch`}>
      {/* Left Column: Status info */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
        <div className="flex-shrink-0">
          {config.icon}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className={`${config.themeColor} font-black italic text-3xl uppercase tracking-tighter leading-none mb-1`}>
            {config.heading}
          </h2>
          <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-2">
            {config.subheading}
          </h3>
          <p className="text-zinc-400 text-sm leading-tight max-w-[220px]">
            {config.description}
          </p>
        </div>
      </div>

      <div className="hidden md:block w-px bg-zinc-800 self-stretch my-2" />
      <div className="block md:hidden w-full h-px bg-zinc-800" />

      {/* Right Column: Match List or Free Day */}
      <div className="flex-1 flex flex-col gap-4 justify-center">
        {gameState !== 'none' && matches.length > 0 ? (
          <div className="flex flex-col gap-4 w-full">
            {matches.map((match, i) => (
              <div key={match.id} className={`w-full flex flex-col items-center text-center ${i > 0 ? "border-t border-zinc-900 pt-4" : ""}`}>
                {match.condition && (
                  <span className={`text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2 border ${config.bgTheme} ${config.themeColor} border-${config.themeColor}/20`}>
                    {match.condition}
                  </span>
                )}
                <div className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-2">
                  {match.phase === "Fase de Grupos" ? "Copa do Mundo 2026" : match.phase}
                </div>
                <div className="flex items-center gap-4 justify-center mb-2 w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src={getFlagUrl(match.team_code)}
                      alt={match.team_name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                    <span className="font-bold text-sm text-white">{match.team_name}</span>
                  </div>
                  <span className="text-zinc-500 font-bold text-xs">X</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={match.opponent_code ? getFlagUrl(match.opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg"}
                      alt={match.opponent_name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700 bg-zinc-950"
                    />
                    <span className="font-bold text-sm text-white">{match.opponent_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-450 font-bold text-xs bg-zinc-950 py-1.5 px-4 rounded-full mt-1 border border-zinc-900">
                  <Clock className="w-3.5 h-3.5 text-zinc-550" />
                  <span>{match.time_brt ? formatTimeBRT(match.time_brt) : "Horário a confirmar"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-2 text-[#2ecc71]">
              <CalendarIcon className="w-full h-full" />
            </div>
            <div className="text-[#2ecc71] font-black italic text-xl uppercase tracking-wide">
              Dia Livre!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
