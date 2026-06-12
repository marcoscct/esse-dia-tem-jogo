"use client";

import { useState, useMemo } from "react";
import { useLanguage, type TimezoneMode } from "./TranslationProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Check, Clock, Globe } from "lucide-react";

const COMMON_TIMEZONES = [
  { value: 'America/Sao_Paulo', labelPt: 'Brasília (BRT)', labelEn: 'Brasília (BRT)', labelEs: 'Brasilia (BRT)' },
  { value: 'America/New_York', labelPt: 'Nova York (EST/EDT)', labelEn: 'New York (EST/EDT)', labelEs: 'Nueva York (EST/EDT)' },
  { value: 'America/Los_Angeles', labelPt: 'Los Angeles (PST/PDT)', labelEn: 'Los Angeles (PST/PDT)', labelEs: 'Los Ángeles (PST/PDT)' },
  { value: 'America/Mexico_City', labelPt: 'Cidade do México (CST)', labelEn: 'Mexico City (CST)', labelEs: 'Ciudad de México (CST)' },
  { value: 'America/Argentina/Buenos_Aires', labelPt: 'Buenos Aires (ART)', labelEn: 'Buenos Aires (ART)', labelEs: 'Buenos Aires (ART)' },
  { value: 'America/Bogota', labelPt: 'Bogotá (COT)', labelEn: 'Bogotá (COT)', labelEs: 'Bogotá (COT)' },
  { value: 'America/Santiago', labelPt: 'Santiago (CLT)', labelEn: 'Santiago (CLT)', labelEs: 'Santiago (CLT)' },
  { value: 'Europe/London', labelPt: 'Londres (GMT/BST)', labelEn: 'London (GMT/BST)', labelEs: 'Londres (GMT/BST)' },
  { value: 'Europe/Madrid', labelPt: 'Madri (CET/CEST)', labelEn: 'Madrid (CET/CEST)', labelEs: 'Madrid (CET/CEST)' },
  { value: 'Europe/Lisbon', labelPt: 'Lisboa (WET/WEST)', labelEn: 'Lisbon (WET/WEST)', labelEs: 'Lisboa (WET/WEST)' },
  { value: 'Europe/Paris', labelPt: 'Paris (CET/CEST)', labelEn: 'Paris (CET/CEST)', labelEs: 'París (CET/CEST)' },
  { value: 'Asia/Tokyo', labelPt: 'Tóquio (JST)', labelEn: 'Tokyo (JST)', labelEs: 'Tokio (JST)' },
  { value: 'Asia/Seoul', labelPt: 'Seul (KST)', labelEn: 'Seoul (KST)', labelEs: 'Seúl (KST)' },
  { value: 'Australia/Sydney', labelPt: 'Sydney (AEST)', labelEn: 'Sydney (AEST)', labelEs: 'Sídney (AEST)' },
];

function getTimezoneOffsetMinutes(timezone: string): number {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(date);
    const getVal = (type: string) => Number(parts.find(p => p.type === type)!.value);
    
    const y = getVal('year');
    const m = getVal('month');
    const d = getVal('day');
    const hr = getVal('hour');
    const min = getVal('minute');
    const sec = getVal('second');
    
    const tzUtc = Date.UTC(y, m - 1, d, hr, min, sec);
    const actualUtc = date.getTime();
    
    return Math.round((tzUtc - actualUtc) / 60000);
  } catch {
    return 0;
  }
}

function formatOffset(offsetMinutes: number): string {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hours = String(Math.floor(abs / 60)).padStart(2, '0');
  const minutes = String(abs % 60).padStart(2, '0');
  return `GMT${sign}${hours}:${minutes}`;
}

export default function SettingsPanel() {
  const { lang, t, timezoneMode, setTimezoneMode, deviceTzAbbr, customTimezone, setCustomTimezone, deviceTimezone, compactMode, setCompactMode } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    {
      id: "device",
      label: t("timezone_mode_device") || "Seu Aparelho",
      desc: deviceTzAbbr ? `UTC ${deviceTzAbbr.startsWith('-') || deviceTzAbbr.startsWith('+') ? deviceTzAbbr : `(${deviceTzAbbr})`}` : "",
      icon: <Clock className="w-4 h-4 text-zinc-400" />
    },
    {
      id: "brt",
      label: t("timezone_mode_brt") || "Brasília (BRT)",
      desc: "UTC-3",
      icon: <Globe className="w-4 h-4 text-zinc-400" />
    },
    {
      id: "stadium",
      label: t("timezone_mode_stadium") || "Estádio (Local)",
      desc: t("timezone_mode_stadium_desc") || "Fuso do local do jogo",
      icon: <Globe className="w-4 h-4 text-zinc-400" />
    },
    {
      id: "custom",
      label: t("timezone_mode_custom") || "Personalizado",
      desc: t("timezone_mode_custom_desc") || "Escolha qualquer fuso",
      icon: <Clock className="w-4 h-4 text-zinc-400" />
    }
  ] as const;

  const popularOptions = useMemo(() => {
    const popular = [...COMMON_TIMEZONES];
    if (deviceTimezone && !popular.some(opt => opt.value === deviceTimezone)) {
      popular.unshift({
        value: deviceTimezone,
        labelPt: `Local (${deviceTzAbbr})`,
        labelEn: `Local (${deviceTzAbbr})`,
        labelEs: `Local (${deviceTzAbbr})`,
      });
    }
    return popular;
  }, [deviceTimezone, deviceTzAbbr]);

  const timezoneOptions = useMemo(() => {
    let supportedTimezones: string[] = [];
    try {
      supportedTimezones = Intl.supportedValuesOf('timeZone');
    } catch {
      supportedTimezones = COMMON_TIMEZONES.map(z => z.value);
    }

    const zones = supportedTimezones.map(tz => {
      const offsetMin = getTimezoneOffsetMinutes(tz);
      const formatted = formatOffset(offsetMin);
      return {
        value: tz,
        offsetMinutes: offsetMin,
        label: `(${formatted}) ${tz.replace(/_/g, ' ')}`,
      };
    });

    zones.sort((a, b) => {
      if (a.offsetMinutes !== b.offsetMinutes) {
        return a.offsetMinutes - b.offsetMinutes;
      }
      return a.value.localeCompare(b.value);
    });

    return zones;
  }, []);

  return (
    <div className="relative">
      {/* Settings Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[#111111]/90 backdrop-blur-md border border-zinc-800 flex items-center justify-center shadow-lg hover:border-zinc-700 hover:text-[#ffcc00] active:scale-95 transition-all cursor-pointer group"
        aria-label="Configurações"
      >
        <Settings className={`w-5 h-5 transition-transform duration-500 text-zinc-400 group-hover:text-[#ffcc00] ${isOpen ? "rotate-90 text-[#ffcc00]" : ""}`} />
      </button>

      {/* Settings Panel Modal with Animation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click Outside overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-12 z-50 bg-[#111111]/95 backdrop-blur-md border border-zinc-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 min-w-[280px] w-80 max-w-[calc(100vw-2rem)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="font-black text-sm uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#ffcc00]" />
                  <span>{t("settings_title") || "Configurações"}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Display Mode Selection Section */}
              <div className="flex flex-col gap-2.5 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ffcc00]">
                  {t("display_mode_title") || "Exibição dos Jogos"}
                </span>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setCompactMode(!compactMode)}
                    className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      compactMode
                        ? "bg-[#ffcc00]/10 border-[#ffcc00]/30 text-white shadow-[0_0_15px_rgba(255,204,0,0.05)]"
                        : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/50 hover:text-white hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold">{t("display_mode_compact") || "Versão Resumida"}</span>
                        <span className="text-[9px] text-zinc-400 font-medium leading-none mt-0.5 font-details">
                          {t("display_mode_compact_desc") || "Ocultar agenda e transmissão"}
                        </span>
                      </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${compactMode ? "bg-[#ffcc00]" : "bg-zinc-800"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${compactMode ? "translate-x-4" : "translate-x-0"}`} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Timezone Selection Section */}
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ffcc00]">
                  {t("timezone_section_title") || "Exibição de Horários"}
                </span>

                <div className="flex flex-col gap-2">
                  {options.map((opt) => {
                    const isActive = timezoneMode === opt.id;
                    return (
                      <div key={opt.id} className="flex flex-col gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setTimezoneMode(opt.id as TimezoneMode);
                          }}
                          className={`flex items-center justify-between gap-3 w-full px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#ffcc00]/10 border-[#ffcc00]/30 text-white shadow-[0_0_15px_rgba(255,204,0,0.05)]"
                              : "bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/50 hover:text-white hover:border-zinc-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${isActive ? "bg-[#ffcc00]/25 text-[#ffcc00]" : "bg-zinc-900"}`}>
                              {opt.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{opt.label}</span>
                              {opt.desc && (
                                <span className="text-[9px] text-zinc-400 font-medium leading-none mt-0.5 font-details">
                                  {opt.desc}
                                </span>
                              )}
                            </div>
                          </div>
                          {isActive && (
                            <Check className="w-4 h-4 text-[#ffcc00] shrink-0" />
                          )}
                        </button>

                        {isActive && opt.id === 'custom' && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-2 pb-1"
                          >
                            <select
                              value={customTimezone}
                              onChange={(e) => setCustomTimezone(e.target.value)}
                              className="w-full bg-zinc-950 text-xs text-zinc-300 font-bold border border-zinc-850 rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#ffcc00] focus:ring-1 focus:ring-[#ffcc00]/20 cursor-pointer font-details"
                            >
                              <optgroup label={t("timezone_group_popular") || "Populares"}>
                                {popularOptions.map((tz) => {
                                  const offsetMin = getTimezoneOffsetMinutes(tz.value);
                                  const formatted = formatOffset(offsetMin);
                                  const label = lang === 'en' ? tz.labelEn : lang === 'es' ? tz.labelEs : tz.labelPt;
                                  return (
                                    <option key={`pop-${tz.value}`} value={tz.value}>
                                      {`(${formatted}) ${label}`}
                                    </option>
                                  );
                                })}
                              </optgroup>
                              <optgroup label={t("timezone_group_all") || "Todos os Fusos"}>
                                {timezoneOptions.map((tz) => (
                                  <option key={`all-${tz.value}`} value={tz.value}>
                                    {tz.label}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
