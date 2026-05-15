"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          {/* Close background area */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg bg-[#111] rounded-[2rem] p-6 md:p-10 shadow-2xl border-4 ${
              hasGame ? "border-[#ffcc00] shadow-[#ffcc00]/20" : "border-[#2ecc71] shadow-[#2ecc71]/20"
            } flex flex-col items-center z-10 overflow-hidden`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors bg-black/50 rounded-full p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {hasGame && matches.length > 0 ? (
              <>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 rounded-full bg-[#ffcc00]/10 flex items-center justify-center mb-6"
                >
                  <AlertTriangle className="w-12 h-12 text-[#ffcc00]" />
                </motion.div>

                <h2 className="text-[#ffcc00] font-black italic text-4xl uppercase tracking-tighter leading-none mb-2 text-center">
                  Tem Jogo!
                </h2>
                <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-2 text-center">
                  Tome Cuidado!
                </h3>
                <p className="text-zinc-400 text-center mb-8">
                  Evite marcar compromissos nesse dia.
                </p>

                <div className="w-full bg-black/50 rounded-2xl p-5 border border-zinc-800 flex flex-col items-center">
                  <div className="text-xs font-bold text-[#ffcc00] uppercase tracking-widest mb-4">
                    {matches[0].phase === "Fase de Grupos" ? "Copa do Mundo 2026" : matches[0].phase}
                  </div>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-zinc-700">
                        <img src={getFlagUrl(matches[0].team_code)} alt={matches[0].team_name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold uppercase">{matches[0].team_code}</span>
                    </div>
                    <span className="text-zinc-500 font-bold text-2xl">X</span>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-zinc-700">
                        <img src={matches[0].opponent_code ? getFlagUrl(matches[0].opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg"} alt={matches[0].opponent_name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold uppercase">{matches[0].opponent_code || "TBD"}</span>
                    </div>
                  </div>
                  <div className="font-bold uppercase tracking-wide text-lg mb-3 text-center">
                    {matches[0].team_name} x {matches[0].opponent_name}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#ffcc00] font-bold bg-[#ffcc00]/10 py-2 px-6 rounded-full">
                    <Clock className="w-5 h-5" />
                    <span className="text-lg">{matches[0].time_brt ? formatTimeBRT(matches[0].time_brt) : "A Definir"}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-24 h-24 rounded-full bg-[#2ecc71]/10 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-[#2ecc71]" />
                </motion.div>

                <h2 className="text-[#2ecc71] font-black italic text-4xl uppercase tracking-tighter leading-none mb-2 text-center">
                  Não Tem Jogo!
                </h2>
                <h3 className="text-white font-bold text-xl uppercase tracking-wider mb-2 text-center">
                  Tudo Certo!
                </h3>
                <p className="text-zinc-400 text-center mb-8">
                  Dia livre para marcar seus eventos.
                </p>

                <div className="w-full bg-black/50 rounded-2xl p-6 border border-zinc-800 flex flex-col items-center">
                  <CalendarIcon className="w-12 h-12 text-[#2ecc71] mb-3" />
                  <div className="text-[#2ecc71] font-black italic text-2xl uppercase tracking-wide">
                    Dia Livre!
                  </div>
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-colors"
            >
              Fazer nova busca
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
