import type { Metadata } from 'next';
import LocalizedTermsPage from '../../_localized/terms-page';

export const metadata: Metadata = {
  title: "Términos de Uso — ¿Este Día Hay Partido?",
  description: "Términos de Uso de ¿Este Día Hay Partido?. Lee las condiciones de uso de nuestros servicios y calendarios de partidos.",
};

export default function Page() {
  return <LocalizedTermsPage lang="es" />;
}
