/** Theme accent colors — tweak these to match your brand */
export const THEME_COLORS = {
  green: 0x00ff9f,
  blue:  0x1f6feb,
};

/**
 * Linearly interpolate between two 24-bit hex colors.
 * @param a  start color as 0xRRGGBB
 * @param b  end color as 0xRRGGBB
 * @param t  blend factor in [0, 1]
 */
export function lerpColor(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
  const rr = Math.round(ar + t * (br - ar));
  const rg = Math.round(ag + t * (bg - ag));
  const rb = Math.round(ab + t * (bb - ab));
  return (rr << 16) | (rg << 8) | rb;
}

/**
 * Returns an oscillating t value in [0,1] based on elapsed time.
 * @param speed  cycles per millisecond (e.g. 0.00025)
 */
export function animatedT(speed = 0.00025): number {
  return (Math.sin(Date.now() * speed) + 1) / 2;
}
