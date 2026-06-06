import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Calendar as CalendarIcon, HelpCircle } from "lucide-react";
import type { MatchWithTeam } from "@/lib/types";
import { getVenueIanaTimezone, formatMatchTimeInTimezone, formatMatchDateInTimezone } from "@/lib/date-utils";
import { getFlagUrl } from "@/lib/flag-codes";
import { useLanguage } from "./TranslationProvider";
import { translateTeamName, translateOpponentName, translatePhase, translateCondition } from "@/locales/i18n-utils";
import CalendarFeedModal from "./CalendarFeedModal";

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

interface ResultCardProps {
  hasGame: boolean;
  matches?: MatchWithTeam[];
}

export default function ResultCard({ matches = [] }: ResultCardProps) {
  const { lang, t, timezoneMode, deviceTimezone, customTimezone } = useLanguage();
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false);

  const firstMatch = matches[0];
  const isSingleTeamMatches = matches.length > 0 && matches.every(m => m.team_code === firstMatch.team_code);
  const showSubscribe = isSingleTeamMatches && firstMatch && firstMatch.team_code !== 'TBD' && firstMatch.team_code !== 'FREE';
  const teamCode = firstMatch?.team_code || '';
  const teamName = firstMatch?.team_name || '';
  
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
      heading: t("has_game_heading"),
      subheading: t("has_game_subheading"),
      description: t("has_game_desc"),
      icon: <AlertTriangle className="w-14 h-14 md:w-20 md:h-20 text-[#ffcc00]" />
    },
    possible: {
      borderColor: "border-[#ff8c00] shadow-[#ff8c00]/10",
      themeColor: "text-[#ff8c00]",
      bgTheme: "bg-[#ff8c00]/10",
      heading: t("possible_game_heading"),
      subheading: t("possible_game_subheading"),
      description: t("possible_game_desc"),
      icon: <HelpCircle className="w-14 h-14 md:w-20 md:h-20 text-[#ff8c00]" />
    },
    none: {
      borderColor: "border-[#2ecc71] shadow-[#2ecc71]/10",
      themeColor: "text-[#2ecc71]",
      bgTheme: "bg-[#2ecc71]/10",
      heading: t("no_game_heading"),
      subheading: t("no_game_subheading"),
      description: t("no_game_desc"),
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
          {showSubscribe && (
            <button
              onClick={() => setIsFeedModalOpen(true)}
              className="mt-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-900 text-[#ffcc00] border border-zinc-900 hover:border-zinc-800 text-xs transition-all cursor-pointer w-full max-w-[220px]"
            >
              <CalendarIcon className="w-4 h-4 text-[#ffcc00]" />
              <span>{t("subscribe_full_calendar")}</span>
            </button>
          )}
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
                    {translateCondition(match.condition, lang)}
                  </span>
                )}
                <div className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-2">
                  {translatePhase(match.phase, lang)}
                </div>
                <div className="flex items-center gap-4 justify-center mb-2 w-full">
                  <div className="flex items-center gap-2">
                    <img
                      src={getFlagUrl(match.team_code)}
                      alt={translateTeamName(match.team_code, match.team_name, lang)}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                    <span className="font-bold text-sm text-white">{translateTeamName(match.team_code, match.team_name, lang)}</span>
                  </div>
                  <span className="text-zinc-500 font-bold text-xs">X</span>
                  <div className="flex items-center gap-2">
                    <img
                      src={match.opponent_code ? getFlagUrl(match.opponent_code) : "https://hatscripts.github.io/circle-flags/flags/xx.svg"}
                      alt={translateOpponentName(match.opponent_code, match.opponent_name, lang)}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700 bg-zinc-950"
                    />
                    <span className="font-bold text-sm text-white">{translateOpponentName(match.opponent_code, match.opponent_name, lang)}</span>
                  </div>
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
                      <div className="flex items-center flex-nowrap whitespace-nowrap gap-1.5 text-zinc-455 font-bold text-xs bg-zinc-950 py-1.5 px-4 rounded-full mt-1 border border-zinc-900">
                        <CalendarIcon className="w-3.5 h-3.5 text-zinc-550" />
                        <span>{formattedDate}</span>
                        <Clock className="w-3.5 h-3.5 text-zinc-550 ml-1.5" />
                        <span>{t("time_tbd")}</span>
                      </div>
                    );
                  }
                  
                  const formattedTime = formatMatchTimeInTimezone(match.time_brt, match.date, targetTz, lang);
                  return (
                    <div className="flex items-center flex-nowrap whitespace-nowrap gap-1.5 text-zinc-455 font-bold text-xs bg-zinc-950 py-1.5 px-4 rounded-full mt-1 border border-zinc-900">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 mb-2 text-[#2ecc71]">
              <CalendarIcon className="w-full h-full" />
            </div>
            <div className="text-[#2ecc71] font-black italic text-xl uppercase tracking-wide">
              {t("free_day")}
            </div>
          </div>
        )}
      </div>

      <CalendarFeedModal
        isOpen={isFeedModalOpen}
        onClose={() => setIsFeedModalOpen(false)}
        teamCode={teamCode}
        teamName={translateTeamName(teamCode, teamName, lang)}
      />
    </div>
  );
}
