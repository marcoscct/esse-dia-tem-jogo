import type { Metadata } from 'next';
import LocalizedCookiePage from '../../_localized/cookie-page';

export const metadata: Metadata = {
  title: "Cookie Policy — Is There a Game Today?",
  description: "Learn how we use cookies on Is There a Game Today to improve your experience and display relevant ads.",
};

export default function Page() {
  return <LocalizedCookiePage lang="en" />;
}
