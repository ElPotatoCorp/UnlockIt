import React from "react";
import styles from "./skeleton.module.css";
import { SkeletonPresets, type SkeletonPresetName } from "./skeletonPresets";

// ─── Block types ──────────────────────────────────────────────────────────────

type Dim = number | string; // px si number, sinon CSS string ("50%", "12rem"…)

export interface SkeletonAvatarBlock {
  type: "avatar";
  /** Diamètre en px (défaut : 40) */
  size?: number;
  color?: string;
}

export interface SkeletonImageBlock {
  type: "image";
  width?: Dim;
  height?: Dim;
  /** border-radius CSS ou px (défaut : "8px") */
  radius?: string | number;
  color?: string;
}

export interface SkeletonTextBlock {
  type: "text";
  /**
   * Largeurs de chaque ligne.
   *
   * - `Dim[]`                     → une valeur par ligne, contrôle total
   * - `"random"`                  → 4 lignes pseudo-aléatoires (change au mount)
   * - `{ count, seed? }`          → N lignes déterministes (stable au re-render)
   *
   * @example
   * lines: ["100%", "100%", "85%", "55%"]    // paragraphe classique
   * lines: ["40%"]                            // titre inline court
   * lines: { count: 5, seed: "user-bio" }    // déterministe, 5 lignes
   */
  lines?: Dim[] | "random" | { count: number; seed?: string };
  /** Hauteur d'une ligne en px (défaut : 12) */
  lineHeight?: number;
  /** Gap vertical entre les lignes en px (défaut : 8) */
  gap?: number;
  color?: string;
  /** Délai shimmer de départ, en secondes (cascade automatique sinon) */
  baseDelay?: number;
}

export interface SkeletonTitleBlock {
  type: "title";
  width?: Dim;
  /** Hauteur en px (défaut : 20) */
  height?: number;
  color?: string;
}

export interface SkeletonBadgeBlock {
  type: "badge";
  /** Nombre de badges côte à côte (défaut : 1) */
  count?: number;
  width?: number;
  height?: number;
  color?: string;
}

export interface SkeletonButtonBlock {
  type: "button";
  width?: number | string;
  height?: number;
  align?: "left" | "center" | "right";
  color?: string;
}

export interface SkeletonDividerBlock {
  type: "divider";
  /** Espace vertical de chaque côté en px (défaut : 8) */
  spacing?: number;
}

export interface SkeletonRowBlock {
  type: "row";
  children: SkeletonBlock[];
  gap?: number;
  align?: "flex-start" | "center" | "flex-end";
}

export interface SkeletonColumnBlock {
  type: "column";
  children: SkeletonBlock[];
  gap?: number;
  flex?: number | string;
}

export type SkeletonBlock =
  | SkeletonAvatarBlock
  | SkeletonImageBlock
  | SkeletonTextBlock
  | SkeletonTitleBlock
  | SkeletonBadgeBlock
  | SkeletonButtonBlock
  | SkeletonDividerBlock
  | SkeletonRowBlock
  | SkeletonColumnBlock;

// ─── Skeleton config / props ──────────────────────────────────────────────────

export interface SkeletonConfig {
  /** Layout composé de blocs. Si omis → défaut avatar + 3 lignes. */
  layout?: SkeletonBlock[];
  /** Couleur par défaut de tous les blocs (surchargeable par bloc) */
  color?: string;
  /** Durée du cycle shimmer en secondes (défaut : 1.4) */
  shimmerDuration?: number;
  /** Largeur du conteneur racine (défaut : "100%") */
  width?: Dim;
  /** Styles inline sur le conteneur racine */
  style?: React.CSSProperties;
}

export interface SkeletonProps extends SkeletonConfig {
  /**
   * Nom d'un preset prédéfini (voir skeletonPresets.ts).
   * Les props individuelles écrasent le preset.
   * @example <Skeleton preset="articleCard" />
   */
  preset?: SkeletonPresetName;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_COLOR = "#e2e8f0";

function px(v: Dim): string {
  return typeof v === "number" ? `${v}px` : v;
}

function seededWidths(count: number, seed: string): string[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return Array.from({ length: count }, (_, i) => {
    h = (Math.imul(1664525, h) + 1013904223) | 0;
    return i === count - 1
      ? `${30 + ((h >>> 0) % 35)}%`
      : `${60 + ((h >>> 0) % 40)}%`;
  });
}

function resolveLines(lines: SkeletonTextBlock["lines"]): Dim[] {
  if (!lines || lines === "random") return seededWidths(4, String(Math.random()));
  if (Array.isArray(lines)) return lines;
  return seededWidths(lines.count, lines.seed ?? "default");
}

// ─── ShimmerBox ───────────────────────────────────────────────────────────────

function ShimmerBox({
  width, height, radius = "6px", color, delay = 0, shimmerDuration, style,
}: {
  width: Dim; height: Dim; radius?: string | number;
  color: string; delay?: number; shimmerDuration: number;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={styles.shimmer}
      style={{
        width: px(width),
        height: px(height),
        borderRadius: typeof radius === "number" ? `${radius}px` : radius,
        backgroundColor: color,
        animationDuration: `${shimmerDuration}s`,
        animationDelay: `${delay}s`,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

// ─── Block renderer ───────────────────────────────────────────────────────────

function renderBlock(
  block: SkeletonBlock,
  defaultColor: string,
  shimmerDuration: number,
  key: number,
): React.ReactNode {
  const delay = key * 0.06;
  const color = ("color" in block && block.color) ? block.color : defaultColor;

  switch (block.type) {

    case "avatar":
      return <ShimmerBox key={key} width={block.size ?? 40} height={block.size ?? 40}
        radius="50%" color={color} delay={delay} shimmerDuration={shimmerDuration} />;

    case "image":
      return <ShimmerBox key={key} width={block.width ?? "100%"} height={block.height ?? 160}
        radius={block.radius ?? "8px"} color={color} delay={delay} shimmerDuration={shimmerDuration} />;

    case "title":
      return <ShimmerBox key={key} width={block.width ?? "55%"} height={block.height ?? 20}
        radius="5px" color={color} delay={delay} shimmerDuration={shimmerDuration} />;

    case "text": {
      const widths = resolveLines(block.lines);
      const lh = block.lineHeight ?? 12;
      const gap = block.gap ?? 8;
      const startDelay = block.baseDelay ?? delay;
      return (
        <div key={key} style={{ display: "flex", flexDirection: "column", gap, width: "100%" }}>
          {widths.map((w, i) => (
            <ShimmerBox key={i} width={w} height={lh} radius="4px" color={color}
              delay={startDelay + i * 0.05} shimmerDuration={shimmerDuration} />
          ))}
        </div>
      );
    }

    case "badge":
      return (
        <div key={key} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: block.count ?? 1 }, (_, i) => (
            <ShimmerBox key={i} width={block.width ?? 64} height={block.height ?? 22}
              radius="99px" color={color} delay={delay + i * 0.04} shimmerDuration={shimmerDuration} />
          ))}
        </div>
      );

    case "button": {
      const justify = { left: "flex-start", center: "center", right: "flex-end" } as const;
      return (
        <div key={key} style={{ display: "flex", justifyContent: justify[block.align ?? "left"], width: "100%" }}>
          <ShimmerBox width={block.width ?? 120} height={block.height ?? 36}
            radius="8px" color={color} delay={delay} shimmerDuration={shimmerDuration} />
        </div>
      );
    }

    case "divider":
      return <div key={key} style={{ height: 0, margin: `${block.spacing ?? 8}px 0` }} />;

    case "row":
      return (
        <div key={key} style={{
          display: "flex", flexDirection: "row",
          gap: block.gap ?? 12, alignItems: block.align ?? "flex-start", width: "100%",
        }}>
          {block.children.map((child, i) => renderBlock(child, defaultColor, shimmerDuration, key * 100 + i))}
        </div>
      );

    case "column":
      return (
        <div key={key} style={{
          display: "flex", flexDirection: "column",
          gap: block.gap ?? 8, flex: block.flex, minWidth: 0,
        }}>
          {block.children.map((child, i) => renderBlock(child, defaultColor, shimmerDuration, key * 100 + i))}
        </div>
      );

    default:
      return null;
  }
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_LAYOUT: SkeletonBlock[] = [
  {
    type: "row", gap: 12, align: "flex-start",
    children: [
      { type: "avatar", size: 40 },
      {
        type: "column", flex: 1,
        children: [
          { type: "title", width: "50%" },
          { type: "text", lines: ["100%", "90%", "65%"], lineHeight: 11, gap: 7 },
        ],
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Skeleton(props: SkeletonProps) {
  const { preset, ...ownProps } = props;
  const cfg: SkeletonConfig = {
    color: DEFAULT_COLOR,
    shimmerDuration: 1.4,
    width: "100%",
    ...(preset ? SkeletonPresets[preset] : {}),
    ...ownProps,
  };

  const { layout = DEFAULT_LAYOUT, color, shimmerDuration, width, style } = cfg as Required<SkeletonConfig>;

  return (
    <div
      className={styles.root}
      style={{ width: px(width as Dim), ...style }}
      role="status"
      aria-label="Chargement du contenu"
      aria-live="polite"
    >
      {layout.map((block, i) => renderBlock(block, color, shimmerDuration, i))}
    </div>
  );
}
