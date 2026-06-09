import type { Metadata } from 'next';
import LocalizedCookiePage from '../../_localized/cookie-page';

export const metadata: Metadata = {
  title: "Política de Cookies — Esse Dia Tem Jogo?",
  description: "Entenda como usamos cookies no Esse Dia Tem Jogo? para melhorar sua experiência e exibir anúncios relevantes.",
};

export default function Page() {
  return <LocalizedCookiePage lang="pt" />;
}
