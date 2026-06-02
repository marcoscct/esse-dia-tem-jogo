// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');

const data = {
  "meta": {
    "version": "1.2",
    "last_updated": "2026-05-15",
    "source": "OpenFootball",
    "competition": "FIFA World Cup 2026",
    "competition_slug": "world_cup_2026",
    "timezone": "America/Sao_Paulo",
    "notes": "Horários em BRT (UTC-3)."
  },
  "teams": {
    "GER": {
      "name": "Alemanha",
      "slug": "alemanha",
      "flag": "🇩🇪",
      "group": "E",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-ger-1", "date": "2026-06-14", "time_brt": "14:00", "opponent_code": "CUW", "opponent_name": "Curaçau", "opponent_flag": "🇨🇼", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "ARG": {
      "name": "Argentina",
      "slug": "argentina",
      "flag": "🇦🇷",
      "group": "J",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-arg-1", "date": "2026-06-17", "time_brt": "02:00", "opponent_code": "ALG", "opponent_name": "Argélia", "opponent_flag": "🇩🇿", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "BRA": {
      "name": "Brasil",
      "slug": "brasil",
      "flag": "🇧🇷",
      "group": "C",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-bra-1", "date": "2026-06-13", "time_brt": "19:00", "opponent_code": "MAR", "opponent_name": "Marrocos", "opponent_flag": "🇲🇦", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "MetLife Stadium", "city": "Nova York", "country": "EUA", "status": "confirmed", "result": null },
        { "id": "wc-bra-2", "date": "2026-06-19", "time_brt": "21:30", "opponent_code": "HAI", "opponent_name": "Haiti", "opponent_flag": "🇭🇹", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "Lincoln Financial", "city": "Filadélfia", "country": "EUA", "status": "confirmed", "result": null },
        { "id": "wc-bra-3", "date": "2026-06-24", "time_brt": "19:00", "opponent_code": "SCO", "opponent_name": "Escócia", "opponent_flag": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "Hard Rock Stadium", "city": "Miami", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "ESP": {
      "name": "Espanha",
      "slug": "espanha",
      "flag": "🇪🇸",
      "group": "H",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-esp-1", "date": "2026-06-15", "time_brt": "13:00", "opponent_code": "CPV", "opponent_name": "Cabo Verde", "opponent_flag": "🇨🇻", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "USA": {
      "name": "Estados Unidos",
      "slug": "estados-unidos",
      "flag": "🇺🇸",
      "group": "A",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-usa-1", "date": "2026-06-12", "time_brt": "16:00", "opponent_code": "WAL", "opponent_name": "País de Gales", "opponent_flag": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "SoFi Stadium", "city": "Los Angeles", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "FRA": {
      "name": "França",
      "slug": "franca",
      "flag": "🇫🇷",
      "group": "I",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-fra-1", "date": "2026-06-16", "time_brt": "16:00", "opponent_code": "SEN", "opponent_name": "Senegal", "opponent_flag": "🇸🇳", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "NED": {
      "name": "Holanda",
      "slug": "holanda",
      "flag": "🇳🇱",
      "group": "B",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-ned-1", "date": "2026-06-15", "time_brt": "11:00", "opponent_code": "AUS", "opponent_name": "Austrália", "opponent_flag": "🇦🇺", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "ENG": {
      "name": "Inglaterra",
      "slug": "inglaterra",
      "flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      "group": "L",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-eng-1", "date": "2026-06-17", "time_brt": "16:00", "opponent_code": "CRO", "opponent_name": "Croácia", "opponent_flag": "🇭🇷", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "JPN": {
      "name": "Japão",
      "slug": "japao",
      "flag": "🇯🇵",
      "group": "D",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-jpn-1", "date": "2026-06-14", "time_brt": "20:00", "opponent_code": "CHI", "opponent_name": "Chile", "opponent_flag": "🇨🇱", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "MAR": {
      "name": "Marrocos",
      "slug": "marrocos",
      "flag": "🇲🇦",
      "group": "C",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-mar-1", "date": "2026-06-13", "time_brt": "19:00", "opponent_code": "BRA", "opponent_name": "Brasil", "opponent_flag": "🇧🇷", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "MetLife Stadium", "city": "Nova York", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "MEX": {
      "name": "México",
      "slug": "mexico",
      "flag": "🇲🇽",
      "group": "A",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-mex-1", "date": "2026-06-11", "time_brt": "17:00", "opponent_code": "NGA", "opponent_name": "Nigéria", "opponent_flag": "🇳🇬", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "Estádio Azteca", "city": "Cidade do México", "country": "México", "status": "confirmed", "result": null }
      ]
    },
    "POR": {
      "name": "Portugal",
      "slug": "portugal",
      "flag": "🇵🇹",
      "group": "K",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-por-1", "date": "2026-06-17", "time_brt": "18:00", "opponent_code": "CGO", "opponent_name": "RD Congo", "opponent_flag": "🇨🇩", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    },
    "URU": {
      "name": "Uruguai",
      "slug": "uruguai",
      "flag": "🇺🇾",
      "group": "F",
      "type": "national_team",
      "status": "active",
      "matches": [
        { "id": "wc-uru-1", "date": "2026-06-16", "time_brt": "15:00", "opponent_code": "KOR", "opponent_name": "Coreia do Sul", "opponent_flag": "🇰🇷", "phase": "Fase de Grupos", "phase_slug": "group_stage", "venue": "A definir", "city": "A definir", "country": "EUA", "status": "confirmed", "result": null }
      ]
    }
  }
};

fs.writeFileSync('public/data/calendar.json', JSON.stringify(data, null, 2));
console.log('Calendar JSON written.');
