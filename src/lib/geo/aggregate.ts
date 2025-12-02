// src/lib/geo/aggregate.ts
import { BskyPost } from "@/types/post";

export type CityPoint = { location: string; lat: number; lon: number; count: number };

/**
 * Aggregate posts by location using real coordinates from backend
 */
export function aggregatePostsToCityCounts(posts: BskyPost[]): CityPoint[] {
  const locationMap = new Map<string, { lat: number; lon: number; count: number }>();

  for (const post of posts) {
    // Skip posts without valid coordinates
    if (!post.latitude || !post.longitude || !post.location) continue;

    const key = post.location.trim();

    if (locationMap.has(key)) {
      // Increment count for existing location
      locationMap.get(key)!.count += 1;
    } else {
      // Add new location with coordinates from backend
      locationMap.set(key, {
        lat: post.latitude,
        lon: post.longitude,
        count: 1
      });
    }
  }

  // Convert to array and sort by count
  const out: CityPoint[] = Array.from(locationMap.entries()).map(([location, data]) => ({
    location,
    lat: data.lat,
    lon: data.lon,
    count: data.count
  }));

  return out.sort((a, b) => b.count - a.count);
}

/**
 * Get all posts for a specific location
 */
export function postsForLocation(posts: BskyPost[], location: string): BskyPost[] {
  return posts.filter(p => p.location && p.location.trim() === location);
}
