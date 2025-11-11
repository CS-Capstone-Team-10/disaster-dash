'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath, AreaClosed } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import type { SeriesPoint } from '@/types/kpi';

interface TotalIncidentsKpiCardProps {
  value: number;
  deltaPct: number;
  series: SeriesPoint[];
  delay?: number;
}

export function TotalIncidentsKpiCard({
  value,
  deltaPct,
  series,
  delay = 0,
}: TotalIncidentsKpiCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const width = 280;
  const height = 80;
  const margin = { top: 4, right: 4, bottom: 20, left: 4 };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const { xScale, yScale } = useMemo(() => {
    const dates = series.map((d) => new Date(d.t));
    const values = series.map((d) => d.v);

    const xScale = scaleTime({
      domain: [Math.min(...dates.map(d => d.getTime())), Math.max(...dates.map(d => d.getTime()))],
      range: [0, innerWidth],
    });

    const yScale = scaleLinear({
      domain: [Math.min(...values) * 0.95, Math.max(...values) * 1.05],
      range: [innerHeight, 0],
      nice: true,
    });

    return { xScale, yScale };
  }, [series, innerWidth, innerHeight]);

  const getDate = (d: SeriesPoint) => new Date(d.t);
  const getValue = (d: SeriesPoint) => d.v;

  // Bottom ticks: start, middle, end
  const tickIndices = [0, Math.floor((series.length - 1) / 2), series.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-[24px] border border-gray-800/40 bg-gray-900/50 p-6 shadow-sm hover:shadow-lg transition-shadow"
      role="article"
      aria-label="Total Incidents KPI"
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400">Total Incidents</h3>
          <p className="text-3xl font-extrabold text-gray-100 mt-1 tabular-nums">
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            deltaPct >= 0
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}
        >
          {deltaPct >= 0 ? (
            <TrendingUp className="w-3 h-3" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3 h-3" aria-hidden="true" />
          )}
          <span>{Math.abs(deltaPct)}%</span>
        </div>
      </div>

      {/* Sparkline */}
      {mounted ? (
        <>
          <svg width={width} height={height} className="w-full">
            <LinearGradient
              id="area-gradient-total"
              from="hsl(var(--brand))"
              to="hsl(var(--brand))"
              fromOpacity={0.3}
              toOpacity={0}
            />
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <AreaClosed
                data={series}
                x={(d) => xScale(getDate(d)) ?? 0}
                y={(d) => yScale(getValue(d)) ?? 0}
                yScale={yScale}
                fill="url(#area-gradient-total)"
                curve={curveMonotoneX}
              />
              <LinePath
                data={series}
                x={(d) => xScale(getDate(d)) ?? 0}
                y={(d) => yScale(getValue(d)) ?? 0}
                stroke="hsl(var(--brand))"
                strokeWidth={2}
                curve={curveMonotoneX}
              />
            </g>
          </svg>

          {/* Date ticks */}
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            {tickIndices.map((i) => (
              <span key={i}>
                {new Date(series[i].t).toLocaleDateString(undefined, {
                  month: 'short',
                  day: '2-digit',
                })}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center" style={{ height: height + 20 }}>
          <div className="text-gray-400">...</div>
        </div>
      )}
    </motion.div>
  );
}
