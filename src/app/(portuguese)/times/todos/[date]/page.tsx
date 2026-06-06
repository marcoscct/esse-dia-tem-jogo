import { getAllDates } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';
import type { Metadata } from 'next';
import LocalizedTimesTodosPage from '../../../../_localized/times-todos-page';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
  return getAllDates(true).map((d) => ({
    date: d,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date: dateParam } = await params;
  const isoDate = parseDateParam(dateParam);
  if (!isoDate) return {};
  
  return {
    title: "Esse Dia Tem Jogo?",
    description: `Veja todos os jogos de ${isoDate}.`,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const { date: dateParam } = await params;
  return <LocalizedTimesTodosPage dateParam={dateParam} />;
}
