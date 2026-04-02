import { Gradiant } from "./Gradiant";
import { Zone } from "./Zone";

export type Orientation = "pointy" | "flat" | number;

export interface HexagonOptions {
  x: number;
  y: number;
  size: number;
  fillColor: string | CanvasGradient | Gradiant;
  borderColor: string | CanvasGradient | Gradiant;
  borderWidth: number;
  orientation?: Orientation;
}

export class Hexagon {
  private options: HexagonOptions;
  constructor(options: HexagonOptions) {
    this.options = options;
  }

  draw(ctx: CanvasRenderingContext2D, zone?: Zone): void {
    const {
      x, y, size, fillColor, borderColor, borderWidth,
      orientation = "pointy"
    } = this.options;

    const dpr = window.devicePixelRatio || 1;
    const offsetX = (zone?.minX ?? 0) * dpr;
    const offsetY = (zone?.minY ?? 0) * dpr;

    const angleOffset = typeof orientation === "number"
      ? orientation
      : orientation === "pointy" ? Math.PI / 6 : 0;

    const resolvedFill = fillColor instanceof Gradiant
      ? fillColor.getColor()
      : fillColor;

    const resolvedBorder = borderColor instanceof Gradiant
      ? borderColor.getColor()
      : borderColor;

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = angleOffset + Math.PI / 3 * i;
      const px = offsetX + x + size * Math.cos(angle);
      const py = offsetY + y + size * Math.sin(angle);
      ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = resolvedFill;
    ctx.strokeStyle = resolvedBorder;
    ctx.lineWidth = borderWidth;
    ctx.fill();
    ctx.stroke();
  }
}