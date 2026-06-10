import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import Image from "next/image";
import type { Language } from "@/locales/i18n-utils";

interface Props {
  lang: Language;
}

const content = {
  pt: {
    back: "Voltar para o Início",
    title: "Política de Cookies",
    p1: "Esta Política de Cookies explica o que são cookies, como os usamos, os tipos de cookies que utilizamos (ou seja, as informações que coletamos por meio de cookies e como essas informações são usadas) e como controlar as preferências de cookies.",
    section1_title: "1. O que são cookies?",
    section1_p: "Cookies são pequenos arquivos de texto usados para armazenar pequenas informações. Eles são armazenados no seu dispositivo quando o site é carregado no seu navegador. Esses cookies nos ajudam a fazer o site funcionar corretamente, torná-lo mais seguro, fornecer uma melhor experiência ao usuário, entender como o site funciona e analisar o que funciona e onde precisa de melhorias.",
    section2_title: "2. Como usamos os cookies?",
    section2_p: "Como a maioria dos serviços online, nosso site usa cookies primários e cookies de terceiros para diversos fins. Os cookies primários são principalmente necessários para que o site funcione da maneira correta e não coletam nenhum de seus dados de identificação pessoal.",
    section2_p2: "Os cookies de terceiros usados em nosso site são principalmente para entender o desempenho do site, como você interage com ele, mantendo nossos serviços seguros, fornecendo anúncios que são relevantes para você (por meio de redes de parceiros como o Google AdSense) e, em geral, proporcionando-lhe uma experiência de usuário aprimorada.",
    section3_title: "3. Tipos de Cookies que utilizamos",
    section3_p: "• Essenciais: Alguns cookies são essenciais para que você possa experimentar a funcionalidade completa do nosso site. Eles nos permitem manter as sessões do usuário e prevenir quaisquer ameaças de segurança.",
    section3_p2: "• Estatísticas/Analytics: Esses cookies armazenam informações como o número de visitantes do site, o número de visitantes únicos, quais páginas do site foram visitadas, a origem da visita, etc. Esses dados nos ajudam a entender e analisar o desempenho do site e onde ele precisa de melhorias (por exemplo, usando o Vercel Analytics).",
    section3_p3: "• Marketing e Anúncios (Google AdSense): Nosso site exibe anúncios. Esses cookies são usados para personalizar os anúncios que mostramos a você para que sejam significativos. Esses cookies também nos ajudam a acompanhar a eficiência dessas campanhas publicitárias. Os cookies de publicidade de terceiros também podem ser usados pelos fornecedores de anúncios para mostrar anúncios em outros sites no navegador.",
    section4_title: "4. Como posso controlar as preferências de cookies?",
    section4_p: "Caso decida alterar suas preferências mais tarde através da sua sessão de navegação, você pode clicar na guia correspondente do seu navegador ou limpar os cookies manualmente em suas configurações de privacidade e segurança. Para saber mais sobre como gerenciar e excluir cookies, visite wikipedia.org ou allaboutcookies.org.",
    footer: "Esse Dia Tem Jogo © 2026. Todos os direitos reservados."
  },
  en: {
    back: "Back to Home",
    title: "Cookie Policy",
    p1: "This Cookie Policy explains what cookies are and how we use them, the types of cookies we use (i.e., the information we collect using cookies and how that information is used), and how to control cookie preferences.",
    section1_title: "1. What are cookies?",
    section1_p: "Cookies are small text files used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, provide a better user experience, and understand how the website performs and analyze what works and where it needs improvement.",
    section2_title: "2. How do we use cookies?",
    section2_p: "Like most online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way, and they do not collect any of your personally identifiable data.",
    section2_p2: "The third-party cookies used on our website are mainly for understanding how the website performs, how you interact with our website, keeping our services secure, providing advertisements that are relevant to you (via partner networks like Google AdSense), and overall providing you with a better user experience.",
    section3_title: "3. Types of Cookies we use",
    section3_p: "• Essential: Some cookies are essential for you to be able to experience the full functionality of our site. They allow us to maintain user sessions and prevent any security threats.",
    section3_p2: "• Statistics/Analytics: These cookies store information like the number of visitors to the website, the number of unique visitors, which pages of the website have been visited, the source of the visit, etc. This data helps us understand and analyze how well the website performs and where it needs improvement.",
    section3_p3: "• Marketing and Advertisements (Google AdSense): Our website displays advertisements. These cookies are used to personalize the advertisements that we show to you so that they are meaningful to you. These cookies also help us keep track of the efficiency of these ad campaigns.",
    section4_title: "4. How can I control cookie preferences?",
    section4_p: "Should you decide to change your preferences later through your browsing session, you can manually clear your cookies in your browser settings. To find out more on how to manage and delete cookies, visit wikipedia.org or allaboutcookies.org.",
    footer: "Is There a Game Today © 2026. All rights reserved."
  },
  es: {
    back: "Volver al Inicio",
    title: "Política de Cookies",
    p1: "Esta Política de Cookies explica qué son las cookies y cómo las usamos, los tipos de cookies que utilizamos (es decir, la información que recopilamos a través de las cookies y cómo se usa esta información) y cómo controlar las preferencias de las cookies.",
    section1_title: "1. ¿Qué son las cookies?",
    section1_p: "Las cookies son pequeños archivos de texto que se utilizan para almacenar información pequeña. Se almacenan en su dispositivo cuando el sitio web se carga en su navegador. Estas cookies nos ayudan a hacer que el sitio web funcione correctamente, sea más seguro, brinde una mejor experiencia de usuario y comprenda cómo funciona el sitio web para analizar qué funciona y dónde necesita mejorar.",
    section2_title: "2. ¿Cómo usamos las cookies?",
    section2_p: "Como la mayoría de los servicios en línea, nuestro sitio web utiliza cookies propias y de terceros para diversos fines. Las cookies propias son principalmente necesarias para que el sitio web funcione correctamente y no recopilan ninguno de sus datos de identificación personal.",
    section2_p2: "Las cookies de terceros utilizadas en nuestro sitio web son principalmente para comprender cómo funciona el sitio web, cómo interactúa con él, mantener nuestros servicios seguros, proporcionarle anuncios que sean relevantes para usted (a través de redes de socios como Google AdSense) y, en general, brindarle una experiencia de usuario mejorada.",
    section3_title: "3. Tipos de Cookies que utilizamos",
    section3_p: "• Esenciales: Algunas cookies son esenciales para que pueda experimentar la funcionalidad completa de nuestro sitio. Nos permiten mantener las sesiones de usuario y prevenir amenazas de seguridad.",
    section3_p2: "• Estadísticas/Analytics: Estas cookies almacenan información como el número de visitantes del sitio, el número de visitantes únicos, qué páginas del sitio se visitaron, el origen de la visita, etc. Estos datos nos ayudan a comprender y analizar cómo funciona el sitio web.",
    section3_p3: "• Publicidad y Marketing (Google AdSense): Nuestro sitio muestra anuncios. Estas cookies se utilizan para personalizar los anuncios que le mostramos para que sean significativos. También nos ayudan a realizar un seguimiento de la eficacia de estas campañas.",
    section4_title: "4. ¿Cómo puedo controlar las preferencias de cookies?",
    section4_p: "Si decide cambiar sus preferencias más adelante durante su sesión de navegación, puede borrar manualmente las cookies en la configuración de su navegador. Para obtener más información sobre cómo administrar y eliminar cookies, visite wikipedia.org o allaboutcookies.org.",
    footer: "¿Este Día Hay Partido? © 2026. Todos los derechos reservados."
  }
};

export default function LocalizedCookiePage({ lang }: Props) {
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
        <div className="bg-[#111111] rounded-3xl p-6 md:p-10 border border-zinc-800 shadow-2xl space-y-8 text-zinc-300 leading-relaxed text-sm md:text-base">
          
          <p>{t.p1}</p>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
              {t.section1_title}
            </h2>
            <p>{t.section1_p}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
              {t.section2_title}
            </h2>
            <p>{t.section2_p}</p>
            <p>{t.section2_p2}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider">
              {t.section3_title}
            </h2>
            <p>{t.section3_p}</p>
            <p>{t.section3_p2}</p>
            <p>{t.section3_p3}</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-black text-lg text-white uppercase tracking-wider flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[#ffcc00]" />
              {t.section4_title}
            </h2>
            <p>{t.section4_p}</p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 text-center">
            {t.footer}
          </div>
        </div>
      </main>
    </div>
  );
}
