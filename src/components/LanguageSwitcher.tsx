"use client";

import { usePathname, useRouter } from "next/navigation";
import { getLanguagePath } from "@/locales/i18n-utils";
import { useLanguage } from "./TranslationProvider";

export default function LanguageSwitcher() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (targetLang: 'pt' | 'en' | 'es') => {
    if (targetLang === lang) return;
    const newPath = getLanguagePath(pathname || "/", targetLang);
    router.push(newPath);
  };

  const languages = [
    { code: "pt", label: "PT", flag: "🇧🇷" },
    { code: "en", label: "EN", flag: "🇺🇸" },
    { code: "es", label: "ES", flag: "🇪🇸" },
  ] as const;

  return (
    <div className="flex items-center gap-1.5 bg-[#111111] border border-zinc-800 rounded-full p-1 shadow-inner max-w-fit">
      {languages.map((l) => {
        const isActive = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => handleLanguageChange(l.code)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              isActive
                ? "bg-[#ffcc00] text-black shadow-[0_0_12px_rgba(255,204,0,0.3)] scale-105"
                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <span className="text-sm md:text-base leading-none">{l.flag}</span>
            <span>{l.label}</span>
          </button>
        );
      })}
    </div>
  );
}
