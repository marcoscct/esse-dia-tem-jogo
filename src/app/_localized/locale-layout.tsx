import { Kanit, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "../globals.css";
import { TranslationProvider } from "@/components/TranslationProvider";
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
    <div className={`${kanit.variable} ${inter.variable} h-full font-sans bg-[#050505] text-white`}>
      <TranslationProvider lang={lang}>
        {children}
      </TranslationProvider>
      <Analytics />
    </div>
  );
}
