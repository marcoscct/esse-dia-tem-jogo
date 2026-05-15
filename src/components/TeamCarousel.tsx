"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import type { TeamSummary } from "@/lib/types";
import { getFlagUrl } from "@/lib/flag-codes";

/* ─────────── physics constants ─────────── */
const WHEEL_FRICTION = 0.92;       // per-frame velocity damping (< 1 = deceleration)
const SNAP_THRESHOLD = 0.4;        // px/frame — below this we snap
const TWEEN_FACTOR = 3.2;          // how aggressively items scale by proximity

interface TeamCarouselProps {
  teams: TeamSummary[];
  selected: string; // slug
  onSelect: (slug: string) => void;
}

/**
 * Compute a 0-1 "proximity" factor for every slide based on how close it is
 * to the viewport centre. 1 = dead centre, 0 = far away.
 * Uses a smooth cosine curve for a natural ease.
 */
function tweenScales(emblaApi: EmblaCarouselType): number[] {
  const engine = emblaApi.internalEngine();
  const scrollProgress = emblaApi.scrollProgress();
  const slidesInView = emblaApi.slidesInView();

  return emblaApi.scrollSnapList().map((snapPos, idx) => {
    if (!slidesInView.includes(idx)) return 0;

    let diff = snapPos - scrollProgress;
    // Handle loop wrapping
    const loopItems = engine.slideLooper?.loopPoints || [];
    loopItems.forEach((lp: { index: number; target: () => number }) => {
      if (lp.index === idx) {
        const target = lp.target();
        const altDiff = target - scrollProgress;
        if (Math.abs(altDiff) < Math.abs(diff)) diff = altDiff;
      }
    });

    // cosine-based curve: smooth ramp from 0→1 as diff goes from far→0
    const proximity = 1 - Math.min(Math.abs(diff * TWEEN_FACTOR), 1);
    // ease it further for a satisfying "pop"
    return 0.5 * (1 + Math.cos(Math.PI * (1 - proximity)));
  });
}

export default function TeamCarousel({ teams, selected, onSelect }: TeamCarouselProps) {
  const brasilIndex = teams.findIndex((t) => t.code === "BRA");
  const startIndex = brasilIndex >= 0 ? brasilIndex : 0;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: true,          // ← enables roulette momentum
    startIndex,
    containScroll: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(startIndex);
  const [scales, setScales] = useState<number[]>([]);
  const rafRef = useRef<number>(0);

  // ── Continuous tween loop (runs on every scroll tick + raf) ──
  const updateTweens = useCallback(() => {
    if (!emblaApi) return;
    const newScales = tweenScales(emblaApi);
    setScales(newScales);
  }, [emblaApi]);

  // ── Snap detection: runs when embla "settles" after momentum ──
  const onSettle = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
    const team = teams[idx];
    if (team && team.slug !== selected) {
      onSelect(team.slug);
    }
  }, [emblaApi, teams, selected, onSelect]);

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

    updateTweens();
    onSelectEmbla();

    emblaApi.on("scroll", updateTweens);
    emblaApi.on("reInit", updateTweens);
    emblaApi.on("select", onSelectEmbla);
    emblaApi.on("settle", onSettle);

    return () => {
      emblaApi.off("scroll", updateTweens);
      emblaApi.off("reInit", updateTweens);
      emblaApi.off("select", onSelectEmbla);
      emblaApi.off("settle", onSettle);
      cancelAnimationFrame(rafRef.current);
    };
  }, [emblaApi, updateTweens, onSelectEmbla, onSettle]);

  // ── Sync external prop changes ──
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
            const proximity = scales[index] ?? 0;
            // Scale: min 0.65, max 1.25
            const scale = 0.65 + proximity * 0.6;
            // Opacity: min 0.3, max 1.0
            const opacity = 0.3 + proximity * 0.7;
            // Ring / glow intensity
            const ringOpacity = proximity;
            const glowSize = Math.round(proximity * 30);
            const isActive = index === selectedIndex;

            return (
              <div
                key={t.code}
                className="flex-[0_0_22%] min-w-[72px] md:flex-[0_0_18%] flex flex-col items-center justify-end cursor-grab active:cursor-grabbing"
                style={{ paddingTop: 32, paddingBottom: 8 }}
                onClick={() => emblaApi?.scrollTo(index)}
              >
                <div
                  className="relative rounded-full mx-auto"
                  style={{
                    width: 64,
                    height: 64,
                    transform: `scale(${scale})`,
                    opacity,
                    transition: "none",  // no CSS transition — driven by scroll physics
                    boxShadow: glowSize > 2
                      ? `0 0 ${glowSize}px rgba(255,204,0,${(ringOpacity * 0.6).toFixed(2)})`
                      : "none",
                    outline: ringOpacity > 0.3
                      ? `${Math.max(2, Math.round(ringOpacity * 4))}px solid rgba(255,204,0,${ringOpacity.toFixed(2)})`
                      : "2px solid rgba(63,63,70,0.6)",
                    outlineOffset: "0px",
                    borderRadius: "9999px",
                    willChange: "transform, opacity",
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

                {/* Label — fades in only for the snapped item */}
                <div
                  className="flex flex-col items-center mt-2"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateY(0)" : "translateY(-6px)",
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
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
