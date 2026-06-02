import LocalizedLayout from '../_localized/locale-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocalizedLayout lang="es">{children}</LocalizedLayout>;
}
