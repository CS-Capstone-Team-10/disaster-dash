# API Integration Guide for Atlas Alert

## Overview

All data fetching has been centralized in `/src/lib/services/data-service.ts`. This makes it super easy to replace mock data with your real API.

## Quick Start

### 1. Set Your API URL

Create a `.env.local` file in the project root:

```bash
# Your API base URL
NEXT_PUBLIC_API_URL=https://your-api.com

# Set to 'false' to use real API instead of mocks
NEXT_PUBLIC_USE_MOCK=false
```

### 2. Update API Endpoints

Open `/src/lib/services/data-service.ts` and uncomment the API fetch calls in each function:

#### Example: `fetchDisasterIncidents()`

**Before (Mock):**
```typescript
async function fetchDisasterIncidents(): Promise<MockTweet[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_TWEETS;
  }
  return [];
}
```

**After (Real API):**
```typescript
async function fetchDisasterIncidents(): Promise<MockTweet[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_TWEETS;
  }

  // Replace with your actual API endpoint
  const response = await fetch(`${API_BASE_URL}/incidents`);
  if (!response.ok) throw new Error('Failed to fetch incidents');
  return response.json();
}
```

## API Endpoints to Implement

### 1. **GET /incidents**
Fetch all disaster incidents/tweets

**Expected Response:**
```json
[
  {
    "id": "string",
    "createdAt": "ISO timestamp",
    "state": "CA",
    "city": "Los Angeles",
    "type": "earthquake" | "wildfire" | "flood" | "hurricane" | "other",
    "text": "string",
    "confidence": 0.92,
    "source": "twitter" | "bluesky",
    "status": "new" | "triaged" | "dismissed",
    "handle": "@username"
  }
]
```

**Used By:**
- Dashboard (stats calculations)
- Analytics page (filters and charts)
- Alerts page (alert list)
- Live Map (map markers)

---

### 2. **GET /aggregations/states**
Fetch state-level disaster aggregations

**Expected Response:**
```json
[
  {
    "id": "US-CA",
    "byType": {
      "wildfire": 72,
      "earthquake": 44,
      "flood": 6
    },
    "total": 122
  }
]
```

**Used By:**
- Dashboard (US Heatmap)

---

### 3. **GET /trends**
Fetch disaster trend data for charts

**Query Parameters:**
- `range` (optional): "6m" | "1y" | "all"

**Expected Response:**
```json
[
  {
    "date": "Jan",
    "wildfires": 12,
    "floods": 8,
    "hurricanes": 3,
    "earthquakes": 5
  }
]
```

**Used By:**
- Dashboard (Trend Chart)

---

### 4. **GET /metrics**
Fetch current metrics snapshot

**Expected Response:**
```json
{
  "windowLabel": "Last 24h",
  "totalIncidents": 300,
  "avgMTTRHours": 4.2,
  "openIncidents": 45,
  "resolvedPct": 0.85,
  "trendTotals": [22, 28, 30, 35, 38, 42, 48, 50, 55, 57, 60, 63],
  "bySeverity": {
    "critical": 15,
    "high": 90,
    "medium": 140,
    "low": 55
  },
  "byDisaster": {
    "earthquake": 38,
    "wildfire": 82,
    "flood": 66,
    "hurricane": 45,
    "other": 69
  }
}
```

**Used By:**
- Dashboard (window label, time context)

---

### 5. **GET /notifications/history**
Fetch notification delivery history

**Expected Response:**
```json
[
  {
    "id": "notif-1",
    "sentAt": "ISO timestamp",
    "channel": "Email" | "Webhook",
    "summary": "string",
    "status": "Delivered" | "Failed"
  }
]
```

**Used By:**
- Notifications page

---

### 6. **WebSocket /stream** (Real-time Updates)
Stream live tweet updates

**Message Format:**
```json
{
  "id": "string",
  "timestamp": "ISO timestamp",
  "handle": "@username",
  "text": "string",
  "disaster": "earthquake",
  "stateId": "US-CA",
  "city": "Los Angeles",
  "confidence": 0.92
}
```

**Implementation in `useLiveTweetStream()`:**
```typescript
export function useLiveTweetStream() {
  const [tweets, setTweets] = useState<ClassifiedTweet[]>([]);

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      const ws = new WebSocket(`wss://your-api.com/stream`);

      ws.onmessage = (event) => {
        const tweet = JSON.parse(event.data);
        setTweets(prev => [tweet, ...prev].slice(0, 50));
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => ws.close();
    }

    // Mock implementation...
  }, []);

  return tweets;
}
```

**Used By:**
- Dashboard (Live Feed)

---

## Component Usage Examples

### Using Hooks in Components

```typescript
// Dashboard Page
import { useDashboardData } from '@/lib/services/data-service';

function DashboardPage() {
  const { incidents, stateAggregations, trends, metrics, loading, error } = useDashboardData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <Dashboard data={{incidents, stateAggregations, trends, metrics}} />;
}
```

```typescript
// Analytics Page
import { useDisasterIncidents } from '@/lib/services/data-service';

function AnalyticsPage() {
  const { data: incidents, loading, error, refetch } = useDisasterIncidents();

  // Use incidents for filtering and analytics
}
```

```typescript
// Alerts Page
import { useDisasterIncidents } from '@/lib/services/data-service';

function AlertsPage() {
  const { data: tweets, loading, error } = useDisasterIncidents();

  // Filter and display alerts
}
```

---

## Testing Your Integration

### Step 1: Test with Mock Data
```bash
# .env.local
NEXT_PUBLIC_USE_MOCK=true
```

### Step 2: Test with Real API
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_USE_MOCK=false
```

### Step 3: Verify Each Page
- ✅ Dashboard - Check stats, heatmap, trends, live feed
- ✅ Analytics - Check filters, charts, KPIs
- ✅ Alerts - Check tweet list, filters, actions
- ✅ Live Map - Check markers, city drill-down
- ✅ Notifications - Check notification history

---

## Error Handling

All hooks return an `error` object. Display errors to users:

```typescript
const { data, loading, error } = useDisasterIncidents();

if (error) {
  return (
    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
      <h3 className="text-red-400 font-semibold">Error Loading Data</h3>
      <p className="text-red-300 text-sm">{error.message}</p>
    </div>
  );
}
```

---

## Adding Authentication

If your API requires authentication, modify the fetch calls in `data-service.ts`:

```typescript
async function fetchDisasterIncidents(): Promise<MockTweet[]> {
  const token = getAuthToken(); // Your auth logic

  const response = await fetch(`${API_BASE_URL}/incidents`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch incidents');
  return response.json();
}
```

---

## Rate Limiting & Caching

Consider adding:

1. **SWR or React Query** for automatic caching and refetching
2. **Request debouncing** for filter changes
3. **Pagination** for large datasets

Example with SWR:
```typescript
import useSWR from 'swr';

export function useDisasterIncidents() {
  const { data, error, mutate } = useSWR(
    '/incidents',
    () => fetchDisasterIncidents(),
    {
      refreshInterval: 30000, // Refresh every 30s
      revalidateOnFocus: true,
    }
  );

  return {
    data: data || [],
    loading: !error && !data,
    error,
    refetch: mutate
  };
}
```

---

## Quick Reference

| Page | Hook | Data Source |
|------|------|-------------|
| Dashboard | `useDashboardData()` | All endpoints |
| Analytics | `useDisasterIncidents()` | `/incidents` |
| Alerts | `useDisasterIncidents()` | `/incidents` |
| Live Map | `useDisasterIncidents()` | `/incidents` |
| Notifications | `useNotificationHistory()` | `/notifications/history` |
| Live Feed | `useLiveTweetStream()` | WebSocket `/stream` |

---

## Summary

1. **All data is centralized** in `/src/lib/services/data-service.ts`
2. **Components use hooks** - no direct API calls in components
3. **Easy to switch** between mock and real data with env variables
4. **Type-safe** - All interfaces are already defined
5. **Ready for production** - Just uncomment API calls and update endpoints

When you're ready to integrate your API, just:
1. Set `NEXT_PUBLIC_API_URL` in `.env.local`
2. Set `NEXT_PUBLIC_USE_MOCK=false`
3. Uncomment and update the API calls in `data-service.ts`
4. Test each page

That's it! 🚀
