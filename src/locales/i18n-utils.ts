export type Language = 'pt' | 'en' | 'es';

import { pt } from './pt';
import { en } from './en';
import { es } from './es';

const dictionaries = { pt, en, es };

export function translate(key: string, lang: Language, params?: Record<string, string>): string {
  const dict = dictionaries[lang] || pt;
  const dictTyped = dict as Record<string, string | Record<string, string>>;
  const enTyped = en as Record<string, string | Record<string, string>>;
  const ptTyped = pt as Record<string, string | Record<string, string>>;
  const rawValue = dictTyped[key] || enTyped[key] || ptTyped[key] || key;
  let text = typeof rawValue === 'string' ? rawValue : key;
  
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replaceAll(`{${k}}`, v);
    });
  }
  return text;
}

export function translateTeamName(code: string, defaultName: string, lang: Language): string {
  if (code === 'TBD') {
    return translateOpponentName(null, defaultName, lang);
  }
  const dict = dictionaries[lang];
  if (dict && dict.teams && dict.teams[code]) {
    return dict.teams[code];
  }
  return defaultName;
}

// Translates opponent names like "2º do Grupo B", "Vencedor da Partida 75", "A definir"
export function translateOpponentName(code: string | null, name: string, lang: Language): string {
  if (code) {
    return translateTeamName(code, name, lang);
  }
  
  if (!name || name === 'A definir') {
    return lang === 'en' ? 'TBD' : lang === 'es' ? 'A definir' : 'A definir';
  }
  
  if (lang === 'pt') return name;
  
  // Translates placeholders like "1º do Grupo A"
  // Match "Xº do Grupo Y"
  const groupMatch = name.match(/^(\d+)º\s+do\s+Grupo\s+([A-L])$/i);
  if (groupMatch) {
    const num = groupMatch[1];
    const group = groupMatch[2];
    if (lang === 'en') {
      const suffix = num === '1' ? 'st' : num === '2' ? 'nd' : 'rd';
      return `${num}${suffix} of Group ${group}`;
    } else if (lang === 'es') {
      return `${num}º del Grupo ${group}`;
    }
  }
  
  // Match "3º do Grupo C/E/F/H/I"
  const groupPoolMatch = name.match(/^(\d+)º\s+do\s+Grupo\s+(.+)$/i);
  if (groupPoolMatch) {
    const num = groupPoolMatch[1];
    const pool = groupPoolMatch[2];
    if (lang === 'en') {
      const suffix = num === '1' ? 'st' : num === '2' ? 'nd' : 'rd';
      return `${num}${suffix} of Group ${pool}`;
    } else if (lang === 'es') {
      return `${num}º del Grupo ${pool}`;
    }
  }
  
  // Match "Vencedor da Partida 75"
  const winnerMatch = name.match(/^Vencedor\s+da\s+Partida\s+(\d+)$/i);
  if (winnerMatch) {
    const num = winnerMatch[1];
    if (lang === 'en') return `Winner of Match ${num}`;
    if (lang === 'es') return `Ganador del Partido ${num}`;
  }
  
  // Match "Perdedor da Partida 75"
  const loserMatch = name.match(/^Perdedor\s+da\s+Partida\s+(\d+)$/i);
  if (loserMatch) {
    const num = loserMatch[1];
    if (lang === 'en') return `Loser of Match ${num}`;
    if (lang === 'es') return `Perdedor del Partido ${num}`;
  }
  
  return name;
}

// Translates condition descriptions like "Caso passe em 2º do Grupo A" or combined "Caso passe em 2º do Grupo A e avance para as Oitavas de Final"
export function translateCondition(condition: string | null, lang: Language): string | null {
  if (!condition) return null;
  if (lang === 'pt') return condition;

  const parts = condition.split(/\s+e\s+/i);
  const prefix = parts[0];
  const suffix = parts[1];

  let prefixTrans = prefix;
  
  const groupMatch = prefix.match(/^Caso\s+passe\s+em\s+(\d+)º\s+do\s+Grupo\s+([A-L])$/i);
  if (groupMatch) {
    const num = groupMatch[1];
    const group = groupMatch[2];
    if (lang === 'en') {
      const sfx = num === '1' ? 'st' : num === '2' ? 'nd' : 'rd';
      prefixTrans = `If qualifying ${num}${sfx} in Group ${group}`;
    } else if (lang === 'es') {
      prefixTrans = `Si clasifica ${num}º del Grupo ${group}`;
    }
  } else {
    const best3rdMatch = prefix.match(/^Caso\s+passe\s+como\s+melhor\s+3º\s+do\s+Grupo\s+([A-L])$/i);
    if (best3rdMatch) {
      const group = best3rdMatch[1];
      if (lang === 'en') prefixTrans = `If qualifying as best 3rd in Group ${group}`;
      if (lang === 'es') prefixTrans = `Si clasifica como mejor 3º del Grupo ${group}`;
    }
  }

  if (suffix) {
    let suffixTrans = suffix;
    if (suffix.includes('avance para as Oitavas de Final') || suffix.includes('avance para as oitavas')) {
      suffixTrans = lang === 'en' ? 'and advancing to the Round of 16' : 'y avanza a los Octavos de Final';
    } else if (suffix.includes('avance para as Quartas de Final') || suffix.includes('avance para as quartas')) {
      suffixTrans = lang === 'en' ? 'and advancing to the Quarter-finals' : 'y avanza a los Cuartos de Final';
    } else if (suffix.includes('avance para a Semifinal') || suffix.includes('avance para a semifinal')) {
      suffixTrans = lang === 'en' ? 'and advancing to the Semi-finals' : 'y avanza a la Semifinal';
    } else if (suffix.includes('dispute o 3º lugar') || suffix.includes('dispute o terceiro')) {
      suffixTrans = lang === 'en' ? 'and playing the 3rd place match' : 'y disputa el 3º puesto';
    } else if (suffix.includes('avance para a Final') || suffix.includes('avance para a final')) {
      suffixTrans = lang === 'en' ? 'and advancing to the Final' : 'y avanza a la Final';
    }
    return `${prefixTrans} ${suffixTrans}`;
  }

  if (condition.includes('Caso avance para as Oitavas de Final')) {
    return lang === 'en' ? 'If advancing to the Round of 16' : 'Si avanza a los Octavos de Final';
  }
  if (condition.includes('Caso avance para as Quartas de Final')) {
    return lang === 'en' ? 'If advancing to the Quarter-finals' : 'Si avanza a los Cuartos de Final';
  }
  if (condition.includes('Caso avance para a Semifinal')) {
    return lang === 'en' ? 'If advancing to the Semi-finals' : 'Si avanza a la Semifinal';
  }
  if (condition.includes('Caso dispute o 3º lugar')) {
    return lang === 'en' ? 'If playing the 3rd place match' : 'Si disputa el 3º puesto';
  }
  if (condition.includes('Caso avance para a Final')) {
    return lang === 'en' ? 'If advancing to the Final' : 'Si avanza a la Final';
  }

  return prefixTrans;
}

// Translates tournament phase names like "Fase de Grupos", "Oitavas de Final"
export function translatePhase(phase: string, lang: Language): string {
  if (lang === 'pt') return phase;
  
  const phaseLower = phase.toLowerCase();
  
  if (phaseLower.includes('fase de grupos') || phaseLower.includes('matchday')) {
    if (phaseLower.startsWith('matchday')) {
      // e.g. "Matchday 1" -> "Jornada 1" / "Matchday 1"
      const num = phaseLower.replace('matchday', '').trim();
      return lang === 'en' ? `Matchday ${num}` : `Jornada ${num}`;
    }
    return lang === 'en' ? 'Group Stage' : 'Fase de Grupos';
  }
  if (phaseLower.includes('32 avos')) {
    return lang === 'en' ? 'Round of 32' : 'Dieciseisavos de Final';
  }
  if (phaseLower.includes('oitavas')) {
    return lang === 'en' ? 'Round of 16' : 'Octavos de Final';
  }
  if (phaseLower.includes('quartas')) {
    return lang === 'en' ? 'Quarter-finals' : 'Cuartos de Final';
  }
  if (phaseLower.includes('semifinal') || phaseLower.includes('semi-final')) {
    return lang === 'en' ? 'Semi-finals' : 'Semifinal';
  }
  if (phaseLower.includes('disputa de 3º lugar') || phaseLower.includes('3º lugar')) {
    return lang === 'en' ? 'Third-place Playoff' : 'Tercer Puesto';
  }
  if (phaseLower.includes('final')) {
    return lang === 'en' ? 'Final' : 'Final';
  }
  
  return phase;
}

// Helper to calculate language switcher paths
export function getLanguagePath(currentPathname: string, targetLang: Language): string {
  const segments = currentPathname.split('/').filter(Boolean);
  
  // Check if first segment is a language code (en or es)
  const isEn = segments[0] === 'en';
  const isEs = segments[0] === 'es';
  const isPt = segments[0] === 'pt'; // In case someone typed /pt/
  
  if (isEn || isEs || isPt) {
    segments.shift();
  }
  
  if (targetLang !== 'pt') {
    segments.unshift(targetLang);
  }
  
  return '/' + segments.join('/');
}
