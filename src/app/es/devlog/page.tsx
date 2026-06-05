import type { Metadata } from 'next';
import LocalizedDevlogPage from '../../_localized/devlog-page';

export const metadata: Metadata = {
  title: "Novedades del Proyecto — ¿Este Día Hay Partido?",
  description: "Sigue las actualizaciones, novedades y el historial de versiones del sitio ¿Este Día Hay Partido?.",
};

export default function Page() {
  return <LocalizedDevlogPage lang="es" />;
}
