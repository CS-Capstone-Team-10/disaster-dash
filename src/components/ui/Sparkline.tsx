'use client';
import React from "react";

export default function Sparkline({
  values, width=180, height=40, stroke="#7c3aed"
}: { values: number[]; width?: number; height?: number; stroke?: string }) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values.map((v, i) => {
    const x = (i/(values.length-1)) * width;
    const y = height - ((v - min) / Math.max(1, (max - min))) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
