import { Hexagon } from "./Hexagon";
import { Gradiant } from "./Gradiant";
import { Zone } from "./Zone";

interface HexDimensions {
  hexWidth: number;
  hexHeight: number;
  horizDist: number;
  vertDist: number;
}

export interface HexGridOptions {
  origin?: { x: number; y: number };
  rows: number;
  cols: number;
  size: number;
  borderWidth: number;
  orientation?: "flat" | "pointy";
  fillColor?: string | CanvasGradient | Gradiant;
  borderColor?: string | CanvasGradient | Gradiant;
}

export class HexGrid {
  hexagons: Hexagon[] = [];
  protected options: Required<HexGridOptions>;

  constructor(options: HexGridOptions) {
    this.options = {
      origin: options.origin ?? { x: 0, y: 0 },
      ...options,
      orientation: options.orientation ?? "pointy",
      fillColor: options.fillColor ?? "#888888",
      borderColor: options.borderColor ?? "#00000000",
    };
    this.generateHexagons();
  }

  private getDimensions(): HexDimensions {
    const { size, orientation } = this.options;

    if (orientation === "pointy") {
      return {
        hexHeight: size * 2,
        hexWidth: Math.sqrt(3) * size,
        vertDist: size * 1.5,
        horizDist: Math.sqrt(3) * size,
      };
    }
    else {
      return {
        hexWidth: size * 2,
        hexHeight: Math.sqrt(3) * size,
        horizDist: size * 1.5,
        vertDist: Math.sqrt(3) * size,
      };
    }
  }

  private getPosition(row: number, col: number, dims: HexDimensions): { x: number; y: number } {
    const { size, borderWidth, orientation, origin } = this.options;

    if (orientation === "pointy") {
      return {
        x: origin.x + col * dims.horizDist + (row % 2) * (dims.horizDist / 2) + size,
        y: origin.y + row * dims.vertDist + size + borderWidth,
      };
    } else {
      return {
        x: origin.x + col * dims.horizDist + size + borderWidth,
        y: origin.y + row * dims.vertDist + (col % 2) * (dims.vertDist / 2) + size,
      };
    }
  }


  private generateHexagons(): void {
    const dims = this.getDimensions();
    const { rows, cols, size, borderWidth, fillColor, borderColor, orientation } = this.options;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const { x, y } = this.getPosition(row, col, dims);
        this.hexagons.push(new Hexagon({
          x,
          y,
          size,
          fillColor,
          borderColor,
          borderWidth,
          orientation
        }));
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, zone?: Zone): void {
    this.hexagons.forEach(hex => hex.draw(ctx, zone));
  }

  public getHitbox(): { minX: number; minY: number; maxX: number; maxY: number } {
    if (this.hexagons.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const hex of this.hexagons) {
      const { x, y, size } = (hex as any).options;
      minX = Math.min(minX, x - size);
      maxX = Math.max(maxX, x + size);
      minY = Math.min(minY, y - size);
      maxY = Math.max(maxY, y + size);
    }

    return { minX, minY, maxX, maxY };
  }
}
