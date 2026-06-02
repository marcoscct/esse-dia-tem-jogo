import type { Metadata } from 'next';
import LocalizedTermsPage from '../../_localized/terms-page';

export const metadata: Metadata = {
  title: "Terms of Use — Is There a Game Today?",
  description: "Terms of Use of Is There a Game Today. Read the conditions of using our services and game calendars.",
};

export default function Page() {
  return <LocalizedTermsPage lang="en" />;
}
