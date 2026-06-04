import type { SkeletonConfig, SkeletonBlock } from "./Skeleton";

/**
 * Presets pour le composant Skeleton.
 *
 * Usage :
 * ```tsx
 * <Skeleton preset="articleCard" />
 * <Skeleton preset="commentList" color="#f1f5f9" />
 * ```
 *
 * Les props individuelles écrasent toujours le preset.
 */
export const SkeletonPresets = {

  // ─── ATOMS ────────────────────────────────────────────────────────────────

  /** Ligne avatar + nom + sous-titre — profil, tweet, résultat de recherche */
  userRow: {
    layout: [
      {
        type: "row", align: "center", gap: 12,
        children: [
          { type: "avatar", size: 40 },
          {
            type: "column", flex: 1, gap: 6,
            children: [
              { type: "title", width: "45%", height: 14 },
              { type: "title", width: "28%", height: 11 },
            ],
          },
        ],
      },
    ] satisfies SkeletonBlock[],
  },

  /** Un simple paragraphe de texte */
  paragraph: {
    layout: [
      { type: "text", lines: { count: 5, seed: "para" }, lineHeight: 13, gap: 9 },
    ] satisfies SkeletonBlock[],
  },

  /** Titre seul */
  title: {
    layout: [
      { type: "title", width: "60%", height: 24 },
    ] satisfies SkeletonBlock[],
  },

  // ─── CARDS ────────────────────────────────────────────────────────────────

  /** Card article : image bannière + titre + paragraphe + tags */
  articleCard: {
    layout: [
      { type: "image", height: 180, radius: "10px" },
      { type: "divider", spacing: 6 },
      { type: "title", width: "70%" },
      { type: "divider", spacing: 4 },
      { type: "text", lines: ["100%", "100%", "82%", "58%"], lineHeight: 11, gap: 7 },
      { type: "divider", spacing: 6 },
      { type: "badge", count: 2 },
    ] satisfies SkeletonBlock[],
  },

  /** Card produit : image carrée + titre + prix + bouton */
  productCard: {
    layout: [
      { type: "image", height: 200, radius: "12px" },
      { type: "divider", spacing: 8 },
      { type: "title", width: "80%" },
      { type: "divider", spacing: 4 },
      { type: "title", width: "35%", height: 16 },
      { type: "divider", spacing: 10 },
      { type: "button", width: "100%", align: "center" },
    ] satisfies SkeletonBlock[],
  },

  /** Card profil : avatar large + nom + bio + bouton */
  profileCard: {
    layout: [
      { type: "image", height: 100, radius: "12px 12px 0 0" },
      { type: "divider", spacing: 4 },
      {
        type: "row", align: "flex-end", gap: 12,
        children: [
          { type: "avatar", size: 64 },
          { type: "button", width: 100, height: 32, align: "right" },
        ],
      },
      { type: "divider", spacing: 6 },
      { type: "title", width: "45%" },
      { type: "title", width: "30%", height: 13 },
      { type: "divider", spacing: 4 },
      { type: "text", lines: { count: 3, seed: "profile-bio" }, lineHeight: 11, gap: 7 },
      { type: "divider", spacing: 6 },
      { type: "badge", count: 3 },
    ] satisfies SkeletonBlock[],
  },

  // ─── LISTS ────────────────────────────────────────────────────────────────

  /** Fil de commentaires (3 items) */
  commentList: {
    layout: [
      {
        type: "row", gap: 10,
        children: [
          { type: "avatar", size: 32 },
          { type: "column", flex: 1, children: [
            { type: "title", width: "32%", height: 12 },
            { type: "text", lines: ["100%", "84%"], lineHeight: 10, gap: 5 },
          ]},
        ],
      },
      { type: "divider", spacing: 10 },
      {
        type: "row", gap: 10,
        children: [
          { type: "avatar", size: 32 },
          { type: "column", flex: 1, children: [
            { type: "title", width: "40%", height: 12 },
            { type: "text", lines: ["100%", "70%"], lineHeight: 10, gap: 5 },
          ]},
        ],
      },
      { type: "divider", spacing: 10 },
      {
        type: "row", gap: 10,
        children: [
          { type: "avatar", size: 32 },
          { type: "column", flex: 1, children: [
            { type: "title", width: "25%", height: 12 },
            { type: "text", lines: ["88%"], lineHeight: 10, gap: 5 },
          ]},
        ],
      },
    ] satisfies SkeletonBlock[],
  },

  /** Table de données : header + 4 lignes */
  table: {
    layout: [
      // header
      {
        type: "row", gap: 16,
        children: [
          { type: "title", width: "20%", height: 11 },
          { type: "title", width: "25%", height: 11 },
          { type: "title", width: "30%", height: 11 },
          { type: "title", width: "15%", height: 11 },
        ],
      },
      { type: "divider", spacing: 4 },
      // rows
      ...([
        ["18%", "22%", "35%", "12%"],
        ["22%", "18%", "28%", "16%"],
        ["15%", "26%", "32%", "10%"],
        ["20%", "20%", "30%", "14%"],
      ] as string[][]).flatMap((cols, i) => [
        {
          type: "row" as const, gap: 16,
          children: cols.map(w => ({ type: "title" as const, width: w, height: 13 })),
        },
        ...(i < 3 ? [{ type: "divider" as const, spacing: 2 }] : []),
      ]),
    ] satisfies SkeletonBlock[],
  },

  // ─── DASHBOARD ────────────────────────────────────────────────────────────

  /** Bandeau de 3 métriques côte à côte */
  dashboardStats: {
    layout: [
      {
        type: "row", gap: 16,
        children: [
          { type: "column", flex: 1, children: [
            { type: "title", width: "60%", height: 11 },
            { type: "title", width: "75%", height: 28 },
            { type: "title", width: "45%", height: 10 },
          ]},
          { type: "column", flex: 1, children: [
            { type: "title", width: "60%", height: 11 },
            { type: "title", width: "75%", height: 28 },
            { type: "title", width: "45%", height: 10 },
          ]},
          { type: "column", flex: 1, children: [
            { type: "title", width: "60%", height: 11 },
            { type: "title", width: "75%", height: 28 },
            { type: "title", width: "45%", height: 10 },
          ]},
        ],
      },
    ] satisfies SkeletonBlock[],
  },

  /** Sidebar de navigation */
  sidebar: {
    layout: [
      { type: "title", width: "55%", height: 22 },
      { type: "divider", spacing: 12 },
      ...Array.from({ length: 6 }, (_, i) => ({
        type: "row" as const, gap: 10, align: "center" as const,
        children: [
          { type: "avatar" as const, size: 20 },
          { type: "title" as const, width: `${40 + (i * 13) % 35}%`, height: 13 },
        ],
      }) satisfies SkeletonBlock).flatMap((row, i) => [
        row,
        ...(i < 5 ? [{ type: "divider" as const, spacing: 4 }] : []),
      ]),
    ] satisfies SkeletonBlock[],
  },

  // ─── FORMS ────────────────────────────────────────────────────────────────

  /** Formulaire : labels + champs + textarea + bouton */
  form: {
    layout: [
      { type: "title", width: "25%", height: 11 },
      { type: "image", height: 38, radius: "6px" },
      { type: "divider", spacing: 4 },
      { type: "title", width: "20%", height: 11 },
      { type: "image", height: 38, radius: "6px" },
      { type: "divider", spacing: 4 },
      { type: "title", width: "30%", height: 11 },
      { type: "image", height: 80, radius: "6px" },
      { type: "divider", spacing: 8 },
      { type: "button", width: 130 },
    ] satisfies SkeletonBlock[],
  },

} as const satisfies Record<string, SkeletonConfig>;

export type SkeletonPresetName = keyof typeof SkeletonPresets;
