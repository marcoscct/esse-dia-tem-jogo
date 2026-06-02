import { getHomeMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import LocalizedHomePage from '../_localized/home-page';

export function generateMetadata(): Metadata {
  return getHomeMetadata('en');
}

export default function Page() {
  return <LocalizedHomePage />;
}
