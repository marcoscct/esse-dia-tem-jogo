import type { Metadata } from "next";
import { Kanit, Inter, Krona_One } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";

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

const kronaOne = Krona_One({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-krona",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Esse Dia Tem Jogo?",
  description: "Descubra se seu time ou seleção joga na data que você escolher.",
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://www.essediatemjogo.com.br"),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
      "en": "/en",
      "es": "/es",
    },
  },
  openGraph: {
    type: "website",
    url: "https://www.essediatemjogo.com.br",
    title: "Esse Dia Tem Jogo?",
    description: "Descubra se seu time ou seleção joga na data que você escolher.",
    siteName: "Esse Dia Tem Jogo",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Esse Dia Tem Jogo",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html
      lang="pt-BR"
      className={`${kanit.variable} ${inter.variable} ${kronaOne.variable} h-full antialiased`}
    >
      <head>
        {/* Structured Data (Schema.org WebApplication) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "WebApplication",
              "name": "Esse Dia Tem Jogo?",
              "description": "Descubra se seu time ou seleção joga na data que você escolher. Evite marcar compromissos importantes no mesmo horário de confrontos cruciais da sua seleção ou time favorito.",
              "url": "https://www.essediatemjogo.com.br/",
              "image": "https://www.essediatemjogo.com.br/logo.webp",
              "screenshot": [
                "https://www.essediatemjogo.com.br/logo.webp"
              ],
              "applicationCategory": "SportsApplication",
              "author": {
                "@type": "Person",
                "name": "Marcos Castro",
                "url": "https://x.com/marcoscastro"
              },
              "offers": {
                "@type": "Offer",
                "price": 0,
                "category": "free"
              }
            })
          }}
        />

        <ThirdPartyScripts />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#050505] text-white relative">
        {/* Meta Pixel fallback for browsers without JavaScript */}
        {metaPixelId && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
