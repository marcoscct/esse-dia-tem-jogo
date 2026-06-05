import { Kanit, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import { TranslationProvider } from "@/components/TranslationProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SettingsPanel from "@/components/SettingsPanel";
import type { Language } from "@/locales/i18n-utils";

const kanit = Kanit({
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-kanit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface Props {
  children: React.ReactNode;
  lang: Language;
}

export default function LocalizedLayout({ children, lang }: Props) {
  return (
    <div className={`${kanit.variable} ${inter.variable} min-h-screen font-sans bg-[#050505] text-white relative`}>
      <TranslationProvider lang={lang}>
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end gap-2.5">
          <LanguageSwitcher />
          <SettingsPanel />
        </div>
        {children}
      </TranslationProvider>
      <Analytics />
    </div>
  );
}
