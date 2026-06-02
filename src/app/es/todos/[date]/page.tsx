import { getAllDates } from '@/lib/calendar';
import { parseDateParam } from '@/lib/date-utils';
import type { Metadata } from 'next';
import LocalizedTodosPage from '../../../_localized/todos-page';

interface Props {
  params: Promise<{ date: string }>;
}

export async function generateStaticParams() {
  return getAllDates().map((d) => ({
    date: d,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date: dateParam } = await params;
  const isoDate = parseDateParam(dateParam);
  if (!isoDate) return {};
  
  return {
    title: "¿Este Día Hay Partido?",
    description: `Consulta todos los partidos del ${isoDate}.`,
  };
}

export default async function Page({ params }: Props) {
  const { date: dateParam } = await params;
  return <LocalizedTodosPage dateParam={dateParam} />;
}
