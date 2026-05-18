export type GradiantDirection = 'horizontal' | 'vertical' | number;

export interface GradiantOptions {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  colors: string[];
  direction: GradiantDirection;
}

export class Gradiant {
  private options: GradiantOptions;
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private colors: string[];
  protected direction: GradiantDirection;

  constructor(options: GradiantOptions) {
    this.options = options
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.colors = options.colors;
    this.direction = options.direction;

    if (!this.ctx) throw new Error(`Unable to access 2D context of canvas`);
    if (this.colors.length < 2) throw new Error(`Gradiant requires at least 2 colors`);
  }

  public getColor(): CanvasGradient {
    const { width, height } = this.canvas;
    const gradient = this.direction === 'horizontal'
      ? this.ctx.createLinearGradient(0, 0, width, 0)
      : this.ctx.createLinearGradient(0, 0, 0, height);

    const step = 1 / (this.colors.length - 1);
    this.colors.forEach((color, index) => {
      gradient.addColorStop(index * step, color);
    });

    return gradient;
  }
}
