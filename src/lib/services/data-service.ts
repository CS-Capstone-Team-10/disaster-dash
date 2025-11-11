/**
 * CENTRALIZED DATA SERVICE
 *
 * This file contains all data fetching logic for the application.
 * Replace the mock implementations with actual API calls when ready.
 *
 * Usage in components:
 * import { useDisasterData, useStateAggregations, useTrends } from '@/lib/services/data-service';
 *
 * const { data, loading, error } = useDisasterData();
 */

import { useMemo, useState, useEffect } from 'react';
import {
  MOCK_TWEETS,
  MOCK_STATE_DATA,
  MOCK_DISASTER_TRENDS,
  MOCK_METRICS,
  MOCK_NOTIFICATION_HISTORY,
  MOCK_CLASSIFIED_TWEETS,
  subscribeToTweetStream,
  startMockTweetPump,
  type MockTweet
} from '@/lib/mock';
import { MOCK_TWEETS as MOCK_TWEETS_V2 } from '@/lib/mock/tweets';
import type { StateDisasterDatum } from '@/types/disaster';
import type { ClassifiedTweet, MetricsSnapshot } from '@/types/incidents';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK !== 'false'; // Default to true

// ============================================================================
// DATA FETCHING FUNCTIONS
// ============================================================================

/**
 * Fetch all disaster incidents/tweets
 * TODO: Replace with actual API call
 */
async function fetchDisasterIncidents(): Promise<MockTweet[]> {
  if (USE_MOCK_DATA) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_TWEETS_V2.length > 0 ? MOCK_TWEETS_V2 : MOCK_TWEETS;
  }

  // READY FOR API: Uncomment and modify when your API is ready
  // const response = await fetch(`${API_BASE_URL}/incidents`);
  // if (!response.ok) throw new Error('Failed to fetch incidents');
  // return response.json();

  return [];
}

/**
 * Fetch state-level disaster aggregations
 * TODO: Replace with actual API call
 */
async function fetchStateAggregations(): Promise<StateDisasterDatum[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_STATE_DATA;
  }

  // READY FOR API: Uncomment and modify when your API is ready
  // const response = await fetch(`${API_BASE_URL}/aggregations/states`);
  // if (!response.ok) throw new Error('Failed to fetch state aggregations');
  // return response.json();

  return [];
}

/**
 * Fetch disaster trend data for charts
 * TODO: Replace with actual API call
 */
async function fetchDisasterTrends(timeRange?: string): Promise<any[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_DISASTER_TRENDS;
  }

  // READY FOR API: Uncomment and modify when your API is ready
  // const url = timeRange
  //   ? `${API_BASE_URL}/trends?range=${timeRange}`
  //   : `${API_BASE_URL}/trends`;
  // const response = await fetch(url);
  // if (!response.ok) throw new Error('Failed to fetch trends');
  // return response.json();

  return [];
}

/**
 * Fetch metrics snapshot
 * TODO: Replace with actual API call
 */
async function fetchMetrics(): Promise<MetricsSnapshot> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_METRICS;
  }

  // READY FOR API: Uncomment and modify when your API is ready
  // const response = await fetch(`${API_BASE_URL}/metrics`);
  // if (!response.ok) throw new Error('Failed to fetch metrics');
  // return response.json();

  return {} as MetricsSnapshot;
}

/**
 * Fetch notification history
 * TODO: Replace with actual API call
 */
async function fetchNotificationHistory(): Promise<any[]> {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return MOCK_NOTIFICATION_HISTORY;
  }

  // READY FOR API: Uncomment and modify when your API is ready
  // const response = await fetch(`${API_BASE_URL}/notifications/history`);
  // if (!response.ok) throw new Error('Failed to fetch notification history');
  // return response.json();

  return [];
}

// ============================================================================
// REACT HOOKS FOR COMPONENTS
// ============================================================================

/**
 * Hook to fetch all disaster incidents
 * Use this in: Dashboard, Alerts page, Analytics page, Live Map
 */
export function useDisasterIncidents() {
  const [data, setData] = useState<MockTweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDisasterIncidents()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, refetch: () => fetchDisasterIncidents().then(setData) };
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
  const [data, setData] = useState<any[]>([]);
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
  const [data, setData] = useState<any[]>([]);
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
 * Hook for live tweet stream
 * Use this in: Dashboard (Live Feed)
 */
export function useLiveTweetStream() {
  const [tweets, setTweets] = useState<ClassifiedTweet[]>([...MOCK_CLASSIFIED_TWEETS]);

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      // READY FOR API: Set up WebSocket or SSE connection here
      // const ws = new WebSocket(`${API_BASE_URL}/stream`);
      // ws.onmessage = (event) => {
      //   const tweet = JSON.parse(event.data);
      //   setTweets(prev => [tweet, ...prev].slice(0, 50));
      // };
      // return () => ws.close();
      return;
    }

    // Mock implementation
    startMockTweetPump();
    const unsubscribe = subscribeToTweetStream((tweet) => {
      setTweets((prev) => [tweet, ...prev].slice(0, 50));
    });

    return unsubscribe;
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
  const incidents = useDisasterIncidents();
  const stateAggs = useStateAggregations();
  const trends = useDisasterTrends();
  const metrics = useMetrics();

  const loading = incidents.loading || stateAggs.loading || trends.loading || metrics.loading;
  const error = incidents.error || stateAggs.error || trends.error || metrics.error;

  return {
    incidents: incidents.data,
    stateAggregations: stateAggs.data,
    trends: trends.data,
    metrics: metrics.data,
    loading,
    error,
    refetch: () => {
      incidents.refetch();
      stateAggs.refetch();
      trends.refetch();
      metrics.refetch();
    }
  };
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
      result = result.filter(t => t.type === filters.type);
    }

    // Apply confidence filter
    if (filters.minConfidence !== undefined) {
      result = result.filter(t => t.confidence >= filters.minConfidence);
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
  fetchStateAggregations: fetchStateAggregations,
  fetchTrends: fetchDisasterTrends,
  fetchMetrics: fetchMetrics,
  fetchNotificationHistory: fetchNotificationHistory,

  // Configuration
  apiBaseUrl: API_BASE_URL,
  useMockData: USE_MOCK_DATA,
};
