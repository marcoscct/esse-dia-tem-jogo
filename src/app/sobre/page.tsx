import type { Metadata } from 'next';
import LocalizedAboutPage from '../_localized/about-page';

export const metadata: Metadata = {
  title: "Sobre Nós — Esse Dia Tem Jogo?",
  description: "Conheça o propósito do Esse Dia Tem Jogo?, criado para ajudar torcedores a evitar marcar compromissos importantes em dias de jogos.",
};

export default function Page() {
  return <LocalizedAboutPage lang="pt" />;
}
