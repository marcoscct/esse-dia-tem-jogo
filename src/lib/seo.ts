/**
 * seo.ts
 * SEO metadata generators for all route types, localized by language.
 * Returns Metadata objects compatible with Next.js App Router.
 */

import type { Metadata } from 'next';
import { formatDateLong } from './date-utils';
import type { MatchWithTeam, Team } from './types';
import type { Language } from '@/locales/i18n-utils';
import { translateTeamName, translatePhase, translateCondition } from '@/locales/i18n-utils';

const SITE_URL = 'https://www.essediatemjogo.com.br';

const LOCALIZED_CONFIG = {
  pt: {
    siteName: 'Esse Dia Tem Jogo',
    title: 'Esse Dia Tem Jogo?',
    description: 'Esse dia tem jogo? Descubra em segundos se tem partida do seu time antes de marcar qualquer compromisso.',
    locale: 'pt_BR',
  },
  en: {
    siteName: 'Is There a Game Today',
    title: 'Is There a Game Today?',
    description: 'Is there a game today? Find out in seconds if your team is playing before scheduling any commitments.',
    locale: 'en_US',
  },
  es: {
    siteName: '¿Este Día Hay Partido?',
    title: '¿Este Día Hay Partido?',
    description: '¿Este día hay partido? Descubre en segundos si hay partido de tu equipo antes de programar cualquier compromiso.',
    locale: 'es_ES',
  }
};

/** Base metadata shared across all pages */
export function getBaseMetadata(lang: Language = 'pt', isClubs: boolean = false): Metadata {
  const config = LOCALIZED_CONFIG[lang];
  const canonicalUrl = lang === 'pt' ? SITE_URL : `${SITE_URL}/${lang}`;
  
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: config.siteName,
    authors: [{ name: 'Castro Brothers', url: 'https://divertical.com.br' }],
    creator: 'Castro Brothers',
    publisher: 'Castro Brothers',
    robots: isClubs ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      siteName: config.siteName,
      locale: config.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@essediatemjogo',
    },
    alternates: {
      canonical: canonicalUrl,
    }
  };
}

/** Metadata for the home page */
export function getHomeMetadata(lang: Language = 'pt', isClubs: boolean = false): Metadata {
  const config = LOCALIZED_CONFIG[lang];
  const base = getBaseMetadata(lang, isClubs);
  
  const ptKeywords = [
    'tem jogo hoje',
    'vai ter jogo',
    'brasil joga hoje',
    'copa do mundo 2026',
    'esse dia tem jogo',
    'jogo do brasil',
    'agenda copa 2026',
  ];

  const enKeywords = [
    'is there a game today',
    'game day schedule',
    'does brazil play today',
    'world cup 2026 schedule',
    'is there a match today',
    'brazil matches',
    'world cup agenda',
  ];

  const esKeywords = [
    'hay partido hoy',
    'juega hoy',
    'brasil juega hoy',
    'copa del mundo 2026',
    'calendario copa 2026',
    'partido de brasil',
    'agenda copa del mundo',
  ];

  const keywords = lang === 'en' ? enKeywords : lang === 'es' ? esKeywords : ptKeywords;

  const pathPrefix = isClubs ? '/times' : '';
  const canonicalUrl = lang === 'pt' ? `${SITE_URL}${pathPrefix}` : `${SITE_URL}/${lang}${pathPrefix}`;

  return {
    ...base,
    title: config.title,
    description: config.description,
    keywords,
    openGraph: {
      ...base.openGraph,
      title: config.title,
      description: config.description,
      url: canonicalUrl,
    },
  };
}

/** Metadata for a team overview page — /[team] */
export function getTeamMetadata(team: Team & { code: string }, lang: Language = 'pt', isClubs: boolean = false): Metadata {
  const base = getBaseMetadata(lang, isClubs);
  const teamName = translateTeamName(team.code, team.name, lang);
  
  let description = `Veja todos os jogos do ${teamName} ${team.flag} na temporada. Datas, horários e adversários confirmados.`;
  if (isClubs) {
    if (lang === 'en') {
      description = `Check all matches for ${teamName} ${team.flag}. Confirmed dates, times, and opponents.`;
    } else if (lang === 'es') {
      description = `Mira todos los partidos de ${teamName} ${team.flag}. Fechas, horarios y rivales confirmados.`;
    }
  } else {
    description = `Veja todos os jogos da ${teamName} ${team.flag} na Copa do Mundo 2026. Datas, horários e adversários confirmados.`;
    if (lang === 'en') {
      description = `Check all World Cup 2026 matches for ${teamName} ${team.flag}. Confirmed dates, times, and opponents.`;
    } else if (lang === 'es') {
      description = `Mira todos los partidos de ${teamName} ${team.flag} en la Copa del Mundo 2026. Fechas, horarios y rivales confirmados.`;
    }
  }

  const pathPrefix = isClubs ? '/times' : '';
  const pathSuffix = lang === 'pt' ? `${pathPrefix}/${team.slug}` : `/${lang}${pathPrefix}/${team.slug}`;
  const url = `${SITE_URL}${pathSuffix}`;

  return {
    ...base,
    title: LOCALIZED_CONFIG[lang].title,
    description,
    keywords: [
      `${teamName.toLowerCase()} matches`,
      `${teamName.toLowerCase()} schedule`,
    ],
    openGraph: {
      ...base.openGraph,
      title: LOCALIZED_CONFIG[lang].title,
      description,
      url,
    },
    alternates: { canonical: url },
  };
}

/** Metadata for a date-specific page — /[team]/[date] */
export function getDatePageMetadata(
  team: Team & { code: string },
  date: string,
  result: { hasGame: boolean; matches: MatchWithTeam[] },
  lang: Language = 'pt',
  isClubs: boolean = false
): Metadata {
  const base = getBaseMetadata(lang, isClubs);
  const formattedDate = formatDateLong(date, lang);
  const teamName = translateTeamName(team.code, team.name, lang);
  
  const pathPrefix = isClubs ? '/times' : '';
  const pathSuffix = lang === 'pt' ? `${pathPrefix}/${team.slug}/${date}` : `/${lang}${pathPrefix}/${team.slug}/${date}`;
  const url = `${SITE_URL}${pathSuffix}`;

  let description: string;
  const compName = isClubs ? 'Brasileirão/Libertadores/Copa do Brasil' : 'Copa do Mundo 2026';
  const compNameEn = isClubs ? 'Brasileirão/Libertadores/Copa do Brasil' : 'World Cup 2026';
  const compNameEs = isClubs ? 'Brasileirão/Libertadores/Copa del Mundo 2026' : 'Copa del Mundo 2026';

  if (result.hasGame) {
    const hasConfirmed = result.matches.some(m => m.status === 'confirmed' || m.status === 'played');
    const match = result.matches[0];
    const opponent = translateTeamName(match.opponent_code || '', match.opponent_name, lang);
    const phase = translatePhase(match.phase, lang);

    if (hasConfirmed) {
      if (lang === 'en') {
        description = `GAME DAY! ${teamName} vs ${opponent} — ${compNameEn} ${phase}. ${
          match.time_brt ? `At ${match.time_brt} BRT.` : 'Kickoff time to be confirmed.'
        }`;
      } else if (lang === 'es') {
        description = `¡HAY PARTIDO! ${teamName} x ${opponent} — ${phase} de ${compNameEs}. ${
          match.time_brt ? `A las ${match.time_brt} (hora de Brasilia).` : 'Horario a confirmar.'
        }`;
      } else {
        description = `TEM JOGO! ${teamName} x ${opponent} — ${phase} do ${compName}. ${
          match.time_brt ? `Às ${match.time_brt} (horário de Brasília).` : 'Horário a confirmar.'
        }`;
      }
    } else {
      const condition = translateCondition(match.condition, lang) || 'TBD';
      if (lang === 'en') {
        description = `POSSIBLE GAME! ${teamName} may play on ${formattedDate} (${compNameEn} ${phase}). Scenario: ${condition}.`;
      } else if (lang === 'es') {
        description = `¡POSIBLE PARTIDO! ${teamName} podría jugar el día ${formattedDate} (${phase} de ${compNameEs}). Condición: ${condition}.`;
      } else {
        description = `POSSÍVEL JOGO! ${teamName} pode jogar no dia ${formattedDate} (${phase} do ${compName}). Condição: ${condition}.`;
      }
    }
  } else {
    if (lang === 'en') {
      description = `Confirmed: ${teamName} ${team.flag} has no game on ${formattedDate}. Feel free to make plans!`;
    } else if (lang === 'es') {
      description = `Confirmado: ${teamName} ${team.flag} no tiene partido el día ${formattedDate}. ¡Puedes programar tu compromiso!`;
    } else {
      description = `Confirmado: ${teamName} ${team.flag} não tem jogo no dia ${formattedDate}. Pode marcar seu compromisso!`;
    }
  }

  return {
    ...base,
    title: LOCALIZED_CONFIG[lang].title,
    description,
    keywords: [
      `${teamName.toLowerCase()} ${date}`,
      `${teamName.toLowerCase()} match today`,
    ],
    openGraph: {
      ...base.openGraph,
      title: LOCALIZED_CONFIG[lang].title,
      description,
      url,
    },
    alternates: { canonical: url },
  };
}
