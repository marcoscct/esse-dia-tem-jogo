import type { Metadata } from 'next';
import LocalizedTermsPage from '../../_localized/terms-page';

export const metadata: Metadata = {
  title: "Termos de Uso — Esse Dia Tem Jogo?",
  description: "Termos de Uso do Esse Dia Tem Jogo?. Leia as condições de uso dos nossos serviços e calendários de jogos.",
};

export default function Page() {
  return <LocalizedTermsPage lang="pt" />;
}
