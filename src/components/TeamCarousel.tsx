"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { TeamSummary } from "@/lib/types";
import { getFlagUrl } from "@/lib/flag-codes";
import { useLanguage } from "./TranslationProvider";
import { translateTeamName } from "@/locales/i18n-utils";

/* ── Portuguese display codes ── */
const PT_CODE: Record<string, string> = {
  GER: "ALE",
  ENG: "ING",
  USA: "EUA",
  NED: "HOL",
  JPN: "JAP",
  CGO: "RDC",
  RSA: "AFS",
  KOR: "COR",
  SWE: "SUE",
  CZE: "TCH",
  IRN: "IRA",
  KSA: "ARA",
  QAT: "CAT"
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
  onScrollComplete?: () => void;
}

interface ProximityData {
  flagP: number;
  labelP: number;
}

/**
 * For each slide, compute flag and label proximity values based on its distance
 * to the current scroll centre. Uses the shortest-path distance around
 * the loop so there's no discontinuity at the wrap-around.
 */
function computeProximities(
  scrollProgress: number,
  snapList: number[],
  numSlides: number
): ProximityData[] {
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
    
    return {
      flagP: Math.pow(linear, STEEPNESS),
      labelP: Math.pow(linear, 2),
    };
  });
}

export default function TeamCarousel({ teams, selected, onSelect, onScrollComplete }: TeamCarouselProps) {
  const { lang, t } = useLanguage();
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
  
  // Safe default values so the carousel renders perfectly centered at Brasil on mount without jumps
  const [proximities, setProximities] = useState<ProximityData[]>(() => {
    return teams.map((_, index) => {
      const isStart = index === startIndex;
      return {
        flagP: isStart ? 1 : 0,
        labelP: isStart ? 1 : 0,
      };
    });
  });

  const isPointerDown = useRef(false);
  const userInteracted = useRef(false);
  const draggedRef = useRef(false);
  const hasSnappedRef = useRef(false);
  const isFlingingRef = useRef(false);
  const isProgrammaticScrollRef = useRef(false);

  const teamsRef = useRef(teams);
  const selectedRef = useRef(selected);
  const onSelectRef = useRef(onSelect);
  const onScrollCompleteRef = useRef(onScrollComplete);

  useEffect(() => {
    teamsRef.current = teams;
    selectedRef.current = selected;
    onSelectRef.current = onSelect;
    onScrollCompleteRef.current = onScrollComplete;
  });

  /* ── Tween: recompute proximities on every scroll frame ── */
  const updateTweens = useCallback(() => {
    if (!emblaApi) return;
    const snaps = emblaApi.scrollSnapList();
    const progress = emblaApi.scrollProgress();
    const pData = computeProximities(progress, snaps, teams.length);
    setProximities(pData);

    // Physics attraction (magnet snapping when velocity slows down)
    const engine = emblaApi.internalEngine();
    const velocity = engine.scrollBody.velocity();
    const isDragging = engine.dragHandler.pointerDown();

    if (isDragging) {
      draggedRef.current = true;
    }

    if (!isDragging && !isProgrammaticScrollRef.current && isFlingingRef.current && !hasSnappedRef.current) {
      const speed = Math.abs(velocity);
      // Lower snap threshold to 0.8 so it is almost at rest before snapping, preventing jerks
      if (speed > 0.05 && speed < 0.8) {
        hasSnappedRef.current = true;
        const closestIdx = pData.findIndex(d => d.flagP === Math.max(...pData.map(p => p.flagP)));
        
        // Lower friction coefficient (0.45) provides higher damping to prevent any pendular oscillation (overshoot/waggle)
        engine.scrollBody.useFriction(0.45);
        engine.scrollBody.useDuration(14);
        
        emblaApi.scrollTo(closestIdx);
      }
    }
  }, [emblaApi, teams.length]);

  /* ── Selection sync ── */
  const syncSelection = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.selectedScrollSnap();
    setSelectedIndex(idx);
  }, [emblaApi]);

  /* ── Click handler ── */
  const handleSlideClick = useCallback((index: number) => {
    if (!emblaApi) return;
    userInteracted.current = true;
    isProgrammaticScrollRef.current = true;
    emblaApi.scrollTo(index);
  }, [emblaApi]);

  /* ── Settle-snap: when dragFree momentum stops, gently snap to nearest ── */
  const handleSettle = useCallback(() => {
    if (!emblaApi) return;

    // Restore base physics
    const engine = emblaApi.internalEngine();
    engine.scrollBody.useBaseFriction();
    engine.scrollBody.useBaseDuration();
    
    hasSnappedRef.current = false;
    draggedRef.current = false;
    isFlingingRef.current = false;
    isProgrammaticScrollRef.current = false;
    
    const nearest = emblaApi.selectedScrollSnap();
    setSelectedIndex(nearest);

    const team = teamsRef.current[nearest];
    if (team && team.slug === selectedRef.current) {
      onScrollCompleteRef.current?.();
    }

    if (userInteracted.current) {
      userInteracted.current = false;
      if (team && team.slug !== selectedRef.current) {
        onSelectRef.current(team.slug);
      }
    }
  }, [emblaApi]);

  /* ── Lifecycle ── */
  useEffect(() => {
    if (!emblaApi) return;

    const initialSyncId = requestAnimationFrame(() => {
      updateTweens();
      syncSelection();
    });

    const handlePointerDown = () => {
      isPointerDown.current = true;
      draggedRef.current = false;
      hasSnappedRef.current = false;
      isFlingingRef.current = false;
      isProgrammaticScrollRef.current = false;
      const engine = emblaApi.internalEngine();
      engine.scrollBody.useBaseFriction();
      engine.scrollBody.useBaseDuration();
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
      if (draggedRef.current) {
        isFlingingRef.current = true;
        const engine = emblaApi.internalEngine();
        // Spin like a true roulette (very low friction)
        engine.scrollBody.useFriction(0.965);
        engine.scrollBody.useDuration(40);
      }
    };

    const handleScroll = () => {
      updateTweens();
      if (isPointerDown.current) {
        userInteracted.current = true;
      }
    };

    emblaApi.on("scroll", handleScroll);
    emblaApi.on("reInit", updateTweens);
    emblaApi.on("select", syncSelection);
    emblaApi.on("settle", handleSettle);
    emblaApi.on("pointerDown", handlePointerDown);
    emblaApi.on("pointerUp", handlePointerUp);

    return () => {
      emblaApi.off("scroll", handleScroll);
      emblaApi.off("reInit", updateTweens);
      emblaApi.off("select", syncSelection);
      emblaApi.off("settle", handleSettle);
      emblaApi.off("pointerDown", handlePointerDown);
      emblaApi.off("pointerUp", handlePointerUp);
      cancelAnimationFrame(initialSyncId);
    };
  }, [emblaApi, updateTweens, syncSelection, handleSettle]);

  /* ── Sync when parent changes `selected` ── */
  useEffect(() => {
    if (!emblaApi) return;
    const targetIdx = teams.findIndex((t) => t.slug === selected);
    if (targetIdx !== -1) {
      if (targetIdx !== emblaApi.selectedScrollSnap()) {
        emblaApi.scrollTo(targetIdx);
      } else {
        onScrollComplete?.();
      }
    }
  }, [selected, teams, emblaApi, onScrollComplete]);

  return (
    <div className="flex flex-col items-center gap-0 w-full">
      {/* Category Title */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="uppercase text-[#ffcc00] font-black tracking-widest text-xs md:text-sm">
          {t("select_team")}
        </span>
        <div className="w-8 h-1 bg-[#ffcc00] rounded-full"></div>
      </div>

      {/* Embla Viewport */}
      <div className="w-full overflow-x-clip overflow-y-visible py-8" ref={emblaRef}>
        <div
          className="flex touch-pan-y"
          style={{ backfaceVisibility: "hidden" }}
        >
          {teams.map((t, index) => {
            const pData = proximities[index] ?? { flagP: index === startIndex ? 1 : 0, labelP: index === startIndex ? 1 : 0 };
            const p = pData.flagP;

            // ── Visual values driven by proximity ──
            const scale = SCALE_MIN + p * (SCALE_MAX - SCALE_MIN);
            const opacity = OPACITY_MIN + p * (OPACITY_MAX - OPACITY_MIN);
            const ringWidth = Math.max(2, Math.round(p * 4));
            const glowRadius = Math.round(p * 35);
            const ringAlpha = p;

            // ── Smooth label styling ──
            const labelOpacity = 0.4 + p * 0.6;
            const r = Math.round(161 + p * (255 - 161));
            const g = Math.round(161 + p * (204 - 161));
            const b = Math.round(170 + p * (0 - 170));
            const textColor = `rgb(${r}, ${g}, ${b})`;
            const fontSize = `${10.5 + p * 7.5}px`;
            const fontWeight = p > 0.85 ? "900" : "500";
            const textTransform = "uppercase" as const;
            const translateY = (1 - p) * -2 + p * 16;
            const scaleText = 0.95 + p * 0.15;

            return (
              <div
                key={t.code}
                className="flex-[0_0_22%] min-w-[72px] md:flex-[0_0_18%] flex flex-col items-center justify-end cursor-grab active:cursor-grabbing select-none"
                style={{ paddingTop: 48, paddingBottom: 24 }}
                onClick={() => handleSlideClick(index)}
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
                    alt={`Bandeira ${translateTeamName(t.code, t.name, lang)}`}
                    className="w-full h-full object-cover rounded-full pointer-events-none"
                    draggable={false}
                    loading="lazy"
                  />
                </div>

                {/* Label — shows on ALL items proportional to proximity */}
                <div
                  className="flex flex-col items-center mt-2 h-6"
                  style={{
                    opacity: labelOpacity,
                    transform: `translateY(${translateY}px) scale(${scaleText})`,
                    willChange: "opacity, transform",
                  }}
                >
                  <span
                    className="whitespace-nowrap leading-none transition-all duration-100"
                    style={{
                      color: textColor,
                      fontSize,
                      fontWeight,
                      textTransform,
                    }}
                  >
                    {translateTeamName(t.code, t.name, lang)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
