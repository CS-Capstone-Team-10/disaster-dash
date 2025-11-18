// src/lib/geo/aggregate.ts
import { BskyPost } from "@/types/post";
import { CITY_COORDS } from "./cities";

export type CityPoint = { city: string; state: string; lat: number; lon: number; count: number };

export function aggregatePostsToCityCounts(posts: BskyPost[]): CityPoint[] {
  const counts = new Map<string, { city: string; state: string; count: number }>();

  for (const p of posts) {
    if (!p.location) continue;
    const key = `${p.location.trim().toLowerCase()}`;
    const item = counts.get(key) ?? { city: p.location.trim(), state: p.location.trim(), count: 0 };
    item.count += 1;
    counts.set(key, item);
  }

  const out: CityPoint[] = [];
  for (const [key, meta] of counts) {
    const coord = CITY_COORDS[key];
    if (!coord) continue; // skip unknown coords
    out.push({ city: meta.city, state: meta.state, lat: coord.lat, lon: coord.lon, count: meta.count });
  }
  return out.sort((a, b) => b.count - a.count);
}

export function postsForCity(posts: BskyPost[], city: string, state: string): BskyPost[] {
  const key = `${city.trim().toLowerCase()},${state.trim().toLowerCase()}`;
  return posts.filter(
    p => p.location && `${p.location.trim().toLowerCase()}` === key
  );
}
