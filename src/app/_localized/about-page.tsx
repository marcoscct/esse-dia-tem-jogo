import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import type { Language } from "@/locales/i18n-utils";

interface Props {
  lang: Language;
}

const content = {
  pt: {
    back: "Voltar para o Início",
    title: "Sobre o Projeto",
    problem_title: "⚽ O Problema Social",
    problem_p1: "Quem nunca passou pelo desespero de receber um convite de casamento, um agendamento de aniversário ou um jantar de família importante e, só depois, perceber que a data coincide exatamente com a semifinal da Copa do Mundo ou com aquele clássico decisivo do seu time do coração?",
    problem_p2: "Esse tipo de conflito de agenda costuma gerar discussões, ausências ou pessoas assistindo ao jogo escondidas embaixo da mesa do buffet.",
    solution_title: "💡 A Solução: Antes de marcar, confere.",
    solution_p1: "O Esse Dia Tem Jogo foi criado para ser o seu \"antídoto de gafes sociais esportivas\". Com uma interface ultra-rápida, direta e mobile-first, a ferramenta responde à pergunta essencial em menos de 5 segundos: \"Esse dia tem jogo do meu time ou seleção?\".",
    solution_rule: "A regra é clara:",
    solution_yes: "TEM JOGO",
    solution_yes_desc: "Bloqueie a agenda imediatamente.",
    solution_no: "NÃO TEM JOGO",
    solution_no_desc: "Pode marcar o compromisso sem medo.",
    about_us_title: "👥 Quem Somos (Castro Brothers)",
    about_us_p1: "O projeto foi idealizado e construído pela equipe dos Castro Brothers, criadores de conteúdo pioneiros na internet brasileira (conhecidos pelo canal do YouTube, o jogo UTC - Um Joystick Um Violão, e diversos outros projetos de entretenimento).",
    about_us_p2: "Decidimos criar esta ferramenta para uso próprio e de nossa comunidade, garantindo que ninguém perca os momentos mais emocionantes do futebol.",
    technical_desc: "O Esse Dia Tem Jogo é um utilitário online e banco de dados de calendário esportivo. O site fornece indexação e consultas rápidas de datas e horários de partidas de futebol de seleções e clubes para auxiliar no planejamento de compromissos sociais e corporativos.",
    footer: "Esse Dia Tem Jogo © 2026. Todos os direitos reservados."
  },
  en: {
    back: "Back to Home",
    title: "About the Project",
    problem_title: "⚽ The Social Problem",
    problem_p1: "Who hasn't experienced the panic of receiving a wedding invitation, birthday schedule, or important family dinner, only to realize later that the date coincides exactly with the World Cup semi-final or a decisive match for your favorite team?",
    problem_p2: "This type of scheduling conflict usually leads to arguments, absences, or people secretly watching the game under the buffet table.",
    solution_title: "💡 The Solution: Check before you schedule.",
    solution_p1: "Is There a Game Today was created to be your 'antidote to sports social gaffes'. With an ultra-fast, straightforward, mobile-first interface, the tool answers the essential question in under 5 seconds: 'Is there a game for my team or country today?'.",
    solution_rule: "The rule is clear:",
    solution_yes: "GAME DAY",
    solution_yes_desc: "Block the calendar immediately.",
    solution_no: "NO GAME",
    solution_no_desc: "Schedule your plans without fear.",
    about_us_title: "👥 Who We Are (Castro Brothers)",
    about_us_p1: "The project was conceptualized and built by the Castro Brothers team, pioneering content creators on the Brazilian internet (known for their YouTube channel, the game UTC - Um Joystick Um Violão, and several other entertainment projects).",
    about_us_p2: "We decided to create this tool for ourselves and our community to ensure no one misses football's most exciting moments.",
    technical_desc: "Is There a Game Today is an online utility and sports calendar database. The website provides indexing and quick queries of dates and times of national team and club football matches to assist in planning social and corporate commitments.",
    footer: "Is There a Game Today © 2026. All rights reserved."
  },
  es: {
    back: "Volver al Inicio",
    title: "Sobre el Proyecto",
    problem_title: "⚽ El Problema Social",
    problem_p1: "¿Quién no ha sentido el pánico al recibir una invitación de boda, una cita de cumpleaños o una cena familiar importante, y darse cuenta después de que la fecha coincide exactamente con la semifinal de la Copa del Mundo o el partido decisivo de su equipo favorito?",
    problem_p2: "Este tipo de conflicto de agenda suele generar discusiones, ausencias o personas viendo el partido a escoñdidas debajo de la mesa.",
    solution_title: "💡 La Solución: Antes de programar, consulta.",
    solution_p1: "¿Este Día Hay Partido? se creó para ser tu 'antídoto contra las meteduras de pata sociales y deportivas'. Con una interfaz ultrarrápida, directa y optimizada para móviles, la herramienta responde a la pregunta fundamental en menos de 5 segundos: '¿Hay partido de mi equipo o selección este día?'.",
    solution_rule: "La regla es clara:",
    solution_yes: "HAY PARTIDO",
    solution_yes_desc: "Bloquea tu agenda de inmediato.",
    solution_no: "NO HAY PARTIDO",
    solution_no_desc: "Puedes programar el compromiso sin miedo.",
    about_us_title: "👥 Quiénes Somos (Castro Brothers)",
    about_us_p1: "El proyecto fue ideado y construido por el equipo de los Castro Brothers, creadores de contenido pioneiros en la internet brasileña (conocidos por su canal de YouTube, el juego UTC - Um Joystick Um Violão, y diversos proyectos de entretenimiento).",
    about_us_p2: "Decidimos crear esta herramienta para nuestro propio uso y el de nuestra comunidad, asegurando que nadie se pierda los momentos más emocionantes del fútbol.",
    technical_desc: "¿Este Día Hay Partido? es una utilidad en línea y base de datos del calendario deportivo. El sitio web proporciona indexación y consultas rápidas de fechas y horarios de partidos de fútbol de selecciones y clubes para ayudar a planificar compromisos sociales y corporativos.",
    footer: "¿Este Día Hay Partido? © 2026. Todos los derechos reservados."
  }
};

export default function LocalizedAboutPage({ lang }: Props) {
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
              src="/logo.webp"
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
          
          {/* Descrição técnica prioritária para bots */}
          <section className="p-5 bg-zinc-950 border border-zinc-900 rounded-2xl border-l-4 border-l-[#ffcc00]">
            <p className="font-sans font-bold text-white text-xs md:text-sm leading-relaxed">
              {t.technical_desc}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              {t.problem_title}
            </h2>
            <p>{t.problem_p1}</p>
            <p>{t.problem_p2}</p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              {t.solution_title}
            </h2>
            <p>{t.solution_p1}</p>
            <p>{t.solution_rule}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
                <span className="block text-2xl mb-1">⚽</span>
                <span className="font-display font-bold text-red-500 block uppercase tracking-wide">{t.solution_yes}</span>
                <span className="text-xs text-zinc-400">{t.solution_yes_desc}</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
                <span className="block text-2xl mb-1">😌</span>
                <span className="font-display font-bold text-[#ffcc00] block uppercase tracking-wide">{t.solution_no}</span>
                <span className="text-xs text-zinc-400">{t.solution_no_desc}</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              {t.about_us_title}
            </h2>
            <p>{t.about_us_p1}</p>
            <p>{t.about_us_p2}</p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 text-center">
            {t.footer}
          </div>
        </div>
      </main>
    </div>
  );
}
