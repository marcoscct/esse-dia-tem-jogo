import { Kanit, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import { TranslationProvider } from "@/components/TranslationProvider";
import HeaderControls from "@/components/HeaderControls";
import type { Language } from "@/locales/i18n-utils";

const kanit = Kanit({
  weight: ["700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-kanit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

interface Props {
  children: React.ReactNode;
  lang: Language;
}

export default function LocalizedLayout({ children, lang }: Props) {
  return (
    <div className={`${kanit.variable} ${inter.variable} min-h-screen font-sans bg-[#050505] text-white relative`}>
      <TranslationProvider lang={lang}>
        <HeaderControls />
        {children}
      </TranslationProvider>
      <Analytics />
    </div>
  );
}
