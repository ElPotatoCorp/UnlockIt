import { Gradiant, type GradiantOptions } from './Gradiant';

export class AnimatedGradiant extends Gradiant {
  private t: number = 0;
  private speed: number;
  private baseColors: string[];
  private loop: boolean;

  constructor(options: GradiantOptions & { speed?: number } & { loop?: boolean }) {
    super(options);
    this.speed = options.speed ?? 0.001;
    this.baseColors = options.colors;
    this.loop = options.loop ?? false;
  }

  private lerpColor(a: string, b: string, amount: number): string {
    const ah = parseInt(a.slice(1), 16);
    const ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;

    const bh = parseInt(b.slice(1), 16);
    const br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;

    const rr = Math.round(ar + amount * (br - ar));
    const rg = Math.round(ag + amount * (bg - ag));
    const rb = Math.round(ab + amount * (bb - ab));

    return '#' + ((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, '0');
  }

  public getColor(): CanvasGradient {
    const { canvas, ctx } = (this as any).options;
    const { width, height } = canvas;

    this.t = (Math.sin(Date.now() * this.speed) + 1) / 2;

    const animatedColors: string[] = [];
    for (let i = 0; i < this.baseColors.length - 1; i++) {
      const c1 = this.baseColors[i];
      const c2 = this.baseColors[i + 1];
      animatedColors.push(this.lerpColor(c1, c2, this.t));
    }

    if (this.loop) { // transition entre la dernière et la première couleur
      const last = this.baseColors[this.baseColors.length - 1];
      const first = this.baseColors[0];
      animatedColors.push(this.lerpColor(last, first, this.t));
    }
    else { // termine simplement par la dernière couleur
      animatedColors.push(this.baseColors[this.baseColors.length - 1]);
    }

    const gradient = this.direction === 'horizontal'
      ? ctx.createLinearGradient(0, 0, width, 0)
      : ctx.createLinearGradient(0, 0, 0, height);

    const step = 1 / (animatedColors.length - 1);
    animatedColors.forEach((color, index) => {
      gradient.addColorStop(index * step, color);
    });

    return gradient;
  }
}
