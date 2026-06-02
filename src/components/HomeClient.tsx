"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { Calendar as CalendarIcon, RefreshCw, Loader2 } from "lucide-react";
import type { TeamSummary, MatchWithTeam } from "@/lib/types";
import ResultModal from "./ResultModal";
import TeamCarousel from "./TeamCarousel";
import { queryDateClient, queryAllGamesOnDateClient } from "@/lib/client-calendar";
import { useLanguage } from "./TranslationProvider";
import LanguageSwitcher from "./LanguageSwitcher";

// Wait, Next.js Link import:
import NextLink from "next/link";

interface HomeClientProps {
  teams: TeamSummary[];
  lastUpdated: string;
  initialTeam?: string;
  initialDate?: string;
  initialMode?: "team" | "date-only";
  result?: { hasGame: boolean; matches: MatchWithTeam[] };
}

export default function HomeClient({ teams, lastUpdated, initialTeam, initialDate, initialMode = "team", result }: HomeClientProps) {
  const { lang, t } = useLanguage();
  const [selectedTeam, setSelectedTeam] = useState(initialTeam || (teams.find(t => t.code === "BRA")?.slug || teams[0]?.slug));
  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [mode, setMode] = useState<"team" | "date-only">(initialMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(!!result);
  const [localResult, setLocalResult] = useState<{ hasGame: boolean; matches: MatchWithTeam[] } | null>(result || null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Range date selection states
  const [isRangeEnabled, setIsRangeEnabled] = useState(false);
  const [endDate, setEndDate] = useState("");
  
  const router = useRouter();

  // Load range parameter if present on initial mounting (direct URL access support)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ate = params.get("ate");
      if (ate) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsRangeEnabled(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEndDate(ate);
        
        // Trigger initial local query for the range immediately
        (async () => {
          try {
            setIsLoading(true);
            if (initialTeam && initialDate) {
              const res = await queryDateClient(initialTeam, initialDate, ate);
              setLocalResult(res);
              setIsModalOpen(true);
            } else if (initialDate) {
              const res = await queryAllGamesOnDateClient(initialDate, ate);
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
      
      try {
        setIsLoading(true);
        if (mode === "team" && selectedTeam) {
          const res = await queryDateClient(selectedTeam, selectedDate, activeEndDate);
          setLocalResult(res);
          setShouldOpenModal(true);
          setIsModalOpen(true);
          window.history.pushState(null, "", `${langPath}/${selectedTeam}/${selectedDate}${queryParam}`);
        } else if (mode === "date-only") {
          const res = await queryAllGamesOnDateClient(selectedDate, activeEndDate);
          setLocalResult(res);
          setShouldOpenModal(true);
          setIsModalOpen(true);
          window.history.pushState(null, "", `${langPath}/todos/${selectedDate}${queryParam}`);
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
    if (mode === "team") {
      window.history.pushState(null, "", `${langPath}/${selectedTeam}`);
    } else {
      window.history.pushState(null, "", `${langPath || '/'}`);
    }
  };

  const langPrefix = lang === 'pt' ? '' : `/${lang}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] font-sans text-white selection:bg-[#ffcc00] selection:text-black">
      {/* Banner Topo — hidden but structure preserved for future ads */}
      <div className="w-full bg-[#ffcc00] text-black font-bold text-center py-3 text-sm md:text-base tracking-widest uppercase hidden">
        Espaço para Banner Topo
      </div>

      <main className="flex-1 flex flex-col items-center px-4 w-full max-w-2xl mx-auto pt-6 pb-12">
        {/* Header / Hero */}
        <header className="w-full flex flex-col items-center text-center mb-6 gap-4">
          {/* Logo */}
          <div className="w-40 h-40 md:w-52 md:h-52">
            <img
              src="/logo.png"
              alt={t("title")}
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,204,0,0.3)]"
            />
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-xs md:max-w-md mx-auto leading-tight">
            {t("description")}
          </p>
          <LanguageSwitcher />
        </header>

        {/* Main Form Card */}
        <div className="w-full bg-[#111111] rounded-3xl p-5 md:p-8 shadow-2xl border border-zinc-800">
          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            {/* Mode Switcher */}
            <div className="flex items-center justify-center gap-3 md:gap-5 mb-1 border-b border-zinc-900 pb-4">
              <button
                type="button"
                onClick={() => setMode("team")}
                className={`font-black uppercase tracking-wider text-xs md:text-sm transition-all pb-1.5 relative ${
                  mode === "team" ? "text-[#ffcc00]" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t("select_team")}
                {mode === "team" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffcc00] rounded-full" />
                )}
              </button>
              
              <span className="text-zinc-600 font-bold uppercase text-xs md:text-sm pb-1.5">{t("or")}</span>
              
              <button
                type="button"
                onClick={() => setMode("date-only")}
                className={`font-black uppercase tracking-wider text-xs md:text-sm transition-all pb-1.5 relative ${
                  mode === "date-only" ? "text-[#ffcc00]" : "text-zinc-500 hover:text-zinc-300"
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

            {/* Date Picker */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <label htmlFor="date" className="uppercase text-[#ffcc00] font-black tracking-widest text-xs md:text-sm cursor-pointer">
                {isRangeEnabled ? t("start_date") : t("select_date")}
              </label>
              <div className="w-8 h-1 bg-[#ffcc00] rounded-full mb-1"></div>
              <div className="relative max-w-[280px] mx-auto w-full">
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
                    } catch (err) {}
                  }}
                  className="w-full appearance-none bg-zinc-950 text-white border border-zinc-800 font-bold text-lg md:text-xl rounded-xl py-4 pl-14 pr-12 focus:outline-none focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20 cursor-pointer"
                />
              </div>
            </div>

            {/* Checkbox for date range */}
            <div className="flex items-center justify-center -mt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs md:text-sm text-zinc-500 hover:text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={isRangeEnabled}
                  onChange={(e) => {
                    setIsRangeEnabled(e.target.checked);
                    if (!e.target.checked) setEndDate("");
                  }}
                  className="rounded border-zinc-850 bg-zinc-950 text-[#ffcc00] focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span>{t("search_range")}</span>
              </label>
            </div>

            {/* Optional End Date Picker (Animated) */}
            <AnimatePresence>
              {isRangeEnabled && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 4 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden w-full"
                >
                  <div className="flex flex-col items-center gap-1.5 text-center pt-2">
                    <label htmlFor="endDate" className="uppercase text-[#ffcc00] font-black tracking-widest text-xs md:text-sm cursor-pointer">
                      {t("end_date")}
                    </label>
                    <div className="w-8 h-1 bg-[#ffcc00] rounded-full mb-1"></div>
                    <div className="relative max-w-[280px] mx-auto w-full">
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
                          } catch (err) {}
                        }}
                        className="w-full appearance-none bg-zinc-950 text-white border border-zinc-800 font-bold text-lg md:text-xl rounded-xl py-4 pl-14 pr-12 focus:outline-none focus:border-[#ffcc00] focus:ring-2 focus:ring-[#ffcc00]/20 cursor-pointer"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !selectedDate || (isRangeEnabled && !endDate)}
              className="mt-1 w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black uppercase tracking-widest text-lg md:text-xl py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,204,0,0.2)] hover:shadow-[0_0_25px_rgba(255,204,0,0.4)] flex items-center justify-center gap-2 cursor-pointer"
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

      {/* Banner Inferior — hidden but structure preserved */}
      <div className="w-full bg-[#ffcc00] text-black font-bold text-center py-3 text-sm md:text-base tracking-widest uppercase hidden">
        Espaço para Banner Inferior
      </div>

      {/* Footer Info */}
      <footer className="w-full flex flex-col items-center justify-center gap-2 py-6 bg-black text-zinc-500 text-xs border-t border-zinc-950">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t("last_updated", { date: lastUpdated })}</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-500 mt-1">
          <NextLink href={`${langPrefix}/sobre`} className="hover:text-[#ffcc00] transition-colors">{t("about")}</NextLink>
          <span>•</span>
          <NextLink href={`${langPrefix}/politica-de-privacidade`} className="hover:text-[#ffcc00] transition-colors">{t("privacy")}</NextLink>
          <span>•</span>
          <NextLink href={`${langPrefix}/termos-de-uso`} className="hover:text-[#ffcc00] transition-colors">{t("terms_of_use")}</NextLink>
        </div>
      </footer>

    </div>
  );
}
