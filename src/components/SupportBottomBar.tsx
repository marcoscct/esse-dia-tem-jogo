"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "./TranslationProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { LIVEPIX_URL } from "./SupportModal";

export default function SupportBottomBar() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      // 1. Get visit count
      const visitCount = Number(localStorage.getItem("support_visit_count") || "0");

      // 2. Check last dismissed time (frequency cap of 7 days)
      const lastDismissed = Number(localStorage.getItem("support_bar_dismissed_at") || "0");
      const now = Date.now();
      const daysSinceDismissed = (now - lastDismissed) / (1000 * 60 * 60 * 24);

      // 3. Show on 2nd visit or more, and only if 7 days have passed since closing it
      if (visitCount >= 2 && daysSinceDismissed >= 7) {
        // Delay showing it for 8 seconds so it rolls in smoothly after page interaction
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 8000);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("localStorage is not available for tracking:", e);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("support_bar_dismissed_at", Date.now().toString());
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
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 bg-[#111111]/95 backdrop-blur-md border border-zinc-850 p-4 rounded-2xl shadow-2xl flex items-start gap-3 relative overflow-hidden"
        >
          {/* Subtle colored border top line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#ffcc00]/20" />

          {/* Heart icon container */}
          <div className="w-8 h-8 rounded-lg bg-[#ffcc00]/10 flex items-center justify-center text-[#ffcc00] shrink-0 border border-[#ffcc00]/20 mt-0.5">
            <Heart className="w-4 h-4 fill-current" />
          </div>

          {/* Text and Actions */}
          <div className="flex-1 flex flex-col gap-2.5">
            <p className="text-zinc-300 text-xs font-bold leading-relaxed pr-6">
              {t("support_desc")}
            </p>
            
            <button
              type="button"
              onClick={handleSupportClick}
              className="py-2 px-3 bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black uppercase tracking-wider text-[10px] rounded-lg transition-colors inline-flex items-center gap-1.5 self-start cursor-pointer"
            >
              <Heart className="w-3 h-3 fill-black" />
              <span>{t("support_button")}</span>
            </button>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-0.5 rounded-md hover:bg-zinc-900"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
