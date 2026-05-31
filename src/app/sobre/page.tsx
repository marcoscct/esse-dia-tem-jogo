import Link from "next/link";
import { ArrowLeft, Mail, Info, Compass } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nós — Esse Dia Tem Jogo?",
  description: "Conheça o propósito do Esse Dia Tem Jogo, criado para ajudar torcedores a não marcarem compromissos importantes em dias de jogos.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#ffcc00] selection:text-black">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#ffcc00] hover:text-[#e6b800] transition-colors mb-6 self-start md:self-center font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Início
          </Link>
          <div className="w-24 h-24 mb-4">
            <img
              src="/logo.png"
              alt="Esse Dia Tem Jogo?"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
            Sobre o Projeto
          </h1>
          <div className="w-12 h-1 bg-[#ffcc00] rounded-full mt-3"></div>
        </div>

        {/* Content Box */}
        <div className="bg-[#111111] rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-2xl space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
          
          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#ffcc00]">⚽</span> O Problema Social
            </h2>
            <p>
              Quem nunca passou pelo desespero de receber um convite de casamento, um agendamento de aniversário ou um jantar de família importante e, só depois, perceber que a data coincide exatamente com a semifinal da Copa do Mundo ou com aquele clássico decisivo do seu time do coração?
            </p>
            <p>
              Esse tipo de conflito de agenda costuma gerar discussões, ausências ou pessoas assistindo ao jogo escondidas embaixo da mesa do buffet.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#ffcc00]">💡</span> A Solução: Antes de marcar, confere.
            </h2>
            <p>
              O <strong>Esse Dia Tem Jogo</strong> foi criado para ser o seu "antídoto de gafes sociais esportivas". Com uma interface ultra-rápida, direta e mobile-first, a ferramenta responde à pergunta essencial em menos de 5 segundos: <strong>"Esse dia tem jogo do meu time ou seleção?"</strong>.
            </p>
            <p>
              A regra é clara:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
                <span className="block text-2xl mb-1">⚽</span>
                <span className="font-display font-bold text-red-500 block uppercase tracking-wide">TEM JOGO</span>
                <span className="text-xs text-zinc-500">Bloqueie a agenda imediatamente.</span>
              </div>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 text-center">
                <span className="block text-2xl mb-1">😌</span>
                <span className="font-display font-bold text-[#ffcc00] block uppercase tracking-wide">NÃO TEM JOGO</span>
                <span className="text-xs text-zinc-500">Pode marcar o compromisso sem medo.</span>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#ffcc00]">👥</span> Quem Somos (Castro Brothers)
            </h2>
            <p>
              O projeto foi idealizado e construído pela equipe dos <strong>Castro Brothers</strong>, criadores de conteúdo pioneiros na internet brasileira (conhecidos pelo canal do YouTube, o jogo UTC - Um Joystick Um Violão, e diversos outros projetos de entretenimento).
            </p>
            <p>
              Decidimos criar esta ferramenta para uso próprio e de nossa comunidade, garantindo que ninguém perca os momentos mais emocionantes do futebol.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display font-black text-xl md:text-2xl text-white uppercase tracking-wide flex items-center gap-2">
              <span className="text-[#ffcc00]">✉️</span> Fale Conosco
            </h2>
            <p>
              Tem alguma sugestão de liga que gostaria de ver no site? Encontrou algum horário incorreto ou gostaria de falar sobre anúncios ou parcerias comerciais?
            </p>
            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#ffcc00]/10 rounded-xl flex items-center justify-center text-[#ffcc00] shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 block font-bold uppercase tracking-wider">E-mail de Contato</span>
                <a href="mailto:contato@essediatemjogo.com.br" className="text-white hover:text-[#ffcc00] font-display font-bold text-base md:text-lg transition-colors">
                  contato@essediatemjogo.com.br
                </a>
              </div>
            </div>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-500 text-center">
            Esse Dia Tem Jogo © 2026. Todos os direitos reservados.
          </div>
        </div>
      </main>
    </div>
  );
}
