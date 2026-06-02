import type { Metadata } from 'next';
import LocalizedAboutPage from '../../_localized/about-page';

export const metadata: Metadata = {
  title: "Quiénes Somos — ¿Este Día Hay Partido?",
  description: "Conoce el propósito de ¿Este Día Hay Partido?, creado para ayudar a los aficionados a evitar programar compromisos importantes en días de partido.",
};

export default function Page() {
  return <LocalizedAboutPage lang="es" />;
}
