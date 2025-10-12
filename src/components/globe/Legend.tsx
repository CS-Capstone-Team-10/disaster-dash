'use client';

import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { ColorScheme } from './types';

interface LegendProps {
  maxValue: number;
  colorScheme: ColorScheme;
  timeWindowLabel?: string;
}

export function Legend({ maxValue, colorScheme, timeWindowLabel }: LegendProps) {
  const gradientId = 'legend-gradient';

  const colorScale = useMemo(() => {
    const interpolator =
      colorScheme === 'reds' ? d3.interpolateReds : d3.interpolateBlues;
    return d3.scaleSequential(interpolator).domain([0, maxValue]);
  }, [maxValue, colorScheme]);

  const ticks = useMemo(() => {
    return [
      0,
      Math.round(maxValue * 0.25),
      Math.round(maxValue * 0.5),
      Math.round(maxValue * 0.75),
      maxValue
    ];
  }, [maxValue]);

  return (
    <div className="absolute bottom-8 left-8 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-xl">
      {timeWindowLabel && (
        <div className="text-xs text-gray-400 mb-3 font-medium">
          {timeWindowLabel}
        </div>
      )}
      <div className="text-xs text-gray-300 mb-2 font-medium">
        Incident Intensity
      </div>
      <svg width="200" height="20" className="mb-2">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            {[0, 0.25, 0.5, 0.75, 1].map(t => (
              <stop
                key={t}
                offset={`${t * 100}%`}
                stopColor={colorScale(t * maxValue)}
              />
            ))}
          </linearGradient>
        </defs>
        <rect
          x="0"
          y="0"
          width="200"
          height="20"
          fill={`url(#${gradientId})`}
          rx="2"
        />
      </svg>
      <div className="flex justify-between text-xs text-gray-400">
        {ticks.map((tick, i) => (
          <div key={i} className="text-center" style={{ width: '40px' }}>
            {tick}
          </div>
        ))}
      </div>
    </div>
  );
}
