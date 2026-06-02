import type { Metadata } from 'next';
import LocalizedPrivacyPage from '../../_localized/privacy-page';

export const metadata: Metadata = {
  title: "Política de Privacidad — ¿Este Día Hay Partido?",
  description: "Política de Privacidad de ¿Este Día Hay Partido?. Obtén información sobre cómo tratamos tus datos y el funcionamiento de los anuncios de Google AdSense.",
};

export default function Page() {
  return <LocalizedPrivacyPage lang="es" />;
}
