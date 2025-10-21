# US Disaster Heatmap Feature

A comprehensive US-only disaster visualization feature for the Atlas Alert Dashboard, featuring both circular/globe and flat map views with real-time disaster monitoring capabilities.

## Overview

This feature visualizes disaster-related social media posts from social media, classified by disaster type (earthquake, wildfire, flood, hurricane, other) and aggregated by US city locations. It provides two visualization modes:

1. **Circular/Globe View**: An interactive 3D globe focused on the United States with auto-rotation
2. **Flat Map View**: A MapLibre GL JS map using MapTiler Planet Lite tiles with heatmap and circle layers

## Features

### Visualization Modes

- **Circular View**:
  - 3D globe rendered with react-three-fiber
  - Auto-rotation with configurable speed (pauses on user interaction)
  - Smooth camera controls (drag to rotate, scroll to zoom)
  - City markers sized and colored by disaster intensity
  - Real-time hover detection with tooltips

- **Flat Map View**:
  - MapLibre GL JS with MapTiler Planet Lite vector tiles
  - Heatmap layer showing disaster density
  - Circle layer for individual cities (visible at higher zoom)
  - Filter by disaster type (All, Earthquake, Wildfire, Flood, Hurricane, Other)
  - Pan and zoom within US boundaries

### Interactive Elements

- **Tooltips**: Hover over cities to see:
  - City name
  - Total post count
  - Top disaster type
  - Breakdown by disaster type with progress bars

- **Click Events**: Click on cities to select them (emits callbacks for custom handling)

- **Legend**: Shows color scale mapping intensity to colors

- **Time Window Selector**: Switch between 1h, 24h, and 7d views

## File Structure

```
src/
├── components/
│   └── us-heatmap/
│       ├── UsHeatmap.tsx           # Main component with view toggle
│       ├── UsHeatmapCircular.tsx   # 3D globe view
│       ├── UsHeatmapFlat.tsx       # Flat map view
│       ├── Legend.tsx              # Color scale legend
│       ├── Tooltip.tsx             # Hover tooltip
│       ├── types.ts                # TypeScript type definitions
│       ├── mockData.ts             # Mock data generator
│       └── index.ts                # Barrel export
└── app/
    └── dashboard/
        └── page.tsx                # Demo dashboard page
```

## Setup

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Add your MapTiler API key:

```env
NEXT_PUBLIC_MAPTILER_KEY=your_key_here
```

**Get a free API key**: Visit [cloud.maptiler.com](https://cloud.maptiler.com/) and sign up for a free account.

### 2. Install Dependencies

Dependencies are already installed if you've run:

```bash
npm install
```

Key dependencies:
- `maplibre-gl` - Map rendering engine
- `@react-three/fiber` & `@react-three/drei` - 3D rendering
- `three` - 3D graphics library
- `d3` - Color scales and data visualization

### 3. Run the Development Server

```bash
npm run dev
```

Visit:
- Main dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Usage

### Basic Usage

```tsx
import { UsHeatmap, generateMockUsCities } from '@/components/us-heatmap';

export default function MyPage() {
  const mockData = generateMockUsCities(50);

  return (
    <UsHeatmap
      data={mockData}
      windowLabel="Last 24h"
      colorScheme="blues"
      autoRotate={true}
      rotationSpeed={0.005}
      onCityClick={(city) => console.log('Clicked:', city)}
      onCityHover={(city) => console.log('Hovering:', city)}
    />
  );
}
```

### Props

```typescript
interface UsHeatmapProps {
  data: CityDatum[];              // Array of city data
  windowLabel?: string;            // e.g., "Last 24h"
  colorScheme?: "blues" | "reds"; // Color scheme
  autoRotate?: boolean;            // Enable auto-rotation (circular view)
  rotationSpeed?: number;          // Rotation speed (default: 0.01)
  onCityHover?: (city: string | null) => void;
  onCityClick?: (city: string) => void;
  view?: "circular" | "flat";     // Initial view mode
}
```

### Data Contract

```typescript
type CityDatum = {
  city: string;          // e.g., "Austin, TX"
  lat: number;           // Latitude
  lon: number;           // Longitude
  total: number;         // Total classified posts
  byType?: Partial<Record<Disaster, number>>;
};

type Disaster = "earthquake" | "wildfire" | "flood" | "hurricane" | "other";
```

## Mock Data

The feature includes a comprehensive mock data generator for testing:

```typescript
import { generateMockUsCities, generateTestData } from '@/components/us-heatmap';

// Generate 50 random US cities with disaster data
const mockData = generateMockUsCities(50);

// Generate with seed for reproducible results
const seededData = generateMockUsCities(100, 12345);

// Get small test dataset with known values
const testData = generateTestData(); // Returns 5 cities
```

The mock generator includes:
- 85+ major US cities with accurate coordinates
- Regional disaster probability weighting (e.g., more earthquakes in CA)
- Configurable city count (1-85)
- Optional seeding for reproducible randomness

## Connecting to Real API

To connect to your FastAPI backend:

1. **Create an API hook** (recommended approach):

```typescript
// src/hooks/useDisasterData.ts
import { useState, useEffect } from 'react';
import { CityDatum, TimeWindow } from '@/components/us-heatmap';

export function useDisasterData(window: TimeWindow) {
  const [data, setData] = useState<CityDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/disasters/aggregate?window=${window}`
        );

        if (!response.ok) throw new Error('Failed to fetch');

        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Optional: Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [window]);

  return { data, loading, error };
}
```

2. **Use in your dashboard**:

```typescript
// src/app/dashboard/page.tsx
import { useDisasterData } from '@/hooks/useDisasterData';

export default function Dashboard() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('24h');
  const { data, loading, error } = useDisasterData(timeWindow);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <UsHeatmap data={data} windowLabel={`Last ${timeWindow}`} />;
}
```

3. **Add API URL to environment**:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAPTILER_KEY=your_key_here
```

## MapTiler Attribution

This feature uses MapTiler Planet Lite tiles. Per the license requirements:

- Attribution is displayed in the bottom-right corner of the flat map view
- The attribution links to MapTiler's copyright page
- **Do not remove or obscure the attribution**

Tile details:
- **TileJSON**: `https://api.maptiler.com/tiles/v3-lite/tiles.json?key={YOUR_KEY}`
- **Format**: Protocol Buffers (pbf)
- **Zoom levels**: 0-10 (optimized for general basemap use)

## Performance Considerations

### Circular View
- Uses instanced rendering for city markers
- Throttled raycasting for hover detection
- Pauses auto-rotation during user interaction

### Flat Map View
- MapLibre's built-in clustering for high-density areas
- Heatmap layer fades out at higher zoom levels
- Circle layer appears at higher zoom for detail
- Memoized style layers prevent unnecessary re-renders

### General
- Mock data is memoized based on time window
- Suspense boundaries for code splitting
- Responsive design with mobile support

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (WebGL required)
- Mobile browsers: ⚠️ Limited 3D performance on older devices

## Troubleshooting

### Map Not Displaying
- **Issue**: White screen or error in flat map view
- **Solution**: Check that `NEXT_PUBLIC_MAPTILER_KEY` is set in `.env.local`

### 3D Globe Not Rendering
- **Issue**: Black screen in circular view
- **Solution**: Ensure WebGL is enabled in browser, check console for Three.js errors

### Slow Performance
- **Issue**: Laggy rotation or interactions
- **Solution**:
  - Reduce `rotationSpeed` value
  - Decrease number of cities in mock data
  - Disable auto-rotation: `autoRotate={false}`

### TypeScript Errors
- **Issue**: Type mismatch errors
- **Solution**: Ensure you're importing types from `@/components/us-heatmap`

## Customization

### Change Color Scheme

```tsx
<UsHeatmap colorScheme="reds" />  // Use red color scale
<UsHeatmap colorScheme="blues" /> // Use blue color scale (default)
```

### Adjust Rotation Speed

```tsx
<UsHeatmap rotationSpeed={0.001} />  // Very slow
<UsHeatmap rotationSpeed={0.01} />   // Medium (default)
<UsHeatmap rotationSpeed={0.05} />   // Fast
```

### Start in Flat View

```tsx
<UsHeatmap view="flat" />
```

### Custom City Markers

To customize marker appearance, edit `UsHeatmapCircular.tsx`:

```typescript
// Adjust size calculation (line 86-87)
const size = 0.04 + intensity * 0.12; // Larger range

// Adjust opacity
<meshBasicMaterial color={marker.color} transparent opacity={0.9} />
```

## Future Enhancements

Potential improvements for production:

1. **Real-time Updates**: WebSocket connection for live data streaming
2. **Time Slider**: Scrub through historical data
3. **Advanced Filtering**: Filter by disaster type, intensity threshold
4. **Export Functionality**: Download data as CSV/JSON
5. **Mobile Optimization**: Touch-friendly controls, reduced polygon count
6. **Custom Basemaps**: Alternative map styles beyond Planet Lite
7. **Clustering**: Automatic city grouping at lower zoom levels
8. **Animation**: Show disaster spread over time

## License & Attribution

- **MapTiler**: Attribution required (automatically displayed)
- **Three.js**: MIT License
- **MapLibre GL JS**: BSD License
- **D3.js**: ISC License

## Support

For issues or questions:
1. Check browser console for errors
2. Verify environment variables are set
3. Ensure all dependencies are installed
4. Review this README for common solutions

---

Built for the **Atlas Alert Dashboard** capstone project.
