import { NextRequest, NextResponse } from "next/server";
import { getTeamBySlug, getTeamByCode } from "@/lib/calendar";
import { translateTeamName, translateOpponentName, translatePhase, translateCondition } from "@/locales/i18n-utils";
import type { Language } from "@/locales/i18n-utils";

function formatUTCBasic(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');
  return `${y}${m}${day}T${hh}${mm}${ss}Z`;
}

function getNextDayISO(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setDate(dateObj.getDate() + 1);
  const nextY = dateObj.getFullYear();
  const nextM = String(dateObj.getMonth() + 1).padStart(2, '0');
  const nextD = String(dateObj.getDate()).padStart(2, '0');
  return `${nextY}-${nextM}-${nextD}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ team: string }> }
) {
  // Resolve params
  const { team: teamParam } = await params;
  
  // Resolve language from query parameter (?lang=en) or Accept-Language header
  const { searchParams } = new URL(request.url);
  let lang: Language = 'pt';
  const langParam = searchParams.get('lang');
  if (langParam === 'en' || langParam === 'es' || langParam === 'pt') {
    lang = langParam;
  } else {
    const acceptLang = request.headers.get('accept-language') || '';
    if (acceptLang.toLowerCase().includes('en')) {
      lang = 'en';
    } else if (acceptLang.toLowerCase().includes('es')) {
      lang = 'es';
    }
  }

  // Find the team
  const teamBySlug = getTeamBySlug(teamParam);
  let team = null;
  let teamCode = "";

  if (teamBySlug) {
    team = teamBySlug;
    teamCode = teamBySlug.code;
  } else {
    const teamByCode = getTeamByCode(teamParam);
    if (teamByCode) {
      team = teamByCode;
      teamCode = teamParam.toUpperCase();
    }
  }

  if (!team) {
    return new NextResponse("Team not found", { status: 404 });
  }

  const teamNameLocalized = translateTeamName(teamCode, team.name, lang);

  // Generate VCALENDAR lines
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//Esse Dia Tem Jogo//NONSGML v1.5//${lang.toUpperCase()}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${lang === 'en' ? `World Cup 2026: ${teamNameLocalized} Schedule` : lang === 'es' ? `Mundial 2026: Calendario de ${teamNameLocalized}` : `Copa 2026: Agenda do ${teamNameLocalized}`}`,
    "X-WR-TIMEZONE:America/Sao_Paulo",
    "X-WR-CALDESC:Calendário oficial e dinâmico de jogos da seleção na Copa do Mundo 2026.",
  ];

  const matches = team.matches || [];

  for (const match of matches) {
    let status = "CONFIRMED";
    let sequence = 0;

    if (match.status === 'eliminated') {
      status = "CANCELLED";
      sequence = 2;
    } else if (match.status === 'possible') {
      status = "TENTATIVE";
      sequence = 0;
    } else {
      status = "CONFIRMED";
      sequence = 1;
    }

    const opponentNameLocalized = match.opponent_code
      ? translateOpponentName(match.opponent_code, match.opponent_name || '', lang)
      : lang === 'pt' ? 'A definir' : lang === 'es' ? 'A definir' : 'TBD';

    // Build Match Title/Summary
    let summary = "";
    const phaseLocalized = translatePhase(match.phase, lang);
    if (lang === 'en') {
      summary = `World Cup: ${teamNameLocalized} vs ${opponentNameLocalized}`;
      if (match.status === 'possible') {
        summary = `[POSSIBLE] World Cup: ${teamNameLocalized} vs ${opponentNameLocalized}`;
      }
    } else if (lang === 'es') {
      summary = `Mundial: ${teamNameLocalized} vs ${opponentNameLocalized}`;
      if (match.status === 'possible') {
        summary = `[POSIBLE] Mundial: ${teamNameLocalized} vs ${opponentNameLocalized}`;
      }
    } else {
      // pt
      summary = `Copa 2026: ${teamNameLocalized} x ${opponentNameLocalized}`;
      if (match.status === 'possible') {
        summary = `[POSSÍVEL] Copa 2026: ${teamNameLocalized} x ${opponentNameLocalized}`;
      }
    }

    // Build Description
    const descParts: string[] = [];
    descParts.push(`${phaseLocalized}`);
    if (match.phase_slug === 'group_stage' && team.group) {
      descParts.push(lang === 'en' ? `Group ${team.group}` : lang === 'es' ? `Grupo ${team.group}` : `Grupo ${team.group}`);
    }
    
    if (match.status === 'possible') {
      const cond = match.condition ? translateCondition(match.condition, lang) : '';
      if (cond) {
        descParts.push(lang === 'en' ? `Qualification condition: ${cond}` : lang === 'es' ? `Condición de clasificación: ${cond}` : `Condição de classificação: ${cond}`);
      } else {
        descParts.push(lang === 'en' ? `Possible classification match.` : lang === 'es' ? `Partido de clasificación posible.` : `Jogo de classificação possível.`);
      }
    }

    if (match.broadcasts && match.broadcasts.length > 0) {
      descParts.push(`${lang === 'pt' ? 'Onde assistir' : lang === 'es' ? 'Dónde ver' : 'Broadcast'}: ${match.broadcasts.join(', ')}`);
    }

    descParts.push("https://essediatemjogo.com.br");

    const description = descParts.join("\n");
    const escapedDesc = description
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');

    const location = match.venue && match.city
      ? `${match.venue}, ${match.city}`
      : match.city || '';

    const matchUID = `match-${match.match_number || match.date}-${teamParam.toLowerCase()}@essediatemjogo.com.br`;

    icsLines.push("BEGIN:VEVENT");
    icsLines.push(`UID:${matchUID}`);
    icsLines.push(`DTSTAMP:${formatUTCBasic(new Date())}`);
    icsLines.push(`STATUS:${status}`);
    icsLines.push(`SEQUENCE:${sequence}`);
    icsLines.push(`SUMMARY:${summary}`);
    icsLines.push(`DESCRIPTION:${escapedDesc}`);
    icsLines.push(`LOCATION:${location}`);

    if (match.time_brt && match.status !== 'eliminated') {
      const [y, m, d] = match.date.split('-').map(Number);
      const [hh, mm] = match.time_brt.split(':').map(Number);
      // BRT is UTC-3, so to get UTC we add 3 hours
      const start = new Date(Date.UTC(y, m - 1, d, hh + 3, mm, 0));
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration
      icsLines.push(`DTSTART:${formatUTCBasic(start)}`);
      icsLines.push(`DTEND:${formatUTCBasic(end)}`);
    } else {
      const nextDay = getNextDayISO(match.date);
      const startStr = match.date.replace(/-/g, '');
      const endStr = nextDay.replace(/-/g, '');
      icsLines.push(`DTSTART;VALUE=DATE:${startStr}`);
      icsLines.push(`DTEND;VALUE=DATE:${endStr}`);
    }

    icsLines.push("END:VEVENT");
  }

  icsLines.push("END:VCALENDAR");

  const icsString = icsLines.join("\r\n");

  return new NextResponse(icsString, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${teamParam}.ics"`,
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
