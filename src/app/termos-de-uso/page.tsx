import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso — Esse Dia Tem Jogo?",
  description: "Termos de Uso do site Esse Dia Tem Jogo. Leia as condições de utilização dos nossos serviços e calendários de jogos.",
};

export default function TermsOfUsePage() {
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
              src="/logo_transparente.png"
              alt="Esse Dia Tem Jogo?"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
            Termos de Uso
          </h1>
          <div className="w-12 h-1 bg-[#ffcc00] rounded-full mt-3"></div>
        </div>

        {/* Content Box */}
        <div className="bg-[#111111] rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-2xl space-y-6 text-zinc-300 leading-relaxed text-sm md:text-base">
          <p>
            Ao acessar o site <strong>Esse Dia Tem Jogo</strong> (disponível em <a href="http://www.essediatemjogo.com.br" className="text-[#ffcc00] hover:underline font-semibold">www.essediatemjogo.com.br</a>), você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
          </p>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              1. Licença de Uso
            </h2>
            <p>
              É concedida permissão para visualizar temporariamente as informações e calendários disponíveis no site para uso pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença você não pode:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-zinc-400">
              <li>Modificar ou copiar os materiais do site;</li>
              <li>Utilizar os dados do calendário para fins comerciais sem consentimento prévio por escrito;</li>
              <li>Tentar descompilar ou fazer engenharia reversa de qualquer código do site;</li>
              <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
              <li>Transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              2. Isenção de Responsabilidade (Aviso Importante!)
            </h2>
            <p className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-4 text-amber-200">
              ⚠️ <strong>Atenção:</strong> Embora nos esforcemos para manter todas as datas, horários e confrontos de jogos atualizados e corretos (com base em dados públicos e comunitários), as confederações esportivas (como FIFA, CBF, CONMEBOL, etc.) podem alterar datas ou horários de partidas sem aviso prévio.
            </p>
            <p>
              Portanto, as informações do site são fornecidas "como estão". O <strong>Esse Dia Tem Jogo</strong> não oferece garantias implícitas ou explícitas de que os dados estejam 100% livres de erros a todo momento. Não nos responsabilizamos por quaisquer compromissos, agendamentos, viagens ou eventos pessoais marcados de forma equivocada com base nas consultas realizadas nesta plataforma. Recomendamos sempre a dupla checagem nos canais oficiais das respectivas competições.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              3. Links de Terceiros e Anúncios
            </h2>
            <p>
              O site pode conter links para outros sites de terceiros ou exibir anúncios dinâmicos. Nós não revisamos todos os sites vinculados de forma contínua e não somos responsáveis pelo conteúdo ou práticas de privacidade de qualquer site parceiro ou anunciante. A inclusão de qualquer link ou anúncio não implica endosso por nossa parte.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              4. Modificações nos Termos
            </h2>
            <p>
              Podemos revisar estes termos de serviço a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual destes termos de serviço.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              5. Lei Aplicável
            </h2>
            <p>
              Estes termos e condições são regidos e interpretados de acordo com as leis brasileiras e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais competentes no Brasil.
            </p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-500 text-center">
            Termos atualizados em 30 de maio de 2026.
          </div>
        </div>
      </main>
    </div>
  );
}
