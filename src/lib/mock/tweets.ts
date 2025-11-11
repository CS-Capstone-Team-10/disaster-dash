// src/lib/mock/tweets.ts
export type Tweet = {
  id: string;
  createdAt: string; // ISO
  state: string;     // e.g. "CA"
  city: string;      // e.g. "Los Angeles"
  type: "earthquake" | "wildfire" | "flood" | "hurricane" | "other";
  text: string;
  confidence: number; // 0..1
  source: "bluesky" | "twitter";
  status: "new" | "triaged" | "dismissed";
};

// Tweet templates for variety
const TEMPLATES = {
  wildfire: [
    "Heavy smoke reported; visible flames on hillside.",
    "Wildfire spreading rapidly, evacuations underway.",
    "Smoke plume visible from downtown.",
    "Fire crews responding to brush fire.",
    "Air quality hazardous due to nearby wildfire.",
  ],
  earthquake: [
    "Strong tremor felt, pictures falling off walls.",
    "Small earthquake detected, no damage reported.",
    "Just felt a significant shake.",
    "Minor aftershock following earlier quake.",
    "Building swaying from earthquake.",
  ],
  flood: [
    "Street flooding, cars stranded.",
    "Water levels rising rapidly.",
    "Underpass completely flooded.",
    "Flood warning issued for area.",
    "Severe flooding blocking main roads.",
  ],
  hurricane: [
    "Hurricane winds increasing rapidly.",
    "Storm surge warnings in effect.",
    "Power outages widespread.",
    "Wind gusts reaching dangerous levels.",
    "Hurricane making landfall nearby.",
  ],
  other: [
    "Emergency vehicles on scene.",
    "Power outage affecting area.",
    "Unknown incident, first responders present.",
    "Structural damage reported.",
    "Emergency situation developing.",
  ],
};

// Generate tweets matching dashboard state totals
// CA: 122 total (wildfire: 72, earthquake: 44, flood: 6)
// TX: 85 total (flood: 48, hurricane: 22, other: 15)
// FL: 66 total (hurricane: 41, flood: 18, other: 7)
// NY: 54 total (other: 42, flood: 12)
// WA: 25 total (wildfire: 12, flood: 13)

function generateTweets(): Tweet[] {
  const tweets: Tweet[] = [];
  let idCounter = 1;

  const addTweet = (
    city: string,
    state: string,
    type: Tweet["type"],
    minutesAgo: number
  ) => {
    const templates = TEMPLATES[type];
    const text = templates[Math.floor(Math.random() * templates.length)];
    const createdAt = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
    const confidence = 0.7 + Math.random() * 0.25;
    const source = Math.random() > 0.5 ? "twitter" : "bluesky";
    const status = Math.random() > 0.8 ? "triaged" : Math.random() > 0.9 ? "dismissed" : "new";

    tweets.push({
      id: `tw_${idCounter.toString().padStart(3, "0")}`,
      createdAt,
      state,
      city,
      type,
      text,
      confidence,
      source,
      status,
    });
    idCounter++;
  };

  // California: 122 total (wildfire: 72, earthquake: 44, flood: 6)
  const caCities = ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "Fresno"];
  for (let i = 0; i < 72; i++) {
    addTweet(caCities[i % caCities.length], "CA", "wildfire", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 44; i++) {
    addTweet(caCities[i % caCities.length], "CA", "earthquake", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 6; i++) {
    addTweet(caCities[i % caCities.length], "CA", "flood", Math.floor(Math.random() * 1440));
  }

  // Texas: 85 total (flood: 48, hurricane: 22, other: 15)
  const txCities = ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso"];
  for (let i = 0; i < 48; i++) {
    addTweet(txCities[i % txCities.length], "TX", "flood", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 22; i++) {
    addTweet(txCities[i % txCities.length], "TX", "hurricane", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 15; i++) {
    addTweet(txCities[i % txCities.length], "TX", "other", Math.floor(Math.random() * 1440));
  }

  // Florida: 66 total (hurricane: 41, flood: 18, other: 7)
  const flCities = ["Miami", "Tampa", "Orlando", "Jacksonville"];
  for (let i = 0; i < 41; i++) {
    addTweet(flCities[i % flCities.length], "FL", "hurricane", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 18; i++) {
    addTweet(flCities[i % flCities.length], "FL", "flood", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 7; i++) {
    addTweet(flCities[i % flCities.length], "FL", "other", Math.floor(Math.random() * 1440));
  }

  // New York: 54 total (other: 42, flood: 12)
  const nyCities = ["New York", "Buffalo", "Rochester"];
  for (let i = 0; i < 42; i++) {
    addTweet(nyCities[i % nyCities.length], "NY", "other", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 12; i++) {
    addTweet(nyCities[i % nyCities.length], "NY", "flood", Math.floor(Math.random() * 1440));
  }

  // Washington: 25 total (wildfire: 12, flood: 13)
  const waCities = ["Seattle", "Spokane", "Tacoma"];
  for (let i = 0; i < 12; i++) {
    addTweet(waCities[i % waCities.length], "WA", "wildfire", Math.floor(Math.random() * 1440));
  }
  for (let i = 0; i < 13; i++) {
    addTweet(waCities[i % waCities.length], "WA", "flood", Math.floor(Math.random() * 1440));
  }

  return tweets;
}

export const MOCK_TWEETS: Tweet[] = generateTweets();
