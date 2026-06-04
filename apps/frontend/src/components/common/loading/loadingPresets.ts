import type { LoadingConfig } from "./Loading";

/**
 * Presets pour le composant Loading.
 *
 * Usage :
 * ```tsx
 * <Loading preset="spinnerInline" />
 * <Loading preset="fullscreenDark" text="Sauvegarde…" />
 * ```
 *
 * Les props individuelles écrasent toujours le preset.
 */
export const LoadingPresets = {

  // ─── SPINNER ─────────────────────────────────────────────────────────────
  spinnerSm: {
    variant: "spinner", color: "#4A90E2", size: 24, thickness: 2, duration: 0.7,
  },
  spinnerMd: {
    variant: "spinner", color: "#4A90E2", size: 48, thickness: 4, duration: 0.8,
  },
  spinnerLg: {
    variant: "spinner", color: "#4A90E2", size: 80, thickness: 6, duration: 1,
    showText: true, text: "Chargement…", textPosition: "bottom",
  },
  spinnerGreen: {
    variant: "spinner", color: "#22c55e", size: 40, thickness: 3, duration: 0.6,
  },
  spinnerRed: {
    variant: "spinner", color: "#ef4444", size: 40, thickness: 3, duration: 0.6,
  },
  spinnerWhite: {
    variant: "spinner", color: "#ffffff", size: 24, thickness: 2, duration: 0.7,
  },
  spinnerInline: {
    variant: "spinner", color: "#6366f1", size: 18, thickness: 2, duration: 0.7,
    showText: true, text: "Chargement…", textPosition: "right",
  },

  // ─── RING ─────────────────────────────────────────────────────────────────
  ringMd: {
    variant: "ring", color: "#6366f1", size: 48, thickness: 4, duration: 1,
  },
  ringLg: {
    variant: "ring", color: "#6366f1", size: 72, thickness: 5, duration: 1.1,
    showText: true, text: "Chargement…", textPosition: "bottom",
  },
  ringGold: {
    variant: "ring", color: "#f59e0b", size: 48, thickness: 4, duration: 1.2,
  },
  ringWhite: {
    variant: "ring", color: "#ffffff", size: 40, thickness: 3, duration: 1,
  },

  // ─── DOTS ─────────────────────────────────────────────────────────────────
  dotsSm: {
    variant: "dots", color: "#64748b", size: 24, duration: 0.5,
  },
  dotsMd: {
    variant: "dots", color: "#4A90E2", size: 48, duration: 0.6,
  },
  dotsPurple: {
    variant: "dots", color: "#a855f7", size: 48, duration: 0.5,
  },
  dotsWithLabel: {
    variant: "dots", color: "#f59e0b", size: 48, duration: 0.6,
    showText: true, text: "Veuillez patienter…", textPosition: "bottom",
  },

  // ─── BARS ─────────────────────────────────────────────────────────────────
  barsMd: {
    variant: "bars", color: "#4A90E2", size: 40, duration: 0.6,
  },
  barsTeal: {
    variant: "bars", color: "#14b8a6", size: 48, duration: 0.5,
  },
  barsWithLabel: {
    variant: "bars", color: "#f97316", size: 48, duration: 0.6,
    showText: true, text: "Analyse en cours…", textPosition: "right",
  },

  // ─── WAVE ─────────────────────────────────────────────────────────────────
  waveMd: {
    variant: "wave", color: "#4A90E2", size: 40, duration: 1,
  },
  wavePink: {
    variant: "wave", color: "#ec4899", size: 48, duration: 0.8,
  },

  // ─── PULSE ────────────────────────────────────────────────────────────────
  pulseMd: {
    variant: "pulse", color: "#4A90E2", size: 48, duration: 1.2,
  },
  pulseRed: {
    variant: "pulse", color: "#ef4444", size: 32, duration: 0.8,
  },
  pulseLive: {
    variant: "pulse", color: "#22c55e", size: 10, duration: 1,
    showText: true, text: "En direct", textPosition: "right",
  },

  // ─── FULLSCREEN ───────────────────────────────────────────────────────────
  fullscreen: {
    variant: "spinner", color: "#4A90E2", size: 64, thickness: 5, duration: 0.9,
    showText: true, text: "Chargement…", textPosition: "bottom",
    fullWidth: true, center: true, overlay: true,
  },
  fullscreenDark: {
    variant: "ring", color: "#ffffff", size: 64, thickness: 4, duration: 1,
    showText: true, text: "Veuillez patienter…", textPosition: "bottom",
    fullWidth: true, center: true, overlay: true,
    overlayColor: "rgba(0,0,0,0.75)",
  },

} as const satisfies Record<string, LoadingConfig>;

export type LoadingPresetName = keyof typeof LoadingPresets;
