export type Breakpoint = "mobile" | "tablet" | "desktop";

export interface ColumnZones {
  left:   { x: number; width: number };
  right:  { x: number; width: number } | null; // null on mobile = single full-width zone
}

export function getBreakpoint(width: number): Breakpoint {
  if (width < 700) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/**
 * Desktop/tablet: two side columns, nothing in the centre.
 * Mobile: one full-width zone (right is null) — avoids the overlap problem
 *         that occurs when two 38%-wide strips overlap on a narrow screen.
 */
export function getColumnZones(width: number): ColumnZones {
  const bp = getBreakpoint(width);

  if (bp === "mobile") {
    // Single zone covering the full width; HexBackground will use only leftLayer
    return {
      left:  { x: 0, width },
      right: null,
    };
  }

  const fraction = bp === "desktop" ? 0.22 : 0.28;
  const colW = Math.round(width * fraction);

  return {
    left:  { x: 0,            width: colW },
    right: { x: width - colW, width: colW },
  };
}
