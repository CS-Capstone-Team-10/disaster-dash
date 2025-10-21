"use client";

import React, { useState } from 'react';
import { TotalIncidentsKpiCard } from './TotalIncidentsKpiCard';
import { AvgMttrCard } from './AvgMttrCard';
import { OpenIncidentsCard } from './OpenIncidentsCard';
import type { KpiData, RangeKey } from '@/types/kpi';

type KPIHeaderProps = {
  data: KpiData;
  onRangeChange?: (range: RangeKey) => void;
};

export function KPIHeader({ data, onRangeChange }: KPIHeaderProps) {
  const [selectedRange, setSelectedRange] = useState<RangeKey>('month');

  const handleRangeChange = (range: RangeKey) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  return (
    <div className="mb-8">
      {/* Header with Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Key Metrics</h2>

        {/* Range Selector */}
        <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-800/40 rounded-xl p-1">
          {(['month', 'week', 'day'] as const).map((range) => (
            <button
              key={range}
              onClick={() => handleRangeChange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedRange === range
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
              aria-label={`Select ${range} range`}
              aria-pressed={selectedRange === range}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TotalIncidentsKpiCard
          value={data.totalIncidents.value}
          deltaPct={data.totalIncidents.deltaPct}
          series={data.totalIncidents.series}
          delay={0.1}
        />

        <AvgMttrCard
          valueHours={data.mttr.valueHours}
          segments={data.mttr.segments}
          targetHours={data.mttr.targetHours}
          delay={0.2}
        />

        <OpenIncidentsCard
          open={data.openIncidents.open}
          resolved={data.openIncidents.resolved}
          series={data.openIncidents.series}
          delay={0.3}
        />
      </div>
    </div>
  );
}
