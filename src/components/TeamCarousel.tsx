"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { TeamSummary } from "@/lib/types";
import { getFlagUrl } from "@/lib/flag-codes";

interface TeamCarouselProps {
  teams: TeamSummary[];
  selected: string; // slug
  onSelect: (slug: string) => void;
}

export default function TeamCarousel({ teams, selected, onSelect }: TeamCarouselProps) {
  // We use loop: true for infinite loop, and align: 'center' to always snap to center
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(
    teams.findIndex((t) => t.slug === selected) || 0
  );

  // Sync prop changes (if changed from outside) to carousel
  useEffect(() => {
    if (!emblaApi) return;
    const targetIdx = teams.findIndex((t) => t.slug === selected);
    if (targetIdx !== -1 && targetIdx !== selectedIndex) {
      emblaApi.scrollTo(targetIdx);
    }
  }, [selected, teams, emblaApi, selectedIndex]);

  // Update selected team when carousel snaps
  const onSelectEmbla = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    const team = teams[idx];
    if (team && team.slug !== selected) {
      onSelect(team.slug);
    }
  }, [emblaApi, teams, selected, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelectEmbla();
    emblaApi.on("select", onSelectEmbla);
    return () => {
      emblaApi.off("select", onSelectEmbla);
    };
  }, [emblaApi, onSelectEmbla]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <label className="uppercase text-zinc-500 font-bold tracking-widest text-xs">
        Escolha a Seleção
      </label>
      <p className="text-zinc-600 text-xs -mt-1">Arraste para selecionar</p>

      {/* Embla Viewport */}
      <div className="w-full overflow-hidden px-2" ref={emblaRef}>
        <div className="flex touch-pan-y py-6" style={{ backfaceVisibility: "hidden" }}>
          {teams.map((t, index) => {
            const isActive = index === selectedIndex;
            return (
              <div
                key={t.code}
                className="flex-[0_0_25%] min-w-[80px] md:flex-[0_0_20%] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
                onClick={() => emblaApi?.scrollTo(index)}
              >
                <div
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-300 mx-auto ${
                    isActive
                      ? "scale-125 ring-4 ring-[#ffcc00] shadow-[0_0_30px_rgba(255,204,0,0.6)] z-10"
                      : "scale-90 opacity-40 ring-2 ring-zinc-700 hover:opacity-80"
                  }`}
                  style={{
                    transformOrigin: "center center",
                  }}
                >
                  <img
                    src={getFlagUrl(t.code)}
                    alt={`Bandeira ${t.name}`}
                    className="w-full h-full object-cover rounded-full"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
                <div
                  className={`flex flex-col items-center mt-3 transition-all duration-300 ${
                    isActive ? "opacity-100 translate-y-1" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <span className="font-bold text-xs uppercase tracking-wider text-[#ffcc00]">
                    {t.code}
                  </span>
                  <span className="text-[10px] italic text-white whitespace-nowrap">
                    {t.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-1.5 mt-1">
        {teams.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`rounded-full transition-all duration-300 ${
              idx === selectedIndex
                ? "w-6 h-2 bg-[#ffcc00]"
                : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
            }`}
            aria-label={`Ir para o slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
