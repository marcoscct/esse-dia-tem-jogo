import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import Image from "next/image";
import type { Language } from "@/locales/i18n-utils";

interface Props {
  lang: Language;
}

const content = {
  pt: {
    back: "Voltar para o Início",
    title: "Contato & Suporte",
    technical_intro: "Canal oficial de comunicação do Esse Dia Tem Jogo. Entre em contato para suporte técnico, sugestões de tabelas ou parcerias comerciais.",
    about_author_title: "👤 Quem Criou?",
    about_author_desc: "Marcos Castro é um dos mais versáteis comediantes brasileiros, combinando talento para o stand-up, a música e a criação de conteúdos digitais. Mestre em Matemática Aplicada pela UFRJ, estreou no grupo Comédia em Pé em 2007 e chegou à final do quadro Quem Chega Lá, no Domingão do Faustão, em 2008, o que alavancou sua carreira. Em 2011, fundou com o irmão Matheus Castro e sua esposa Luciana D'Aulizio o canal Castro Brothers, que já ultrapassou 5,5 milhões de inscritos e se tornou referência em quadros de humor, paródias musicais, esquetes e no viral quadro UTC – Ultimate Trocadilho Championship. Criador de “Um Joystick, Um Violão” e do game musical A Lenda do Herói, em que dublou todas as faixas do protagonista, Marcos alia improviso, efeitos sonoros e interação com o público em seus shows de stand-up musical.",
    creators_label: "Castro Brothers",
    email_label: "E-mail de Contato",
    socials_label: "Nossas Redes Sociais",
    youtube_sub: "Mais de 4 milhões de inscritos no YouTube",
    instagram_sub: "Acompanhe nossos bastidores no Instagram",
    twitter_sub: "Fale conosco no X / Twitter",
    footer: "Esse Dia Tem Jogo © 2026. Todos os direitos reservados."
  },
  en: {
    back: "Back to Home",
    title: "Contact & Support",
    technical_intro: "Official communication channel for Is There a Game Today. Contact us for technical support, schedule suggestions, or business partnerships.",
    about_author_title: "👤 Who Created It?",
    about_author_desc: "Marcos Castro is one of the most versatile Brazilian comedians, combining talent for stand-up, music, and digital content creation. With a Master's degree in Applied Mathematics from UFRJ, he debuted in the group Comédia em Pé in 2007 and reached the final of the segment Quem Chega Lá on Domingão do Faustão in 2008, launching his career. In 2011, alongside his brother Matheus Castro and his wife Luciana D'Aulizio, he founded the Castro Brothers channel, which has surpassed 5.5 million subscribers and has become a reference in comedy sketches, musical parodies, and the viral segment UTC – Ultimate Trocadilho Championship. Creator of “Um Joystick, Um Violão” and the musical game A Lenda do Herói, where he voiced all of the protagonist's tracks, Marcos combines improvisation, sound effects, and audience interaction in his musical stand-up shows.",
    creators_label: "Castro Brothers",
    email_label: "Contact Email",
    socials_label: "Our Social Media",
    youtube_sub: "Over 4 million subscribers on YouTube",
    instagram_sub: "Follow our updates on Instagram",
    twitter_sub: "Talk to us on X / Twitter",
    footer: "Is There a Game Today © 2026. All rights reserved."
  },
  es: {
    back: "Volver al Inicio",
    title: "Contacto & Soporte",
    technical_intro: "Canal oficial de comunicación de ¿Este Día Hay Partido?. Contáctanos para soporte técnico, sugerencias de calendarios o alianzas comerciales.",
    about_author_title: "👤 ¿Quién lo Creó?",
    about_author_desc: "Marcos Castro es uno de los comediantes brasileños más versátiles, combinando su talento para el stand-up, la música y la creación de contenidos digitales. Máster en Matemáticas Aplicadas por la UFRJ, debutó en el grupo Comédia em Pé en 2007 y llegó a la final de la sección Quem Chega Lá en Domingão del Faustão en 2008, impulsando su carrera. En 2011 fundó junto a su hermano Matheus Castro y su esposa Luciana D'Aulizio el canal Castro Brothers, que ya supera los 5,5 millones de suscriptores y se ha convertido en un referente en comedias, parodias musicales y el segmento viral UTC – Ultimate Trocadilho Championship. Creador de “Um Joystick, Um Violão” y del juego musical A Lenda do Herói, donde dio voz a todos los temas del protagonista, Marcos une la improvisación, los efectos de sonido y la interacción del público en sus espectáculos de stand-up musical.",
    creators_label: "Castro Brothers",
    email_label: "Correo Electrónico",
    socials_label: "Nuestras Redes Sociales",
    youtube_sub: "Más de 4 millones de suscriptores en YouTube",
    instagram_sub: "Sigue nuestro día a día en Instagram",
    twitter_sub: "Escríbenos en X / Twitter",
    footer: "¿Este Día Hay Partido? © 2026. Todos los derechos reservados."
  }
};

export default function LocalizedContactPage({ lang }: Props) {
  const t = content[lang];
  const langPrefix = lang === "pt" ? "" : `/${lang}`;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#ffcc00] selection:text-black">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <Link href={langPrefix || "/"} className="inline-flex items-center gap-2 text-sm text-[#ffcc00] hover:text-[#e6b800] transition-colors mb-6 self-start md:self-center font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>
          <div className="w-24 h-24 mb-4">
            <Image
              src="/logo.png"
              alt="Esse Dia Tem Jogo?"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
            {t.title}
          </h1>
          <div className="w-12 h-1 bg-[#ffcc00] rounded-full mt-3"></div>
        </div>

        {/* Content Box */}
        <div className="bg-[#111111] rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-2xl space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
          
          {/* Intro Técnico */}
          <section className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl border-l-4 border-l-[#ffcc00]">
            <p className="font-sans font-bold text-white text-xs md:text-sm leading-relaxed">
              {t.technical_intro}
            </p>
          </section>

          {/* Perfil Humano / Autoridade */}
          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide">
              {t.about_author_title}
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-zinc-950 border border-zinc-900 rounded-2xl">
              {/* Foto de Marcos Castro */}
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#ffcc00]/20 shrink-0 bg-zinc-900 flex items-center justify-center relative">
                <Image
                  src="/marcos.png"
                  alt="Marcos Castro"
                  fill
                  className="object-cover object-top"
                  sizes="96px"
                  priority
                />
              </div>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs text-zinc-550 block font-bold uppercase tracking-widest">{t.creators_label}</span>
                <p className="text-zinc-350 text-xs md:text-sm leading-relaxed">
                  {t.about_author_desc}
                </p>
              </div>
            </div>
          </section>

          {/* E-mail de Contato */}
          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
              ✉️ {t.email_label}
            </h2>
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-900 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#ffcc00]/10 rounded-xl flex items-center justify-center text-[#ffcc00] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-zinc-550 block font-bold uppercase tracking-wider">{t.email_label}</span>
                <a href="mailto:contato@essediatemjogo.com.br" className="text-white hover:text-[#ffcc00] font-display font-bold text-base md:text-lg transition-colors">
                  contato@essediatemjogo.com.br
                </a>
              </div>
            </div>
          </section>

          {/* Redes Sociais */}
          <section className="space-y-4">
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
              🔗 {t.socials_label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a 
                href="https://www.youtube.com/castrobrothers" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <svg className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507A3.003 3.003 0 0 0 .503 6.163C0 8.04 0 12 0 12s0 3.959.503 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.96 24 12 24 12s0-3.959-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="font-bold text-sm text-white uppercase">YouTube</span>
                <span className="text-[10px] text-zinc-500">{t.youtube_sub}</span>
              </a>

              <a 
                href="https://www.instagram.com/castrobrothers" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <svg className="w-8 h-8 text-pink-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
                <span className="font-bold text-sm text-white uppercase">Instagram</span>
                <span className="text-[10px] text-zinc-500">{t.instagram_sub}</span>
              </a>

              <a 
                href="https://x.com/marcoscastro" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-all flex flex-col items-center text-center gap-2 group"
              >
                <svg className="w-8 h-8 text-sky-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="font-bold text-sm text-white uppercase">X / Twitter</span>
                <span className="text-[10px] text-zinc-500">{t.twitter_sub}</span>
              </a>
            </div>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-550 text-center">
            {t.footer}
          </div>
        </div>
      </main>
    </div>
  );
}
