import type { Metadata } from 'next';
import LocalizedCookiePage from '../../_localized/cookie-page';

export const metadata: Metadata = {
  title: "Política de Cookies — ¿Este Día Hay Partido?",
  description: "Aprenda cómo usamos cookies en ¿Este Día Hay Partido? para mejorar su experiencia y mostrar anuncios relevantes.",
};

export default function Page() {
  return <LocalizedCookiePage lang="es" />;
}
