"use client";

import React, { createContext, useContext } from 'react';
import type { Language } from '@/locales/i18n-utils';
import { translate } from '@/locales/i18n-utils';

const LanguageContext = createContext<{
  lang: Language;
  t: (key: string, params?: Record<string, string>) => string;
}>({
  lang: 'pt',
  t: (key) => key,
});

export function TranslationProvider({ lang, children }: { lang: Language; children: React.ReactNode }) {
  const t = (key: string, params?: Record<string, string>) => translate(key, lang, params);

  return (
    <LanguageContext.Provider value={{ lang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
