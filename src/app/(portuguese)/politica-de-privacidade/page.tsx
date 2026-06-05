import type { Metadata } from 'next';
import LocalizedPrivacyPage from '../../_localized/privacy-page';

export const metadata: Metadata = {
  title: "Política de Privacidade — Esse Dia Tem Jogo?",
  description: "Política de Privacidade do Esse Dia Tem Jogo?. Saiba como lidamos com seus dados e o funcionamento dos anúncios do Google AdSense.",
};

export default function Page() {
  return <LocalizedPrivacyPage lang="pt" />;
}
