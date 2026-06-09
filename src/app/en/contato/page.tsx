import type { Metadata } from 'next';
import LocalizedContactPage from '../../_localized/contact-page';

export const metadata: Metadata = {
  title: "Contact & Support — Is There a Game Today?",
  description: "Contact the creators of Is There a Game Today. Reach out for business partnerships, support, or suggestions.",
};

export default function Page() {
  return <LocalizedContactPage lang="en" />;
}
