"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

import { Calendar as CalendarIcon, RefreshCw, Loader2, ChevronDown } from "lucide-react";
import Image from "next/image";
import type { TeamSummary, MatchWithTeam, Match } from "@/lib/types";
const ResultModal = dynamic(() => import("./ResultModal"), { ssr: false });
const SupportModal = dynamic(() => import("./SupportModal"), { ssr: false });
const SupportBottomBar = dynamic(() => import("./SupportBottomBar"), { ssr: false });
import TeamCarousel from "./TeamCarousel";
import { queryDateClient, queryAllGamesOnDateClient, getClientCalendar } from "@/lib/client-calendar";
import { useLanguage } from "./TranslationProvider";
import { translateTeamName, translateOpponentName, translatePhase, translateCondition } from "@/locales/i18n-utils";
import { getFlagUrl } from "@/lib/flag-codes";

// Wait, Next.js Link import:
import NextLink from "next/link";

interface HomeClientProps {
  teams: TeamSummary[];
  lastUpdated: string;
  initialTeam?: string;
  initialDate?: string;
  initialMode?: "team" | "date-only";
  result?: { hasGame: boolean; matches: MatchWithTeam[] };
  isClubs?: boolean;
  initialMatches?: Match[];
}

export default function HomeClient({ teams, lastUpdated, initialTeam, initialDate, initialMode = "team", result, isClubs = false, initialMatches }: HomeClientProps) {
  const { lang, t } = useLanguage();
  const defaultTeam = isClubs
    ? (teams[0]?.slug)
    : (teams.find(t => t.code === "BRA")?.slug || teams[0]?.slug);
  const [selectedTeam, setSelectedTeam] = useState(initialTeam || defaultTeam);
  const [selectedTeamMatches, setSelectedTeamMatches] = useState<Match[]>(() => {
    return (initialMatches || []);
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDate) return initialDate;
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [mode, setMode] = useState<"team" | "date-only">(initialMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(!!result);
  const [localResult, setLocalResult] = useState<{ hasGame: boolean; matches: MatchWithTeam[] } | null>(result || null);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Client-side dynamic match loading for selected team
  useEffect(() => {
    if (initialMatches && selectedTeam === initialTeam) {
      setSelectedTeamMatches(initialMatches.filter(m => m.phase_slug !== 'friendly'));
      return;
    }

    let active = true;
    (async () => {
      try {
        const calendar = await getClientCalendar(isClubs);
        const entry = Object.entries(calendar.teams).find(
          ([, teamItem]) => teamItem.slug === selectedTeam
        );
        if (entry && active) {
          const [, teamItem] = entry;
          const sorted = [...teamItem.matches]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          setSelectedTeamMatches(sorted);
        }
      } catch (err) {
        console.error("Failed to load matches for selected team client-side:", err);
      }
    })();

    return () => {
      active = false;
    };
  }, [selectedTeam, isClubs, initialMatches, initialTeam]);
  
  // Range date selection states
  const [isRangeEnabled, setIsRangeEnabled] = useState(false);
  const [endDate, setEndDate] = useState("");
  
  // Load range parameter if present on initial mounting (direct URL access support)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ate = params.get("ate");
      if (ate) {
        setTimeout(() => {
          setIsRangeEnabled(true);
          setEndDate(ate);
        }, 0);
        
        // Trigger initial local query for the range immediately
        (async () => {
          try {
            setIsLoading(true);
            if (initialTeam && initialDate) {
              const res = await queryDateClient(initialTeam, initialDate, ate, isClubs);
              setLocalResult(res);
              setIsModalOpen(true);
            } else if (initialDate) {
              const res = await queryAllGamesOnDateClient(initialDate, ate, isClubs);
              setLocalResult(res);
              setIsModalOpen(true);
            }
          } catch (err) {
            console.error("Failed to query initial range client-side:", err);
          } finally {
            setIsLoading(false);
          }
        })();
      }
    }
  }, [initialTeam, initialDate]);

  // Sync modal state when result changes (e.g., on navigation)
  const [prevResult, setPrevResult] = useState(result);
  if (result !== prevResult) {
    setPrevResult(result);
    setLocalResult(result || null);
    setShouldOpenModal(!!result);
    if (!result) {
      setIsModalOpen(false);
    }
  }

  // Restore last selected team from localStorage if on the home page (no initialTeam)
  useEffect(() => {
    if (!initialTeam) {
      try {
        const saved = localStorage.getItem("lastSelectedTeam");
        if (saved) {
          const exists = teams.some(t => t.slug === saved);
          if (exists) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedTeam(saved);
          }
        }
      } catch (err) {
        console.error("Failed to read from localStorage:", err);
      }
    }
  }, [initialTeam, teams]);

  // Save selected team to localStorage when it changes
  useEffect(() => {
    if (selectedTeam) {
      try {
        localStorage.setItem("lastSelectedTeam", selectedTeam);
      } catch (err) {
        console.error("Failed to write to localStorage:", err);
      }
    }
  }, [selectedTeam]);

  // Open modal on mount/prop change for date-only mode (since there is no TeamCarousel scroll to trigger it)
  useEffect(() => {
    if (mode === "date-only" && shouldOpenModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsModalOpen(true);
    }
  }, [mode, shouldOpenModal]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const activeEndDate = isRangeEnabled && endDate ? endDate : undefined;
      const queryParam = activeEndDate ? `?ate=${activeEndDate}` : "";
      const langPath = lang === 'pt' ? '' : `/${lang}`;
      const basePrefix = isClubs ? `${langPath}/times` : langPath;
      
      try {
        setIsLoading(true);
        if (mode === "team" && selectedTeam) {
          const res = await queryDateClient(selectedTeam, selectedDate, activeEndDate, isClubs);
          setLocalResult(res);
          setShouldOpenModal(true);
          setIsModalOpen(true);
          window.history.pushState(null, "", `${basePrefix}/${selectedTeam}/${selectedDate}${queryParam}`);
        } else if (mode === "date-only") {
          const res = await queryAllGamesOnDateClient(selectedDate, activeEndDate, isClubs);
          setLocalResult(res);
          setShouldOpenModal(true);
          setIsModalOpen(true);
          window.history.pushState(null, "", `${basePrefix}/todos/${selectedDate}${queryParam}`);
        }
      } catch (err) {
        console.error("Failed to query date client-side:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShouldOpenModal(false);
    setLocalResult(null);
    const langPath = lang === 'pt' ? '' : `/${lang}`;
    const basePrefix = isClubs ? `${langPath}/times` : langPath;
    if (mode === "team") {
      window.history.pushState(null, "", `${basePrefix}/${selectedTeam}`);
    } else {
      window.history.pushState(null, "", `${basePrefix || '/'}`);
    }
  };

  const activeTeamData = teams.find(t => t.slug === selectedTeam);
  const langPrefix = lang === 'pt' ? '' : `/${lang}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] font-sans text-white selection:bg-[#ffcc00] selection:text-black">
      {/* Banner Topo — hidden but structure preserved for future ads */}
      <div className="w-full bg-[#ffcc00] text-black font-bold text-center py-3 text-sm md:text-base tracking-widest uppercase hidden">
        Espaço para Banner Topo
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-6 md:pt-20 pb-6 md:pb-8 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 lg:gap-16">
        {/* Header / Hero (Logo na esquerda no desktop) */}
        <header className="flex flex-col items-center justify-center shrink-0">
          {/* Logo */}
          <div className="w-40 h-40 md:w-[280px] md:h-[280px] lg:w-[340px] lg:h-[340px]">
            <Image
              src="/logo.webp"
              alt={t("title")}
              width={340}
              height={340}
              priority
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,204,0,0.3)]"
            />
          </div>
        </header>

        {/* Main Form Card (Coluna da direita no desktop) */}
        <div className="w-full max-w-xl lg:max-w-2xl bg-[#111111] rounded-3xl p-5 md:p-8 shadow-2xl border border-zinc-800 shrink">
          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            {/* Mode Switcher */}
            <div className="flex items-center justify-center gap-3 md:gap-5 mb-1 border-b border-zinc-900 pb-4">
              <button
                type="button"
                onClick={() => setMode("team")}
                className={`font-black uppercase tracking-wider text-[10px] md:text-xs transition-all pb-1.5 relative ${
                  mode === "team" ? "text-[#ffcc00]" : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {t("select_team")}
                {mode === "team" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffcc00] rounded-full" />
                )}
              </button>
              
              <span className="text-zinc-400 font-bold uppercase text-[10px] md:text-xs pb-1.5">{t("or")}</span>
              
              <button
                type="button"
                onClick={() => setMode("date-only")}
                className={`font-black uppercase tracking-wider text-[10px] md:text-xs transition-all pb-1.5 relative ${
                  mode === "date-only" ? "text-[#ffcc00]" : "text-zinc-400 hover:text-zinc-300"
                }`}
              >
                {t("select_day_only")}
                {mode === "date-only" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffcc00] rounded-full" />
                )}
              </button>
            </div>

            {/* Team Carousel */}
            {mode === "team" && (
              <TeamCarousel
                teams={teams}
                selected={selectedTeam}
                onSelect={setSelectedTeam}
                onScrollComplete={() => {
                  if (shouldOpenModal) {
                    setIsModalOpen(true);
                  }
                }}
              />
            )}

            {/* Date Pickers Container */}
            <div className="flex flex-col md:flex-row items-start justify-center gap-4 w-full">
              {/* Start Date */}
              <div className="flex flex-col items-center gap-1.5 text-center w-full flex-1">
                <label htmlFor="date" className="font-display uppercase text-[#ffcc00] font-black tracking-widest text-[10px] md:text-xs cursor-pointer">
                  {isRangeEnabled ? t("start_date") : t("select_date")}
                </label>
                <div className="w-8 h-1 bg-[#ffcc00] rounded-full mb-1"></div>
                <div className="relative w-full max-w-[280px] md:max-w-full mx-auto">
                  <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ffcc00] w-6 h-6 pointer-events-none" />
                  <input
                    type="date"
                    id="date"
                    required
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      if (endDate && e.target.value > endDate) {
                        setEndDate("");
                      }
                    }}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker();
                      } catch {}
                    }}
                    className="w-full appearance-none bg-zinc-950 text-white border border-zinc-800 font-bold text-lg md:text-xl rounded-xl py-4 pl-14 pr-12 focus:outline-none focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20 cursor-pointer"
                  />
                </div>
              </div>

              {/* Optional End Date Picker */}
              <AnimatePresence>
                {isRangeEnabled && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden w-full flex-1"
                  >
                    <div className="flex flex-col items-center gap-1.5 text-center md:pt-0 w-full">
                      <label htmlFor="endDate" className="font-display uppercase text-[#ffcc00] font-black tracking-widest text-[10px] md:text-xs cursor-pointer">
                        {t("end_date")}
                      </label>
                      <div className="w-8 h-1 bg-[#ffcc00] rounded-full mb-1"></div>
                      <div className="relative w-full max-w-[280px] md:max-w-full mx-auto">
                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-[#ffcc00] w-6 h-6 pointer-events-none" />
                        <input
                          type="date"
                          id="endDate"
                          required={isRangeEnabled}
                          value={endDate}
                          min={selectedDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          onClick={(e) => {
                            try {
                              e.currentTarget.showPicker();
                            } catch {}
                          }}
                          className="w-full appearance-none bg-zinc-950 text-white border border-zinc-800 font-bold text-lg md:text-xl rounded-xl py-4 pl-14 pr-12 focus:outline-none focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20 cursor-pointer"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Checkbox for date range */}
            <div className="flex items-center justify-center -mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm text-zinc-400 hover:text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={isRangeEnabled}
                  onChange={(e) => {
                    setIsRangeEnabled(e.target.checked);
                    if (e.target.checked) {
                      setEndDate("2026-07-19");
                    } else {
                      setEndDate("");
                    }
                  }}
                  className="rounded border-zinc-850 bg-zinc-950 text-[#ffcc00] focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span>{t("search_range")}</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !selectedDate || (isRangeEnabled && !endDate)}
              className="mt-1 w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black uppercase tracking-widest text-base md:text-lg py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,204,0,0.2)] hover:shadow-[0_0_25px_rgba(255,204,0,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-black" />
                  <span>{t("please_wait")}</span>
                </>
              ) : (
                t("verify")
              )}
            </button>
          </form>
        </div>

        {/* Result Modal */}
        <ResultModal 
          hasGame={localResult?.hasGame || false} 
          matches={localResult?.matches} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          date={selectedDate}
          endDate={isRangeEnabled ? endDate : undefined}
        />
      </main>

      {/* Seção Informativa para SEO e AdSense (Abaixo da Dobra) */}
      <section className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col gap-12 border-t border-zinc-900 mt-8 font-details">
        
        {/* Bloco Dinâmico de Contexto do Jogo (SEO e Crawlers) */}
        {localResult && (
          <div className="bg-zinc-950 rounded-3xl p-6 border border-zinc-800 shadow-xl flex flex-col gap-4">
            <h2 className="font-display text-xs md:text-sm font-black uppercase tracking-wider text-[#ffcc00] flex items-center gap-2">
              <span className="text-lg">🔍</span>
              {t("verify")} - {(() => {
                const parts = (initialDate || selectedDate).split("-");
                if (parts.length < 3) return initialDate || selectedDate;
                return lang === 'en' ? `${parts[1]}/${parts[2]}/${parts[0]}` : `${parts[2]}/${parts[1]}/${parts[0]}`;
              })()}
            </h2>
            <div className="w-12 h-1 bg-[#ffcc00] rounded-full"></div>
            <div className="text-zinc-400 text-sm md:text-base leading-relaxed space-y-3 font-details">
              {localResult.matches.length > 0 ? (
                localResult.matches.map((m, idx) => {
                  const opponentNameTrans = translateOpponentName(m.opponent_code, m.opponent_name, lang);
                  const phaseTrans = translatePhase(m.phase, lang);
                  const dateStr = (() => {
                    const parts = m.date.split("-");
                    if (parts.length < 3) return m.date;
                    return lang === 'en' ? `${parts[1]}/${parts[2]}/${parts[0]}` : `${parts[2]}/${parts[1]}/${parts[0]}`;
                  })();
                  const teamNameTrans = translateTeamName(m.team_code, m.team_name, lang);
                  
                  if (m.status === 'confirmed' || m.status === 'played') {
                    return (
                      <p key={idx} className="border-l-2 border-[#ffcc00] pl-3">
                        {lang === 'en' ? (
                          `Confirmed Match: ${teamNameTrans} will play against ${opponentNameTrans} on ${dateStr} for the ${phaseTrans}. The match will take place at the ${m.venue} in ${m.city}, ${m.country}.`
                        ) : lang === 'es' ? (
                          `Partido Confirmado: ${teamNameTrans} jugará contra ${opponentNameTrans} el ${dateStr} para la ${phaseTrans}. El partido se disputará en el ${m.venue} en ${m.city}, ${m.country}.`
                        ) : (
                          `Jogo Confirmado: O ${teamNameTrans} enfrentará o ${opponentNameTrans} no dia ${dateStr} pela ${phaseTrans}. A partida acontecerá no estádio ${m.venue} em ${m.city}, ${m.country}.`
                        )}
                      </p>
                    );
                  } else {
                    const condTrans = translateCondition(m.condition, lang) || "";
                    return (
                      <p key={idx} className="border-l-2 border-orange-500 pl-3">
                        {lang === 'en' ? (
                          `Possible Match Scenario: ${teamNameTrans} may play against ${opponentNameTrans} on ${dateStr} for the ${phaseTrans}. Condition: ${condTrans}.`
                        ) : lang === 'es' ? (
                          `Escenario de Partido Posible: ${teamNameTrans} podría jugar contra ${opponentNameTrans} el ${dateStr} para la ${phaseTrans}. Condición: ${condTrans}.`
                        ) : (
                          `Cenário de Possível Jogo: O ${teamNameTrans} poderá jogar contra o ${opponentNameTrans} no dia ${dateStr} pela ${phaseTrans}. Condição: ${condTrans}.`
                        )}
                      </p>
                    );
                  }
                })
              ) : (
                <p className="border-l-2 border-green-500 pl-3">
                  {lang === 'en' ? (
                    `No football matches are scheduled for ${activeTeamData ? activeTeamData.name : ""} on the date of ${(() => {
                      const parts = (initialDate || selectedDate).split("-");
                      if (parts.length < 3) return initialDate || selectedDate;
                      return `${parts[1]}/${parts[2]}/${parts[0]}`;
                    })()}.`
                  ) : lang === 'es' ? (
                    `No hay partidos de fútbol programados para ${activeTeamData ? activeTeamData.name : ""} en la fecha del ${(() => {
                      const parts = (initialDate || selectedDate).split("-");
                      if (parts.length < 3) return initialDate || selectedDate;
                      return `${parts[2]}/${parts[1]}/${parts[0]}`;
                    })()}.`
                  ) : (
                    `Não há partidas de futebol agendadas para o ${activeTeamData ? activeTeamData.name : ""} na data de ${(() => {
                      const parts = (initialDate || selectedDate).split("-");
                      if (parts.length < 3) return initialDate || selectedDate;
                      return `${parts[2]}/${parts[1]}/${parts[0]}`;
                    })()}.`
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Bloco 1: Sobre o Projeto / Descrição do Time */}
        <div className="bg-[#111111] rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-xl">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg md:text-xl font-black uppercase tracking-wider text-[#ffcc00] flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              {t("seo_about_title")}
            </h2>
            <div className="w-12 h-1 bg-[#ffcc00] rounded-full"></div>
            <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
              {t("seo_about_desc")}
            </p>
            {activeTeamData && (
              <div className="mt-4 p-5 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-zinc-850">
                    <img
                      src={getFlagUrl(activeTeamData.code)}
                      alt={activeTeamData.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xs uppercase text-white tracking-wider">
                      {activeTeamData.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      {t("seo_team_default_desc", { team: activeTeamData.name })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bloco: Agenda de Jogos */}
        {selectedTeamMatches.length > 0 && (
          <div className="bg-[#111111] rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-xl flex flex-col gap-6 w-full">
            <h2 className="font-display text-lg md:text-xl font-black uppercase tracking-wider text-[#ffcc00] flex items-center gap-2">
              <span className="text-2xl">📅</span>
              {lang === 'en' ? 'Match Schedule' : lang === 'es' ? 'Agenda de Partidos' : 'Agenda de Jogos'}
            </h2>
            <div className="w-12 h-1 bg-[#ffcc00] rounded-full"></div>
            
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
              {lang === 'en' 
                ? `Check all scheduled or potential matches for ${activeTeamData ? activeTeamData.name : ''}.` 
                : lang === 'es'
                ? `Consulta todos los partidos confirmados o posibles para ${activeTeamData ? activeTeamData.name : ''}.`
                : `Confira todos os compromissos confirmados ou possíveis na agenda de jogos da equipe de ${activeTeamData ? activeTeamData.name : ''}.`}
            </p>

            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
              {selectedTeamMatches.map((match) => {
                const matchDateFormatted = (() => {
                  const parts = match.date.split("-");
                  if (parts.length < 3) return match.date;
                  return `${parts[2]}/${parts[1]}/${parts[0]}`;
                })();
                const isPlayed = match.status === 'played' || !!match.result;
                const isConfirmed = match.status === 'confirmed';
                return (
                  <div key={match.id} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#ffcc00] uppercase tracking-wider">
                        {matchDateFormatted} {match.time_brt ? `• ${match.time_brt} BRT` : ''}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                        isPlayed
                          ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          : isConfirmed 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/20'
                      }`}>
                        {isPlayed
                          ? (lang === 'en' ? 'Finished' : lang === 'es' ? 'Finalizado' : 'Finalizado')
                          : isConfirmed 
                          ? (lang === 'en' ? 'Confirmed' : lang === 'es' ? 'Confirmado' : 'Confirmado')
                          : (lang === 'en' ? 'Possible' : lang === 'es' ? 'Posible' : 'Possível')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-1">
                      <div className="flex items-center gap-2">
                        {activeTeamData && (
                          <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                            <img src={getFlagUrl(activeTeamData.code)} alt={activeTeamData.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="text-sm font-bold text-white">{activeTeamData ? activeTeamData.name : ''}</span>
                      </div>

                      {isPlayed && match.result ? (
                        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-black text-[#ffcc00] tabular-nums">
                          <span>{match.is_home ? match.result.goals_home : match.result.goals_away}</span>
                          <span className="text-zinc-600 font-bold">-</span>
                          <span>{match.is_home ? match.result.goals_away : match.result.goals_home}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-black text-xs">VS</span>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{translateOpponentName(match.opponent_code, match.opponent_name, lang)}</span>
                        {match.opponent_code && (
                          <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                            <img src={getFlagUrl(match.opponent_code)} alt={match.opponent_name} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 border-t border-zinc-900 pt-2 text-[11px] text-zinc-500">
                      <span>🏆 {translatePhase(match.phase, lang)}</span>
                      {match.venue && <span>📍 {match.venue} ({match.city}, {match.country})</span>}
                      {match.broadcasts && match.broadcasts.length > 0 && (
                        <span>📺 {match.broadcasts.join(', ')}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bloco 2: Como Funciona */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-sm md:text-base font-black uppercase tracking-wider text-white border-b border-zinc-900 pb-3">
            {t("seo_how_it_works_title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-900 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ffcc00]/10 flex items-center justify-center text-xs font-black text-[#ffcc00] border border-[#ffcc00]/20">
                1
              </div>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                {t("seo_how_it_works_step1")}
              </p>
            </div>
            <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-900 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ffcc00]/10 flex items-center justify-center text-xs font-black text-[#ffcc00] border border-[#ffcc00]/20">
                2
              </div>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                {t("seo_how_it_works_step2")}
              </p>
            </div>
            <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-900 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ffcc00]/10 flex items-center justify-center text-xs font-black text-[#ffcc00] border border-[#ffcc00]/20">
                3
              </div>
              <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
                {t("seo_how_it_works_step3")}
              </p>
            </div>
          </div>
        </div>

        {/* Bloco 3: Acordeão de FAQ */}
        <div className="flex flex-col gap-6">
          <h2 className="font-display text-sm md:text-base font-black uppercase tracking-wider text-white border-b border-zinc-900 pb-3">
            {t("seo_faq_title")}
          </h2>
          <div className="flex flex-col gap-4">
            {[
              { q: t("seo_faq_q1"), a: t("seo_faq_a1") },
              { q: t("seo_faq_q2"), a: t("seo_faq_a2") },
              { q: t("seo_faq_q3"), a: t("seo_faq_a3") },
              { q: t("seo_faq_q4"), a: t("seo_faq_a4") }
            ].map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-[#111111] border border-zinc-850 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm md:text-base text-white hover:text-[#ffcc00] transition-colors focus:outline-none cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#ffcc00]" : ""}`} />
                  </button>
                  <div 
                    className="px-5 text-zinc-400 text-xs md:text-sm leading-relaxed border-t border-zinc-900 transition-all duration-300 ease-in-out overflow-hidden"
                    style={{
                      maxHeight: isOpen ? "250px" : "0px",
                      opacity: isOpen ? 1 : 0,
                      paddingTop: isOpen ? "12px" : "0px",
                      paddingBottom: isOpen ? "16px" : "0px",
                      borderTopColor: isOpen ? "rgb(24, 24, 27)" : "transparent"
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bloco 4: Links Rápidos das Seleções (Internal Linking) */}
        <div className="flex flex-col gap-4 border-t border-zinc-900 pt-8">
          <h3 className="font-display font-black text-[10px] md:text-xs text-[#ffcc00] uppercase tracking-wider">
            {t("seo_available_teams_title")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {teams.map((tItem) => {
              const path = isClubs ? `${langPrefix}/times/${tItem.slug}` : `${langPrefix}/${tItem.slug}`;
              return (
                <NextLink
                  key={tItem.code}
                  href={path || "/"}
                  className="px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-xl text-xs hover:border-[#ffcc00] hover:text-[#ffcc00] transition-all flex items-center gap-1.5"
                >
                  <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                    <img
                      src={getFlagUrl(tItem.code)}
                      alt={tItem.name}
                      width={16}
                      height={16}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>{tItem.name}</span>
                </NextLink>
              );
            })}
          </div>
        </div>

      </section>

      {/* Banner Inferior — hidden but structure preserved */}
      <div className="w-full bg-[#ffcc00] text-black font-bold text-center py-3 text-sm md:text-base tracking-widest uppercase hidden">
        Espaço para Banner Inferior
      </div>

      {/* Footer Info */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 py-4 md:py-5 bg-black text-zinc-400 text-xs border-t border-zinc-950 font-details">
        <div className="flex items-center gap-1.5 flex-wrap justify-center text-zinc-400">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t("last_updated", { date: lastUpdated })}</span>
          <span>|</span>
          <NextLink href={`${langPrefix}/devlog`} prefetch={false} className="hover:text-[#ffcc00] font-bold transition-colors">
            v1.6.0
          </NextLink>
        </div>
        <div className="hidden md:block text-zinc-400">•</div>
        <div className="flex items-center gap-4 text-zinc-400 mt-1 md:mt-0 flex-wrap justify-center">
          <NextLink href={`${langPrefix}/sobre`} prefetch={false} className="hover:text-[#ffcc00] transition-colors">{t("about")}</NextLink>
          <span>•</span>
          <NextLink href={`${langPrefix}/contato`} prefetch={false} className="hover:text-[#ffcc00] transition-colors">{t("contact")}</NextLink>
          <span>•</span>
          <NextLink href={`${langPrefix}/devlog`} prefetch={false} className="hover:text-[#ffcc00] transition-colors">{t("devlog")}</NextLink>
          <span>•</span>
          <NextLink href={`${langPrefix}/politica-de-privacidade`} prefetch={false} className="hover:text-[#ffcc00] transition-colors">{t("privacy")}</NextLink>
          <span>•</span>
          <NextLink href={`${langPrefix}/politica-de-cookies`} prefetch={false} className="hover:text-[#ffcc00] transition-colors">{t("cookie_policy")}</NextLink>
          <span>•</span>
          <NextLink href={`${langPrefix}/termos-de-uso`} prefetch={false} className="hover:text-[#ffcc00] transition-colors">{t("terms_of_use")}</NextLink>
        </div>
      </footer>

      {/* Support / PIX Floating Bar & Automatic Popup */}
      {/* <SupportBottomBar /> */}
      {/* <SupportModal /> */}
    </div>
  );
}
