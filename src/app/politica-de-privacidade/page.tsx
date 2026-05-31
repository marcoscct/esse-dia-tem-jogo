import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Esse Dia Tem Jogo?",
  description: "Política de Privacidade do site Esse Dia Tem Jogo. Saiba como cuidamos dos seus dados e como os anúncios do Google AdSense são exibidos.",
};

export default function PrivacyPolicyPage() {
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
            Política de Privacidade
          </h1>
          <div className="w-12 h-1 bg-[#ffcc00] rounded-full mt-3"></div>
        </div>

        {/* Content Box */}
        <div className="bg-[#111111] rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-2xl space-y-6 text-zinc-300 leading-relaxed text-sm md:text-base">
          <p>
            A sua privacidade é extremamente importante para nós. É política do site <strong>Esse Dia Tem Jogo</strong> respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site, acessível em <a href="http://www.essediatemjogo.com.br" className="text-[#ffcc00] hover:underline font-semibold">www.essediatemjogo.com.br</a>.
          </p>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              1. Coleta de Informações
            </h2>
            <p>
              O site <strong>Esse Dia Tem Jogo</strong> funciona como uma ferramenta utilitária e não exige cadastro, nome, e-mail ou dados bancários para o seu uso comum. Não coletamos dados de identificação pessoal de forma direta dos nossos visitantes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              2. Cookies e Anúncios do Google AdSense
            </h2>
            <p>
              Nós utilizamos o <strong>Google AdSense</strong> para veicular anúncios quando você visita o nosso website. O Google utiliza cookies para veicular anúncios com base em suas visitas anteriores a este ou a outros sites na internet.
            </p>
            <p className="pl-4 border-l-2 border-[#ffcc00]/50 text-zinc-400">
              O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para nossos usuários com base nas visitas feitas a este e/ou a outros sites na internet.
            </p>
            <p>
              Os usuários podem optar por desativar a publicidade personalizada acessando as <a href="https://settings.google.com/ads/preferences" target="_blank" rel="noopener noreferrer" className="text-[#ffcc00] hover:underline">Configurações de Anúncios do Google</a>. Alternativamente, você pode desativar o uso de cookies de terceiros para publicidade personalizada visitando a página <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#ffcc00] hover:underline">www.aboutads.info</a>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              3. Cookies de Terceiros e Analytics
            </h2>
            <p>
              Podemos usar ferramentas de análise de tráfego (como o Google Analytics) que coletam informações anônimas de navegação, como páginas visitadas, tempo de permanência e tipo de dispositivo, unicamente para entender o volume de acessos e melhorar o desempenho técnico do site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              4. Ligações a Sites de Terceiros
            </h2>
            <p>
              Nosso site pode conter links para outros sites externos que não são operados por nós (como links para informações de campeonatos oficiais ou parceiros comerciais). Não nos responsabilizamos pelo conteúdo e políticas de privacidade de terceiros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              5. Consentimento e LGPD
            </h2>
            <p>
              Ao utilizar nosso site, você concorda com a nossa política de privacidade. Em conformidade com a Lei Geral de Proteção de Dados (LGPD) no Brasil, garantimos que nenhum dado pessoal sensível é armazenado ou processado sem a devida base legal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              6. Contato e Dúvidas
            </h2>
            <p>
              Se você tiver alguma dúvida sobre como lidamos com dados de usuários e informações pessoais, entre em contato conosco através do e-mail: <span className="text-[#ffcc00] font-semibold">contato@essediatemjogo.com.br</span>.
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-500 text-center">
            Esta política é aplicável a partir de 30 de maio de 2026.
          </div>
        </div>
      </main>
    </div>
  );
}
