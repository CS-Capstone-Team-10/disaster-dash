'use client';

import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { DisasterDatum, ColorScheme } from './types';

interface FlatMapProps {
  data: DisasterDatum[];
  colorScheme: ColorScheme;
  onRegionClick?: (regionId: string) => void;
}

const countryNames: Record<string, string> = {
  USA: 'United States',
  CHN: 'China',
  JPN: 'Japan',
  DEU: 'Germany',
  GBR: 'United Kingdom',
  FRA: 'France',
  IND: 'India',
  BRA: 'Brazil',
  CAN: 'Canada',
  AUS: 'Australia',
  MEX: 'Mexico',
  KOR: 'South Korea',
  ESP: 'Spain',
  ITA: 'Italy',
  TUR: 'Turkey',
  IDN: 'Indonesia',
  RUS: 'Russia',
  PHL: 'Philippines',
  THA: 'Thailand',
  ZAF: 'South Africa',
  ARG: 'Argentina'
};

type Region = 'world' | 'north-america' | 'europe' | 'asia';

const regionButtons: { label: string; value: Region }[] = [
  { label: 'World', value: 'world' },
  { label: 'North America', value: 'north-america' },
  { label: 'Europe', value: 'europe' },
  { label: 'Asia', value: 'asia' }
];

export function FlatMap({ data, colorScheme, onRegionClick }: FlatMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region>('world');

  const colorScale = useMemo(() => {
    const maxIntensity = Math.max(...data.map(d => d.total), 1);
    const interpolator =
      colorScheme === 'reds' ? d3.interpolateReds : d3.interpolateBlues;
    return d3.scaleSequential(interpolator).domain([0, maxIntensity]);
  }, [data, colorScheme]);

  // More accurate positions based on Mercator projection (% of width/height)
  const countryPositions: Record<string, { x: number; y: number }> = {
    USA: { x: 20, y: 40 },
    CHN: { x: 75, y: 42 },
    JPN: { x: 85, y: 42 },
    DEU: { x: 52, y: 35 },
    GBR: { x: 49, y: 33 },
    FRA: { x: 50, y: 37 },
    IND: { x: 70, y: 48 },
    BRA: { x: 35, y: 68 },
    CAN: { x: 22, y: 30 },
    AUS: { x: 82, y: 72 },
    MEX: { x: 18, y: 48 },
    KOR: { x: 80, y: 41 },
    ESP: { x: 48, y: 40 },
    ITA: { x: 53, y: 39 },
    TUR: { x: 58, y: 40 },
    IDN: { x: 78, y: 58 },
    RUS: { x: 65, y: 28 },
    PHL: { x: 80, y: 50 },
    THA: { x: 74, y: 50 },
    ZAF: { x: 55, y: 75 },
    ARG: { x: 33, y: 77 }
  };

  // Filter data based on selected region
  const regionCountries: Record<Region, string[]> = {
    world: Object.keys(countryPositions),
    'north-america': ['USA', 'CAN', 'MEX'],
    europe: ['DEU', 'GBR', 'FRA', 'ESP', 'ITA', 'TUR'],
    asia: ['CHN', 'JPN', 'IND', 'KOR', 'THA', 'PHL', 'IDN']
  };

  const filteredData = data.filter(d =>
    regionCountries[selectedRegion].includes(d.regionId)
  );

  // Adjust zoom and position based on region
  const getViewBox = () => {
    switch (selectedRegion) {
      case 'north-america':
        return '0 200 400 300';
      case 'europe':
        return '400 150 250 250';
      case 'asia':
        return '600 200 400 300';
      default:
        return '0 0 1000 500';
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-100 to-slate-50 overflow-hidden">
      {/* Region selector */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
        {regionButtons.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSelectedRegion(value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedRegion === value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* World map using high-quality image */}
      <div className="absolute inset-0">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg"
          alt="World Map"
          className="w-full h-full object-cover opacity-80"
          style={{
            filter: 'brightness(1.1) contrast(0.9)',
            objectPosition: selectedRegion === 'north-america' ? '10% 40%' :
                            selectedRegion === 'europe' ? '50% 35%' :
                            selectedRegion === 'asia' ? '75% 40%' : 'center'
          }}
        />
      </div>

      {/* Data markers */}
      <div className="absolute inset-0">
        {filteredData.map((datum) => {
          const pos = countryPositions[datum.regionId];
          if (!pos) return null;

          const color = colorScale(datum.total);
          const intensity =
            datum.total / Math.max(...data.map(d => d.total), 1);
          const size = 30 + intensity * 50;

          return (
            <div
              key={datum.regionId}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125 hover:z-30"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${size}px`,
                height: `${size}px`
              }}
              onMouseEnter={() => setHoveredRegion(datum.regionId)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => onRegionClick?.(datum.regionId)}
            >
              {/* Pulsing circle */}
              <div
                className="w-full h-full rounded-full shadow-2xl border-2 border-white relative"
                style={{
                  backgroundColor: color,
                  opacity: 0.85,
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                {/* Inner glow */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                    opacity: 0.6
                  }}
                />
              </div>

              {/* Tooltip */}
              {hoveredRegion === datum.regionId && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 bg-gray-900/95 text-white text-xs px-4 py-3 rounded-lg shadow-2xl whitespace-nowrap z-50 min-w-[180px]">
                  <div className="font-bold text-sm mb-1">
                    {countryNames[datum.regionId] || datum.regionId}
                  </div>
                  <div className="text-gray-300">
                    Total incidents:{' '}
                    <span className="font-bold text-white">{datum.total}</span>
                  </div>
                  {datum.byType && (
                    <div className="mt-2 space-y-1">
                      {Object.entries(datum.byType)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3)
                        .map(([type, count]) => (
                          <div
                            key={type}
                            className="flex justify-between text-xs"
                          >
                            <span className="capitalize text-gray-400">
                              {type}:
                            </span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                    </div>
                  )}
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div
                      className="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent"
                      style={{ borderTopColor: 'rgba(17, 24, 39, 0.95)' }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
