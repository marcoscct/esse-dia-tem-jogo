"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon, X, HelpCircle } from "lucide-react";
import type { MatchWithTeam } from "@/lib/types";
import { formatTimeBRT } from "@/lib/date-utils";
import { getFlagUrl } from "@/lib/flag-codes";

interface ResultModalProps {
  hasGame: boolean;
  matches?: MatchWithTeam[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ResultModal({ hasGame, matches = [], isOpen, onClose }: ResultModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Determine game state:
  // - none: no matches on this date
  // - confirmed: at least one match has status 'confirmed' or 'played'
  // - possible: matches exist, but all are 'possible'
  const gameState: 'confirmed' | 'possible' | 'none' = 
    matches.length === 0 
      ? 'none' 
      : matches.some(m => m.status === 'confirmed' || m.status === 'played')
        ? 'confirmed'
        : 'possible';

  // Config based on state
  const config = {
    confirmed: {
      borderColor: "border-[#ffcc00] shadow-[#ffcc00]/20",
      themeColor: "text-[#ffcc00]",
      bgTheme: "bg-[#ffcc00]/10",
      heading: "Tem Jogo!",
      subheading: "Tome Cuidado!",
      description: "Evite marcar compromissos nesse dia.",
      icon: <AlertTriangle className="w-12 h-12 text-[#ffcc00]" />
    },
    possible: {
      borderColor: "border-[#ff8c00] shadow-[#ff8c00]/20",
      themeColor: "text-[#ff8c00]",
      bgTheme: "bg-[#ff8c00]/10",
      heading: "Possível Jogo!",
      subheading: "Fique Atento!",
      description: "Esta seleção possui cenários de classificação para este dia.",
      icon: <HelpCircle className="w-12 h-12 text-[#ff8c00]" />
    },
    none: {
      borderColor: "border-[#2ecc71] shadow-[#2ecc71]/20",
      themeColor: "text-[#2ecc71]",
      bgTheme: "bg-[#2ecc71]/10",
      heading: "Não Tem Jogo!",
      subheading: "Tudo Certo!",
      description: "Dia livre para marcar seus eventos.",
      icon: <CheckCircle2 className="w-12 h-12 text-[#2ecc71]" />
    }
  }[gameState];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
        >
          {/* Close background area */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg bg-[#0d0d0d] rounded-[2rem] p-6 md:p-8 shadow-2xl border-4 ${config.borderColor} flex flex-col items-center z-10 overflow-hidden`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-550 hover:text-white transition-colors bg-zinc-950 rounded-full p-2 border border-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className={`w-20 h-20 rounded-full ${config.bgTheme} flex items-center justify-center mb-5`}
            >
              {config.icon}
            </motion.div>

            <h2 className={`${config.themeColor} font-black italic text-4xl uppercase tracking-tighter leading-none mb-1 text-center`}>
              {config.heading}
            </h2>
            <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1 text-center">
              {config.subheading}
            </h3>
            <p className="text-zinc-500 text-sm text-center mb-6 max-w-xs leading-tight">
              {config.description}
            </p>

            {gameState !== 'none' && matches.length > 0 ? (
              <div className="w-full max-h-[320px] overflow-y-auto pr-1 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {matches.map(match => (
                  <div key={match.id} className="w-full bg-[#141414] rounded-2xl p-5 border border-zinc-900 flex flex-col items-center">
                    {match.condition && (
                      <div className={`text-[10px] font-black uppercase tracking-wider py-1.5 px-4 rounded-full mb-3 text-center border ${config.bgTheme} ${config.themeColor} border-${config.themeColor}/20`}>
                        {match.condition}
                      </div>
                    )}
                    
                    <div className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest mb-3">
                      {match.phase === "Fase de Grupos" ? "Copa do Mundo 2026" : match.phase}
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-3">
                      <div className="flex flex-col items-center gap-1.5 w-20">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-850">
                          <img src={getFlagUrl(match.team_code)} alt={match.team_name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-black text-zinc-450 uppercase">{match.team_code}</span>
                      </div>

                      <span className="text-zinc-700 font-black text-lg italic">X</span>

                      <div className="flex flex-col items-center gap-1.5 w-20">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-850 bg-zinc-950 flex items-center justify-center">
                          <img 
                            src={match.opponent_code ? getFlagUrl(match.opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg"} 
                            alt={match.opponent_name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-[10px] font-black text-zinc-450 uppercase">{match.opponent_code || "TBD"}</span>
                      </div>
                    </div>

                    <div className="font-black uppercase tracking-tight text-md text-white mb-2 text-center max-w-[240px] truncate">
                      {match.team_name} x {match.opponent_name}
                    </div>

                    <div className="flex items-center justify-center gap-1 text-zinc-600 font-bold text-[9px] uppercase tracking-wide text-center">
                      <span>{match.venue}</span>
                      <span>•</span>
                      <span>{match.city}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-white font-bold bg-zinc-950 py-1.5 px-4 rounded-full mt-3 text-xs border border-zinc-900">
                      <Clock className="w-3.5 h-3.5 text-zinc-550" />
                      <span>{match.time_brt ? formatTimeBRT(match.time_brt) : "Horário a confirmar"}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-[#141414] rounded-2xl py-8 px-6 border border-zinc-900 flex flex-col items-center">
                <CalendarIcon className="w-12 h-12 text-[#2ecc71] mb-3 opacity-80" />
                <div className="text-[#2ecc71] font-black italic text-xl uppercase tracking-wider">
                  Dia Livre!
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="mt-6 w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all border border-zinc-800 hover:border-zinc-700"
            >
              Fazer nova busca
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
