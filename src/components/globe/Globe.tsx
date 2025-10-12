'use client';

import React, { useMemo, useState, useRef } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import * as d3 from 'd3';
import { DisasterDatum, ColorScheme } from './types';

interface GlobeProps {
  data: DisasterDatum[];
  colorScheme: ColorScheme;
  autoRotate: boolean;
  rotationSpeed: number;
  onRegionClick?: (regionId: string) => void;
  onRegionHover?: (regionId: string | null) => void;
  onHoverPosition?: (position: THREE.Vector2 | null) => void;
  onHoverData?: (data: any | null) => void;
}

// Country name mapping for common ISO codes
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

export function Globe({
  data,
  colorScheme,
  autoRotate,
  rotationSpeed,
  onRegionClick,
  onRegionHover,
  onHoverPosition,
  onHoverData
}: GlobeProps) {
  const globeRef = useRef<THREE.Group>(null);
  const markersRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { camera, raycaster, pointer } = useThree();

  // Load Earth texture (using a brighter day map)
  const earthTexture = useLoader(
    THREE.TextureLoader,
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-day.jpg'
  );

  // Color scale
  const colorScale = useMemo(() => {
    const maxIntensity = Math.max(...data.map(d => d.total), 1);
    const interpolator =
      colorScheme === 'reds' ? d3.interpolateReds : d3.interpolateBlues;
    return d3.scaleSequential(interpolator).domain([0, maxIntensity]);
  }, [data, colorScheme]);

  // Create markers for each data point
  const markers = useMemo(() => {
    // Approximate lat/lon for countries (simplified)
    const countryCoords: Record<string, [number, number]> = {
      USA: [37.0902, -95.7129],
      CHN: [35.8617, 104.1954],
      JPN: [36.2048, 138.2529],
      DEU: [51.1657, 10.4515],
      GBR: [55.3781, -3.436],
      FRA: [46.2276, 2.2137],
      IND: [20.5937, 78.9629],
      BRA: [-14.235, -51.9253],
      CAN: [56.1304, -106.3468],
      AUS: [-25.2744, 133.7751],
      MEX: [23.6345, -102.5528],
      KOR: [35.9078, 127.7669],
      ESP: [40.4637, -3.7492],
      ITA: [41.8719, 12.5674],
      TUR: [38.9637, 35.2433],
      IDN: [-0.7893, 113.9213],
      RUS: [61.524, 105.3188],
      PHL: [12.8797, 121.774],
      THA: [15.87, 100.9925],
      ZAF: [-30.5595, 22.9375],
      ARG: [-38.4161, -63.6167]
    };

    return data.map(d => {
      const coords = countryCoords[d.regionId] || [0, 0];
      const [lat, lon] = coords;

      // Convert lat/lon to 3D position on sphere
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const radius = 2.02; // Slightly above globe surface

      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      const color = colorScale(d.total);
      const intensity = d.total / Math.max(...data.map(d => d.total), 1);
      const size = 0.03 + intensity * 0.08;

      return {
        position: new THREE.Vector3(x, y, z),
        color,
        size,
        data: d,
        regionId: d.regionId,
        regionName: countryNames[d.regionId] || d.regionId
      };
    });
  }, [data, colorScale]);

  // Auto-rotation with proper null checks
  useFrame((state, delta) => {
    if (globeRef.current && autoRotate && !isDragging) {
      globeRef.current.rotation.y += rotationSpeed * delta * 60;
    }

    // Raycasting for hover detection with null checks
    if (
      markersRef.current &&
      markersRef.current.children.length > 0 &&
      onRegionHover &&
      onHoverPosition &&
      onHoverData
    ) {
      try {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(
          markersRef.current.children
        );

        if (intersects.length > 0) {
          const marker = intersects[0].object as any;
          const markerData = marker.userData;

          if (markerData && markerData.regionId) {
            onRegionHover(markerData.regionId);

            // Convert 3D position to 2D screen position
            const screenPos = markerData.position.clone();
            screenPos.project(camera);

            onHoverPosition(
              new THREE.Vector2(
                (screenPos.x * 0.5 + 0.5) * window.innerWidth,
                (-screenPos.y * 0.5 + 0.5) * window.innerHeight
              )
            );
            onHoverData(markerData);
          }
        } else {
          onRegionHover(null);
          onHoverPosition(null);
          onHoverData(null);
        }
      } catch (error) {
        console.error('Raycasting error:', error);
      }
    }
  });

  return (
    <group ref={globeRef}>
      {/* Main Globe */}
      <Sphere args={[2, 64, 64]}>
        <meshPhongMaterial
          map={earthTexture}
          emissive="#0a0a0a"
          emissiveIntensity={0.1}
          shininess={30}
          specular="#222222"
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial
          color="#4a9eff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Data markers */}
      <group ref={markersRef}>
        {markers.map((marker, i) => (
          <mesh
            key={i}
            position={marker.position}
            userData={{
              regionId: marker.regionId,
              regionName: marker.regionName,
              data: marker.data,
              position: marker.position
            }}
            onClick={() => onRegionClick?.(marker.regionId)}
          >
            <sphereGeometry args={[marker.size, 16, 16]} />
            <meshBasicMaterial
              color={marker.color}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>

      {/* Orbit Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        onStart={() => setIsDragging(true)}
        onEnd={() => setIsDragging(false)}
      />
    </group>
  );
}
