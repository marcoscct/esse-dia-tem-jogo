#!/usr/bin/env node
/**
 * scripts/transform-clubs.js
 * Scrapes and compiles Série A, Série B, Libertadores, and Copa do Brasil fixtures
 * from Globo Esporte for 2026. Generates public/data/clubs_calendar.json.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'clubs_calendar.json');

// Map of the 40 Série A and Série B teams of 2026 with their codes and badge URLs.
const CLUB_INFO = {
  "PAL": { "name": "Palmeiras", "badge": "https://s.sde.globo.com/media/organizations/2019/07/06/Palmeiras.svg" },
  "FLA": { "name": "Flamengo", "badge": "https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg" },
  "FLU": { "name": "Fluminense", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/fluminense.svg" },
  "CAP": { "name": "Athletico-PR", "badge": "https://s.sde.globo.com/media/organizations/2026/01/07/Athletico-PR.svg" },
  "RBB": { "name": "Bragantino", "badge": "https://s.sde.globo.com/media/organizations/2021/06/28/bragantino.svg" },
  "BAH": { "name": "Bahia", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/bahia.svg" },
  "CFC": { "name": "Coritiba", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/coritiba.svg" },
  "SAO": { "name": "São Paulo", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/sao-paulo.svg" },
  "CAM": { "name": "Atlético-MG", "badge": "https://s.sde.globo.com/media/organizations/2018/03/10/atletico-mg.svg" },
  "COR": { "name": "Corinthians", "badge": "https://s.sde.globo.com/media/organizations/2024/10/09/Corinthians_2024_Q4ahot4.svg" },
  "CRU": { "name": "Cruzeiro", "badge": "https://s.sde.globo.com/media/organizations/2021/02/13/cruzeiro_2021.svg" },
  "BOT": { "name": "Botafogo", "badge": "https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg" },
  "VIT": { "name": "Vitória", "badge": "https://s.sde.globo.com/media/organizations/2025/12/18/Vitoria_2025.svg" },
  "INT": { "name": "Internacional", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/internacional.svg" },
  "SAN": { "name": "Santos", "badge": "https://s.sde.globo.com/media/organizations/2018/03/12/santos.svg" },
  "GRE": { "name": "Grêmio", "badge": "https://s.sde.globo.com/media/organizations/2018/03/12/gremio.svg" },
  "VAS": { "name": "Vasco", "badge": "https://s.sde.globo.com/media/organizations/2021/09/04/vasco_SVG.svg" },
  "REM": { "name": "Remo", "badge": "https://s.sde.globo.com/media/organizations/2021/02/25/Remo-PA.svg" },
  "MIR": { "name": "Mirassol", "badge": "https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg" },
  "CHA": { "name": "Chapecoense", "badge": "https://s.sde.globo.com/media/organizations/2021/06/21/CHAPECOENSE-2018.svg" },
  "SPT": { "name": "Sport", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg" },
  "VNO": { "name": "Vila Nova", "badge": "https://s.sde.globo.com/media/organizations/2021/04/07/vilanova.svg" },
  "SBD": { "name": "São Bernardo", "badge": "https://s.sde.globo.com/media/organizations/2022/01/20/Sao_Bernardo.svg" },
  "NAU": { "name": "Náutico", "badge": "https://s.sde.globo.com/media/organizations/2019/01/03/Nautico.svg" },
  "FOR": { "name": "Fortaleza", "badge": "https://s.sde.globo.com/media/organizations/2021/09/19/Fortaleza_2021_1.svg" },
  "GOI": { "name": "Goiás", "badge": "https://s.sde.globo.com/media/organizations/2021/03/01/GOIAS-2021.svg" },
  "NOV": { "name": "Novorizontino", "badge": "https://s.sde.globo.com/media/organizations/2019/01/08/Novohorizontino.svg" },
  "CRI": { "name": "Criciúma", "badge": "https://s.sde.globo.com/media/teams/2026/01/16/criciuma-2026-svg-79692.svg" },
  "ATH": { "name": "Athletic Club", "badge": "https://s.sde.globo.com/media/organizations/2025/01/22/Athletic_Club-mineiro.svg" },
  "JUV": { "name": "Juventude", "badge": "https://s.sde.globo.com/media/organizations/2021/04/29/Juventude-2021-01.svg" },
  "OPE": { "name": "Operário-PR", "badge": "https://s.sde.globo.com/media/organizations/2018/12/27/Operário-PR.svg" },
  "CRB": { "name": "CRB", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/crb.svg" },
  "CEA": { "name": "Ceará", "badge": "https://s.sde.globo.com/media/organizations/2019/10/10/ceara.svg" },
  "ACG": { "name": "Atlético-GO", "badge": "https://s.sde.globo.com/media/organizations/2020/07/02/atletico-go-2020.svg" },
  "CUI": { "name": "Cuiabá", "badge": "https://s.sde.globo.com/media/organizations/2018/12/26/Cuiaba_EC.svg" },
  "BSP": { "name": "Botafogo-SP", "badge": "https://s.sde.globo.com/media/organizations/2024/05/15/BFC.svg" },
  "AVA": { "name": "Avaí", "badge": "https://s.sde.globo.com/media/organizations/2024/05/12/avaí.svg" },
  "LEC": { "name": "Londrina", "badge": "https://s.sde.globo.com/media/organizations/2018/03/11/londrina.svg" },
  "PON": { "name": "Ponte Preta", "badge": "https://s.sde.globo.com/media/organizations/2019/03/17/ponte-preta.svg" },
  "AME": { "name": "América-MG", "badge": "https://s.sde.globo.com/media/organizations/2024/05/07/America-MG-branco.svg" }
};

function slugify(name) {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch helper with simple retries
async function fetchJson(url) {
  let attempts = 3;
  while (attempts > 0) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (err) {
      attempts--;
      if (attempts === 0) throw err;
      await delay(500);
    }
  }
}

// Generate default broadcasts based on competition
function getBroadcasts(competition, match) {
  // Check if GE has defined standard transmission
  if (match.transmissao && match.transmissao.label) {
    const label = match.transmissao.label.toLowerCase();
    const channels = [];
    if (label.includes('globo')) channels.push('Globo');
    if (label.includes('sportv')) channels.push('SporTV');
    if (label.includes('sbt')) channels.push('SBT');
    if (label.includes('caze') || label.includes('cazé')) channels.push('CazéTV');
    if (label.includes('premiere')) channels.push('Premiere');
    if (label.includes('prime') || label.includes('amazon')) channels.push('Prime Video');
    if (label.includes('espn')) channels.push('ESPN');
    if (label.includes('disney')) channels.push('Disney+');
    if (label.includes('hbo') || label.includes('max')) channels.push('Max');
    if (label.includes('paramount')) channels.push('Paramount+');
    if (channels.length > 0) return channels;
  }

  // Default fallbacks if no broadcasts specified
  if (competition === 'brasileirao-a') {
    // Standard Brasileirão A defaults: Premiere for almost all, Globo sometimes
    return ['Premiere'];
  }
  if (competition === 'brasileirao-b') {
    return ['Premiere'];
  }
  if (competition === 'copa-do-brasil') {
    return ['Prime Video', 'SporTV', 'Premiere'];
  }
  if (competition === 'libertadores') {
    return ['ESPN', 'Paramount+'];
  }
  return [];
}

async function main() {
  console.log('🏁 Starting club fixtures transformer...');

  // Initialize output teams object
  const calendarTeams = {};
  for (const [code, info] of Object.entries(CLUB_INFO)) {
    calendarTeams[code] = {
      name: info.name,
      slug: slugify(info.name),
      flag: '🛡️', // Default emoji flag, but getFlagUrl will overwrite this with badge SVG URL
      group: null,
      type: 'club',
      status: 'active',
      matches: []
    };
  }

  // Competitions config
  const competitions = [
    {
      id: 'brasileirao-a',
      tUUID: 'd1a37fa4-e948-43a6-ba53-ab24ab3a45b1',
      phaseSlug: 'fase-unica-campeonato-brasileiro-2026',
      roundsCount: 38
    },
    {
      id: 'brasileirao-b',
      tUUID: '009b5a68-dd09-46b8-95b3-293a2d494366',
      phaseSlug: 'brasileiro-serie-b-2026-fase-unica',
      roundsCount: 38
    },
    {
      id: 'libertadores-group',
      tUUID: '83ad0ca5-f84e-4906-9242-a40d6585ebca',
      phaseSlug: 'fase-de-grupos-libertadores-2026',
      roundsCount: 6
    }
  ];

  // Helper to insert a match for a team
  const addMatch = (teamCode, matchData) => {
    if (calendarTeams[teamCode]) {
      // Avoid duplicate matches by checking GE match id
      const exists = calendarTeams[teamCode].matches.some(m => m.id === matchData.id);
      if (!exists) {
        calendarTeams[teamCode].matches.push(matchData);
      }
    }
  };

  // 1. Fetch Rounds-based competitions (Série A, Série B, Libertadores Group Stage)
  for (const comp of competitions) {
    console.log(`📡 Fetching ${comp.id}...`);
    for (let r = 1; r <= comp.roundsCount; r++) {
      const url = `https://api.globoesporte.globo.com/tabela/${comp.tUUID}/fase/${comp.phaseSlug}/rodada/${r}/jogos/`;
      try {
        const games = await fetchJson(url);
        if (Array.isArray(games)) {
          games.forEach(g => {
            const dateStr = g.data_realizacao ? g.data_realizacao.slice(0, 10) : '';
            if (!dateStr) return; // Skip matches without a date

            const timeStr = g.hora_realizacao || (g.data_realizacao ? g.data_realizacao.slice(11, 16) : null);
            const home = g.equipes.mandante;
            const away = g.equipes.visitante;

            const homeCode = home.sigla.toUpperCase();
            const awayCode = away.sigla.toUpperCase();

            const matchId = `cbr2026-${g.id}`;
            const phaseLabel = comp.id.startsWith('libertadores') ? `Grupo - Rodada ${r}` : `${r}ª rodada`;
            const phaseSlug = comp.phaseSlug;

            // Save match for home team
            if (CLUB_INFO[homeCode]) {
              addMatch(homeCode, {
                id: `${matchId}-H`,
                date: dateStr,
                time_brt: timeStr,
                opponent_code: awayCode,
                opponent_name: CLUB_INFO[awayCode] ? CLUB_INFO[awayCode].name : away.nome_popular,
                opponent_flag: null,
                phase: phaseLabel,
                phase_slug: phaseSlug,
                venue: g.sede ? g.sede.nome_popular : null,
                city: g.sede ? g.sede.nome_popular : null,
                status: 'confirmed',
                result: g.placar_oficial_mandante !== null ? { home: g.placar_oficial_mandante, away: g.placar_oficial_visitante } : null,
                broadcasts: getBroadcasts(comp.id, g),
                is_home: true
              });
            }

            // Save match for away team
            if (CLUB_INFO[awayCode]) {
              addMatch(awayCode, {
                id: `${matchId}-A`,
                date: dateStr,
                time_brt: timeStr,
                opponent_code: homeCode,
                opponent_name: CLUB_INFO[homeCode] ? CLUB_INFO[homeCode].name : home.nome_popular,
                opponent_flag: null,
                phase: phaseLabel,
                phase_slug: phaseSlug,
                venue: g.sede ? g.sede.nome_popular : null,
                city: g.sede ? g.sede.nome_popular : null,
                status: 'confirmed',
                result: g.placar_oficial_mandante !== null ? { home: g.placar_oficial_mandante, away: g.placar_oficial_visitante } : null,
                broadcasts: getBroadcasts(comp.id, g),
                is_home: false
              });
            }
          });
        }
        await delay(50); // Be friendly
      } catch (err) {
        console.error(`⚠️ Failed to fetch ${comp.id} round ${r}: ${err.message}`);
      }
    }
  }

  // 2. Fetch Copa do Brasil Knockout fixtures (Oitavas de final)
  console.log('📡 Fetching Copa do Brasil...');
  try {
    const r = await fetch('https://ge.globo.com/futebol/copa-do-brasil/');
    const html = await r.text();
    const m = html.match(/id=\x22scriptReact\x22>([\s\S]*?)<\/script>/)[1];
    const c = m.match(/const classificacao = (\{[\s\S]*?\});/)[1];
    const cdbData = JSON.parse(c);

    if (cdbData && cdbData.secao && cdbData.secao[0] && cdbData.secao[0].chave) {
      cdbData.secao[0].chave.forEach(chave => {
        if (Array.isArray(chave.jogos)) {
          chave.jogos.forEach(g => {
            const dateStr = g.data_realizacao ? g.data_realizacao.slice(0, 10) : '';
            // If date is missing (TBD), we can skip or use a fallback date. We keep it only if date exists.
            if (!dateStr) return;

            const timeStr = g.hora_realizacao || (g.data_realizacao ? g.data_realizacao.slice(11, 16) : null);
            const home = g.equipes.mandante;
            const away = g.equipes.visitante;

            const homeCode = home.sigla.toUpperCase();
            const awayCode = away.sigla.toUpperCase();

            // GE id is missing in Copa do Brasil sometimes (it's null in mockup).
            // We can generate a deterministic ID.
            const matchId = `cdb2026-${slugify(home.nome_popular)}-vs-${slugify(away.nome_popular)}-${dateStr}`;
            const phaseLabel = 'Oitavas de final';
            const phaseSlug = cdbData.fase.slug || 'oitavas-de-final-copa-do-brasil-2026';

            // Home match
            if (CLUB_INFO[homeCode]) {
              addMatch(homeCode, {
                id: `${matchId}-H`,
                date: dateStr,
                time_brt: timeStr,
                opponent_code: awayCode,
                opponent_name: CLUB_INFO[awayCode] ? CLUB_INFO[awayCode].name : away.nome_popular,
                opponent_flag: null,
                phase: phaseLabel,
                phase_slug: phaseSlug,
                venue: g.sede ? g.sede.nome_popular : null,
                city: g.sede ? g.sede.nome_popular : null,
                status: 'confirmed',
                result: g.placar_oficial_mandante !== null ? { home: g.placar_oficial_mandante, away: g.placar_oficial_visitante } : null,
                broadcasts: getBroadcasts('copa-do-brasil', g),
                is_home: true
              });
            }

            // Away match
            if (CLUB_INFO[awayCode]) {
              addMatch(awayCode, {
                id: `${matchId}-A`,
                date: dateStr,
                time_brt: timeStr,
                opponent_code: homeCode,
                opponent_name: CLUB_INFO[homeCode] ? CLUB_INFO[homeCode].name : home.nome_popular,
                opponent_flag: null,
                phase: phaseLabel,
                phase_slug: phaseSlug,
                venue: g.sede ? g.sede.nome_popular : null,
                city: g.sede ? g.sede.nome_popular : null,
                status: 'confirmed',
                result: g.placar_oficial_mandante !== null ? { home: g.placar_oficial_mandante, away: g.placar_oficial_visitante } : null,
                broadcasts: getBroadcasts('copa-do-brasil', g),
                is_home: false
              });
            }
          });
        }
      });
    }
  } catch (err) {
    console.error(`⚠️ Failed to fetch Copa do Brasil: ${err.message}`);
  }

  // 3. Fetch Libertadores Knockout fixtures (Oitavas de final)
  console.log('📡 Fetching Libertadores Oitavas...');
  try {
    const r = await fetch('https://ge.globo.com/futebol/libertadores/');
    const html = await r.text();
    const m = html.match(/id=\x22scriptReact\x22>([\s\S]*?)<\/script>/)[1];
    const c = m.match(/const classificacao = (\{[\s\S]*?\});/)[1];
    const libData = JSON.parse(c);

    if (libData && libData.secao) {
      libData.secao.forEach(secao => {
        if (Array.isArray(secao.chave)) {
          secao.chave.forEach(chave => {
            if (Array.isArray(chave.jogos)) {
              chave.jogos.forEach(g => {
                const dateStr = g.data_realizacao ? g.data_realizacao.slice(0, 10) : '';
                if (!dateStr) return;

                const timeStr = g.hora_realizacao || (g.data_realizacao ? g.data_realizacao.slice(11, 16) : null);
                const home = g.equipes.mandante;
                const away = g.equipes.visitante;

                const homeCode = home.sigla.toUpperCase();
                const awayCode = away.sigla.toUpperCase();

                const matchId = `lib2026-ko-${slugify(home.nome_popular)}-vs-${slugify(away.nome_popular)}-${dateStr}`;
                const phaseLabel = 'Oitavas de final';
                const phaseSlug = libData.fase.slug || 'oitavas-de-final-libertadores-2026';

                // Home match
                if (CLUB_INFO[homeCode]) {
                  addMatch(homeCode, {
                    id: `${matchId}-H`,
                    date: dateStr,
                    time_brt: timeStr,
                    opponent_code: awayCode,
                    opponent_name: CLUB_INFO[awayCode] ? CLUB_INFO[awayCode].name : away.nome_popular,
                    opponent_flag: null,
                    phase: phaseLabel,
                    phase_slug: phaseSlug,
                    venue: g.sede ? g.sede.nome_popular : null,
                    city: g.sede ? g.sede.nome_popular : null,
                    status: 'confirmed',
                    result: g.placar_oficial_mandante !== null ? { home: g.placar_oficial_mandante, away: g.placar_oficial_visitante } : null,
                    broadcasts: getBroadcasts('libertadores', g),
                    is_home: true
                  });
                }

                // Away match
                if (CLUB_INFO[awayCode]) {
                  addMatch(awayCode, {
                    id: `${matchId}-A`,
                    date: dateStr,
                    time_brt: timeStr,
                    opponent_code: homeCode,
                    opponent_name: CLUB_INFO[homeCode] ? CLUB_INFO[homeCode].name : home.nome_popular,
                    opponent_flag: null,
                    phase: phaseLabel,
                    phase_slug: phaseSlug,
                    venue: g.sede ? g.sede.nome_popular : null,
                    city: g.sede ? g.sede.nome_popular : null,
                    status: 'confirmed',
                    result: g.placar_oficial_mandante !== null ? { home: g.placar_oficial_mandante, away: g.placar_oficial_visitante } : null,
                    broadcasts: getBroadcasts('libertadores', g),
                    is_home: false
                  });
                }
              });
            }
          });
        }
      });
    }
  } catch (err) {
    console.error(`⚠️ Failed to fetch Libertadores knockout: ${err.message}`);
  }

  // Sort matches for each club by date
  for (const team of Object.values(calendarTeams)) {
    team.matches.sort((a, b) => a.date.localeCompare(b.date));
  }

  // Compile full Calendar object
  const outputCalendar = {
    meta: {
      version: '1.0',
      last_updated: new Date().toISOString().slice(0, 10),
      source: 'ge.globo.com scraper',
      competition: 'Clubes do Brasil - Série A, Série B, Copa do Brasil e Libertadores 2026',
      competition_slug: 'clubes_brasil_2026',
      timezone: 'America/Sao_Paulo',
      notes: 'Gerado automaticamente por scripts/transform-clubs.js'
    },
    teams: calendarTeams
  };

  // Write file to output path
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(outputCalendar, null, 2), 'utf-8');
  console.log(`🎉 Saved ${Object.keys(CLUB_INFO).length} teams' fixtures successfully to: ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('💥 Script crashed:', err);
  process.exit(1);
});
