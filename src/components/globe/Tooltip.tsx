'use client';

import React from 'react';
import { DisasterDatum } from './types';

interface TooltipProps {
  position: {
    x: number;
    y: number;
  } | null;
  data: {
    regionName: string;
    data: DisasterDatum;
  } | null;
}

const disasterColors: Record<string, string> = {
  earthquake: '#ef4444',
  wildfire: '#f97316',
  flood: '#3b82f6',
  hurricane: '#8b5cf6',
  other: '#6b7280'
};

const disasterLabels: Record<string, string> = {
  earthquake: 'Earthquake',
  wildfire: 'Wildfire',
  flood: 'Flood',
  hurricane: 'Hurricane',
  other: 'Other'
};

export function Tooltip({ position, data }: TooltipProps) {
  if (!position || !data) return null;

  const { regionName, data: disasterData } = data;
  const byType = disasterData.byType || {};
  const types = Object.entries(byType).sort((a, b) => b[1] - a[1]);

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-200"
      style={{
        left: position.x + 15,
        top: position.y - 10,
        transform:
          position.x > window.innerWidth / 2
            ? 'translateX(-100%) translateX(-30px)'
            : undefined
      }}
    >
      <div className="bg-gray-900/95 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-gray-700 p-3 min-w-[200px]">
        <div className="font-semibold text-sm mb-2">{regionName}</div>
        <div className="text-xs text-gray-300 mb-2">
          Total incidents:{' '}
          <span className="font-bold text-white">{disasterData.total}</span>
        </div>
        {types.length > 0 && (
          <div className="space-y-1.5">
            {types.map(([type, count]) => {
              const percentage = (count / disasterData.total) * 100;
              return (
                <div key={type} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400">
                      {disasterLabels[type]}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: disasterColors[type]
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
