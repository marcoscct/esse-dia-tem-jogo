import type { Metadata } from 'next';
import LocalizedDevlogPage from '../../_localized/devlog-page';

export const metadata: Metadata = {
  title: "Project Changelog — Is There a Game Today?",
  description: "Track the updates, new features, and version history of the Is There a Game Today? website.",
};

export default function Page() {
  return <LocalizedDevlogPage lang="en" />;
}
