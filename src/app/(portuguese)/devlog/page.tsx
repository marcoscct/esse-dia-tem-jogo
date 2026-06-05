import type { Metadata } from 'next';
import LocalizedDevlogPage from '../../_localized/devlog-page';

export const metadata: Metadata = {
  title: "Novidades do Projeto — Esse Dia Tem Jogo?",
  description: "Acompanhe as atualizações, novidades e o histórico de versões do site Esse Dia Tem Jogo?.",
};

export default function Page() {
  return <LocalizedDevlogPage lang="pt" />;
}
