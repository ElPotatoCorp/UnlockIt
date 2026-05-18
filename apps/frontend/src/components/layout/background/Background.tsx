import React, { useEffect, useRef } from "react";
import { HexPattern } from "./HexPattern";
import { Zone } from "./Zone";
import { AnimatedGradiant } from "./AnimatedGradiant";

function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function hitboxesCollide(
  boxA: { minX: number; minY: number; maxX: number; maxY: number },
  boxB: { minX: number; minY: number; maxX: number; maxY: number }
): boolean {
  return !(
    boxA.maxX < boxB.minX ||
    boxA.minX > boxB.maxX ||
    boxA.maxY < boxB.minY ||
    boxA.minY > boxB.maxY
  );
}

function getPageType(): "short" | "long" | "veryLong" {
  const pageHeight = document.body.scrollHeight;
  const screenHeight = window.innerHeight;
  const ratio = pageHeight / screenHeight;

  if (ratio <= 1.2) return "short";
  if (ratio <= 3) return "long";
  return "veryLong";
}

let leftPatterns: HexPattern[] = [];
let rightPatterns: HexPattern[] = [];
let ctx: CanvasRenderingContext2D;
let canvas: HTMLCanvasElement;

function createRandomGradiant(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
): AnimatedGradiant {
  const colorSets = [
    ["#00FF9F", "#1F6FEB"],
    ["#1F6FEB", "#00FF9F"],
  ];
  const colors = colorSets[Math.floor(Math.random() * colorSets.length)];

  return new AnimatedGradiant({
    canvas,
    ctx,
    colors,
    direction: Math.floor(Math.random() * 2) === 1 ? "vertical" : "horizontal",
    speed: 0.00025 + Math.random() * 0.001,
    loop: true,
  });
}

function generatePatterns(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  leftPatterns = [];
  rightPatterns = [];

  const totalHeight = document.body.scrollHeight;
  const patternHeight = 300;
  const count = Math.ceil(totalHeight / patternHeight);

  const placedLeft: HexPattern[] = [];
  const placedRight: HexPattern[] = [];

  for (let i = 0; i < count * 2; i++) {
    const zoneWidth = window.innerWidth * 0.2;
    const xOffset = Math.floor(Math.random() * zoneWidth) - zoneWidth * 0.3;
    const yOffset = Math.floor(Math.random() * totalHeight);

    const size = 30 + Math.floor(Math.random() * 6);
    const borderWidth = 2 + Math.random() * 2;
    const orientation = Math.random() < 0.5 ? "pointy" : "flat";
    const fillCount = Math.floor(Math.random() * 6) + 6;

    const leftPattern = new HexPattern({
      rows: 5 + Math.floor(Math.random() * 3),
      cols: 5 + Math.floor(Math.random() * 3),
      size,
      fillCount,
      borderWidth,
      orientation,
      fillColor: "#ffffff00",
      borderColor: createRandomGradiant(canvas, ctx),
      origin: { x: xOffset, y: yOffset },
    });

    const rightPattern = new HexPattern({
      rows: 4 + Math.floor(Math.random() * 3),
      cols: 4 + Math.floor(Math.random() * 3),
      size,
      fillCount,
      borderWidth,
      orientation,
      fillColor: "#ffffff00",
      borderColor: createRandomGradiant(canvas, ctx),
      origin: { x: xOffset, y: yOffset },
    });

    const leftHitbox = leftPattern.getHitbox();
    const rightHitbox = rightPattern.getHitbox();

    const collidesLeft = placedLeft.some((p) =>
      hitboxesCollide(p.getHitbox(), leftHitbox)
    );
    const collidesRight = placedRight.some((p) =>
      hitboxesCollide(p.getHitbox(), rightHitbox)
    );

    if (!collidesLeft) {
      leftPatterns.push(leftPattern);
      placedLeft.push(leftPattern);
    }

    if (!collidesRight) {
      rightPatterns.push(rightPattern);
      placedRight.push(rightPattern);
    }
  }
}

function animateBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  let lastTime = 0;
  let lastScrollY = window.scrollY;
  let needsRedraw = true;
  let isScrolling = false;
  let scrollTimeout: number | null = null;

  function loop(time: number) {
    const currentScrollY = window.scrollY;

    if (currentScrollY !== lastScrollY) {
      needsRedraw = true;
      lastScrollY = currentScrollY;
      isScrolling = true;

      if (scrollTimeout !== null) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 200);
    }

    const frameInterval = isScrolling ? 50 : 125; // 20 : 8  fps

    if (needsRedraw || time - lastTime > frameInterval) {
      draw();
      lastTime = time;
      needsRedraw = false;
    }

    requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", () => {
    draw();
  });

  function draw() {
    ctx.clearRect(
      0,
      0,
      Math.max(window.innerWidth, canvas.width),
      Math.max(window.innerHeight, canvas.height)
    );

    const scrollY = window.scrollY;
    const parallaxFactor = 0.25;
    const offsetY = scrollY * parallaxFactor;

    const leftZone = new Zone(
      0,
      -offsetY,
      window.innerWidth * 0.2,
      window.innerHeight + offsetY
    );
    const rightZone = new Zone(
      window.innerWidth * 0.8,
      -offsetY,
      window.innerWidth,
      window.innerHeight + offsetY
    );

    leftPatterns.forEach((p) => p.draw(ctx, leftZone));
    rightPatterns.forEach((p) => p.draw(ctx, rightZone));
  }

  requestAnimationFrame(loop);
}

export const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    generatePatterns(canvas, ctx);
    animateBackground(canvas, ctx);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
};