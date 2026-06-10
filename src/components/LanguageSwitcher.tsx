"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getLanguagePath } from "@/locales/i18n-utils";
import { useLanguage } from "./TranslationProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (targetLang: 'pt' | 'en' | 'es') => {
    if (targetLang === lang) return;
    const newPath = getLanguagePath(pathname || "/", targetLang);
    router.push(newPath);
  };

  const languages = [
    { code: "pt", shortLabel: "PT", fullLabel: "Português", flag: "🇧🇷" },
    { code: "en", shortLabel: "EN", fullLabel: "English", flag: "🇺🇸" },
    { code: "es", shortLabel: "ES", fullLabel: "Español", flag: "🇪🇸" },
  ] as const;

  const activeLanguage = languages.find((l) => l.code === lang) || languages[0];

  return (
    <div className="relative">
      {/* Mobile Selector: Rounded Button with current flag */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-10 h-10 rounded-full bg-[#111111]/90 backdrop-blur-md border border-zinc-800 flex items-center justify-center text-lg shadow-lg hover:border-zinc-700 active:scale-95 transition-all cursor-pointer"
      >
        <span className="leading-none select-none">{activeLanguage.flag}</span>
      </button>

      {/* Mobile Dropdown Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click Outside overlay */}
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu options */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-12 z-50 bg-[#111111]/95 backdrop-blur-md border border-zinc-800 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 min-w-[140px] md:hidden"
            >
              {languages.map((l) => {
                const isActive = l.code === lang;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      handleLanguageChange(l.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#ffcc00] text-black font-black"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                    }`}
                  >
                    <span className="text-base leading-none select-none">{l.flag}</span>
                    <span className="normal-case font-bold">{l.fullLabel}</span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Selector: Inline horizontal menu */}
      <div className="hidden md:flex items-center gap-1 bg-[#111111]/80 backdrop-blur-md border border-zinc-800 rounded-full p-1 shadow-lg">
        {languages.map((l) => {
          const isActive = l.code === lang;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => handleLanguageChange(l.code)}
              className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-[#ffcc00] text-black shadow-[0_0_12px_rgba(255,204,0,0.2)] scale-105"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/55"
              }`}
            >
              <span className="font-bold normal-case tracking-normal px-0.5">
                {l.fullLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
