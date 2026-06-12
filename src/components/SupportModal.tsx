"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "./TranslationProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";

// Edit your Livepix support link here:
export const LIVEPIX_URL = "https://livepix.gg/castrobrothers";

interface Props {
  // Option to manually trigger the modal (e.g. from the header button)
  triggerOpen?: boolean;
  onCloseTrigger?: () => void;
}

export default function SupportModal({ triggerOpen = false, onCloseTrigger }: Props) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Sync internal state with external triggerOpen prop
  useEffect(() => {
    if (triggerOpen) {
      setIsOpen(true);
    }
  }, [triggerOpen]);

  useEffect(() => {
    // Only run frequency logic if the modal is NOT opened manually via header trigger
    if (triggerOpen) return;

    try {
      // 1. Check and increment visit count
      const visitCount = Number(localStorage.getItem("support_visit_count") || "0");
      const currentVisits = visitCount + 1;
      localStorage.setItem("support_visit_count", currentVisits.toString());

      // 2. Check last dismissed timestamp (frequency cap of 15 days)
      const lastDismissed = Number(localStorage.getItem("support_modal_dismissed_at") || "0");
      const now = Date.now();
      const daysSinceDismissed = (now - lastDismissed) / (1000 * 60 * 60 * 24);

      // 3. Condition: Show on 2nd visit or more, and only if 15 days have passed since dismissal
      if (currentVisits >= 2 && daysSinceDismissed >= 15) {
        // Subtle 5-second delay after page load so it's not jarring
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("localStorage is not available for tracking visits:", e);
    }
  }, [triggerOpen]);

  const handleDismiss = () => {
    setIsOpen(false);
    if (onCloseTrigger) {
      onCloseTrigger();
    }
    try {
      // Save dismiss time in localStorage (lasts 15 days)
      localStorage.setItem("support_modal_dismissed_at", Date.now().toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleSupportClick = () => {
    window.open(LIVEPIX_URL, "_blank", "noopener,noreferrer");
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-[#111111] border border-zinc-850 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative overflow-hidden flex flex-col items-center text-center z-10"
          >
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffcc00]/[0.02] rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full p-1.5 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Animated heart icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#ffcc00]/10 flex items-center justify-center text-[#ffcc00] mb-5 border border-[#ffcc00]/20 relative">
              <Heart className="w-8 h-8 text-[#ffcc00] fill-[#ffcc00]/10 animate-pulse" />
            </div>

            {/* Content */}
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-tight">
              {t("support_modal_title")}
            </h2>
            
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mt-4 mb-6 font-details">
              {t("support_modal_desc")}
            </p>

            {/* Livepix button */}
            <button
              type="button"
              onClick={handleSupportClick}
              className="w-full py-4 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black uppercase tracking-wider text-xs md:text-sm rounded-2xl transition-all hover:scale-[1.02] active:scale-98 shadow-[0_4px_20px_rgba(255,204,0,0.15)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-black" />
              <span>{t("support_modal_action")}</span>
            </button>

            {/* Sub-text */}
            <span className="text-[10px] text-zinc-550 mt-4 leading-normal font-details">
              A contribuição é totalmente opcional e voluntária. Obrigado pelo apoio!
            </span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
