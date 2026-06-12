"use client";

import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar, Globe, Layers, Zap, Flame, Award, Tv } from "lucide-react";
import Image from "next/image";
import type { Language } from "@/locales/i18n-utils";

interface Props {
  lang: Language;
}

const content = {
  pt: {
    back: "Voltar para o Início",
    title: "Novidades do Projeto",
    subtitle: "Acompanhe a evolução, atualizações e avanços do site versão por versão.",
    footer: "Esse Dia Tem Jogo © 2026. Todos os direitos reservados.",
    devlogs: [
      {
        version: "v1.6.0",
        date: "05 de Junho, 2026",
        title: "📺 Canais de Transmissão (Onde Assistir)",
        icon: Tv,
        highlights: [
          "Integração de informações completas de canais de transmissão (Globo, SBT, SporTV, Premiere, YouTube, etc.) para cada partida do calendário.",
          "Visualização clara do canal transmissor diretamente nos cards de resultado das partidas.",
          "Traduções multilíngues automatizadas para os nomes e descrições dos canais de transmissão de acordo com a preferência do usuário."
        ]
      },
      {
        version: "v1.5.0",
        date: "04 de Junho, 2026",
        title: "🌍 Amistosos Internacionais & Melhorias de Busca",
        icon: Globe,
        highlights: [
          "Adicionamos suporte completo a Amistosos Internacionais no banco de dados e consultas do calendário.",
          "Mapeamos e configuramos bandeiras/brasões para todas as novas seleções nacionais integradas.",
          "Implementamos preenchimento automático inteligente da data inicial (hoje) e data final (final da Copa do Mundo) ao ativar a busca por intervalo.",
          "Corrigimos problemas com duplicação de partidas em buscas abrangentes."
        ]
      },
      {
        version: "v1.4.0",
        date: "02 de Junho, 2026",
        title: "📅 Integração de Calendário & Fusos Horários",
        icon: Calendar,
        highlights: [
          "Introduzimos o botão 'Adicionar à Agenda' nas partidas, permitindo integrar compromissos ao Google Agenda, Outlook ou baixar o arquivo .ics.",
          "Criamos o seletor de preferências de Fuso Horário: visualize as partidas no horário do seu aparelho, no fuso de Brasília (BRT) ou no fuso local do estádio.",
          "Corrigimos o bug de exibição de nomes duplicados em estágios de mata-mata com traduções multilíngues."
        ]
      },
      {
        version: "v1.3.0",
        date: "01 de Junho, 2026",
        title: "🔍 Pesquisa por Data e Intervalos",
        icon: Zap,
        highlights: [
          "Criamos o modo de busca por data única (permitindo ver todos os jogos que acontecem em um dia específico sem selecionar time).",
          "Adicionamos a opção de pesquisa por intervalo de datas para que você verifique finais de semana inteiros ou períodos específicos.",
          "Implementamos a ferramenta de compartilhar resultados de jogos via redes sociais ou copiando para a área de transferência."
        ]
      },
      {
        version: "v1.2.0",
        date: "30 de Maio, 2026",
        title: "🏆 Chaveamento e Mata-Mata da Copa",
        icon: Award,
        highlights: [
          "Preparamos o sistema para o chaveamento completo da Copa do Mundo 2026, incluindo as novas fases de 32-avos.",
          "Desenvolvemos a lógica para exibir cenários hipotéticos de classificação das seleções ('Caso passe em 1º...', 'Caso avance para...').",
          "Fizemos melhorias de performance no carrossel e corrigimos bugs de looping infinito."
        ]
      },
      {
        version: "v1.1.0",
        date: "20 de Maio, 2026",
        title: "🎨 Novo Visual e Carrossel de Roleta",
        icon: Layers,
        highlights: [
          "Rewrite completo da UI/UX com visual premium escuro, destaque em amarelo e visualização limpa de dados.",
          "Desenvolvemos o inovador carrossel de seleções estilo roleta física com aproximação e escala baseada em cosseno.",
          "Criamos um modal de resultados animado e de alto impacto visual para responder de forma direta a pergunta se 'Esse Dia Tem Jogo?'."
        ]
      },
      {
        version: "v1.0.0",
        date: "15 de Maio, 2026",
        title: "🚀 O Início de Tudo",
        icon: Flame,
        highlights: [
          "Estruturação inicial e desenvolvimento do motor de lógica de buscas do projeto.",
          "Criação das primeiras rotas dinâmicas para times e datas específicas.",
          "Automação básica para atualização automática de jogos do calendário."
        ]
      }
    ]
  },
  en: {
    back: "Back to Home",
    title: "Project Changelog",
    subtitle: "Track the evolution, updates, and milestones of the website version by version.",
    footer: "Is There a Game Today © 2026. All rights reserved.",
    devlogs: [
      {
        version: "v1.6.0",
        date: "June 5, 2026",
        title: "📺 Broadcast Channels (Where to Watch)",
        icon: Tv,
        highlights: [
          "Integrated comprehensive broadcasting channel information (Globo, SBT, SporTV, Premiere, YouTube, etc.) for each scheduled match.",
          "Clear display of the transmitting channels directly on the match result cards.",
          "Automated multilingual translations for broadcasting network names based on the user's selected language."
        ]
      },
      {
        version: "v1.5.0",
        date: "June 4, 2026",
        title: "🌍 International Friendlies & Search Quality",
        icon: Globe,
        highlights: [
          "Added full support for International Friendlies in both the database and calendar queries.",
          "Mapped and configured flag icons for all newly integrated national teams.",
          "Implemented smart pre-filling of start date (today) and end date (World Cup final) upon date range search activation.",
          "Resolved match duplication issues in broad calendar queries."
        ]
      },
      {
        version: "v1.4.0",
        date: "June 2, 2026",
        title: "📅 Calendar Integration & Timezone Selector",
        icon: Calendar,
        highlights: [
          "Introduced the 'Add to Calendar' button, supporting Google Calendar, Outlook, and offline .ics file downloads.",
          "Created the timezone display preference switcher: view matches in your local device time, Brasília time (BRT), or local Stadium time.",
          "Fixed double location text display and resolved localized generic names in knockout stages."
        ]
      },
      {
        version: "v1.3.0",
        date: "June 1, 2026",
        title: "🔍 Date Range & Day-Only Queries",
        icon: Zap,
        highlights: [
          "Created the day-only query mode (to view all matches scheduled on a specific date without choosing a team).",
          "Added support for date range searches to check entire weekends or custom time intervals.",
          "Implemented the query results sharing utility with clipboard copying support."
        ]
      },
      {
        version: "v1.2.0",
        date: "May 30, 2026",
        title: "🏆 Bracket & Knockout Stages Support",
        icon: Award,
        highlights: [
          "Fully prepared the platform for the 2026 World Cup bracket stages (including the new Round of 32).",
          "Programmed conditional scenario descriptions ('If qualifying 1st...', 'If advancing to...').",
          "Optimized the team carousel scrolling physics and solved infinite looping glitches."
        ]
      },
      {
        version: "v1.1.0",
        date: "May 20, 2026",
        title: "🎨 Complete UI Overhaul & Roulette Carousel",
        icon: Layers,
        highlights: [
          "Rewrote the website UI/UX to follow a premium dark aesthetics with brand-yellow accents.",
          "Designed the roulette-style team carousel with customizable inertia physics and cosine scaling.",
          "Developed the high-fidelity animated Result Modal to quickly answer if there is a match."
        ]
      },
      {
        version: "v1.0.0",
        date: "May 15, 2026",
        title: "🚀 The Kickoff",
        icon: Flame,
        highlights: [
          "Initial codebase structure and development of the core search matching engine.",
          "Established the dynamic routing for teams and date parameters.",
          "Setup automation pipelines for scheduled updates to calendar data files."
        ]
      }
    ]
  },
  es: {
    back: "Volver al Inicio",
    title: "Novedades del Proyecto",
    subtitle: "Sigue la evolución, actualizaciones y avances del sitio versión por versión.",
    footer: "¿Este Día Hay Partido? © 2026. Todos los derechos reservados.",
    devlogs: [
      {
        version: "v1.6.0",
        date: "05 de Junho, 2026",
        title: "📺 Canales de Transmisión (Dónde Ver)",
        icon: Tv,
        highlights: [
          "Integración de información detallada de canales de transmisión (Globo, SBT, SporTV, Premiere, YouTube, etc.) para cada partido del calendario.",
          "Visualización clara del canal transmisor directamente en las tarjetas de resultado de los partidos.",
          "Traducción automática multilingüe de los nombres y descripciones de los canales emisores según la preferencia del usuario."
        ]
      },
      {
        version: "v1.5.0",
        date: "04 de Junio, 2026",
        title: "🌍 Amistosos Internacionales y Calidad de Búsqueda",
        icon: Globe,
        highlights: [
          "Añadimos soporte completo para Amistosos Internacionales en la base de datos y consultas.",
          "Mapeamos e integramos las banderas y escudos de todas las selecciones nacionales agregadas.",
          "Implementamos el llenado automático de la fecha de inicio (hoy) y fin (final del Mundial) al activar rango.",
          "Corregimos duplicidades de partidos en las consultas del calendario."
        ]
      },
      {
        version: "v1.4.0",
        date: "02 de Junio, 2026",
        title: "📅 Integración de Agenda y Husos Horarios",
        icon: Calendar,
        highlights: [
          "Introdujimos el botón 'Añadir a la Agenda' con soporte para Google Calendar, Outlook y descarga de .ics.",
          "Creamos el selector de huso horario: visualiza partidos en tu huso local, huso de Brasilia (BRT) o huso del estadio.",
          "Corregimos duplicación de texto de ubicación y ajustamos traducciones de mata-mata."
        ]
      },
      {
        version: "v1.3.0",
        date: "01 de Junio, 2026",
        title: "🔍 Rango de Fechas y Búsqueda por Día",
        icon: Zap,
        highlights: [
          "Creamos el modo de búsqueda por fecha única para listar todos los partidos de un día específico.",
          "Añadimos la opción de buscar un rango de fechas para verificar fines de semana enteros.",
          "Implementamos la utilidad de compartir los resultados copiándolos al portapapeles."
        ]
      },
      {
        version: "v1.2.0",
        date: "30 de Mayo, 2026",
        title: "🏆 Eliminatorias de la Copa Mundial",
        icon: Award,
        highlights: [
          "Preparamos el sistema para el cuadro de eliminación directa del Mundial 2026 (incluidos dieciseisavos).",
          "Desarrollamos la lógica de condiciones clasificatorias ('Si pasa como 1º...', 'Si avanza a...').",
          "Hicimos optimizaciones de física en el carrusel de selecciones para evitar bloqueos."
        ]
      },
      {
        version: "v1.1.0",
        date: "20 de Mayo, 2026",
        title: "🎨 Nuevo Diseño y Carrusel de Ruleta",
        icon: Layers,
        highlights: [
          "Rediseño integral de la UI con tema oscuro premium y acentos amarillos elegantes.",
          "Desarrollamos el carrusel estilo ruleta con física de inercia y escala de coseno sobre el elemento activo.",
          "Diseñamos el Modal de Resultados animado para dar una respuesta inmediata de '¿Este día hay partido?'."
        ]
      },
      {
        version: "v1.0.0",
        date: "15 de Mayo, 2026",
        title: "🚀 El Comienzo de Todo",
        icon: Flame,
        highlights: [
          "Estructuración inicial de la base de código y motor lógico de coincidencias de partidos.",
          "Creación de rutas dinámicas por selección y fecha.",
          "Configuración de pipelines automatizados para actualizar el calendario de juegos de forma regular."
        ]
      }
    ]
  }
};

export default function LocalizedDevlogPage({ lang }: Props) {
  const t = content[lang];
  const langPrefix = lang === "pt" ? "" : `/${lang}`;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-details selection:bg-[#ffcc00] selection:text-black">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <Link
            href={langPrefix || "/"}
            className="inline-flex items-center gap-2 text-sm text-[#ffcc00] hover:text-[#e6b800] transition-colors mb-6 self-start md:self-center font-bold uppercase tracking-wider group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t.back}
          </Link>
          <div className="w-20 h-20 mb-4 drop-shadow-[0_0_15px_rgba(255,204,0,0.2)]">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
            {t.title}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-lg">
            {t.subtitle}
          </p>
          <div className="w-12 h-1 bg-[#ffcc00] rounded-full mt-4"></div>
        </div>

        {/* Timeline container */}
        <div className="relative border-l border-zinc-800 ml-4 md:ml-6 pl-6 md:pl-10 space-y-12 py-2">
          {t.devlogs.map((log) => {
            const Icon = log.icon;
            return (
              <div key={log.version} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-[43px] md:-left-[59px] top-1.5 w-8 h-8 md:w-10 md:h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-[#ffcc00] group-hover:border-[#ffcc00] transition-colors duration-300 shadow-md">
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>

                {/* Content card */}
                <div className="bg-[#111111] rounded-3xl p-6 border border-zinc-850 shadow-lg group-hover:border-zinc-800 transition-all duration-300 relative overflow-hidden">
                  {/* Decorative glowing background accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffcc00]/[0.02] rounded-full blur-xl pointer-events-none group-hover:bg-[#ffcc00]/[0.04] transition-all duration-300" />
                  
                  {/* Version tag and date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="bg-[#ffcc00]/10 text-[#ffcc00] font-display font-black text-sm uppercase px-3 py-1 rounded-full tracking-wider border border-[#ffcc00]/20">
                      {log.version}
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                      {log.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-lg md:text-xl text-white mb-4">
                    {log.title}
                  </h3>

                  {/* Bullet points */}
                  <ul className="space-y-3 text-zinc-400 text-sm md:text-base">
                    {log.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2.5 leading-relaxed">
                        <Sparkles className="w-4 h-4 text-[#ffcc00]/60 shrink-0 mt-1" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-zinc-900 text-xs text-zinc-400 text-center">
          {t.footer}
        </div>
      </main>
    </div>
  );
}
