import React, { useEffect, useRef } from "react";
import { HexBackground } from "./HexBackground";
import { seedFromString } from "./seededRandom";

interface BackgroundProps {
  seedOverride?: string;
}

const Background: React.FC<BackgroundProps> = ({ seedOverride }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HexBackground | null>(null);

  const seedStr = seedOverride ?? "hexbg-anonymous";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    const bg = new HexBackground({ container: el, seed: seedFromString(seedStr) });

    bg.init()
      .then(() => {
        if (cancelled) {
          bg.destroy();
        } else {
          bgRef.current = bg;
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
      if (bgRef.current) {
        bgRef.current.destroy();
        bgRef.current = null;
      }
    };
  }, [seedStr]);

  return (
    <div
      id="background"
      ref={containerRef}
      data-seed={seedStr}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    />
  );
};

export default Background;