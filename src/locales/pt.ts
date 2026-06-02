export const pt = {
  // Common / Home
  "title": "Esse Dia Tem Jogo?",
  "description": "Descubra se sua seleção joga na data que você escolher.",
  "select_team": "Escolha a Seleção",
  "select_day_only": "Escolha somente o dia",
  "or": "OU",
  "start_date": "Data Inicial",
  "select_date": "Escolha a Data",
  "end_date": "Data Final",
  "search_range": "Pesquisar intervalo de datas",
  "please_wait": "Aguarde...",
  "verify": "Verificar",
  "last_updated": "Dados atualizados: {date} | v1.4.0",
  "about": "Sobre",
  "privacy": "Privacidade",
  "terms_of_use": "Termos de Uso",
  "back_home": "Voltar para o Início",
  "about_title": "Sobre o Projeto",
  
  // Results config
  "has_game_heading": "Tem Jogo!",
  "has_game_subheading": "Tome Cuidado!",
  "has_game_desc": "Evite marcar compromissos nesse dia.",

  "possible_game_heading": "Possível Jogo!",
  "possible_game_subheading": "Fique Atento!",
  "possible_game_desc": "Esta seleção pode jogar neste dia.",
  "possible_game_desc_modal": "Esta seleção possui cenários de classificação para este dia.",

  "no_game_heading": "Não Tem Jogo!",
  "no_game_subheading": "Tudo Certo!",
  "no_game_desc": "Dia livre para marcar seus eventos.",
  
  "free_day": "Dia Livre!",
  "new_search": "Fazer nova busca",
  "share_result": "Compartilhar Resultado",
  "copied": "Texto Copiado!",
  "time_tbd": "Horário a confirmar",
  "add_to_calendar": "Adicionar à Agenda",
  "google_calendar": "Google Agenda",
  "outlook_calendar": "Outlook / Microsoft",
  "download_ics": "Baixar arquivo (.ics)",

  // Share templates
  "share_free_range": "Pode marcar compromisso entre os dias {start} e {end}! Eu já garanti que a agenda está livre em http://www.essediatemjogo.com.br",
  "share_free_single": "Pode marcar compromisso no dia {date}! Eu já garanti que a agenda está livre em http://www.essediatemjogo.com.br",
  "share_busy_range": "Não marque nada nesses dias! Os seguintes jogos podem ocorrer entre os dias {start} e {end}:\n{games}\n\nConfira você também em http://www.essediatemjogo.com.br",
  "share_busy_single": "Não marque nada nesse dia! Os seguintes jogos podem ocorrer no dia {date}:\n{games}\n\nConfira você também em http://www.essediatemjogo.com.br",

  // Team names (Portuguese, defaults from calendar.json)
  "teams": {} as Record<string, string>
};
