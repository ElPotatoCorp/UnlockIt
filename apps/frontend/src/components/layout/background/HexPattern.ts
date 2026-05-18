import { Hexagon } from "./Hexagon";
import { HexGrid, type HexGridOptions } from "./HexGrid";
import { Zone } from "./Zone";

export type HexPatternMatrix = boolean[][];

interface HexPatternOptions extends HexGridOptions {
  fillCount?: number;
  pattern?: HexPatternMatrix;
}

export class HexPattern extends HexGrid {
  private pattern: HexPatternMatrix;
  private fillCount: number;

  constructor(options: HexPatternOptions) {
    super(options);
    this.fillCount = options.fillCount ?? Math.floor((options.rows * options.cols) / 4);
    this.pattern = options.pattern ?? this.generateConnectedPattern();
  }

  private generateConnectedPattern(): HexPatternMatrix {
    const pattern: HexPatternMatrix = Array.from({ length: this.options.rows }, () =>
      Array(this.options.cols).fill(false)
    );

    let currentRow = Math.floor(Math.random() * this.options.rows);
    let currentCol = Math.floor(Math.random() * this.options.cols);
    pattern[currentRow][currentCol] = true;
    let filled = 1;

    const directions = [
      [-1, 0], [0, -1], [0, 1], [1, 0]
    ];

    while (filled < this.fillCount) {
      const neighbors = directions
        .map(([dr, dc]) => [currentRow + dr, currentCol + dc])
        .filter(([r, c]) =>
          r >= 0 && r < this.options.rows &&
          c >= 0 && c < this.options.cols &&
          !pattern[r][c]
        );

      if (neighbors.length === 0) {
        let found = false;
        for (let r = 0; r < this.options.rows; r++) {
          for (let c = 0; c < this.options.cols; c++) {
            if (pattern[r][c]) {
              const freeNeighbors = directions
                .map(([dr, dc]) => [r + dr, c + dc])
                .filter(([nr, nc]) =>
                  nr >= 0 && nr < this.options.rows &&
                  nc >= 0 && nc < this.options.cols &&
                  !pattern[nr][nc]
                );
              if (freeNeighbors.length > 0) {
                [currentRow, currentCol] = freeNeighbors[Math.floor(Math.random() * freeNeighbors.length)];
                pattern[currentRow][currentCol] = true;
                filled++;
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }
        if (!found) break;
      } else {
        const [nextRow, nextCol] = neighbors[Math.floor(Math.random() * neighbors.length)];
        currentRow = nextRow;
        currentCol = nextCol;
        pattern[currentRow][currentCol] = true;
        filled++;
      }
    }

    return pattern;
  }

  override draw(ctx: CanvasRenderingContext2D, zone?: Zone): void {
    this.hexagons.forEach((hex, index) => {
        const row = Math.floor(index / this.options.cols);
        const col = index % this.options.cols;
        if (this.pattern[row][col]) {
          hex.draw(ctx, zone);
        }
    });
  }

  public override getHitbox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const activeHexes: Hexagon[] = [];

    this.hexagons.forEach((hex, index) => {
        const row = Math.floor(index / this.options.cols);
        const col = index % this.options.cols;
        if (this.pattern[row][col]) {
        activeHexes.push(hex);
        }
    });

    if (activeHexes.length === 0) {
        return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const hex of activeHexes) {
        const { x, y, size } = (hex as any).options;
        minX = Math.min(minX, x - size);
        maxX = Math.max(maxX, x + size);
        minY = Math.min(minY, y - size);
        maxY = Math.max(maxY, y + size);
    }

    return { minX, minY, maxX, maxY };
  }
}
