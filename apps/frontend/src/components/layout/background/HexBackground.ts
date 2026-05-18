import * as PIXI from "pixi.js";
import { HexPatternContainer } from "./HexPatternContainer";
import { getColumnZones, getBreakpoint } from "./layout";
import { createSeededRandom } from "./seededRandom";
import { THEME_COLORS } from "./color";

const ATTEMPTS_PER_COLUMN = 14;
const PARALLAX_FACTOR = 0.22;

export interface HexBackgroundOptions {
  container: HTMLElement;
  seed: number;
}

export class HexBackground {
  private opts: HexBackgroundOptions;
  private app: PIXI.Application;
  private leftLayer:  PIXI.Container;
  private rightLayer: PIXI.Container;
  private patterns: HexPatternContainer[] = [];
  private resizeObserver: ResizeObserver | null = null;
  private seed: number;
  private scrollY = 0;
  private initialized = false;
  /** Set to true by destroy() so the init() .then() knows to abort */
  private destroyed = false;

  constructor(opts: HexBackgroundOptions) {
    this.opts       = opts;
    this.seed       = opts.seed;
    this.app        = new PIXI.Application();
    this.leftLayer  = new PIXI.Container();
    this.rightLayer = new PIXI.Container();
  }

  async init(): Promise<void> {
    const { container } = this.opts;
    const w = window.innerWidth;
    const h = window.innerHeight;

    await this.app.init({
      canvas:           container instanceof HTMLCanvasElement ? container : undefined,
      width:            w,
      height:           h,
      backgroundAlpha:  0,
      resolution:       window.devicePixelRatio || 1,
      autoDensity:      true,
      antialias:        true,
      powerPreference:  "low-power",
    });

    // If destroy() was called while we were awaiting, tear everything down now
    if (this.destroyed) {
      this.app.destroy(true);
      return;
    }

    if (!(container instanceof HTMLCanvasElement)) {
      container.appendChild(this.app.canvas);
    }

    const canvas = this.app.canvas as HTMLCanvasElement;
    canvas.style.position     = "fixed";
    canvas.style.inset        = "0";
    canvas.style.width        = "100vw";
    canvas.style.height       = "100vh";
    canvas.style.zIndex       = "-1";
    canvas.style.pointerEvents = "none";

    this.app.stage.addChild(this.leftLayer);
    this.app.stage.addChild(this.rightLayer);

    this.buildPatterns(w, h);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(document.documentElement);

    window.addEventListener("scroll", this.onScroll, { passive: true });
    this.app.ticker.add(this.onTick);

    this.initialized = true;
  }

  // --------------------------------------------------------------------------
  private buildPatterns(w: number, h: number): void {
    for (const p of this.patterns) p.destroy();
    this.patterns = [];
    this.leftLayer.removeChildren();
    this.rightLayer.removeChildren();

    const bp     = getBreakpoint(w);
    const zones  = getColumnZones(w);
    const pageH  = Math.max(document.body.scrollHeight, h);
    const slotH  = bp === "mobile" ? 200 : 280;
    const slotsY = Math.ceil(pageH / slotH);

    const rng         = createSeededRandom(this.seed);
    const hexSizeBase = bp === "mobile" ? 20 : bp === "tablet" ? 27 : 32;

    const colorPairs: Array<[number, number]> = [
      [THEME_COLORS.green, THEME_COLORS.blue],
      [THEME_COLORS.blue,  THEME_COLORS.green],
    ];

    const buildColumn = (layer: PIXI.Container, zoneX: number, zoneW: number) => {
      const placed: PIXI.Rectangle[] = [];

      for (let attempt = 0; attempt < slotsY * ATTEMPTS_PER_COLUMN; attempt++) {
        const orientation = rng() < 0.5 ? "pointy" as const : "flat" as const;
        const size        = hexSizeBase + Math.floor(rng() * 8);
        const borderWidth = 1.5 + rng() * 2;
        const rows        = 4 + Math.floor(rng() * 4);
        const cols        = 4 + Math.floor(rng() * 4);
        const fillCount   = 6 + Math.floor(rng() * 8);
        const [colorA, colorB] = colorPairs[Math.floor(rng() * colorPairs.length)];
        const animSpeed   = 0.0001 + rng() * 0.0004;

        // Keep patterns well within the zone bounds
        const originX = zoneX + rng() * zoneW * 0.7;
        const originY = rng() * pageH;

        const pat = new HexPatternContainer({
          originX, originY, rows, cols, size, borderWidth,
          orientation, fillCount, rng,
          renderer: this.app.renderer as PIXI.Renderer,
          colorA, colorB, animSpeed,
        });

        const bounds = pat.getBounds();
        const margin = 10;
        const ex = bounds.x - margin, ey = bounds.y - margin;
        const ew = bounds.width + margin * 2, eh = bounds.height + margin * 2;

        const overlaps = placed.some(b =>
          !(ex + ew < b.x || ex > b.x + b.width || ey + eh < b.y || ey > b.y + b.height)
        );

        if (overlaps) { pat.destroy(); continue; }

        placed.push(new PIXI.Rectangle(bounds.x, bounds.y, bounds.width, bounds.height));
        layer.addChild(pat.container);
        this.patterns.push(pat);
      }
    };

    // Mobile: single full-width zone on leftLayer only, rightLayer stays empty
    buildColumn(this.leftLayer, zones.left.x, zones.left.width);
    if (zones.right !== null) {
      buildColumn(this.rightLayer, zones.right.x, zones.right.width);
    }
  }

  // --------------------------------------------------------------------------
  private onResize = (): void => {
    if (!this.initialized) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.app.renderer.resize(w, h);
    this.buildPatterns(w, h);
  };

  private onScroll = (): void => {
    this.scrollY = window.scrollY;
  };

  private onTick = (): void => {
    const offsetY = -this.scrollY * PARALLAX_FACTOR;
    this.leftLayer.y  = offsetY;
    this.rightLayer.y = offsetY;
    for (const p of this.patterns) p.update();
  };

  // --------------------------------------------------------------------------
  destroy(): void {
    // Signal to init()'s .then() that it should abort if still in-flight
    this.destroyed = true;

    if (!this.initialized) return;

    this.resizeObserver?.disconnect();
    window.removeEventListener("scroll", this.onScroll);
    this.app.ticker.remove(this.onTick);
    for (const p of this.patterns) p.destroy();
    this.patterns = [];
    this.app.destroy(true);
    this.initialized = false;
  }
}
