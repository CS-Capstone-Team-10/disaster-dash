/**
 * CENTRALIZED DATA SERVICE
 *
 * This file contains all data fetching logic for the application.
 * Integrates with the bluesky_api backend.
 *
 * Usage in components:
 * import { useDisasterData, useStateAggregations, useTrends } from '@/lib/services/data-service';
 *
 * const { data, loading, error } = useDisasterData();
 */

import { useMemo, useState, useEffect } from 'react';
import {
  MOCK_NOTIFICATION_HISTORY,
  MOCK_DISASTER_TRENDS,
  subscribeToTweetStream,
  startMockTweetPump,
  type MockTweet
} from '@/lib/mock';
import type { StateDisasterDatum } from '@/types/disaster';
import type { ClassifiedTweet, MetricsSnapshot, Disaster } from '@/types/incidents';
import type { BskyPost } from '@/types/post';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true'; // Default to false (use real data)

// ============================================================================
// DATA TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Convert backend BskyPost to MockTweet format (for compatibility with analytics)
 */
function bskyPostToMockTweet(post: BskyPost): MockTweet {
  // Extract state code from location (e.g., "California" -> "CA", "Texas" -> "TX")
  const stateMap: Record<string, string> = {
    'california': 'CA', 'texas': 'TX', 'florida': 'FL', 'new york': 'NY',
    'washington': 'WA', 'oregon': 'OR', 'arizona': 'AZ', 'nevada': 'NV',
    'colorado': 'CO', 'oklahoma': 'OK', 'louisiana': 'LA', 'georgia': 'GA'
  };
  
  const locationLower = post.location.toLowerCase();
  let state = 'XX'; // Default unknown
  
  for (const [name, code] of Object.entries(stateMap)) {
    if (locationLower.includes(name)) {
      state = code;
      break;
    }
  }

  // Try to extract city from location
  const city = post.location.split(',')[0].trim();

  return {
    id: post.id.toString(),
    createdAt: post.analyzed_at,
    state,
    city,
    type: post.disaster_type as Disaster,
    text: post.summary,
    confidence: post.confidence,
    source: 'bluesky',
    status: 'new', // Default status
    handle: post.post_author,
  };
}

/**
 * Convert backend BskyPost to ClassifiedTweet format (for live feed)
 */
function bskyPostToClassifiedTweet(post: BskyPost): ClassifiedTweet {
  const mockTweet = bskyPostToMockTweet(post);
  return {
    id: mockTweet.id,
    timestamp: mockTweet.createdAt,
    handle: mockTweet.handle || '@unknown',
    text: mockTweet.text,
    disaster: mockTweet.type,
    stateId: `US-${mockTweet.state}`,
    city: mockTweet.city,
    confidence: mockTweet.confidence,
  };
}

/**
 * Aggregate posts by state for choropleth map
 */
function aggregateByState(posts: BskyPost[]): StateDisasterDatum[] {
  const stateMap = new Map<string, { byType: Record<string, number>; total: number }>();

  posts.forEach(post => {
    const mockTweet = bskyPostToMockTweet(post);
    const stateId = `US-${mockTweet.state}`;
    
    if (!stateMap.has(stateId)) {
      stateMap.set(stateId, { byType: {}, total: 0 });
    }

    const state = stateMap.get(stateId)!;
    const type = mockTweet.type;
    
    state.byType[type] = (state.byType[type] || 0) + 1;
    state.total += 1;
  });

  return Array.from(stateMap.entries()).map(([id, data]) => ({
    id,
    byType: data.byType as Record<Disaster, number>,
    total: data.total,
  }));
}

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetch all disaster incidents from backend
 */
async function fetchDisasterIncidents(): Promise<BskyPost[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/disasters?limit=1000`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch disasters: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching disasters:', error);
    throw error;
  }
}

/**
 * Paginated response type
 */
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
};

/**
 * Fetch paginated disaster incidents from backend
 */
async function fetchPaginatedDisasterIncidents(
  skip: number = 0,
  limit: number = 20
): Promise<PaginatedResponse<BskyPost>> {
  try {
    // Fetch one extra to determine if there are more
    const response = await fetch(`${API_BASE_URL}/disasters?skip=${skip}&limit=${limit + 1}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch disasters: ${response.status} ${response.statusText}`);
    }
    
    const data: BskyPost[] = await response.json();
    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, limit) : data;
    
    // Fetch total count separately for accurate pagination
    const totalResponse = await fetch(`${API_BASE_URL}/disasters?limit=0&skip=0`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Try to get total from a count endpoint or estimate
    let total = skip + data.length;
    if (hasMore) {
      // If we got more than limit, there's at least one more page
      // For accurate total, we'd need a count endpoint
      // For now, fetch all to count (can be optimized with backend count endpoint)
      const countResponse = await fetch(`${API_BASE_URL}/disasters?limit=10000`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (countResponse.ok) {
        const allData = await countResponse.json();
        total = allData.length;
      }
    }
    
    return {
      data: items,
      total,
      skip,
      limit,
      hasMore,
    };
  } catch (error) {
    console.error('Error fetching paginated disasters:', error);
    throw error;
  }
}

/**
 * Fetch state-level disaster aggregations
 * Aggregates data from /disasters endpoint
 */
async function fetchStateAggregations(): Promise<StateDisasterDatum[]> {
  try {
    const disasters = await fetchDisasterIncidents();
    return aggregateByState(disasters);
  } catch (error) {
    console.error('Error fetching state aggregations:', error);
    throw error;
  }
}

// Types for trend and notification data
export type TrendData = {
  date: string;
  wildfires: number;
  floods: number;
  hurricanes: number;
  earthquakes: number;
};

export type NotificationHistory = {
  id: string;
  sentAt: string;
  channel: string;
  summary: string;
  status: string;
};

/**
 * Fetch disaster trend data for charts
 * Uses mock data for now (can be implemented with backend aggregation later)
 */
async function fetchDisasterTrends(_timeRange?: string): Promise<TrendData[]> {
  // For now, return mock trend data
  // TODO: Implement backend endpoint for time-series aggregations
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_DISASTER_TRENDS;
}

/**
 * Backend stats response type
 */
type BackendStats = {
  time_range: string;
  total_disasters: number;
  by_severity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recent_count: number;
  recent_disasters: Array<{
    id: number;
    summary: string;
    location: string;
    severity: string;
    disaster_type: string;
    analyzed_at: string;
  }>;
};

/**
 * Fetch metrics snapshot from backend /stats endpoint
 */
async function fetchMetrics(): Promise<MetricsSnapshot> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats?time_range=24hours`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
    }
    
    const stats: BackendStats = await response.json();
    
    // Transform backend stats to MetricsSnapshot format
    const totalIncidents = stats.total_disasters;
    const resolvedCount = Math.floor(totalIncidents * 0.85); // Assume 85% resolved
    const openIncidents = totalIncidents - resolvedCount;
    
    // Calculate disaster type counts from all disasters
    const disasters = await fetchDisasterIncidents();
    const byDisaster: Record<Disaster, number> = {
      earthquake: 0,
      wildfire: 0,
      flood: 0,
      hurricane: 0,
      other: 0,
    };
    
    disasters.forEach(d => {
      const type = d.disaster_type as Disaster;
      if (type in byDisaster) {
        byDisaster[type]++;
      }
    });
    
    return {
      windowLabel: stats.time_range,
      totalIncidents,
      avgMTTRHours: 4.2, // TODO: Calculate from actual resolution data
      openIncidents,
      resolvedPct: resolvedCount / totalIncidents,
      trendTotals: [], // TODO: Implement trend calculation
      bySeverity: stats.by_severity,
      byDisaster,
    };
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

/**
 * Fetch notification history
 * Uses mock data (notification system not implemented in backend yet)
 */
async function fetchNotificationHistory(): Promise<NotificationHistory[]> {
  // TODO: Implement notification system in backend
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_NOTIFICATION_HISTORY;
}

// ============================================================================
// REACT HOOKS FOR COMPONENTS
// ============================================================================

/**
 * Sort posts by most recent first
 */
function sortByMostRecent(posts: BskyPost[]): BskyPost[] {
  return [...posts].sort((a, b) => 
    new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime()
  );
}

/**
 * Hook to fetch all disaster incidents
 * Use this in: Dashboard, Alerts page, Analytics page
 */
export function useDisasterIncidents() {
  const [data, setData] = useState<BskyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDisasterIncidents()
      .then((posts) => setData(sortByMostRecent(posts)))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, refetch: () => fetchDisasterIncidents().then((posts) => setData(sortByMostRecent(posts))) };
}

/**
 * Hook to fetch disaster incidents from the last 24 hours only
 * Use this in: Live Map
 */
export function useLiveMapIncidents() {
  const [data, setData] = useState<BskyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDisasterIncidents()
      .then((allPosts) => {
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        const recentPosts = allPosts.filter((post) => {
          const postTime = new Date(post.post_created_at).getTime();
          return postTime >= twentyFourHoursAgo;
        });
        setData(sortByMostRecent(recentPosts));
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const refetch = () => {
    fetchDisasterIncidents()
      .then((allPosts) => {
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        const recentPosts = allPosts.filter((post) => {
          const postTime = new Date(post.post_created_at).getTime();
          return postTime >= twentyFourHoursAgo;
        });
        setData(sortByMostRecent(recentPosts));
      });
  };

  return { data, loading, error, refetch };
}

/**
 * Hook to fetch paginated disaster incidents
 * Use this in: Alerts page with pagination
 */
export function usePaginatedDisasterIncidents(page: number, pageSize: number = 20) {
  const [data, setData] = useState<PaginatedResponse<BskyPost>>({
    data: [],
    total: 0,
    skip: 0,
    limit: pageSize,
    hasMore: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const skip = (page - 1) * pageSize;

  useEffect(() => {
    setLoading(true);
    fetchPaginatedDisasterIncidents(skip, pageSize)
      .then((response) => {
        // Sort by most recent first
        setData({
          ...response,
          data: sortByMostRecent(response.data),
        });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [skip, pageSize]);

  const refetch = () => {
    setLoading(true);
    fetchPaginatedDisasterIncidents(skip, pageSize)
      .then((response) => {
        setData({
          ...response,
          data: sortByMostRecent(response.data),
        });
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { 
    data: data.data, 
    total: data.total,
    hasMore: data.hasMore,
    loading, 
    error, 
    refetch 
  };
}

/**
 * Hook to fetch state-level aggregations
 * Use this in: Dashboard (US Heatmap)
 */
export function useStateAggregations() {
  const [data, setData] = useState<StateDisasterDatum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchStateAggregations()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, refetch: () => fetchStateAggregations().then(setData) };
}

/**
 * Hook to fetch disaster trends
 * Use this in: Dashboard (Trend Chart)
 */
export function useDisasterTrends(timeRange?: string) {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchDisasterTrends(timeRange)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [timeRange]);

  return { data, loading, error, refetch: () => fetchDisasterTrends(timeRange).then(setData) };
}

/**
 * Hook to fetch metrics snapshot
 * Use this in: Dashboard (Stats Cards)
 */
export function useMetrics() {
  const [data, setData] = useState<MetricsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMetrics()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, refetch: () => fetchMetrics().then(setData) };
}

/**
 * Hook to fetch notification history
 * Use this in: Notifications page
 */
export function useNotificationHistory() {
  const [data, setData] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchNotificationHistory()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, refetch: () => fetchNotificationHistory().then(setData) };
}

/**
 * Hook for live tweet stream with polling
 * Use this in: Dashboard (Live Feed)
 */
export function useLiveTweetStream() {
  const [tweets, setTweets] = useState<ClassifiedTweet[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<Date>(new Date());

  useEffect(() => {
    if (USE_MOCK_DATA) {
      // Mock implementation
      startMockTweetPump();
      const unsubscribe = subscribeToTweetStream((tweet) => {
        setTweets((prev) => [tweet, ...prev].slice(0, 50));
      });
      return unsubscribe;
    }

    // Real data implementation with polling
    const fetchLatest = async () => {
      try {
        const disasters = await fetchDisasterIncidents();
        // Convert to ClassifiedTweet and sort by most recent
        const classified = disasters
          .map(bskyPostToClassifiedTweet)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 50);
        
        setTweets(classified);
        setLastFetchTime(new Date());
      } catch (error) {
        console.error('Error fetching live tweets:', error);
      }
    };

    // Initial fetch
    fetchLatest();

    // Poll every 30 seconds
    const interval = setInterval(fetchLatest, 30000);

    return () => clearInterval(interval);
  }, []);

  return tweets;
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Hook to get all data for the dashboard in one call
 * Use this in: Dashboard page (main page)
 */
export function useDashboardData() {
  const bskyIncidents = useDisasterIncidents();
  const stateAggs = useStateAggregations();
  const trends = useDisasterTrends();
  const metrics = useMetrics();

  // Convert BskyPost to MockTweet format for dashboard stats calculation
  const incidents = useMemo(() => {
    return bskyIncidents.data.map(bskyPostToMockTweet);
  }, [bskyIncidents.data]);

  const loading = bskyIncidents.loading || stateAggs.loading || trends.loading || metrics.loading;
  const error = bskyIncidents.error || stateAggs.error || trends.error || metrics.error;

  return {
    incidents,
    stateAggregations: stateAggs.data,
    trends: trends.data,
    metrics: metrics.data,
    loading,
    error,
    refetch: () => {
      bskyIncidents.refetch();
      stateAggs.refetch();
      trends.refetch();
      metrics.refetch();
    }
  };
}

/**
 * Hook to get incidents in MockTweet format for analytics
 * Use this in: Analytics page
 */
export function useAnalyticsIncidents() {
  const { data: bskyPosts, loading, error } = useDisasterIncidents();

  const mockTweets = useMemo(() => {
    return bskyPosts.map(bskyPostToMockTweet);
  }, [bskyPosts]);

  return { data: mockTweets, loading, error };
}

/**
 * Hook to get filtered incidents with client-side filtering
 * Use this in: Analytics page
 */
export function useFilteredIncidents(filters: {
  window?: string;
  type?: string;
  minConfidence?: number;
}) {
  const { data, loading, error } = useDisasterIncidents();

  const filtered = useMemo(() => {
    let result = data;

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(t => t.disaster_type?.toLowerCase() === filters.type);
    }

    // Apply confidence filter
    if (filters.minConfidence !== undefined) {
      const minConf = filters.minConfidence;
      result = result.filter(t => t.confidence >= minConf);
    }

    // TODO: Apply time window filter when you have real timestamps
    // This would be done server-side in a real API

    return result;
  }, [data, filters]);

  return { data: filtered, loading, error };
}

// ============================================================================
// EXPORT API CLIENT (for custom queries)
// ============================================================================

export const dataService = {
  // Core data fetching
  fetchIncidents: fetchDisasterIncidents,
  fetchPaginatedIncidents: fetchPaginatedDisasterIncidents,
  fetchStateAggregations: fetchStateAggregations,
  fetchTrends: fetchDisasterTrends,
  fetchMetrics: fetchMetrics,
  fetchNotificationHistory: fetchNotificationHistory,

  // Configuration
  apiBaseUrl: API_BASE_URL,
  useMockData: USE_MOCK_DATA,
};
