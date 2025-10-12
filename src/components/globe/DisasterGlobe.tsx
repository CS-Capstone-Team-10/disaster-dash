'use client';

import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Globe } from './Globe';
import { Tooltip } from './Tooltip';
import { Legend } from './Legend';
import { FlatMap } from './FlatMap';
import { DisasterGlobeProps } from './types';

export function DisasterGlobe({
  data,
  timeWindowLabel = 'Last 24h',
  colorScheme = 'blues',
  autoRotate = true,
  rotationSpeed = 0.02,
  onRegionClick,
  onRegionHover
}: DisasterGlobeProps) {
  const [viewMode, setViewMode] = useState<'globe' | 'map'>('globe');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hoverData, setHoverData] = useState<any>(null);

  const maxIntensity = Math.max(...data.map(d => d.total), 1);

  const handleRegionHover = (regionId: string | null) => {
    setHoveredRegion(regionId);
    onRegionHover?.(regionId);
  };

  return (
    <div
      className="relative w-full h-full bg-gradient-to-b from-gray-950 to-gray-900"
      style={{ minHeight: '600px' }}
    >
      {/* View Toggle Button */}
      <button
        onClick={() => setViewMode(viewMode === 'globe' ? 'map' : 'globe')}
        className="absolute top-8 right-8 z-50 bg-gray-900/90 backdrop-blur-sm hover:bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 shadow-xl transition-colors duration-200 font-medium text-sm"
      >
        {viewMode === 'globe' ? '🗺️ Map View' : '🌍 Globe View'}
      </button>

      {viewMode === 'globe' ? (
        <>
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              {/* Lighting */}
              <ambientLight intensity={0.8} />
              <directionalLight position={[5, 3, 5]} intensity={1.2} />
              <pointLight
                position={[-5, -3, -5]}
                intensity={0.6}
                color="#ffffff"
              />

              <Globe
                data={data}
                colorScheme={colorScheme}
                autoRotate={autoRotate}
                rotationSpeed={rotationSpeed}
                onRegionClick={onRegionClick}
                onRegionHover={handleRegionHover}
                onHoverPosition={setHoverPosition}
                onHoverData={setHoverData}
              />
            </Suspense>
          </Canvas>

          {/* Tooltip */}
          <Tooltip position={hoverPosition} data={hoverData} />

          {/* Instructions */}
          <div className="absolute top-8 left-8 bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-xl max-w-xs">
            <div className="text-sm text-gray-300 space-y-2">
              <div className="font-semibold text-white mb-2">Controls</div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Drag to rotate the globe</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Scroll to zoom in/out</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Hover over markers for details</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Click markers to select region</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <FlatMap
          data={data}
          colorScheme={colorScheme}
          onRegionClick={onRegionClick}
        />
      )}

      {/* Legend */}
      <Legend
        maxValue={maxIntensity}
        colorScheme={colorScheme}
        timeWindowLabel={timeWindowLabel}
      />
    </div>
  );
}
