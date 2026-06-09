import type { Metadata } from 'next';
import LocalizedContactPage from '../../_localized/contact-page';

export const metadata: Metadata = {
  title: "Contacto & Soporte — ¿Este Día Hay Partido?",
  description: "Contacta con los creadores de ¿Este Día Hay Partido?. Escríbenos para alianzas, soporte o sugerencias.",
};

export default function Page() {
  return <LocalizedContactPage lang="es" />;
}
