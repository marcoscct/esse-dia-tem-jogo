"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar as CalendarIcon } from "lucide-react";
import type { TeamSummary, MatchWithTeam } from "@/lib/types";
import ResultModal from "./ResultModal";
import TeamCarousel from "./TeamCarousel";

interface HomeClientProps {
  teams: TeamSummary[];
  lastUpdated: string;
  initialTeam?: string;
  initialDate?: string;
  result?: { hasGame: boolean; matches: MatchWithTeam[] };
}

export default function HomeClient({ teams, lastUpdated, initialTeam, initialDate, result }: HomeClientProps) {
  const [selectedTeam, setSelectedTeam] = useState(initialTeam || (teams.find(t => t.code === "BRA")?.slug || teams[0]?.slug));
  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (result) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [result]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTeam && selectedDate) {
      router.push(`/${selectedTeam}/${selectedDate}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // After closing the modal, navigate back to the home page to reset URL
    setTimeout(() => {
      router.push("/");
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] font-sans text-white selection:bg-[#ffcc00] selection:text-black">
      {/* Banner Topo — hidden but structure preserved for future ads */}
      <div className="w-full bg-[#ffcc00] text-black font-bold text-center py-3 text-sm md:text-base tracking-widest uppercase hidden">
        Espaço para Banner Topo
      </div>

      <main className="flex-1 flex flex-col items-center px-4 w-full max-w-2xl mx-auto pt-6 pb-12">
        {/* Header / Hero */}
        <header className="w-full flex flex-col items-center text-center mb-6">
          {/* Logo */}
          <div className="w-40 h-40 md:w-52 md:h-52 mb-4">
            <img
              src="/logo.png"
              alt="Esse Dia Tem Jogo?"
              className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(255,204,0,0.3)]"
            />
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-xs md:max-w-md mx-auto leading-tight">
            Descubra se sua seleção joga na data que você escolher.
          </p>
        </header>

        {/* Main Form Card */}
        <div className="w-full bg-[#111111] rounded-3xl p-5 md:p-8 shadow-2xl border border-zinc-800">
          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            {/* Team Carousel */}
            <TeamCarousel
              teams={teams}
              selected={selectedTeam}
              onSelect={setSelectedTeam}
            />

            {/* Date Picker */}
            <div className="flex flex-col gap-2 text-center">
              <label htmlFor="date" className="uppercase text-zinc-500 font-bold tracking-widest text-xs">
                Escolha a Data
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 w-6 h-6 pointer-events-none" />
                <input
                  type="date"
                  id="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full appearance-none bg-white text-black font-bold text-lg md:text-xl rounded-xl py-4 pl-14 pr-5 focus:outline-none focus:ring-4 focus:ring-[#ffcc00]/50 cursor-pointer"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!selectedDate || (selectedDate === initialDate && selectedTeam === initialTeam && isModalOpen)}
              className="mt-1 w-full bg-[#ffcc00] hover:bg-[#e6b800] text-black font-black uppercase tracking-widest text-lg md:text-xl py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,204,0,0.2)] hover:shadow-[0_0_25px_rgba(255,204,0,0.4)]"
            >
              Verificar
            </button>
          </form>
        </div>

        {/* Result Modal */}
        <ResultModal 
          hasGame={result?.hasGame || false} 
          matches={result?.matches} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </main>

      {/* Banner Inferior — hidden but structure preserved */}
      <div className="w-full bg-[#ffcc00] text-black font-bold text-center py-3 text-sm md:text-base tracking-widest uppercase hidden">
        Espaço para Banner Inferior
      </div>

      {/* Footer Info */}
      <div className="w-full text-center py-4 bg-black text-zinc-600 text-xs">
        Dados atualizados: {lastUpdated} | v1.2.2
      </div>
    </div>
  );
}
