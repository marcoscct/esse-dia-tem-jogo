import type { Metadata } from 'next';
import LocalizedPrivacyPage from '../../_localized/privacy-page';

export const metadata: Metadata = {
  title: "Privacy Policy — Is There a Game Today?",
  description: "Privacy Policy of Is There a Game Today. Learn how we handle your data and how Google AdSense advertisements are served.",
};

export default function Page() {
  return <LocalizedPrivacyPage lang="en" />;
}
