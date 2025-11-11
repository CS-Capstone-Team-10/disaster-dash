// src/lib/geo/cities.ts
export const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  // California
  "los angeles,ca": { lat: 34.0522, lon: -118.2437 },
  "san francisco,ca": { lat: 37.7749, lon: -122.4194 },
  "san diego,ca": { lat: 32.7157, lon: -117.1611 },
  "sacramento,ca": { lat: 38.5816, lon: -121.4944 },
  "fresno,ca": { lat: 36.7378, lon: -119.7871 },

  // Texas
  "houston,tx": { lat: 29.7604, lon: -95.3698 },
  "dallas,tx": { lat: 32.7767, lon: -96.7970 },
  "austin,tx": { lat: 30.2672, lon: -97.7431 },
  "san antonio,tx": { lat: 29.4241, lon: -98.4936 },
  "fort worth,tx": { lat: 32.7555, lon: -97.3308 },
  "el paso,tx": { lat: 31.7619, lon: -106.4850 },

  // Florida
  "miami,fl": { lat: 25.7617, lon: -80.1918 },
  "tampa,fl": { lat: 27.9506, lon: -82.4572 },
  "orlando,fl": { lat: 28.5383, lon: -81.3792 },
  "jacksonville,fl": { lat: 30.3322, lon: -81.6557 },

  // New York
  "new york,ny": { lat: 40.7128, lon: -74.0060 },
  "buffalo,ny": { lat: 42.8864, lon: -78.8784 },
  "rochester,ny": { lat: 43.1566, lon: -77.6088 },

  // Washington
  "seattle,wa": { lat: 47.6062, lon: -122.3321 },
  "spokane,wa": { lat: 47.6588, lon: -117.4260 },
  "tacoma,wa": { lat: 47.2529, lon: -122.4443 },
};
