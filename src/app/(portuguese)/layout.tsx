import { TranslationProvider } from "@/components/TranslationProvider";
import HeaderControls from "@/components/HeaderControls";

export default function PortugueseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslationProvider lang="pt">
      <HeaderControls />
      {children}
    </TranslationProvider>
  );
}
