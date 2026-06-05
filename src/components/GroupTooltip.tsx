"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getGroupTeamsClient } from "@/lib/client-calendar";
import { getFlagUrl } from "@/lib/flag-codes";
import { useLanguage } from "./TranslationProvider";
import { translateTeamName } from "@/locales/i18n-utils";

interface GroupTooltipProps {
  text: string;
  groupLetter: string;
}

export default function GroupTooltip({ text, groupLetter }: GroupTooltipProps) {
  const { lang } = useLanguage();
  const [teams, setTeams] = useState<Array<{ code: string; name: string; flag: string }>>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    getGroupTeamsClient(groupLetter)
      .then((data) => {
        if (mounted) {
          // Sort teams alphabetically by code or keep as is. Usually they are naturally ordered.
          setTeams(data);
        }
      })
      .catch((err) => console.error("Error loading group teams:", err));

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [groupLetter, timeoutId]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    
    if (showTooltip) {
      setShowTooltip(false);
    } else {
      setShowTooltip(true);
      const id = setTimeout(() => {
        setShowTooltip(false);
      }, 2500); // give a bit more time for reading 4 teams
      setTimeoutId(id);
    }
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

  if (teams.length === 0) {
    return <span>{text}</span>;
  }

  return (
    <span className="relative inline-flex items-center justify-center">
      <span
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="border-b border-dashed border-zinc-500 cursor-help hover:text-white hover:border-zinc-300 transition-colors"
      >
        {text}
      </span>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 md:-right-4 mt-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-[99999] pointer-events-none w-max max-w-[280px]"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {teams.map((t) => (
                <div key={t.code} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-zinc-800 bg-zinc-900">
                    <img
                      src={getFlagUrl(t.code)}
                      alt={t.code}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-zinc-300 text-xs font-bold truncate max-w-[80px]">
                    {translateTeamName(t.code, t.name, lang)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
