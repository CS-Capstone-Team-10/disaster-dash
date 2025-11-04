// src/lib/geo/aggregate.ts
import { CITY_COORDS } from "./cities";
import type { Tweet } from "@/lib/mock/tweets";

export type CityPoint = { city: string; state: string; lat: number; lon: number; count: number };

export function aggregateTweetsToCityCounts(tweets: Tweet[]): CityPoint[] {
  const counts = new Map<string, { city: string; state: string; count: number }>();

  for (const t of tweets) {
    if (!t.city || !t.state) continue;
    const key = `${t.city.trim().toLowerCase()},${t.state.trim().toLowerCase()}`;
    const item = counts.get(key) ?? { city: t.city.trim(), state: t.state.trim(), count: 0 };
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

export function tweetsForCity(tweets: Tweet[], city: string, state: string): Tweet[] {
  const key = `${city.trim().toLowerCase()},${state.trim().toLowerCase()}`;
  return tweets.filter(
    t => `${t.city.trim().toLowerCase()},${t.state.trim().toLowerCase()}` === key
  );
}
