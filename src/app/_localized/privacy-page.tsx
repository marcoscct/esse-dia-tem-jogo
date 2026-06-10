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
    title: "Política de Privacidade",
    p1: "A sua privacidade é extremamente importante para nós. É política do site Esse Dia Tem Jogo respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site, acessível em www.essediatemjogo.com.br.",
    s1_title: "1. Coleta de Informações",
    s1_p1: "O site Esse Dia Tem Jogo funciona como uma ferramenta utilitária e não exige cadastro, nome, e-mail ou dados bancários para o seu uso comum. Não coletamos dados de identificação pessoal de forma direta dos nossos visitantes.",
    s2_title: "2. Cookies e Anúncios do Google AdSense",
    s2_p1: "Nós utilizamos o Google AdSense para veicular anúncios quando você visita o nosso website. O Google utiliza cookies para veicular anúncios com base em suas visitas anteriores a este ou a outros sites na internet.",
    s2_p2: "O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para nossos usuários com base nas visitas feitas a este e/ou a outros sites na internet.",
    s2_p3: "Os usuários podem optar por desativar a publicidade personalizada acessando as Configurações de Anúncios do Google. Alternativamente, você pode desativar o uso de cookies de terceiros para publicidade personalizada visitando a página www.aboutads.info.",
    s3_title: "3. Cookies de Terceiros e Analytics",
    s3_p1: "Podemos usar ferramentas de análise de tráfego (como o Google Analytics) que coletam informações anônimas de navegação, como páginas visitadas, tempo de permanência e tipo de dispositivo, unicamente para entender o volume de acessos e melhorar o desempenho técnico do site.",
    s4_title: "4. Ligações a Sites de Terceiros",
    s4_p1: "Nosso site pode conter links para outros sites externos que não são operados por nós (como links para informações de campeonatos oficiais ou parceiros comerciais). Não nos responsabilizamos pelo conteúdo e políticas de privacidade de terceiros.",
    s5_title: "5. Consentimento e LGPD",
    s5_p1: "Ao utilizar nosso site, você concorda com a nossa política de privacidade. Em conformidade com a Lei Geral de Proteção de Dados (LGPD) no Brasil, garantimos que nenhum dado pessoal sensível é armazenado ou processado sem a devida base legal.",
    s6_title: "6. Contato e Dúvidas",
    s6_p1: "Se você tiver alguma dúvida sobre como lidamos com dados de usuários e informações pessoais, entre em contato conosco através do e-mail: contato@essediatemjogo.com.br.",
    footer: "Esta política é aplicável a partir de 30 de maio de 2026."
  },
  en: {
    back: "Back to Home",
    title: "Privacy Policy",
    p1: "Your privacy is extremely important to us. It is the policy of Is There a Game Today to respect your privacy regarding any information we may collect on the website, accessible at www.essediatemjogo.com.br.",
    s1_title: "1. Information Collection",
    s1_p1: "The website Is There a Game Today works as a utility tool and does not require registration, name, email or bank details for its common use. We do not collect personally identifiable data directly from our visitors.",
    s2_title: "2. Cookies and Google AdSense Ads",
    s2_p1: "We use Google AdSense to serve advertisements when you visit our website. Google uses cookies to serve ads based on your previous visits to this or other websites on the internet.",
    s2_p2: "Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.",
    s2_p3: "Users may opt out of personalized advertising by visiting Google Ad Settings. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info.",
    s3_title: "3. Third-Party Cookies and Analytics",
    s3_p1: "We may use traffic analysis tools (such as Google Analytics) that collect anonymous browsing information, such as pages visited, time spent and device type, solely to understand traffic volume and improve the technical performance of the site.",
    s4_title: "4. Links to Third-Party Sites",
    s4_p1: "Our website may contain links to external sites that are not operated by us (such as links to official tournament info or commercial partners). We are not responsible for the content and privacy policies of third-party sites.",
    s5_title: "5. Consent and Privacy Laws",
    s5_p1: "By using our site, you agree to our privacy policy. In compliance with the General Data Protection Law (LGPD) in Brazil and GDPR standards, we guarantee that no sensitive personal data is stored or processed without proper legal grounds.",
    s6_title: "6. Contact and Inquiries",
    s6_p1: "If you have any questions about how we handle user data and personal information, contact us via email: contato@essediatemjogo.com.br.",
    footer: "This policy is effective as of May 30, 2026."
  },
  es: {
    back: "Volver al Inicio",
    title: "Política de Privacidad",
    p1: "Su privacidad es extremadamente importante para nosotros. Es política del sitio ¿Este Día Hay Partido? respetar su privacidad con respecto a cualquier información que podamos recopilar en el sitio web, accesible en www.essediatemjogo.com.br.",
    s1_title: "1. Recopilación de Información",
    s1_p1: "El sitio web ¿Este Día Hay Partido? funciona como una herramienta de utilidad y no requiere registro, correo electrónico o datos bancarios para su uso común. No recopilamos datos de identificación personal directamente de nuestros visitantes.",
    s2_title: "2. Cookies y Anuncios de Google AdSense",
    s2_p1: "Utilizamos Google AdSense para publicar anuncios cuando visita nuestro sitio web. Google utiliza cookies para mostrar anuncios basados en sus visitas anteriores a este u otros sitios en la web.",
    s2_p2: "El uso de cookies de publicidad por parte de Google le permite a él y a sus socios mostrar anuncios a nuestros usuarios en función de sus visitas a este y/u otros sitios web en Internet.",
    s2_p3: "Los usuarios pueden optar por desactivar la publicidad personalizada accediendo a la Configuración de anuncios de Google. Alternativamente, puede optar por desactivar el uso de cookies de un tercero para la publicidad personalizada visitando www.aboutads.info.",
    s3_title: "3. Cookies de Terceros y Analítica",
    s3_p1: "Podemos utilizar herramientas de análisis de tráfico (como Google Analytics) que recopilan información de navegación anónima, como páginas visitadas, tiempo de permanencia y tipo de dispositivo, únicamente para comprender el volumen de accesos y mejorar el rendimiento técnico del sitio.",
    s4_title: "4. Enlaces a Sitios de Terceros",
    s4_p1: "Nuestro sitio web puede contener enlaces a otros sitios externos que no son operados por nosotros (como enlaces a información de campeonatos oficiales o socios comerciales). No nos responsabilizamos por el contenido y las políticas de privacidad de terceros.",
    s5_title: "5. Consentimiento y Legislación de Privacidad",
    s5_p1: "Al utilizar nuestro sitio, usted acepta nuestra política de privacidad. En cumplimiento de la Ley General de Protección de Datos (LGPD) en Brasil y las regulaciones internacionales, garantizamos que ningún dato personal sensible se almacena o procesa sin la debida base legal.",
    s6_title: "6. Contacto y Consultas",
    s6_p1: "Si tiene alguna pregunta sobre cómo manejamos los datos de los usuarios y la información personal, contáctenos por correo electrónico: contato@essediatemjogo.com.br.",
    footer: "Esta política es aplicable a partir del 30 de mayo de 2026."
  }
};

export default function LocalizedPrivacyPage({ lang }: Props) {
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
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              {t.s2_title}
            </h2>
            <p>{t.s2_p1}</p>
            <p className="pl-4 border-l-2 border-[#ffcc00]/50 text-zinc-400">
              {t.s2_p2}
            </p>
            <p dangerouslySetInnerHTML={{ __html: t.s2_p3.replace("www.aboutads.info", '<a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" class="text-[#ffcc00] hover:underline">www.aboutads.info</a>') }} />
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

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg md:text-xl text-white uppercase tracking-wide">
              {t.s6_title}
            </h2>
            <p>{t.s6_p1}</p>
          </section>

          <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-400 text-center">
            {t.footer}
          </div>
        </div>
      </main>
    </div>
  );
}
