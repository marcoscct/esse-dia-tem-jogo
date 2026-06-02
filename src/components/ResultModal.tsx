"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon, X, HelpCircle, Share2, Check, ChevronDown } from "lucide-react";
import type { MatchWithTeam } from "@/lib/types";
import { formatTimeBRT } from "@/lib/date-utils";
import { getFlagUrl } from "@/lib/flag-codes";
import { useLanguage } from "./TranslationProvider";
import { translateTeamName, translateOpponentName, translatePhase, translateCondition } from "@/locales/i18n-utils";
import { getGoogleCalendarUrl, getOutlookCalendarUrl, downloadIcsFile } from "@/lib/calendar-utils";

interface ResultModalProps {
  hasGame: boolean;
  matches?: MatchWithTeam[];
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  endDate?: string;
}

export default function ResultModal({ hasGame, matches = [], isOpen, onClose, date, endDate }: ResultModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { lang, t } = useLanguage();

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevDate, setPrevDate] = useState(date);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  if (isOpen !== prevIsOpen || date !== prevDate) {
    setPrevIsOpen(isOpen);
    setPrevDate(date);
    setCopied(false);
    setOpenDropdownId(null);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleCopyText = () => {
    if (!date) return;

    let text = "";
    const formattedDate = (() => {
      const parts = date.split("-");
      if (parts.length < 3) return date;
      const [, month, day] = parts;
      return lang === 'en' ? `${month}/${day}` : `${day}/${month}`;
    })();

    const formattedEndDate = (() => {
      if (!endDate) return "";
      const parts = endDate.split("-");
      if (parts.length < 3) return endDate;
      const [, month, day] = parts;
      return lang === 'en' ? `${month}/${day}` : `${day}/${month}`;
    })();

    if (gameState === "none" || matches.length === 0) {
      if (formattedEndDate) {
        text = t("share_free_range", { start: formattedDate, end: formattedEndDate });
      } else {
        text = t("share_free_single", { date: formattedDate });
      }
    } else {
      const gamesList = matches
        .map((match) => {
          const transTeam = translateTeamName(match.team_code, match.team_name, lang);
          const transOpp = translateOpponentName(match.opponent_code, match.opponent_name, lang);
          const conditionStr = match.condition ? ` (${translateCondition(match.condition, lang)})` : "";
          const datePrefix = formattedEndDate 
            ? `${(() => {
                const p = match.date.split("-");
                if (p.length < 3) return match.date;
                return lang === 'en' ? `${p[1]}/${p[2]}` : `${p[2]}/${p[1]}`;
              })()}: ` 
            : "";
          return `- ${datePrefix}${transTeam} x ${transOpp}${conditionStr}`;
        })
        .join("\n");

      if (formattedEndDate) {
        text = t("share_busy_range", { start: formattedDate, end: formattedEndDate, games: gamesList });
      } else {
        text = t("share_busy_single", { date: formattedDate, games: gamesList });
      }
    }

    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
      });
  };

  const getEventData = (match: MatchWithTeam) => {
    const teamNameTrans = translateTeamName(match.team_code, match.team_name, lang);
    const opponentNameTrans = translateOpponentName(match.opponent_code, match.opponent_name, lang);
    const phaseTrans = translatePhase(match.phase, lang);
    
    const separator = lang === 'pt' ? ' x ' : ' vs ';
    const title = `${teamNameTrans}${separator}${opponentNameTrans}`;
    
    const location = `${match.venue}, ${match.city}`;
    
    const timeStr = match.time_brt ? formatTimeBRT(match.time_brt, lang) : t("time_tbd");
    
    let description = "";
    if (lang === 'pt') {
      description = `Esse Dia Tem Jogo! ⚽\n\nPartida: ${title}\nFase: ${phaseTrans}\nEstádio: ${match.venue}\nCidade: ${match.city}\nHorário: ${timeStr}\n\nEvite marcar compromissos nesse horário!\nConsulte mais datas em: http://www.essediatemjogo.com.br`;
    } else if (lang === 'es') {
      description = `¡Hay Partido! ⚽\n\nPartido: ${title}\nFase: ${phaseTrans}\nEstadio: ${match.venue}\nCiudad: ${match.city}\nHorario: ${timeStr}\n\n¡Evita programar compromisos a esta hora!\nConsulta más fechas en: http://www.essediatemjogo.com.br`;
    } else {
      description = `Game Day! ⚽\n\nMatch: ${title}\nPhase: ${phaseTrans}\nVenue: ${match.venue}\nCity: ${match.city}\nTime: ${timeStr}\n\nAvoid scheduling commitments during this time!\nCheck more dates at: http://www.essediatemjogo.com.br`;
    }

    return {
      id: match.id,
      title,
      description,
      location,
      date: match.date,
      timeBrt: match.time_brt
    };
  };

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
      heading: t("has_game_heading"),
      subheading: t("has_game_subheading"),
      description: t("has_game_desc"),
      icon: <AlertTriangle className="w-6 h-6 text-[#ffcc00]" />
    },
    possible: {
      borderColor: "border-[#ff8c00] shadow-[#ff8c00]/20",
      themeColor: "text-[#ff8c00]",
      bgTheme: "bg-[#ff8c00]/10",
      heading: t("possible_game_heading"),
      subheading: t("possible_game_subheading"),
      description: t("possible_game_desc_modal"),
      icon: <HelpCircle className="w-6 h-6 text-[#ff8c00]" />
    },
    none: {
      borderColor: "border-[#2ecc71] shadow-[#2ecc71]/20",
      themeColor: "text-[#2ecc71]",
      bgTheme: "bg-[#2ecc71]/10",
      heading: t("no_game_heading"),
      subheading: t("no_game_subheading"),
      description: t("no_game_desc"),
      icon: <CheckCircle2 className="w-6 h-6 text-[#2ecc71]" />
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

            <div className="flex items-center gap-3 mb-2 justify-center mt-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`w-10 h-10 rounded-full ${config.bgTheme} flex items-center justify-center shrink-0`}
              >
                {config.icon}
              </motion.div>
              <h2 className={`${config.themeColor} font-black italic text-3xl md:text-4xl uppercase tracking-tighter leading-none`}>
                {config.heading}
              </h2>
            </div>
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
                        {translateCondition(match.condition, lang)}
                      </div>
                    )}
                    
                    <div className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest mb-3">
                      {translatePhase(match.phase, lang)}
                      {endDate && ` • ${(() => {
                        const parts = match.date.split("-");
                        if (parts.length < 3) return match.date;
                        return lang === 'en' ? `${parts[1]}/${parts[2]}` : `${parts[2]}/${parts[1]}`;
                      })()}`}
                    </div>

                    <div className="flex items-center justify-center gap-6 mb-3">
                      <div className="flex flex-col items-center gap-1.5 w-20">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-850">
                          <img 
                            src={getFlagUrl(match.team_code)} 
                            alt={translateTeamName(match.team_code, match.team_name, lang)} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-[10px] font-black text-zinc-455 uppercase">{match.team_code}</span>
                      </div>

                      <span className="text-zinc-700 font-black text-lg italic">X</span>

                      <div className="flex flex-col items-center gap-1.5 w-20">
                        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-855 bg-zinc-950 flex items-center justify-center">
                          <img 
                            src={match.opponent_code ? getFlagUrl(match.opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg"} 
                            alt={translateOpponentName(match.opponent_code, match.opponent_name, lang)} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-[10px] font-black text-zinc-455 uppercase">{match.opponent_code || "TBD"}</span>
                      </div>
                    </div>

                    <div className="font-black uppercase tracking-tight text-md text-white mb-2 text-center">
                      {translateTeamName(match.team_code, match.team_name, lang)} x {translateOpponentName(match.opponent_code, match.opponent_name, lang)}
                    </div>

                    <div className="flex items-center justify-center gap-1 text-zinc-600 font-bold text-[9px] uppercase tracking-wide text-center">
                      <span>{match.venue}</span>
                      {match.city && match.city !== match.venue && (
                        <>
                          <span>•</span>
                          <span>{match.city}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-white font-bold bg-zinc-950 py-1.5 px-4 rounded-full mt-3 text-xs border border-zinc-900">
                      <Clock className="w-3.5 h-3.5 text-zinc-550" />
                      <span>{match.time_brt ? formatTimeBRT(match.time_brt, lang) : t("time_tbd")}</span>
                    </div>

                    {/* Add to Calendar Button & Accordion */}
                    <div className="w-full mt-4 flex flex-col gap-2">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === match.id ? null : match.id)}
                        className="w-full flex items-center justify-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs border border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-zinc-550" />
                        <span>{t("add_to_calendar")}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdownId === match.id ? "rotate-180" : ""}`} />
                      </button>

                      {openDropdownId === match.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="w-full bg-[#0a0a0a] border border-zinc-900 rounded-xl p-2 flex flex-col gap-1 overflow-hidden"
                        >
                          <a
                            href={getGoogleCalendarUrl(getEventData(match))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 hover:bg-zinc-900/60 text-zinc-300 hover:text-white font-bold py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-transparent hover:border-zinc-900"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#db4437] shrink-0" />
                            <span>{t("google_calendar")}</span>
                          </a>
                          <a
                            href={getOutlookCalendarUrl(getEventData(match))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2.5 hover:bg-zinc-900/60 text-zinc-300 hover:text-white font-bold py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-transparent hover:border-zinc-900"
                          >
                            <span className="w-2 h-2 rounded-full bg-[#0078d4] shrink-0" />
                            <span>{t("outlook_calendar")}</span>
                          </a>
                          <button
                            onClick={() => downloadIcsFile(getEventData(match))}
                            className="flex items-center justify-center gap-2.5 w-full hover:bg-zinc-900/60 text-zinc-300 hover:text-white font-bold py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-transparent hover:border-zinc-900"
                          >
                            <span className="w-2 h-2 rounded-full bg-zinc-550 shrink-0" />
                            <span>{t("download_ics")}</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-[#141414] rounded-2xl py-8 px-6 border border-zinc-900 flex flex-col items-center">
                <CalendarIcon className="w-12 h-12 text-[#2ecc71] mb-3 opacity-80" />
                <div className="text-[#2ecc71] font-black italic text-xl uppercase tracking-wider">
                  {t("free_day")}
                </div>
              </div>
            )}

            {/* Share Result Button */}
            {date && (
              <button
                onClick={handleCopyText}
                className={`mt-5 w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all border text-xs md:text-sm ${
                  copied 
                    ? "bg-[#2ecc71]/10 text-[#2ecc71] border-[#2ecc71]/30" 
                    : "bg-zinc-950 hover:bg-zinc-900 text-zinc-300 border-zinc-900 hover:border-zinc-800 hover:text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#2ecc71]" />
                    <span>{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#ffcc00]" />
                    <span>{t("share_result")}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="mt-4 w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all border border-zinc-800 hover:border-zinc-700"
            >
              {t("new_search")}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
