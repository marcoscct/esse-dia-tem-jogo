"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lock, Unlock, Copy, ExternalLink, Calendar, MessageSquare } from "lucide-react";
import { useLanguage } from "./TranslationProvider";

interface CalendarFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamCode: string;
  teamName: string;
}

export default function CalendarFeedModal({ isOpen, onClose, teamCode, teamName }: CalendarFeedModalProps) {
  const { lang, t } = useLanguage();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [clickTime, setClickTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const unlocked = localStorage.getItem("calendar_unlocked") === "true";
      setTimeout(() => {
        setIsUnlocked(unlocked);
      }, 0);
    }
  }, [isOpen]);

  // Listen to window focus/visibility to check time spent on WhatsApp
  useEffect(() => {
    if (!clickTime) return;

    let checked = false;

    const checkTime = () => {
      if (checked) return;
      checked = true;

      const timeSpentAway = (Date.now() - clickTime) / 1000;
      
      // If spent at least 2.5 seconds, we assume they shared
      if (timeSpentAway >= 2.5) {
        setIsUnlocked(true);
        try {
          localStorage.setItem("calendar_unlocked", "true");
        } catch (err) {
          console.warn("Failed to write calendar_unlocked to localStorage:", err);
        }
        setClickTime(null);
      } else {
        alert(t("share_whatsapp_invalid_duration") || "Por favor, conclua o compartilhamento no WhatsApp para liberar a agenda completa!");
        setClickTime(null);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkTime();
      }
    };

    const handleFocus = () => {
      checkTime();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [clickTime, t]);

  if (!isOpen) return null;

  // Build URLs
  const origin = typeof window !== "undefined" ? window.location.origin : "https://essediatemjogo.com.br";
  
  // Dynamic Webcal and HTTPS links
  const feedUrl = `${origin}/api/calendar/${teamCode.toLowerCase()}?lang=${lang}`;
  const webcalUrl = feedUrl.replace(/^https?:/, "webcal:");
  const googleCalUrl = `https://www.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl)}`;

  const handleShareClick = () => {
    const defaultText = lang === 'en'
      ? `Hey, subscribe to this 2026 World Cup calendar that updates itself as teams advance! It's free and helps you avoid scheduling conflicts on game days: ${origin}/en`
      : lang === 'es'
      ? `¡Mira, suscríbete a este calendario del Mundial 2026 que se actualiza solo si la selección pasa de fase! Es gratis y te ayuda a evitar programar eventos: ${origin}/es`
      : `Cara, assina essa agenda da Copa do Mundo 2026 que se auto-atualiza se a seleção passar de fase! É grátis e ajuda a não marcar nada em dia de jogo: ${origin}`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultText)}`;
    window.open(whatsappUrl, "_blank");
    setClickTime(Date.now());
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative bg-zinc-950 border border-zinc-900 rounded-3xl w-full max-w-md p-6 overflow-hidden shadow-2xl z-10 flex flex-col gap-5 text-center"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#ffcc00]" />
              <span className="font-black text-sm uppercase tracking-wider text-zinc-200">
                {t("calendar_feed_title") || "Assinar Agenda Completa"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-zinc-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Icon Badge */}
          <div className="flex justify-center my-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${isUnlocked ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-[#ffcc00]/10 border-[#ffcc00]/30 text-[#ffcc00]"}`}>
              {isUnlocked ? <Unlock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-black text-white">
              {isUnlocked 
                ? (t("calendar_feed_unlocked_title") || "Agenda Liberada!") 
                : (t("calendar_feed_locked_title") || `Agenda do ${teamName}`)}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed px-2 font-details">
              {isUnlocked
                ? (t("calendar_feed_unlocked_desc") || "Escolha seu aplicativo de preferência abaixo para se inscrever e receber atualizações em tempo real.")
                : (t("calendar_feed_locked_desc") || "Receba todos os jogos da seleção direto na agenda do seu celular. Os horários e adversários de fases eliminatórias se auto-atualizam ou são cancelados conforme os resultados reais.")}
            </p>
          </div>

          {/* Body Content */}
          <div className="mt-2 flex flex-col gap-3">
            {!isUnlocked ? (
              /* Locked Flow */
              <div className="flex flex-col gap-4">
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 text-xs text-zinc-400 text-left flex flex-col gap-2 font-details">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#ffcc00]" />
                    <span>{t("calendar_feed_feature_1") || "Sincronização 100% Automática"}</span>
                  </span>
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#ffcc00]" />
                    <span>{t("calendar_feed_feature_2") || "Atualizações de adversários pós fase de grupos"}</span>
                  </span>
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#ffcc00]" />
                    <span>{t("calendar_feed_feature_3") || "Auto-cancelamento se o time for eliminado"}</span>
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#ffcc00]">
                    {t("calendar_feed_action_text") || "Compartilhe no WhatsApp para liberar"}
                  </span>
                  <button
                    onClick={handleShareClick}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg shadow-emerald-900/20"
                  >
                    <MessageSquare className="w-5 h-5 fill-white" />
                    <span>{t("share_whatsapp_unlock_btn") || "Compartilhar no WhatsApp"}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Unlocked Flow */
              <div className="flex flex-col gap-2.5">
                {/* Google Calendar Link */}
                <a
                  href={googleCalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 w-full px-4 py-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">{t("google_calendar") || "Google Agenda"}</span>
                      <span className="text-[9px] text-zinc-400 font-details">{t("subscribe_google_desc") || "Inscrição direta em um clique"}</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-zinc-400" />
                </a>

                {/* Webcal standard link */}
                <a
                  href={webcalUrl}
                  className="flex items-center justify-between gap-4 w-full px-4 py-3.5 bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#ffcc00]/10 text-[#ffcc00] group-hover:bg-[#ffcc00]/20 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">{t("webcal_subscribe_btn") || "iPhone / Mac / Outlook"}</span>
                      <span className="text-[9px] text-zinc-400 font-details">{t("subscribe_webcal_desc") || "Abre o app nativo do seu aparelho"}</span>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-zinc-400" />
                </a>

                {/* Copy URL feed */}
                <button
                  onClick={handleCopyUrl}
                  className="flex items-center justify-between gap-4 w-full px-4 py-3.5 bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 rounded-2xl transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-white">
                        {copied ? (t("copied") || "Copiado!") : (t("copy_feed_url_btn") || "Copiar link do calendário")}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-details">{t("copy_feed_url_desc") || "Para adicionar manualmente no app"}</span>
                    </div>
                  </div>
                  <Copy className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
