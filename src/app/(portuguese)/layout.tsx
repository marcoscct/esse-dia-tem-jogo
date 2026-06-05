import { TranslationProvider } from "@/components/TranslationProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SettingsPanel from "@/components/SettingsPanel";

export default function PortugueseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranslationProvider lang="pt">
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end gap-2.5">
        <LanguageSwitcher />
        <SettingsPanel />
      </div>
      {children}
    </TranslationProvider>
  );
}
