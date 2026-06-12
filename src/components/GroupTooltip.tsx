"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
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
  
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    let mounted = true;
    getGroupTeamsClient(groupLetter)
      .then((data) => {
        if (mounted) {
          setTeams(data);
        }
      })
      .catch((err) => console.error("Error loading group teams:", err));

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [groupLetter]);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const tooltipWidth = 240; // Estimated tooltip width
      
      // Determine if we should align to the right half of screen
      const isRightHalf = rect.left + rect.width / 2 > viewportWidth / 2;
      
      let left = 0;
      if (isRightHalf) {
        left = Math.max(12, rect.right - tooltipWidth);
      } else {
        left = Math.min(viewportWidth - tooltipWidth - 12, rect.left);
      }
      
      const viewportHeight = window.innerHeight;
      const tooltipHeight = 90; // Estimated tooltip height
      const spaceBelow = viewportHeight - rect.bottom;
      
      let top = rect.bottom + 8;
      if (spaceBelow < tooltipHeight && rect.top > tooltipHeight) {
        top = rect.top - tooltipHeight - 8;
      }
      
      setCoords({
        top,
        left,
      });
    }
  };

  useEffect(() => {
    if (showTooltip) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [showTooltip]);

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
      }, 2500);
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
    <span className="relative inline-flex items-center justify-center" ref={triggerRef}>
      <span
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="border-b border-dashed border-zinc-500 cursor-help hover:text-white hover:border-zinc-300 transition-colors"
      >
        {text}
      </span>

      {isMounted && createPortal(
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                top: coords.top,
                left: coords.left,
                zIndex: 999999,
              }}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 shadow-[0_0_30px_rgba(0,0,0,0.8)] pointer-events-none w-max max-w-[280px]"
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {teams.map((t) => (
                  <div key={t.code} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-zinc-800 bg-zinc-900">
                      <img
                        src={getFlagUrl(t.code)}
                        alt={t.code}
                        width={20}
                        height={20}
                        loading="lazy"
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
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}
