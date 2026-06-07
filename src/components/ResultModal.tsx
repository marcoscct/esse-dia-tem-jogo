"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon, X, HelpCircle, Share2, Check, ChevronDown } from "lucide-react";
import type { MatchWithTeam } from "@/lib/types";
import { formatTimeBRT, getVenueIanaTimezone, formatMatchTimeInTimezone, formatMatchDateInTimezone } from "@/lib/date-utils";
import { getFlagUrl, isClubCode } from "@/lib/flag-codes";
import { useLanguage } from "./TranslationProvider";
import { translateTeamName, translateOpponentName, translatePhase, translateCondition, getCompetitionName } from "@/locales/i18n-utils";
import { getGoogleCalendarUrl, getOutlookCalendarUrl, downloadIcsFile } from "@/lib/calendar-utils";
import CalendarFeedModal from "./CalendarFeedModal";
import GroupTooltip from "./GroupTooltip";

function renderWithGroupTooltip(text: string | null | undefined, keyPrefix: string) {
  if (!text) return null;
  const regex = /(Grupo\s+[A-L]|Group\s+[A-L])/i;
  const parts = text.split(regex);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const match = part.match(/^(?:Grupo|Group)\s+([A-L])$/i);
    if (match) {
      return <GroupTooltip key={`${keyPrefix}-${i}`} text={part} groupLetter={match[1].toUpperCase()} />;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function BroadcastIcon({ channel }: { channel: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const channelInfo: Record<string, { logo: string; name: string }> = {
    Globo: { logo: "/images/globo.png", name: "Globo" },
    SBT: { logo: "/images/sbt.png", name: "SBT" },
    SporTV: { logo: "/images/sportv.png", name: "SporTV" },
    CazéTV: { logo: "/images/cazetv.png", name: "CazéTV" },
  };

  const info = channelInfo[channel] || { logo: "", name: channel };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setShowTooltip(true);
    const id = setTimeout(() => {
      setShowTooltip(false);
    }, 2000);
    setTimeoutId(id);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  if (!info.logo) {
    return (
      <div className="relative flex items-center justify-center">
        <button
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="h-8 px-2.5 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all focus:outline-none cursor-pointer"
        >
          <span className="text-[10px] font-black tracking-tight text-zinc-300 uppercase">{info.name}</span>
        </button>
        
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full mb-2.5 z-20 px-2.5 py-1 text-[10px] font-black text-white bg-zinc-900 border border-zinc-800 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
            >
              {info.name}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-zinc-900" />
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800 -z-10" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-zinc-950 border border-zinc-850 hover:border-zinc-700 transition-all p-1.5 focus:outline-none cursor-pointer"
      >
        <img src={info.logo} alt={info.name} className="w-full h-full object-contain" />
      </button>
      
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2.5 z-20 px-2.5 py-1 text-[10px] font-black text-white bg-zinc-900 border border-zinc-800 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
          >
            {info.name}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-zinc-900" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800 -z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ResultModalProps {
  hasGame: boolean;
  matches?: MatchWithTeam[];
  isOpen: boolean;
  onClose: () => void;
  date?: string;
  endDate?: string;
}

export default function ResultModal({ matches = [], isOpen, onClose, date, endDate }: ResultModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const { lang, t, timezoneMode, deviceTimezone, customTimezone } = useLanguage();
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevDate, setPrevDate] = useState(date);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const firstMatch = matches[0];
  const isSingleTeamMatches = matches.length > 0 && matches.every(m => m.team_code === firstMatch.team_code);
  const showSubscribe = isSingleTeamMatches && firstMatch && firstMatch.team_code !== 'TBD' && firstMatch.team_code !== 'FREE';
  const teamCode = firstMatch?.team_code || '';
  const teamName = firstMatch?.team_name || '';
  
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
          const isHomeSelected = match.is_home !== false;
          const leftName = isHomeSelected
            ? translateTeamName(match.team_code, match.team_name, lang)
            : translateOpponentName(match.opponent_code, match.opponent_name, lang);
          const rightName = isHomeSelected
            ? translateOpponentName(match.opponent_code, match.opponent_name, lang)
            : translateTeamName(match.team_code, match.team_name, lang);
          const conditionStr = match.condition ? ` (${translateCondition(match.condition, lang)})` : "";
          const datePrefix = formattedEndDate 
            ? `${(() => {
                const p = match.date.split("-");
                if (p.length < 3) return match.date;
                return lang === 'en' ? `${p[1]}/${p[2]}` : `${p[2]}/${p[1]}`;
              })()}: ` 
            : "";
          return `- ${datePrefix}${leftName} x ${rightName}${conditionStr}`;
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
    const isHomeSelected = match.is_home !== false;
    const leftName = isHomeSelected ? teamNameTrans : opponentNameTrans;
    const rightName = isHomeSelected ? opponentNameTrans : teamNameTrans;
    const title = `${leftName}${separator}${rightName}`;
    
    const location = `${match.venue}, ${match.city}`;
    
    const venueTz = getVenueIanaTimezone(match.city, match.venue);
    const localTimeFormatted = match.time_brt ? formatMatchTimeInTimezone(match.time_brt, match.date, venueTz, lang) : "";
    
    const timeStrBrt = match.time_brt ? formatTimeBRT(match.time_brt, lang) : t("time_tbd");
    
    let description = "";
    if (lang === 'pt') {
      const localTimeText = localTimeFormatted ? ` / ${localTimeFormatted} (horário local)` : "";
      description = `Esse Dia Tem Jogo! ⚽\n\nPartida: ${title}\nFase: ${phaseTrans}\nEstádio: ${match.venue}\nCidade: ${match.city}\nHorário: ${timeStrBrt}${localTimeText}\n\nEvite marcar compromissos nesse horário!\nConsulte mais datas em: http://www.essediatemjogo.com.br`;
    } else if (lang === 'es') {
      const localTimeText = localTimeFormatted ? ` / ${localTimeFormatted} (hora local)` : "";
      description = `¡Hay Partido! ⚽\n\nPartido: ${title}\nFase: ${phaseTrans}\nEstadio: ${match.venue}\nCiudad: ${match.city}\nHorario: ${timeStrBrt}${localTimeText}\n\n¡Evita programar compromisos a esta hora!\nConsulta más fechas en: http://www.essediatemjogo.com.br`;
    } else {
      const localTimeText = localTimeFormatted ? ` / ${localTimeFormatted} (local time)` : "";
      description = `Game Day! ⚽\n\nMatch: ${title}\nPhase: ${phaseTrans}\nVenue: ${match.venue}\nCity: ${match.city}\nTime: ${timeStrBrt}${localTimeText}\n\nAvoid scheduling commitments during this time!\nCheck more dates at: http://www.essediatemjogo.com.br`;
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
            className={`relative w-full max-w-[560px] md:max-w-[850px] bg-[#0d0d0d] rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-2xl border-4 ${config.borderColor} flex flex-col md:flex-row md:items-stretch gap-6 md:gap-8 z-10 overflow-hidden`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-550 hover:text-white transition-colors bg-zinc-950 rounded-full p-2 border border-zinc-900 z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column */}
            <div className="flex flex-col items-center md:items-center md:justify-center flex-1 w-full md:w-[45%]">
              <div className="flex items-center gap-3 mb-2 justify-center mt-4 md:mt-0">
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

              {/* Desktop Buttons */}
              <div className="w-full mt-8 hidden md:flex flex-col gap-3">
                {/* Subscribe button moved to match accordion */}
                {date && (
                  <button
                    onClick={handleCopyText}
                    className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all border text-xs md:text-sm ${
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
                  className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all border border-zinc-800 hover:border-zinc-700"
                >
                  {t("new_search")}
                </button>
              </div>
            </div>

            {/* Right Column (Matches) */}
            <div className="flex-1 w-full md:w-[55%] flex flex-col justify-center">
              {gameState !== 'none' && matches.length > 0 ? (
                <div className="w-full max-h-[400px] md:max-h-[480px] overflow-y-auto pr-2 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {matches.map(match => (
                    <div key={match.id} className="w-full bg-[#141414] rounded-2xl p-4 sm:p-5 border border-zinc-900 flex flex-col items-center">
                      {match.condition && (
                        <div className={`text-[10px] font-black uppercase tracking-wider py-1.5 px-4 rounded-full mb-3 text-center border ${config.bgTheme} ${config.themeColor} border-${config.themeColor}/20`}>
                          {renderWithGroupTooltip(translateCondition(match.condition, lang), `cond-${match.id}`)}
                        </div>
                      )}
                      
                      <div className="text-[10px] font-bold text-zinc-650 uppercase tracking-widest mb-3">
                        {(() => {
                          const comp = getCompetitionName(match.phase_slug, lang);
                          const phaseText = translatePhase(match.phase, lang);
                          const label = comp ? `${comp} • ${phaseText}` : phaseText;
                          
                          return (
                            <>
                              {renderWithGroupTooltip(label, `phase-${match.id}`)}
                              {endDate && ` • ${(() => {
                                const parts = match.date.split("-");
                                if (parts.length < 3) return match.date;
                                return lang === 'en' ? `${parts[1]}/${parts[2]}` : `${parts[2]}/${parts[1]}`;
                              })()}`}
                            </>
                          );
                        })()}
                      </div>

                      {(() => {
                        const isHomeSelected = match.is_home !== false;
                        const leftCode = isHomeSelected ? match.team_code : (match.opponent_code || 'TBD');
                        const leftName = isHomeSelected
                          ? translateTeamName(match.team_code, match.team_name, lang)
                          : translateOpponentName(match.opponent_code, match.opponent_name, lang);
                        const leftFlag = isHomeSelected
                          ? getFlagUrl(match.team_code)
                          : (match.opponent_code ? getFlagUrl(match.opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg");

                        const rightCode = isHomeSelected ? (match.opponent_code || 'TBD') : match.team_code;
                        const rightName = isHomeSelected
                          ? translateOpponentName(match.opponent_code, match.opponent_name, lang)
                          : translateTeamName(match.team_code, match.team_name, lang);
                        const rightFlag = isHomeSelected
                          ? (match.opponent_code ? getFlagUrl(match.opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg")
                          : getFlagUrl(match.team_code);

                        const leftIsClub = isClubCode(leftCode);
                        const rightIsClub = isClubCode(rightCode);

                        return (
                          <>
                            <div className="flex items-center justify-center gap-6 mb-3">
                              <div className="flex flex-col items-center gap-1.5 w-20">
                                <div className={leftIsClub ? "w-12 h-12 flex items-center justify-center" : "w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-850"}>
                                  <img 
                                    src={leftFlag} 
                                    alt={leftName} 
                                    className={leftIsClub ? "w-full h-full object-contain" : "w-full h-full object-cover"} 
                                  />
                                </div>
                                <span className="text-[10px] font-black text-zinc-455 uppercase">{leftCode}</span>
                              </div>

                              <span className="text-zinc-700 font-black text-lg italic">X</span>

                              <div className="flex flex-col items-center gap-1.5 w-20">
                                <div className={rightIsClub ? "w-12 h-12 flex items-center justify-center" : "w-12 h-12 rounded-full overflow-hidden ring-2 ring-zinc-855 bg-zinc-950 flex items-center justify-center"}>
                                  <img 
                                    src={rightFlag} 
                                    alt={rightName} 
                                    className={rightIsClub ? "w-full h-full object-contain" : "w-full h-full object-cover"} 
                                  />
                                </div>
                                <span className="text-[10px] font-black text-zinc-455 uppercase">{rightCode}</span>
                              </div>
                            </div>

                            <div className="font-black uppercase tracking-tight text-md text-white mb-2 text-center">
                              {isHomeSelected ? (
                                <>
                                  {translateTeamName(match.team_code, match.team_name, lang)} x {renderWithGroupTooltip(translateOpponentName(match.opponent_code, match.opponent_name, lang), `opp-${match.id}`)}
                                </>
                              ) : (
                                <>
                                  {translateOpponentName(match.opponent_code, match.opponent_name, lang)} x {renderWithGroupTooltip(translateTeamName(match.team_code, match.team_name, lang), `team-${match.id}`)}
                                </>
                              )}
                            </div>
                          </>
                        );
                      })()}

                      <div className="flex items-center justify-center gap-1 text-zinc-600 font-bold text-[9px] uppercase tracking-wide text-center">
                        <span>{match.venue}</span>
                        {match.city && match.city !== match.venue && (
                          <>
                            <span>•</span>
                            <span>{match.city}</span>
                          </>
                        )}
                      </div>

                      {(() => {
                        let targetTz = 'America/Sao_Paulo';
                        if (timezoneMode === 'device') {
                          targetTz = deviceTimezone;
                        } else if (timezoneMode === 'stadium') {
                          targetTz = getVenueIanaTimezone(match.city, match.venue);
                        } else if (timezoneMode === 'custom') {
                          targetTz = customTimezone;
                        }

                        const formattedDate = formatMatchDateInTimezone(match.time_brt, match.date, targetTz, lang);

                        if (!match.time_brt) {
                          return (
                            <div className="flex items-center justify-center flex-nowrap whitespace-nowrap gap-1 md:gap-1.5 text-white font-bold bg-zinc-950 py-1.5 px-3 sm:px-4 rounded-full mt-3 text-[11px] sm:text-xs border border-zinc-900 w-fit max-w-full">
                              <CalendarIcon className="w-3.5 h-3.5 text-zinc-550" />
                              <span>{formattedDate}</span>
                              <Clock className="w-3.5 h-3.5 text-zinc-550 ml-1.5" />
                              <span>{t("time_tbd")}</span>
                            </div>
                          );
                        }
                        
                        const formattedTime = formatMatchTimeInTimezone(match.time_brt, match.date, targetTz, lang);
                        return (
                          <div className="flex items-center justify-center flex-nowrap whitespace-nowrap gap-1 md:gap-1.5 text-white font-bold bg-zinc-950 py-1.5 px-3 sm:px-4 rounded-full mt-3 text-[11px] sm:text-xs border border-zinc-900 w-fit max-w-full">
                            <CalendarIcon className="w-3.5 h-3.5 text-zinc-550" />
                            <span>{formattedDate}</span>
                            <Clock className="w-3.5 h-3.5 text-zinc-550 ml-1.5" />
                            <span>{formattedTime}</span>
                          </div>
                        );
                      })()}

                      {lang === 'pt' && match.broadcasts && match.broadcasts.length > 0 && (
                        <div className="flex flex-col items-center gap-1 mt-3">
                          <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-wider">{t("where_to_watch")}</span>
                          <div className="flex items-center gap-2 mt-1">
                            {match.broadcasts.map((channel) => (
                              <BroadcastIcon key={channel} channel={channel} />
                            ))}
                          </div>
                        </div>
                      )}

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
                            
                            {showSubscribe && (
                              <div className="w-full h-px bg-zinc-900/80 my-1" />
                            )}
                            {showSubscribe && (
                              <button
                                onClick={() => setIsFeedModalOpen(true)}
                                className="flex items-center justify-center gap-2.5 w-full hover:bg-zinc-900/60 text-[#ffcc00] hover:text-[#ffd633] font-bold py-2 px-3 rounded-lg text-[10px] uppercase tracking-wider transition-colors cursor-pointer border border-transparent hover:border-zinc-900"
                              >
                                <CalendarIcon className="w-3 h-3 text-[#ffcc00]" />
                                <span>{t("subscribe_full_calendar")}</span>
                              </button>
                            )}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full bg-[#141414] rounded-2xl py-8 px-6 border border-zinc-900 flex flex-col items-center">
                  <CalendarIcon className="w-12 h-12 text-[#2ecc71] mb-3 opacity-80" />
                  {date && (
                    <div className="text-zinc-550 font-bold text-xs uppercase tracking-widest mb-1.5">
                      {(() => {
                        const getSingleFormattedWithWeekday = (dStr: string) => {
                          try {
                            const [y, m, d] = dStr.split("-").map(Number);
                            const tempDate = new Date(y, m - 1, d); // local date
                            const localesMap = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
                            const parts = new Intl.DateTimeFormat(localesMap[lang], {
                              day: '2-digit',
                              month: '2-digit',
                              weekday: 'long'
                            }).formatToParts(tempDate);
                            const dayVal = parts.find(p => p.type === 'day')?.value || '';
                            const monthVal = parts.find(p => p.type === 'month')?.value || '';
                            const weekdayVal = parts.find(p => p.type === 'weekday')?.value || '';
                            const dateFmt = lang === 'en' ? `${monthVal}/${dayVal}` : `${dayVal}/${monthVal}`;
                            return `${dateFmt} (${weekdayVal.toUpperCase()})`;
                          } catch {
                            return dStr;
                          }
                        };

                        const formattedDate = getSingleFormattedWithWeekday(date);
                        const formattedEndDate = endDate ? getSingleFormattedWithWeekday(endDate) : "";
                        return formattedEndDate ? `${formattedDate} - ${formattedEndDate}` : formattedDate;
                      })()}
                    </div>
                  )}
                  <div className="text-[#2ecc71] font-black italic text-xl uppercase tracking-wider text-center">
                    {t("free_day")}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Buttons */}
            <div className="w-full mt-2 flex md:hidden flex-col gap-3">
              {/* Subscribe button moved to match accordion */}
              {date && (
                <button
                  onClick={handleCopyText}
                  className={`w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all border text-xs md:text-sm ${
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
                className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all border border-zinc-800 hover:border-zinc-700"
              >
                {t("new_search")}
              </button>
            </div>

            <CalendarFeedModal
              isOpen={isFeedModalOpen}
              onClose={() => setIsFeedModalOpen(false)}
              teamCode={teamCode}
              teamName={translateTeamName(teamCode, teamName, lang)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
