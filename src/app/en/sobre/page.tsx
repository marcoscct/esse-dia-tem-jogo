import type { Metadata } from 'next';
import LocalizedAboutPage from '../../_localized/about-page';

export const metadata: Metadata = {
  title: "About Us — Is There a Game Today?",
  description: "Learn about the purpose of Is There a Game Today, created to help fans avoid scheduling important commitments on game days.",
};

export default function Page() {
  return <LocalizedAboutPage lang="en" />;
}
