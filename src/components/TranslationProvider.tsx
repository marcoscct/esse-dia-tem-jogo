"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/locales/i18n-utils';
import { translate } from '@/locales/i18n-utils';
import { getTimezoneAbbreviation } from '@/lib/date-utils';

export type TimezoneMode = 'device' | 'brt' | 'stadium' | 'custom';

interface SettingsContextType {
  lang: Language;
  t: (key: string, params?: Record<string, string>) => string;
  timezoneMode: TimezoneMode;
  setTimezoneMode: (mode: TimezoneMode) => void;
  customTimezone: string;
  setCustomTimezone: (tz: string) => void;
  deviceTimezone: string;
  deviceTzAbbr: string;
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  lang: 'pt',
  t: (key) => key,
  timezoneMode: 'device',
  setTimezoneMode: () => {},
  customTimezone: 'America/Sao_Paulo',
  setCustomTimezone: () => {},
  deviceTimezone: 'America/Sao_Paulo',
  deviceTzAbbr: 'BRT',
  compactMode: false,
  setCompactMode: () => {},
});

export function TranslationProvider({ lang, children }: { lang: Language; children: React.ReactNode }) {
  const t = (key: string, params?: Record<string, string>) => translate(key, lang, params);
  
  const [timezoneMode, setTimezoneModeState] = useState<TimezoneMode>('device');
  const [customTimezone, setCustomTimezoneState] = useState('America/Sao_Paulo');
  const [deviceTimezone, setDeviceTimezone] = useState('America/Sao_Paulo');
  const [deviceTzAbbr, setDeviceTzAbbr] = useState('BRT');
  const [compactModeState, setCompactModeState] = useState(false);

  useEffect(() => {
    // Detect device timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
      const abbr = getTimezoneAbbreviation(tz);
      setTimeout(() => {
        setDeviceTimezone(tz);
        setDeviceTzAbbr(abbr || 'GMT');
      }, 0);
    } catch (err) {
      console.warn("Failed to resolve device timezone:", err);
    }

    // Load from localStorage
    const saved = localStorage.getItem("timezoneMode");
    if (saved === 'device' || saved === 'brt' || saved === 'stadium' || saved === 'custom') {
      setTimeout(() => {
        setTimezoneModeState(saved);
      }, 0);
    }

    const savedCustomTz = localStorage.getItem("customTimezone");
    if (savedCustomTz) {
      setTimeout(() => {
        setCustomTimezoneState(savedCustomTz);
      }, 0);
    } else {
      // Fallback to resolved timezone on mount if not saved
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) {
          setTimeout(() => {
            setCustomTimezoneState(tz);
          }, 0);
        }
      } catch {}
    }

    const savedCompact = localStorage.getItem("compactMode");
    if (savedCompact !== null) {
      setTimeout(() => {
        setCompactModeState(savedCompact === 'true');
      }, 0);
    }
  }, []);

  const setTimezoneMode = (mode: TimezoneMode) => {
    setTimezoneModeState(mode);
    try {
      localStorage.setItem("timezoneMode", mode);
    } catch (err) {
      console.warn("Failed to save timezoneMode to localStorage:", err);
    }
  };

  const setCustomTimezone = (tz: string) => {
    setCustomTimezoneState(tz);
    try {
      localStorage.setItem("customTimezone", tz);
    } catch (err) {
      console.warn("Failed to save customTimezone to localStorage:", err);
    }
  };

  const setCompactMode = (v: boolean) => {
    setCompactModeState(v);
    try {
      localStorage.setItem("compactMode", v.toString());
    } catch (err) {
      console.warn("Failed to save compactMode to localStorage:", err);
    }
  };

  return (
    <SettingsContext.Provider value={{
      lang,
      t,
      timezoneMode,
      setTimezoneMode,
      customTimezone,
      setCustomTimezone,
      deviceTimezone,
      deviceTzAbbr,
      compactMode: compactModeState,
      setCompactMode
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useLanguage() {
  return useContext(SettingsContext);
}
