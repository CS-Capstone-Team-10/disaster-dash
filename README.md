# Atlas Alert

**Disaster Intelligence Dashboard**

A real-time disaster intelligence platform that monitors and visualizes disaster events across the United States through social media analysis (Twitter, Bluesky). It provides incident triage, geographic visualization, trend analysis, and alert management.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [API Integration](#api-integration)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## ✨ Features

### 📊 Dashboard
- **KPI Cards**: Active Disasters, Posts Analyzed, Affected Areas, Alert Level
- **US State Choropleth Heatmap**: Interactive AmCharts map showing disaster concentrations by state
  - Filterable by disaster type (earthquake, wildfire, flood, hurricane, other)
  - Time window indicator
  - State drill-down capability
- **Disaster Trends Chart**: Multi-line trends showing historical disaster data
- **Live Feed**: Real-time streaming incident feed with confidence scores and color-coded disaster types

### 🗺️ Live Map
- Leaflet-based interactive map of USA
- Circle markers at city locations with incident counts
- City drill-down modal showing all incidents
- Custom DivIcon badges with incident counts
- Fit bounds on available data

### 🚨 Alerts Management
- Comprehensive incident list with advanced filtering:
  - Search by text/city
  - Filter by disaster type
  - Filter by state
  - Filter by status (new, triaged, dismissed)
- Color-coded disaster type badges
- Location and status badges
- Action dropdown (Mark Triaged, Dismiss)
- Real-time count display

### 📈 Analytics Dashboard
- Advanced metrics and KPI cards with sparklines
- Multiple filtering options:
  - Time window (1h, 24h, 7d)
  - Disaster type filter
  - Confidence threshold slider (50%-95%)
- Four visualization charts:
  1. Incidents Over Time (by Type) - Stacked area chart
  2. Top Cities - Bar chart of affected cities
  3. Confidence Distribution - Histogram
  4. Triage Status by Type - Stacked bar chart

### 🔔 Notifications Settings
- Notification channel configuration (Email, Webhook)
- Notification delivery history with status tracking
- Preference controls (severity, frequency, disaster type)

---

## 🛠️ Tech Stack

### Core
- **Next.js 15.5.4** - React meta-framework with App Router and Server Components
- **React 19.1.0** - UI library
- **TypeScript 5** - Strong typing for reliability
- **Tailwind CSS 4** - Utility-first CSS framework

### Data Visualization
- **AmCharts 5** - Interactive maps and choropleth visualization
- **Leaflet 1.9.4** + **React-Leaflet 5.0.0** - Lightweight mapping library
- **Recharts 3.3.0** - Simple, composable React charts
- **Nivo** (v0.99.0) - Advanced visualization components
- **Visx** (v3.12.0) - Low-level D3-based visualization primitives

### UI & Animation
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **Framer Motion** - Advanced animation library
- **class-variance-authority** - CSS class composition

### Utilities
- **date-fns** - Date manipulation
- **next-themes** - Theme management

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** (required)
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/disaster-dash.git
   cd disaster-dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## 📁 Project Structure

```
disaster-dash/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with theme provider
│   │   ├── globals.css             # Global styling
│   │   └── (app)/                  # Protected app routes group
│   │       ├── layout.tsx          # App shell with sidebar/header
│   │       ├── page.tsx            # Dashboard home page
│   │       ├── alerts/             # Alerts management
│   │       ├── analytics/          # Advanced analytics
│   │       ├── live-map/           # Interactive map
│   │       └── notifications/      # Notification settings
│   │
│   ├── components/
│   │   ├── layout/                 # Sidebar, Header, SettingsPanel
│   │   ├── dashboard/              # Dashboard components
│   │   ├── analytics/              # Analytics components
│   │   ├── kpi/                    # KPI card components
│   │   └── ui/                     # Reusable UI components
│   │
│   ├── lib/
│   │   ├── services/
│   │   │   └── data-service.ts     # Centralized data fetching
│   │   ├── analytics/
│   │   │   └── aggregations.ts     # Data transformation utilities
│   │   ├── geo/
│   │   │   ├── cities.ts           # City coordinate mapping
│   │   │   └── aggregate.ts        # Tweet-to-city aggregation
│   │   ├── mock/
│   │   │   ├── index.ts            # Mock data exports
│   │   │   └── tweets.ts           # Tweet generation + streaming
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── disaster.ts             # Disaster type definitions
│   │   ├── incidents.ts            # Tweet and metric types
│   │   └── kpi.ts                  # KPI data structures
│   │
│   └── data/
│       └── mock.ts                 # Legacy mock data
│
├── public/
│   └── logo.png                    # Atlas Alert logo
│
├── .env.example                    # Environment variables template
├── .npmrc                          # NPM configuration
├── vercel.json                     # Vercel configuration
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

### Key Architecture Patterns

#### Centralized Data Service

All data fetching is managed through `/src/lib/services/data-service.ts`:

```typescript
// Example usage
import { useDashboardData, useDisasterIncidents } from '@/lib/services/data-service';

// In component
const { incidents, stateAggregations, trends, metrics, loading, error } = useDashboardData();
```

**Available Hooks:**
- `useDashboardData()` - All dashboard data in one call
- `useDisasterIncidents()` - Fetch all tweet incidents
- `useStateAggregations()` - State-level metrics
- `useDisasterTrends()` - Time-series trend data
- `useMetrics()` - Metrics snapshot
- `useNotificationHistory()` - Notification logs
- `useLiveTweetStream()` - Real-time tweet subscription
- `useFilteredIncidents()` - Client-side filtered incidents

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

#### Quick Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "feat: ready for deployment"
   git push origin main
   ```

2. **Go to [vercel.com](https://vercel.com)**
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Done!** Your app will be live in ~2 minutes

#### Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Deployment Configuration

The project includes `vercel.json` with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_USE_MOCK": "true"
  }
}
```

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pushes to any other branch (e.g., `feat/new-feature`)

### Custom Domain Setup

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Enter your domain (e.g., `atlasalert.com`)
4. Follow DNS configuration instructions
5. SSL certificate provisioned automatically

### Build Output

```
Route (app)                         Size  First Load JS
┌ ○ /                             223 kB         391 kB
├ ○ /alerts                      19.8 kB         187 kB
├ ○ /analytics                   10.1 kB         177 kB
├ ○ /live-map                    1.34 kB         169 kB
└ ○ /notifications                 20 kB         187 kB
```

**Total app size**: ~500KB (excellent performance)

---

## 🔌 API Integration

### Default: Mock Data Mode

By default, the app runs with comprehensive mock data. No API required!

### Switching to Real API

#### 1. Set Environment Variables

Create `.env.local`:

```bash
# Set to 'false' to use real API
NEXT_PUBLIC_USE_MOCK=false

# Your API base URL
NEXT_PUBLIC_API_URL=https://api.atlasalert.com
```

#### 2. Update Data Service

Open `/src/lib/services/data-service.ts` and uncomment the API calls:

```typescript
async function fetchDisasterIncidents(): Promise<MockTweet[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_TWEETS;
  }

  // Uncomment this section
  const response = await fetch(`${API_BASE_URL}/incidents`);
  if (!response.ok) throw new Error('Failed to fetch incidents');
  return response.json();
}
```

### API Endpoints Required

Your backend should implement these 6 endpoints:

#### 1. GET /incidents
Fetch all disaster incidents/tweets

**Response:**
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

**Used By:** Dashboard, Analytics, Alerts, Live Map

#### 2. GET /aggregations/states
State-level disaster aggregations

**Response:**
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

**Used By:** Dashboard (US Heatmap)

#### 3. GET /trends
Disaster trend data for charts

**Query Parameters:**
- `range` (optional): "6m" | "1y" | "all"

**Response:**
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

**Used By:** Dashboard (Trend Chart)

#### 4. GET /metrics
Current metrics snapshot

**Response:**
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

**Used By:** Dashboard

#### 5. GET /notifications/history
Notification delivery history

**Response:**
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

**Used By:** Notifications page

#### 6. WebSocket /stream
Real-time tweet updates

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

**Implementation:**
```typescript
export function useLiveTweetStream() {
  const [tweets, setTweets] = useState<ClassifiedTweet[]>([]);

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      const ws = new WebSocket(`wss://api.atlasalert.com/stream`);

      ws.onmessage = (event) => {
        const tweet = JSON.parse(event.data);
        setTweets(prev => [tweet, ...prev].slice(0, 50));
      };

      return () => ws.close();
    }
    // Mock implementation...
  }, []);

  return tweets;
}
```

**Used By:** Dashboard (Live Feed)

### Adding Authentication

If your API requires authentication, modify the fetch calls:

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

## 🔐 Environment Variables

### Development

Create `.env.local` in the project root:

```bash
# Data Source Configuration
NEXT_PUBLIC_USE_MOCK=true              # Use mock data (default)
NEXT_PUBLIC_API_URL=                   # Leave empty for mock mode

# Optional: Add your own variables
# NEXT_PUBLIC_API_KEY=your-api-key
# NEXT_PUBLIC_WS_URL=wss://your-websocket-url
```

### Production (Vercel)

Set environment variables in Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_USE_MOCK=false`
   - `NEXT_PUBLIC_API_URL=https://your-api.com`
3. Redeploy

### Environment Variable Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_USE_MOCK` | Use mock data instead of real API | `true` | No |
| `NEXT_PUBLIC_API_URL` | Your API base URL | `/api` | Only when `USE_MOCK=false` |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

---

## 🧪 Testing Your Deployment

After deployment, verify each page:

- ✅ **Dashboard** (`/`) - KPI cards, heatmap, trends, live feed
- ✅ **Live Map** (`/live-map`) - Interactive map with city markers
- ✅ **Alerts** (`/alerts`) - Filtering and incident management
- ✅ **Analytics** (`/analytics`) - Charts and metrics
- ✅ **Notifications** (`/notifications`) - Settings and history

---

## 🐛 Troubleshooting

### Build Fails with Dependency Errors

**Solution:** Ensure `.npmrc` is committed to your repository:
```
legacy-peer-deps=true
```

### Environment Variables Not Working

**Solution:**
- Verify variable names start with `NEXT_PUBLIC_` for client-side access
- Redeploy after changing environment variables in Vercel
- Check the "Environment Variables" tab in Settings

### Map Not Loading

**Solution:** The Live Map uses dynamic imports with `ssr: false` (already configured):

```typescript
// src/app/(app)/live-map/page.tsx
const LiveMapImpl = dynamic(() => import('./LiveMapImpl'), { ssr: false });
```

### Build Succeeds Locally but Fails on Vercel

**Solution:**
- Check Node.js version matches (20+)
- Verify all files are committed to Git
- Check build logs in Vercel dashboard for specific errors

---

## 🎨 Styling & Theming

### Design System

- **Color Palette**: Dark gray (gray-950/gray-900 background), light text (gray-100)
- **Disaster Type Colors**:
  - 🟠 Earthquake: Orange (#FFE0B2 → #E65100)
  - 🔴 Wildfire: Red (#FFcdd2 → #B71C1C)
  - 🔵 Flood: Blue (#BBDEFB → #0D47A1)
  - 🟢 Hurricane: Green (#C8E6C9 → #1B5E20)
  - 🟣 Other: Purple (#D1C4E9 → #4527A0)

### Dark Mode

- Default to system theme via next-themes
- Color scheme optimized for dark mode
- Consistent 900/950 gray backgrounds

---

## 📊 Performance

### Optimization Features

- ✅ **Next.js 15** with Turbopack for fast builds
- ✅ **React 19** for improved performance
- ✅ **Dynamic imports** for code splitting (Live Map)
- ✅ **Tailwind CSS 4** with PostCSS for optimized styling
- ✅ **Vercel Edge Network** for global CDN
- ✅ **Static page generation** where possible

### Bundle Size

Total first load JS: **391 KB** (main page)
- Excellent performance for a data-rich dashboard
- All routes under 200 KB except main dashboard

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Test production build locally
npm start
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 📞 Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🎯 Roadmap

- [ ] Real-time WebSocket integration
- [ ] User authentication and authorization
- [ ] Advanced filtering and search
- [ ] Export data to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Email notification system
- [ ] Webhook integrations
- [ ] Admin dashboard

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [AmCharts](https://www.amcharts.com/) - Interactive maps
- [Leaflet](https://leafletjs.com/) - Open-source mapping
- [Nivo](https://nivo.rocks/) - Data visualization
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

---

<div align="center">

**Built with ❤️ using Next.js 15 & React 19**

[Report Bug](https://github.com/yourusername/disaster-dash/issues) · [Request Feature](https://github.com/yourusername/disaster-dash/issues)

</div>
