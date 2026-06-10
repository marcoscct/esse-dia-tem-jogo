import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import type { Language } from "@/locales/i18n-utils";

interface Props {
  lang: Language;
}

const content = {
  pt: {
    back: "Voltar para o Início",
    title: "Termos de Uso",
    p1: "Ao acessar o site Esse Dia Tem Jogo (disponível em www.essediatemjogo.com.br), você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.",
    s1_title: "1. Licença de Uso",
    s1_p1: "É concedida permissão para visualizar temporariamente as informações e calendários disponíveis no site para uso pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença você não pode:",
    s1_l1: "Modificar ou copiar os materiais do site;",
    s1_l2: "Utilizar os dados do calendário para fins comerciais sem consentimento prévio por escrito;",
    s1_l3: "Tentativa de engenharia reversa de qualquer código do site;",
    s1_l4: "Remover quaisquer direitos autorais dos materiais; ou",
    s1_l5: "Transferir ou espelhar os materiais em qualquer outro servidor.",
    s2_title: "2. Isenção de Responsabilidade (Aviso Importante!)",
    s2_warn: "Atenção: Embora nos esforcemos para manter todas as datas, horários e confrontos de jogos atualizados e corretos (com base em dados públicos e comunitários), as confederações esportivas (como FIFA, CBF, CONMEBOL, etc.) podem alterar datas ou horários de partidas sem aviso prévio.",
    s2_p1: "Portanto, as informações do site são fornecidas \"como estão\". O Esse Dia Tem Jogo não oferece garantias implícitas ou explícitas de que os dados estejam 100% livres de erros a todo momento. Não nos responsabilizamos por quaisquer compromissos, agendamentos, viagens ou eventos pessoais marcados de forma equivocada com base nas consultas realizadas nesta plataforma. Recomendamos sempre a dupla checagem nos canais oficiais das respectivas competições.",
    s3_title: "3. Links de Terceiros e Anúncios",
    s3_p1: "O site pode conter links para outros sites de terceiros ou exibir anúncios dinâmicos. Nós não revisamos todos os sites vinculados de forma contínua e não somos responsáveis pelo conteúdo ou práticas de privacidade de qualquer site parceiro ou anunciante.",
    s4_title: "4. Modificações nos Termos",
    s4_p1: "Podemos revisar estes termos de serviço a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual destes termos de serviço.",
    s5_title: "5. Lei Aplicável",
    s5_p1: "Estes termos e condições são regidos e interpretados de acordo com as leis brasileiras e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais competentes no Brasil.",
    footer: "Termos atualizados em 30 de maio de 2026."
  },
  en: {
    back: "Back to Home",
    title: "Terms of Use",
    p1: "By accessing the website Is There a Game Today (available at www.essediatemjogo.com.br), you agree to comply with these terms of service, all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this website.",
    s1_title: "1. Use License",
    s1_p1: "Permission is granted to temporarily view the information and calendars available on the site for personal, non-commercial use. This is the grant of a license, not a transfer of title, and under this license you may not:",
    s1_l1: "Modify or copy the materials on the site;",
    s1_l2: "Use calendar data for commercial purposes without prior written consent;",
    s1_l3: "Attempt to reverse engineer any code on the site;",
    s1_l4: "Remove any copyright notations from materials; or",
    s1_l5: "Transfer or mirror materials on any other server.",
    s2_title: "2. Disclaimer (Important Warning!)",
    s2_warn: "Warning: While we strive to keep all dates, times and match fixtures updated and correct (based on public and community databases), sports associations (such as FIFA, CBF, CONMEBOL, etc.) may change dates or times of games without prior notice.",
    s2_p1: "Therefore, information on the website is provided 'as is'. Is There a Game Today makes no warranties, implied or explicit, that the data is 100% error-free at all times. We are not responsible for any personal commitments, appointments, travel plans or events incorrectly scheduled based on queries made on this platform. We always recommend double-checking official competition channels.",
    s3_title: "3. Third-Party Links and Advertisements",
    s3_p1: "The website may contain links to third-party sites or display dynamic ads. We do not continuously review all linked sites and are not responsible for the content or privacy practices of any partner or advertiser.",
    s4_title: "4. Modifying Terms",
    s4_p1: "We may revise these terms of service at any time without notice. By using this website, you agree to be bound by the then-current version of these terms of service.",
    s5_title: "5. Governing Law",
    s5_p1: "These terms and conditions are governed by and construed in accordance with Brazilian laws and you irrevocably submit to the exclusive jurisdiction of the competent courts in Brazil.",
    footer: "Terms updated on May 30, 2026."
  },
  es: {
    back: "Volver al Inicio",
    title: "Términos de Uso",
    p1: "Al acceder al sitio web ¿Este Día Hay Partido? (disponible en www.essediatemjogo.com.br), usted acepta cumplir con estos términos de servicio, todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sitio.",
    s1_title: "1. Licencia de Uso",
    s1_p1: "Se concede permiso para ver temporalmente la información y los calendarios disponibles en el sitio únicamente para uso personal y no comercial. Esta es la concesión de una licencia, no una transferencia de título, y bajo esta licencia usted no puede:",
    s1_l1: "Modificar o copiar los materiales del sitio;",
    s1_l2: "Utilizar los datos del calendario para fines comerciales sin consentimiento previo por escrito;",
    s1_l3: "Intentar realizar ingeniería inversa de cualquier código del sitio web;",
    s1_l4: "Eliminar cualquier marca de derechos de autor de los materiales; o",
    s1_l5: "Transferir o 'reflejar' los materiales en cualquier otro servidor.",
    s2_title: "2. Descargo de Responsabilidad (¡Aviso Importante!)",
    s2_warn: "Atención: Aunque nos esforzamos por mantener todas las fechas, horarios y emparejamientos de partidos actualizados y correctos (basados en bases de datos públicas y comunitarias), las asociaciones deportivas (como FIFA, CBF, CONMEBOL, etc.) pueden cambiar las fechas u horarios de los partidos sin previo aviso.",
    s2_p1: "Por lo tanto, la información en el sitio web se proporciona 'tal cual'. ¿Este Día Hay Partido? no ofrece garantías implícitas o explícitas de que los datos estén 100% libres de errores en todo momento. No nos responsabilizamos por compromisos personales, citas, planes de viaje o eventos programados erróneamente sobre la base de las consultas realizadas en esta plataforma. Recomendamos siempre realizar una doble verificación en los canales oficiales de las respectivas competiciones.",
    s3_title: "3. Enlaces de Terceros y Publicidad",
    s3_p1: "El sitio web puede contener enlaces a sitios de terceros o mostrar anuncios dinámicos. No revisamos de forma de forma continua todos los sitios vinculados y no somos responsables del contenido o las prácticas de privacidad de ningún socio o anunciante.",
    s4_title: "4. Modificación de los Términos",
    s4_p1: "Podemos revisar estos términos de servicio en cualquier momento sin previo aviso. Al utilizar este sitio web, usted acepta estar sujeto a la versión vigente en ese momento de estos términos de servicio.",
    s5_title: "5. Ley Aplicable",
    s5_p1: "Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes brasileñas y usted se somete irrevocablemente a la jurisdicción exclusiva de los tribunales competentes en Brasil.",
    footer: "Términos actualizados el 30 de mayo de 2026."
  }
};

export default function LocalizedTermsPage({ lang }: Props) {
  const t = content[lang];
  const langPrefix = lang === "pt" ? "" : `/${lang}`;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-[#ffcc00] selection:text-black">
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <Link href={langPrefix || "/"} className="inline-flex items-center gap-2 text-sm text-[#ffcc00] hover:text-[#e6b800] transition-colors mb-6 self-start md:self-center font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>
          <div className="w-24 h-24 mb-4">
            <Image
              src="/logo.webp"
              alt="Esse Dia Tem Jogo?"
              width={96}
              height={96}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white uppercase tracking-tight">
            {t.title}
          </h1>
          <div className="w-12 h-1 bg-[#ffcc00] rounded-full mt-3"></div>
        </div>

        {/* Content Box */}
        <div className="bg-[#111111] rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-2xl space-y-6 text-zinc-300 leading-relaxed text-sm md:text-base">
          <p>{t.p1}</p>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              {t.s1_title}
            </h2>
            <p>{t.s1_p1}</p>
            <ul className="list-disc pl-6 space-y-1.5 text-zinc-400">
              <li>{t.s1_l1}</li>
              <li>{t.s1_l2}</li>
              <li>{t.s1_l3}</li>
              <li>{t.s1_l4}</li>
              <li>{t.s1_l5}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              {t.s2_title}
            </h2>
            <p className="bg-amber-950/20 border border-amber-900/50 rounded-xl p-4 text-amber-200">
              ⚠️ {t.s2_warn}
            </p>
            <p>{t.s2_p1}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              {t.s3_title}
            </h2>
            <p>{t.s3_p1}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              {t.s4_title}
            </h2>
            <p>{t.s4_p1}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              {t.s5_title}
            </h2>
            <p>{t.s5_p1}</p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 text-center">
            {t.footer}
          </div>
        </div>
      </main>
    </div>
  );
}
