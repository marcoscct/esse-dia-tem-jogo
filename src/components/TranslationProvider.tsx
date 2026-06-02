"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '@/locales/i18n-utils';
import { translate } from '@/locales/i18n-utils';
import { getTimezoneAbbreviation } from '@/lib/date-utils';

export type TimezoneMode = 'device' | 'brt' | 'stadium';

interface SettingsContextType {
  lang: Language;
  t: (key: string, params?: Record<string, string>) => string;
  timezoneMode: TimezoneMode;
  setTimezoneMode: (mode: TimezoneMode) => void;
  deviceTimezone: string;
  deviceTzAbbr: string;
}

const SettingsContext = createContext<SettingsContextType>({
  lang: 'pt',
  t: (key) => key,
  timezoneMode: 'device',
  setTimezoneMode: () => {},
  deviceTimezone: 'America/Sao_Paulo',
  deviceTzAbbr: 'BRT',
});

export function TranslationProvider({ lang, children }: { lang: Language; children: React.ReactNode }) {
  const t = (key: string, params?: Record<string, string>) => translate(key, lang, params);
  
  const [timezoneMode, setTimezoneModeState] = useState<TimezoneMode>('device');
  const [deviceTimezone, setDeviceTimezone] = useState('America/Sao_Paulo');
  const [deviceTzAbbr, setDeviceTzAbbr] = useState('BRT');

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
    if (saved === 'device' || saved === 'brt' || saved === 'stadium') {
      setTimeout(() => {
        setTimezoneModeState(saved);
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

  return (
    <SettingsContext.Provider value={{
      lang,
      t,
      timezoneMode,
      setTimezoneMode,
      deviceTimezone,
      deviceTzAbbr
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useLanguage() {
  return useContext(SettingsContext);
}
