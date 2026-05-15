import type { Metadata } from "next";
import { Kanit, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Esse Dia Tem Jogo?",
  description: "Descubra se sua seleção joga na data que você escolher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${kanit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}
