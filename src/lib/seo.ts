/**
 * seo.ts
 * SEO metadata generators for all route types.
 * Returns Metadata objects compatible with Next.js App Router.
 */

import type { Metadata } from 'next';
import { formatDateLong } from './date-utils';
import type { MatchWithTeam, Team } from './types';

const SITE_NAME = 'Esse Dia Tem Jogo';
const SITE_URL = 'https://www.essediatemjogo.com.br';
const SITE_DESCRIPTION =
  'Esse dia tem jogo? Descubra em segundos se tem partida do seu time antes de marcar qualquer compromisso.';

/** Base metadata shared across all pages */
export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: 'Castro Brothers', url: 'https://divertical.com.br' }],
  creator: 'Castro Brothers',
  publisher: 'Castro Brothers',
  robots: { index: true, follow: true },
  openGraph: {
    siteName: SITE_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@essediatemjogo',
  },
};

/** Metadata for the home page */
export function getHomeMetadata(): Metadata {
  return {
    ...baseMetadata,
    title: "Esse Dia Tem Jogo?",
    description: SITE_DESCRIPTION,
    keywords: [
      'tem jogo hoje',
      'vai ter jogo',
      'brasil joga hoje',
      'copa do mundo 2026',
      'esse dia tem jogo',
      'jogo do brasil',
      'agenda copa 2026',
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Esse Dia Tem Jogo?",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
    },
    alternates: { canonical: SITE_URL },
  };
}

/** Metadata for a team overview page — /[team] */
export function getTeamMetadata(team: Team & { code: string }): Metadata {
  const description = `Veja todos os jogos da ${team.name} ${team.flag} na Copa do Mundo 2026. Datas, horários e adversários confirmados.`;
  const url = `${SITE_URL}/${team.slug}`;

  return {
    ...baseMetadata,
    title: "Esse Dia Tem Jogo?",
    description,
    keywords: [
      `jogos da ${team.name.toLowerCase()}`,
      `${team.name.toLowerCase()} copa 2026`,
      `${team.name.toLowerCase()} joga quando`,
      `calendário ${team.name.toLowerCase()} copa do mundo`,
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Esse Dia Tem Jogo?",
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
  result: { hasGame: boolean; matches: MatchWithTeam[] }
): Metadata {
  const formattedDate = formatDateLong(date);
  const url = `${SITE_URL}/${team.slug}/${date}`;

  let description: string;

  if (result.hasGame) {
    const hasConfirmed = result.matches.some(m => m.status === 'confirmed' || m.status === 'played');
    const match = result.matches[0];
    const opponent = match.opponent_name;
    const phase = match.phase;

    if (hasConfirmed) {
      description = `TEM JOGO! ${team.name} x ${opponent} — ${phase} da Copa do Mundo 2026. ${
        match.time_brt ? `Às ${match.time_brt} (horário de Brasília).` : 'Horário a confirmar.'
      }`;
    } else {
      description = `POSSÍVEL JOGO! ${team.name} pode jogar no dia ${formattedDate} (${phase} da Copa do Mundo 2026). Condição: ${match.condition || 'A confirmar'}.`;
    }
  } else {
    description = `Confirmado: ${team.name} ${team.flag} não tem jogo no dia ${formattedDate}. Pode marcar seu compromisso!`;
  }

  return {
    ...baseMetadata,
    title: "Esse Dia Tem Jogo?",
    description,
    keywords: [
      `${team.name.toLowerCase()} joga ${formattedDate}`,
      `jogo da ${team.name.toLowerCase()} hoje`,
      `${team.name.toLowerCase()} copa 2026`,
      `esse dia tem jogo ${team.name.toLowerCase()}`,
    ],
    openGraph: {
      ...baseMetadata.openGraph,
      title: "Esse Dia Tem Jogo?",
      description,
      url,
    },
    alternates: { canonical: url },
  };
}
