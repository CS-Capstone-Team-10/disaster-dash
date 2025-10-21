"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

type SeriesPoint = {
  t: string;
  v: number;
};

type OpenIncidentsCardProps = {
  open: number;
  resolved: number;
  series: SeriesPoint[];
  delay?: number;
};

export function OpenIncidentsCard({ open, resolved, series, delay = 0 }: OpenIncidentsCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = open + resolved;
  const resolvedPct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Donut chart dimensions
  const donutWidth = 160;
  const donutHeight = 160;
  const centerX = donutWidth / 2;
  const centerY = donutHeight / 2;
  const outerRadius = 70;
  const innerRadius = 50;

  const pieData = [
    { label: 'Resolved', value: resolved, color: '#10b981' },
    { label: 'Open', value: open, color: '#f97316' }
  ];

  // Mini trendline dimensions
  const trendWidth = 200;
  const trendHeight = 40;
  const pad = 4;

  const data = series.map(p => p.v);
  const vMin = Math.min(...data);
  const vMax = Math.max(...data);

  const xScale = scaleLinear<number>({
    domain: [0, data.length - 1],
    range: [pad, trendWidth - pad]
  });

  const yScale = scaleLinear<number>({
    domain: [vMin, vMax],
    range: [trendHeight - pad, pad]
  });

  const points = data.map((v, i) => ({
    x: Math.round(xScale(i) * 100) / 100,
    y: Math.round(yScale(v) * 100) / 100
  }));

  // Calculate trend
  const firstValue = data[0];
  const lastValue = data[data.length - 1];
  const trend = lastValue > firstValue ? 'up' : lastValue < firstValue ? 'down' : 'flat';
  const trendPct = firstValue !== 0 ? Math.abs(((lastValue - firstValue) / firstValue) * 100) : 0;

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
      aria-label={`Open Incidents: ${open} open, ${resolved} resolved`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <AlertCircle className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-400">Open Incidents</h3>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-4">
        {mounted ? (
          <svg width={donutWidth} height={donutHeight}>
            <Group top={centerY} left={centerX}>
              <Pie
                data={pieData}
                pieValue={(d) => d.value}
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                cornerRadius={3}
                padAngle={0.02}
              >
                {(pie) => {
                  return pie.arcs.map((arc, i) => {
                    return (
                      <g key={`arc-${i}`}>
                        <path d={pie.path(arc) || ''} fill={arc.data.color} opacity={0.9} />
                      </g>
                    );
                  });
                }}
              </Pie>
              {/* Center label */}
              <text
                textAnchor="middle"
                dy="-0.5em"
                className="text-2xl font-bold fill-gray-100"
              >
                {resolvedPct}%
              </text>
              <text
                textAnchor="middle"
                dy="1.2em"
                className="text-xs fill-gray-500"
              >
                Resolved
              </text>
            </Group>
          </svg>
        ) : (
          <div className="flex items-center justify-center" style={{ width: donutWidth, height: donutHeight }}>
            <div className="text-2xl font-bold text-gray-400">...</div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div>
          <div className="text-2xl font-bold text-gray-100">{open}</div>
          <div className="text-xs text-gray-500">Open</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-100">{resolved}</div>
          <div className="text-xs text-gray-500">Resolved</div>
        </div>
      </div>

      {/* Mini Trendline */}
      <div className="mt-4 pt-4 border-t border-gray-800/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Trend (7 days)</span>
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3 text-red-400" />
            ) : trend === 'down' ? (
              <TrendingDown className="w-3 h-3 text-green-400" />
            ) : null}
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-gray-400'}`}>
              {trendPct > 0 ? `${trend === 'up' ? '+' : '-'}${trendPct.toFixed(1)}%` : '0%'}
            </span>
          </div>
        </div>
        {mounted ? (
          <svg width={trendWidth} height={trendHeight} className="mx-auto">
            <LinePath
              data={points}
              x={(d) => d.x}
              y={(d) => d.y}
              stroke="#f97316"
              strokeWidth={2}
              curve={curveMonotoneX}
            />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={2} fill="#f97316" />
            ))}
          </svg>
        ) : (
          <div className="h-10 flex items-center justify-center">
            <div className="text-gray-400">...</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
