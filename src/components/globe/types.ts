export interface DisasterDatum {
  regionId: string;
  total: number;
  byType?: {
    earthquake?: number;
    wildfire?: number;
    flood?: number;
    hurricane?: number;
    other?: number;
  };
}

export type ColorScheme = 'blues' | 'reds';

export interface DisasterGlobeProps {
  data: DisasterDatum[];
  timeWindowLabel?: string;
  colorScheme?: ColorScheme;
  autoRotate?: boolean;
  rotationSpeed?: number;
  onRegionClick?: (regionId: string) => void;
  onRegionHover?: (regionId: string | null) => void;
}

export interface RegionMesh {
  id: string;
  name: string;
  geometry: any;
  intensity: number;
  data?: DisasterDatum;
}
