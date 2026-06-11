"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Heart } from "lucide-react";
import { useLanguage } from "./TranslationProvider";
import SupportModal from "./SupportModal";

const LanguageSwitcher = dynamic(() => import("./LanguageSwitcher"), { ssr: false });
const SettingsPanel = dynamic(() => import("./SettingsPanel"), { ssr: false });

export default function HeaderControls() {
  const { t } = useLanguage();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end gap-2.5">
      <LanguageSwitcher />
      
      {/* Support / PIX Button */}
      <button
        type="button"
        onClick={() => setIsSupportOpen(true)}
        className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-[#111111]/80 backdrop-blur-md border border-zinc-800 rounded-full text-xs font-black uppercase tracking-wider text-white hover:text-[#ffcc00] hover:border-[#ffcc00]/40 hover:bg-[#ffcc00]/5 transition-all cursor-pointer group shadow-lg"
      >
        <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20 group-hover:fill-red-500 group-hover:scale-110 transition-all" />
        <span>{t("support") || "Apoiar"}</span>
      </button>

      <button
        type="button"
        onClick={() => setIsSupportOpen(true)}
        className="md:hidden w-10 h-10 rounded-full bg-[#111111]/90 backdrop-blur-md border border-zinc-800 flex items-center justify-center shadow-lg hover:border-zinc-700 active:scale-95 transition-all cursor-pointer group"
        aria-label="Apoiar"
      >
        <Heart className="w-5 h-5 text-red-500 fill-red-500/10 group-hover:scale-110 group-hover:fill-red-500 transition-all" />
      </button>

      <SettingsPanel />

      {/* Support Modal triggered by header click */}
      <SupportModal triggerOpen={isSupportOpen} onCloseTrigger={() => setIsSupportOpen(false)} />
    </div>
  );
}
