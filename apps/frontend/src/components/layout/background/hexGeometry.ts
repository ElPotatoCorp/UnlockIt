export type HexOrientation = "pointy" | "flat";

export interface HexDimensions {
  hexW:     number; // bounding width  of one hex
  hexH:     number; // bounding height of one hex
  horizStep: number; // x distance between column centres
  vertStep:  number; // y distance between row centres
}

export function getHexDimensions(size: number, orientation: HexOrientation): HexDimensions {
  if (orientation === "pointy") {
    const w = Math.sqrt(3) * size;
    const h = 2 * size;
    return { hexW: w, hexH: h, horizStep: w, vertStep: h * 0.75 };
  } else {
    const w = 2 * size;
    const h = Math.sqrt(3) * size;
    return { hexW: w, hexH: h, horizStep: w * 0.75, vertStep: h };
  }
}

/**
 * Returns the 6 vertices of a hexagon centred at (cx, cy).
 * `angleOffset`:  Math.PI/6 for pointy-top, 0 for flat-top.
 */
export function hexVertices(
  cx: number, cy: number, size: number, angleOffset: number
): Array<{ x: number; y: number }> {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = angleOffset + (Math.PI / 3) * i;
    pts.push({ x: cx + size * Math.cos(a), y: cy + size * Math.sin(a) });
  }
  return pts;
}

export function orientationAngle(o: HexOrientation): number {
  return o === "pointy" ? Math.PI / 6 : 0;
}
