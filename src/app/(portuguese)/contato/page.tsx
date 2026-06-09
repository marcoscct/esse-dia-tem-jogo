import type { Metadata } from 'next';
import LocalizedContactPage from '../../_localized/contact-page';

export const metadata: Metadata = {
  title: "Contato e Suporte — Esse Dia Tem Jogo?",
  description: "Fale com os idealizadores do Esse Dia Tem Jogo. Entre em contato para parcerias, suporte ou sugestões.",
};

export default function Page() {
  return <LocalizedContactPage lang="pt" />;
}
