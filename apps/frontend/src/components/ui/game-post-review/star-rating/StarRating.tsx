import React, { useState, useRef, useEffect } from "react";
import styles from "./starRating.module.css";

interface StarRatingProps {
  max?: number;
  stars?: number;
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  max = 10,
  value = 0,
  onChange,
  readOnly = false,
}) => {
  const [rating, setRating] = useState<number>(value);
  const [preview, setPreview] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setRating(value);
  }, [value]);

  const totalWidth = 500;

  const fractionToValue = (fraction: number) => {
    const v = Math.round(fraction * max);
    return Math.max(0, Math.min(max, v));
  };

  const handlePointer = (clientX: number) => {
    if (!svgRef.current || readOnly) return;
    const rect = svgRef.current.getBoundingClientRect();
    const frac = (clientX - rect.left) / rect.width;
    return fractionToValue(frac);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    const v = handlePointer(e.clientX);
    if (typeof v === "number") {
      setRating(v);
      onChange?.(v);
    }
  };

  const handleMove = (e: React.MouseEvent) => {
    if (readOnly) return;
    const v = handlePointer(e.clientX);
    if (typeof v === "number") setPreview(v);
  };

  const handleLeave = () => {
    if (!readOnly) setPreview(null);
  };

  const displayed = preview ?? rating;
  const fillWidth = (displayed / max) * totalWidth;

  return (
    <div className={styles.wrapper}>
      <svg
        ref={svgRef}
        className={`${styles.svg} ${readOnly ? styles.readonly : ""}`}
        viewBox="0 0 500 100"
        onClick={handleClick}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <defs>
          <mask id="starsMask">
            <rect x="0" y="0" width="500" height="100" fill="black" />
            <g fill="white">
              <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
              <polygon points="150,0 161,35 198,35 168,57 179,91 150,70 121,91 132,57 102,35 139,35" />
              <polygon points="250,0 261,35 298,35 268,57 279,91 250,70 221,91 232,57 202,35 239,35" />
              <polygon points="350,0 361,35 398,35 368,57 379,91 350,70 321,91 332,57 302,35 339,35" />
              <polygon points="450,0 461,35 498,35 468,57 479,91 450,70 421,91 432,57 402,35 439,35" />
            </g>
          </mask>

          <linearGradient id="grad" x1="0" x2="1">
            <stop offset="0%" stopColor="#1F6FEB" />
            <stop offset="100%" stopColor="#00FF9F" />
          </linearGradient>
        </defs>

        <g mask="url(#starsMask)">
          <rect x="0" y="0" width={fillWidth} height="100" fill="url(#grad)" />
        </g>

        <g fill="none" stroke="#00ff9d88" strokeWidth="2">
          <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" />
          <polygon points="150,0 161,35 198,35 168,57 179,91 150,70 121,91 132,57 102,35 139,35" />
          <polygon points="250,0 261,35 298,35 268,57 279,91 250,70 221,91 232,57 202,35 239,35" />
          <polygon points="350,0 361,35 398,35 368,57 379,91 350,70 321,91 332,57 302,35 339,35" />
          <polygon points="450,0 461,35 498,35 468,57 479,91 450,70 421,91 432,57 402,35 439,35" />
        </g>
      </svg>
    </div>
  );
};