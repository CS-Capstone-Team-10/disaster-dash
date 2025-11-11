export type Disaster = "all" | "earthquake" | "wildfire" | "flood" | "hurricane" | "other";

export type StateDisasterDatum = {
  id: string; // ISO 3166-2 US state code like "US-CA", "US-TX"
  byType: Partial<Record<Exclude<Disaster, "all">, number>>;
  total?: number; // optional; if omitted we sum byType
};
