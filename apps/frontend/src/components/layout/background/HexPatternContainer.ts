import * as PIXI from "pixi.js";
import {
  getHexDimensions,
  hexVertices,
  orientationAngle,
  type HexOrientation,
} from "./hexGeometry";
import { lerpColor, animatedT } from "./color";
import type { createSeededRandom } from "./seededRandom";

export interface HexPatternOptions {
  originX: number;
  originY: number;
  rows: number;
  cols: number;
  size: number;
  borderWidth: number;
  orientation: HexOrientation;
  fillCount: number;
  rng: ReturnType<typeof createSeededRandom>;
  renderer: PIXI.Renderer;
  colorA: number;
  colorB: number;
  animSpeed: number;
}

// --------------------------------------------------------------------------
function generatePattern(
  rows: number,
  cols: number,
  fillCount: number,
  rng: ReturnType<typeof createSeededRandom>
): boolean[][] {
  const grid: boolean[][] = Array.from({ length: rows }, () =>
    new Array(cols).fill(false)
  );

  let r = Math.floor(rng() * rows);
  let c = Math.floor(rng() * cols);
  grid[r][c] = true;
  let filled = 1;

  const dirs = [[-1, 0], [0, -1], [0, 1], [1, 0]];

  while (filled < fillCount) {
    const neighbors = dirs
      .map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nr, nc]) =>
        nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc]
      );

    if (neighbors.length === 0) {
      let found = false;
      outer: for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (!grid[row][col]) continue;
          const free = dirs
            .map(([dr, dc]) => [row + dr, col + dc])
            .filter(([nr, nc]) =>
              nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc]
            );
          if (free.length > 0) {
            [r, c] = free[Math.floor(rng() * free.length)];
            grid[r][c] = true;
            filled++;
            found = true;
            break outer;
          }
        }
      }
      if (!found) break;
    } else {
      [r, c] = neighbors[Math.floor(rng() * neighbors.length)];
      grid[r][c] = true;
      filled++;
    }
  }
  return grid;
}

// --------------------------------------------------------------------------
export class HexPatternContainer {
  public container: PIXI.Container;

  private sprites: PIXI.Sprite[] = [];
  private texture: PIXI.RenderTexture;
  private colorA: number;
  private colorB: number;
  private animSpeed: number;

  constructor(opts: HexPatternOptions) {
    this.colorA    = opts.colorA;
    this.colorB    = opts.colorB;
    this.animSpeed = opts.animSpeed;

    const dims        = getHexDimensions(opts.size, opts.orientation);
    const angleOffset = orientationAngle(opts.orientation);

    // Extra padding so stroke is never clipped at texture edges
    const pad     = Math.ceil(opts.borderWidth) + 4;
    const texSize = opts.size * 2 + pad * 2;

    this.texture = PIXI.RenderTexture.create({
      width:      texSize,
      height:     texSize,
      resolution: opts.renderer.resolution,
    });

    // Force eager GPU allocation of the underlying framebuffer.
    // PixiJS v8 creates RenderTextures lazily — the WebGL FBO isn't actually
    // bound until the GPU first samples it, causing Firefox's "lazy init" warning.
    // Calling bind() on the texture source forces the driver to allocate and
    // zero-fill the buffer right now, before any draw call touches it.
    const glTexSys = (opts.renderer as any).texture;
    if (glTexSys?.bind) {
      glTexSys.bind(this.texture.source, 0);
    }

    // Draw a white hex outline. White + sprite.tint = any color at runtime.
    // PixiJS v8: poly() expects PointData[] ({x, y} objects), not a flat array.
    const hexGfx = new PIXI.Graphics();
    const verts  = hexVertices(texSize / 2, texSize / 2, opts.size, angleOffset);
    hexGfx.poly(verts);
    hexGfx.fill({ color: 0x000000, alpha: 0 });
    hexGfx.stroke({ color: 0xffffff, width: opts.borderWidth, alignment: 0.5 });
    opts.renderer.render({ container: hexGfx, target: this.texture, clear: true });
    hexGfx.destroy();

    // ---- Generate connected pattern and place sprites ----
    const pattern = generatePattern(opts.rows, opts.cols, opts.fillCount, opts.rng);
    this.container = new PIXI.Container();

    for (let row = 0; row < opts.rows; row++) {
      for (let col = 0; col < opts.cols; col++) {
        if (!pattern[row][col]) continue;

        let cx: number, cy: number;
        if (opts.orientation === "pointy") {
          cx = col * dims.horizStep + (row % 2) * (dims.horizStep / 2) + opts.size;
          cy = row * dims.vertStep  + opts.size;
        } else {
          cx = col * dims.horizStep + opts.size;
          cy = row * dims.vertStep  + (col % 2) * (dims.vertStep / 2) + opts.size;
        }

        const sprite   = new PIXI.Sprite(this.texture);
        sprite.anchor.set(0.5);
        sprite.x = opts.originX + cx;
        sprite.y = opts.originY + cy;
        this.sprites.push(sprite);
        this.container.addChild(sprite);
      }
    }
  }

  update(): void {
    const t     = animatedT(this.animSpeed);
    const color = lerpColor(this.colorA, this.colorB, t);
    for (const s of this.sprites) s.tint = color;
  }

  destroy(): void {
    this.texture.destroy(true);
    this.container.destroy({ children: true });
  }

  /**
   * Bounding box in world space.
   * Computed manually to avoid the PIXI v8 Bounds vs Rectangle type mismatch.
   */
  getBounds(): PIXI.Rectangle {
    if (this.sprites.length === 0) return new PIXI.Rectangle(0, 0, 0, 0);

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const half = this.texture.width / 2;

    for (const s of this.sprites) {
      minX = Math.min(minX, s.x - half);
      minY = Math.min(minY, s.y - half);
      maxX = Math.max(maxX, s.x + half);
      maxY = Math.max(maxY, s.y + half);
    }

    return new PIXI.Rectangle(minX, minY, maxX - minX, maxY - minY);
  }
}
