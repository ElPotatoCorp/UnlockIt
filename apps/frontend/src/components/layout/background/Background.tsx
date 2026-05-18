import React, { useEffect, useRef } from "react";
import { HexBackground } from "./HexBackground";
import { getSeedFromCookie } from "./seededRandom";

interface BackgroundProps {
  /**
   * Name of the cookie that holds the user's session/auth identifier.
   * If the cookie is present its value is hashed into a seed so the
   * pattern is stable per-user across refreshes.
   * If omitted, "session_id" is tried and a hard-coded default is used
   * as a fallback.
   */
  cookieName?: string;
}

export const Background: React.FC<BackgroundProps> = ({
  cookieName = "session_id",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HexBackground | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Guard against React StrictMode's mount → unmount → remount cycle.
    // If cleanup fires before init() resolves, we skip setup entirely.
    let cancelled = false;

    const seed = getSeedFromCookie(cookieName);
    const bg = new HexBackground({ container: el, seed });

    bg.init()
      .then(() => {
        if (cancelled) {
          // Cleanup already ran while we were awaiting — destroy immediately
          bg.destroy();
        } else {
          bgRef.current = bg;
        }
      })
      .catch(console.error);

    return () => {
      cancelled = true;
      // If init() already resolved bgRef is populated — destroy now.
      // If it hasn't resolved yet the .then() above will handle it.
      if (bgRef.current) {
        bgRef.current.destroy();
        bgRef.current = null;
      }
    };
  }, [cookieName]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    />
  );
};