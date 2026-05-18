export class Zone {
  public minX: number;
  public minY: number;
  public maxX: number;
  public maxY: number;

  constructor(minX: number, minY: number, maxX: number, maxY: number) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  get width(): number {
    return this.maxX - this.minX;
  }

  get height(): number {
    return this.maxY - this.minY;
  }

  get center(): { x: number; y: number } {
    return {
      x: this.minX + this.width / 2,
      y: this.minY + this.height / 2
    };
  }

  contains(x: number, y: number): boolean {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }

  debugDraw(ctx: CanvasRenderingContext2D, color: string = 'rgba(0,0,0,0.2)'): void {
    const dpr = window.devicePixelRatio || 1;
    ctx.fillStyle = color;
    ctx.fillRect(this.minX * dpr, this.minY * dpr, this.width * dpr, this.height * dpr);
  }

  intersects(other: Zone): boolean {
    return !(
      this.maxX < other.minX ||
      this.minX > other.maxX ||
      this.maxY < other.minY ||
      this.minY > other.maxY
    );
  }
}
