"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target } from 'lucide-react';

type Segment = {
  label: "Optimal" | "Caution" | "Critical";
  from: number;
  to: number;
};

type AvgMttrCardProps = {
  valueHours: number;
  segments: Segment[];
  targetHours?: number;
  delay?: number;
};

const SEGMENT_COLORS = {
  Optimal: "#10b981",    // green-500
  Caution: "#f59e0b",    // amber-500
  Critical: "#ef4444"    // red-500
};

export function AvgMttrCard({ valueHours, segments, targetHours, delay = 0 }: AvgMttrCardProps) {
  const width = 280;
  const height = 180;
  const cx = width / 2;
  const cy = height - 20;
  const outerRadius = 90;
  const innerRadius = 70;
  const strokeWidth = outerRadius - innerRadius;

  // Find min/max from segments
  const allValues = segments.flatMap(s => [s.from, s.to]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const range = maxValue - minValue;

  // Convert value to angle (180° arc: -90° to +90°)
  const valueToAngle = (val: number) => {
    const normalized = (val - minValue) / range;
    return -90 + (normalized * 180);
  };

  // Create arc path for a segment
  const createArc = (fromVal: number, toVal: number, radius: number) => {
    const startAngle = valueToAngle(fromVal) * (Math.PI / 180);
    const endAngle = valueToAngle(toVal) * (Math.PI / 180);

    const x1 = Math.round((cx + radius * Math.cos(startAngle)) * 100) / 100;
    const y1 = Math.round((cy + radius * Math.sin(startAngle)) * 100) / 100;
    const x2 = Math.round((cx + radius * Math.cos(endAngle)) * 100) / 100;
    const y2 = Math.round((cy + radius * Math.sin(endAngle)) * 100) / 100;

    const largeArcFlag = (endAngle - startAngle) > Math.PI ? 1 : 0;

    return `M ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`;
  };

  // Needle for current value
  const needleAngle = valueToAngle(valueHours) * (Math.PI / 180);
  const needleLength = outerRadius + 10;
  const needleX = Math.round((cx + needleLength * Math.cos(needleAngle)) * 100) / 100;
  const needleY = Math.round((cy + needleLength * Math.sin(needleAngle)) * 100) / 100;

  // Target marker (if provided)
  const targetAngle = targetHours ? valueToAngle(targetHours) * (Math.PI / 180) : null;
  const targetX = targetAngle !== null ? Math.round((cx + (outerRadius + 15) * Math.cos(targetAngle)) * 100) / 100 : 0;
  const targetY = targetAngle !== null ? Math.round((cy + (outerRadius + 15) * Math.sin(targetAngle)) * 100) / 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-gray-800/40 bg-gray-900/50 backdrop-blur-sm p-6 shadow-lg"
      tabIndex={0}
      role="article"
      aria-label={`Average MTTR: ${valueHours} hours`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-400">Average MTTR</h3>
        </div>
      </div>

      <svg width={width} height={height} className="mx-auto">
        {/* Background arc */}
        <path
          d={createArc(minValue, maxValue, (outerRadius + innerRadius) / 2)}
          fill="none"
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Colored segments */}
        {segments.map((segment, i) => (
          <path
            key={i}
            d={createArc(segment.from, segment.to, (outerRadius + innerRadius) / 2)}
            fill="none"
            stroke={SEGMENT_COLORS[segment.label]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.8}
          />
        ))}

        {/* Needle */}
        <g>
          <line
            x1={cx}
            y1={cy}
            x2={needleX}
            y2={needleY}
            stroke="#f3f4f6"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r={6} fill="#f3f4f6" />
          <circle cx={cx} cy={cy} r={3} fill="#1f2937" />
        </g>

        {/* Target marker */}
        {targetHours !== undefined && targetAngle !== null && (
          <g>
            <line
              x1={targetX}
              y1={targetY - 8}
              x2={targetX}
              y2={targetY + 8}
              stroke="#60a5fa"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={targetX} cy={targetY} r={4} fill="#60a5fa" />
          </g>
        )}

        {/* Center value label */}
        <text
          x={cx}
          y={cy - 15}
          textAnchor="middle"
          className="text-3xl font-bold fill-gray-100"
        >
          {valueHours.toFixed(1)}
        </text>
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          className="text-xs fill-gray-500"
        >
          hours
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: SEGMENT_COLORS[segment.label] }}
            />
            <span className="text-gray-500">{segment.label}</span>
          </div>
        ))}
        {targetHours !== undefined && (
          <div className="flex items-center gap-1.5">
            <Target className="w-3 h-3 text-blue-400" />
            <span className="text-gray-500">Target: {targetHours}h</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
