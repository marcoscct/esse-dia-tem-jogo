import { getHomeMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import LocalizedTimesPage from '../../_localized/times-page';

export function generateMetadata(): Metadata {
  return getHomeMetadata('es', true);
}

export default function Page() {
  return <LocalizedTimesPage />;
}
