"use client";

import dynamic from "next/dynamic";

const LanguageSwitcher = dynamic(() => import("./LanguageSwitcher"), { ssr: false });
const SettingsPanel = dynamic(() => import("./SettingsPanel"), { ssr: false });

export default function HeaderControls() {
  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end gap-2.5">
      <LanguageSwitcher />
      <SettingsPanel />
    </div>
  );
}
