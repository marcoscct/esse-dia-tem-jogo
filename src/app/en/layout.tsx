import LocalizedLayout from '../_localized/locale-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocalizedLayout lang="en">{children}</LocalizedLayout>;
}
