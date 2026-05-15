"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { TeamSummary } from "@/lib/types";
import { getFlagUrl } from "@/lib/flag-codes";

/* ── Portuguese display codes ── */
const PT_CODE: Record<string, string> = {
  GER: "ALE",
  ENG: "ING",
  USA: "EUA",
  NED: "HOL",
  JPN: "JAP",
};
function displayCode(code: string): string {
  return PT_CODE[code] ?? code;
}

/* ── Visual tuning ── */
const SCALE_MIN = 0.55;
const SCALE_MAX = 1.4;
const OPACITY_MIN = 0.25;
const OPACITY_MAX = 1.0;
const STEEPNESS = 5; // power curve exponent — higher = only pops near centre

interface TeamCarouselProps {
  teams: TeamSummary[];
  selected: string;
  onSelect: (slug: string) => void;
}

/**
 * For each slide, compute a 0→1 "proximity" value based on its distance
 * to the current scroll centre.  Uses the shortest-path distance around
 * the loop so there's no discontinuity at the wrap-around.
 */
function computeProximities(
  scrollProgress: number,
  snapList: number[],
  numSlides: number
): number[] {
  return snapList.map((snap) => {
    // Raw difference in scroll-space (0…1)
    let diff = snap - scrollProgress;
    // Shortest path around the loop
    if (diff > 0.5) diff -= 1;
    if (diff < -0.5) diff += 1;

    // Normalise so that 1 slot away ≈ distance 1.0
    const normalised = Math.abs(diff) * numSlides;
    // Linear 0→1 proximity (clamped)
    const linear = Math.max(0, 1 - normalised);
    // Steep power curve — only "pops" when very close to centre
    return Math.pow(linear, STEEPNESS);
  });
}

export default function TeamCarousel({ teams, selected, onSelect }: TeamCarouselProps) {
  const brasilIndex = teams.findIndex((t) => t.code === "BRA");
  const startIndex = brasilIndex >= 0 ? brasilIndex : 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: true,
    startIndex,
    containScroll: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(startIndex);
  const [proximities, setProximities] = useState<number[]>([]);
  const rafId = useRef(0);

  /* ── Tween: recompute proximities on every scroll frame ── */
  const updateTweens = useCallback(() => {
    if (!emblaApi) return;
    const snaps = emblaApi.scrollSnapList();
    const progress = emblaApi.scrollProgress();
    setProximities(computeProximities(progress, snaps, teams.length));
  }, [emblaApi, teams.length]);

  /* ── Selection sync ── */
  const syncSelection = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    const team = teams[idx];
    if (team && team.slug !== selected) onSelect(team.slug);
  }, [emblaApi, teams, selected, onSelect]);

  /* ── Lifecycle ── */
  useEffect(() => {
    if (!emblaApi) return;

    updateTweens();
    syncSelection();

    emblaApi.on("scroll", updateTweens);
    emblaApi.on("reInit", updateTweens);
    emblaApi.on("select", syncSelection);
    emblaApi.on("settle", syncSelection);

    return () => {
      emblaApi.off("scroll", updateTweens);
      emblaApi.off("reInit", updateTweens);
      emblaApi.off("select", syncSelection);
      emblaApi.off("settle", syncSelection);
      cancelAnimationFrame(rafId.current);
    };
  }, [emblaApi, updateTweens, syncSelection]);

  /* ── Sync when parent changes `selected` ── */
  useEffect(() => {
    if (!emblaApi) return;
    const targetIdx = teams.findIndex((t) => t.slug === selected);
    if (targetIdx !== -1 && targetIdx !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(targetIdx);
    }
  }, [selected, teams, emblaApi]);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <label className="uppercase text-zinc-500 font-bold tracking-widest text-xs">
        Escolha a Seleção
      </label>
      <p className="text-zinc-600 text-xs -mt-1">Arraste para selecionar</p>

      {/* Embla Viewport */}
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div
          className="flex touch-pan-y"
          style={{ backfaceVisibility: "hidden" }}
        >
          {teams.map((t, index) => {
            const p = proximities[index] ?? 0; // 0…1 steep proximity

            // ── Visual values driven by proximity ──
            const scale = SCALE_MIN + p * (SCALE_MAX - SCALE_MIN);
            const opacity = OPACITY_MIN + p * (OPACITY_MAX - OPACITY_MIN);
            const ringWidth = Math.max(2, Math.round(p * 4));
            const glowRadius = Math.round(p * 35);
            const ringAlpha = p;

            // Label uses a softer curve so it's visible a bit earlier
            const labelP = Math.pow(Math.max(0, 1 - Math.abs(
              (() => {
                const snaps = emblaApi?.scrollSnapList() ?? [];
                const prog = emblaApi?.scrollProgress() ?? 0;
                let d = (snaps[index] ?? 0) - prog;
                if (d > 0.5) d -= 1;
                if (d < -0.5) d += 1;
                return d * teams.length;
              })()
            )), 2); // power 2 = gentler than the scale curve

            return (
              <div
                key={t.code}
                className="flex-[0_0_22%] min-w-[72px] md:flex-[0_0_18%] flex flex-col items-center justify-end cursor-grab active:cursor-grabbing select-none"
                style={{ paddingTop: 40, paddingBottom: 4 }}
                onClick={() => emblaApi?.scrollTo(index)}
              >
                {/* Flag circle */}
                <div
                  className="relative rounded-full mx-auto"
                  style={{
                    width: 56,
                    height: 56,
                    transform: `scale(${scale.toFixed(3)})`,
                    opacity,
                    boxShadow: glowRadius > 3
                      ? `0 0 ${glowRadius}px rgba(255,204,0,${(ringAlpha * 0.55).toFixed(2)})`
                      : "none",
                    outline: ringAlpha > 0.15
                      ? `${ringWidth}px solid rgba(255,204,0,${ringAlpha.toFixed(2)})`
                      : "2px solid rgba(63,63,70,0.5)",
                    outlineOffset: 0,
                    borderRadius: "9999px",
                    willChange: "transform, opacity",
                  }}
                >
                  <img
                    src={getFlagUrl(t.code)}
                    alt={`Bandeira ${t.name}`}
                    className="w-full h-full object-cover rounded-full pointer-events-none"
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                {/* Label — shows on ALL items proportional to proximity */}
                <div
                  className="flex flex-col items-center mt-2 h-8"
                  style={{
                    opacity: labelP,
                    transform: `translateY(${(1 - labelP) * -4}px) scale(${0.8 + labelP * 0.2})`,
                    willChange: "opacity, transform",
                  }}
                >
                  <span className="font-bold text-[11px] uppercase tracking-wider text-[#ffcc00] leading-none">
                    {displayCode(t.code)}
                  </span>
                  <span className="text-[10px] italic text-white whitespace-nowrap leading-tight mt-0.5">
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
