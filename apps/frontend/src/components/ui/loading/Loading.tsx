import React from "react";
import styles from "./loading.module.css";
import { LoadingPresets, type LoadingPresetName } from "./loadingPresets";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LoadingVariant = "spinner" | "dots" | "bars" | "pulse" | "ring" | "wave";

export interface LoadingConfig {
  /** Variante visuelle */
  variant?: LoadingVariant;
  /** Taille principale en px (diamètre spinner/ring, hauteur bars/wave) */
  size?: number;
  /** Épaisseur du trait — spinner et ring uniquement */
  thickness?: number;
  /** Couleur principale, accepte tout format CSS */
  color?: string;
  /** Couleur de la piste (fond du cercle) — spinner et ring uniquement */
  trackColor?: string;
  /** Durée d'un cycle d'animation en secondes */
  duration?: number;
  /** Afficher un label texte */
  showText?: boolean;
  /** Contenu du label */
  text?: React.ReactNode;
  /** Position du label par rapport à l'indicateur */
  textPosition?: "top" | "bottom" | "left" | "right";
  /** Styles inline sur le label */
  textStyle?: React.CSSProperties;
  /** Le wrapper prend toute la largeur de son parent */
  fullWidth?: boolean;
  /** Centre l'indicateur dans son conteneur */
  center?: boolean;
  /** aria-label du role="status" */
  ariaLabel?: string;
  /** Styles inline sur le wrapper racine */
  style?: React.CSSProperties;
  /** Superpose un fond semi-transparent (mode page entière) */
  overlay?: boolean;
  /** Couleur de l'overlay (défaut : rgba(255,255,255,0.85)) */
  overlayColor?: string;
}

export interface LoadingProps extends LoadingConfig {
  /**
   * Nom d'un preset prédéfini. Les props individuelles écrasent le preset.
   * @example <Loading preset="spinnerInline" color="#ff0000" />
   */
  preset?: LoadingPresetName;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS: Required<Omit<LoadingConfig, "style" | "textStyle" | "overlayColor" | "text" | "trackColor">> = {
  variant: "spinner",
  size: 48,
  thickness: 4,
  color: "#4A90E2",
  duration: 0.8,
  showText: false,
  textPosition: "bottom",
  fullWidth: false,
  center: true,
  ariaLabel: "Chargement",
  overlay: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Spinner({ size, thickness, color, trackColor, duration }: {
  size: number; thickness: number; color: string; trackColor?: string; duration: number;
}) {
  return (
    <div
      className={styles.spinner}
      style={{
        width: size, height: size,
        borderWidth: thickness,
        borderColor: trackColor ?? "rgba(0,0,0,0.1)",
        borderTopColor: color,
        animationDuration: `${duration}s`,
      }}
    />
  );
}

function Ring({ size, thickness, color, trackColor, duration }: {
  size: number; thickness: number; color: string; trackColor?: string; duration: number;
}) {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg
      width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className={styles.ring}
      style={{ animationDuration: `${duration}s` }}
      aria-hidden="true"
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={trackColor ?? "rgba(0,0,0,0.1)"} strokeWidth={thickness} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={thickness} strokeLinecap="round"
        strokeDasharray={`${circ * 0.25} ${circ * 0.75}`}
        className={styles.ringArc}
        style={{ animationDuration: `${duration}s` }}
      />
    </svg>
  );
}

function Dots({ size, color, duration }: { size: number; color: string; duration: number }) {
  return (
    <div className={styles.dots} style={{ color, fontSize: size * 0.3 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ animationDuration: `${duration}s`, animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

function Bars({ size, color, duration }: { size: number; color: string; duration: number }) {
  return (
    <div className={styles.bars} style={{ color, height: size }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ animationDuration: `${duration}s`, animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

function Wave({ size, color, duration }: { size: number; color: string; duration: number }) {
  return (
    <div className={styles.wave} style={{ color, height: size }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} style={{ animationDuration: `${duration}s`, animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

function Pulse({ size, color, duration }: { size: number; color: string; duration: number }) {
  return (
    <div
      className={styles.pulse}
      style={{ width: size, height: size, backgroundColor: color, animationDuration: `${duration}s` }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Loading(props: LoadingProps) {
  const { preset, ...ownProps } = props;
  const cfg: LoadingConfig = { ...DEFAULTS, ...(preset ? LoadingPresets[preset] : {}), ...ownProps };

  const {
    variant, size, thickness, color, trackColor, duration,
    showText, text, textPosition, textStyle,
    fullWidth, center, ariaLabel, style, overlay, overlayColor,
  } = cfg as Required<LoadingConfig>;

  const flexDir: React.CSSProperties["flexDirection"] =
    textPosition === "right" ? "row"
    : textPosition === "left" ? "row-reverse"
    : textPosition === "top" ? "column-reverse"
    : "column";

  const indicator = (() => {
    switch (variant) {
      case "spinner": return <Spinner size={size} thickness={thickness} color={color} trackColor={trackColor} duration={duration} />;
      case "ring":    return <Ring size={size} thickness={thickness} color={color} trackColor={trackColor} duration={duration} />;
      case "dots":    return <Dots size={size} color={color} duration={duration} />;
      case "bars":    return <Bars size={size} color={color} duration={duration} />;
      case "wave":    return <Wave size={size} color={color} duration={duration} />;
      case "pulse":   return <Pulse size={size} color={color} duration={duration} />;
      default:        return null;
    }
  })();

  const inner = (
    <div
      className={styles.wrapper}
      style={{
        width: fullWidth ? "100%" : "auto",
        justifyContent: center ? "center" : "flex-start",
        flexDirection: flexDir,
        ...style,
      }}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      {indicator}
      {showText && text && (
        <p
          className={styles.label}
          style={{
            marginLeft:   textPosition === "right"  ? "0.6rem" : 0,
            marginRight:  textPosition === "left"   ? "0.6rem" : 0,
            marginTop:    textPosition === "bottom" ? "0.5rem" : 0,
            marginBottom: textPosition === "top"    ? "0.5rem" : 0,
            ...textStyle,
          }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div
        className={styles.overlay}
        style={{ backgroundColor: overlayColor ?? "rgba(255,255,255,0.85)" }}
        aria-modal="true"
      >
        {inner}
      </div>
    );
  }

  return inner;
}
