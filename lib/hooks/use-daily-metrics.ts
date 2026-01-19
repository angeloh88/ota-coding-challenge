'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

/**
 * Daily metric data point for chart consumption
 * Format compatible with Recharts
 */
export interface DailyMetricDataPoint {
  date: string; // ISO date string (YYYY-MM-DD)
  engagement: number;
  reach: number;
}

/**
 * Hook to fetch daily metrics for the last N days from the API
 * Automatically fills in missing dates with 0 values (handled server-side)
 * @param days - Number of days to fetch (default: 30)
 * @returns Query result with daily metrics data, loading, and error states
 */
export function useDailyMetrics(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.metrics.dailyList({ days }),
    queryFn: async (): Promise<DailyMetricDataPoint[]> => {
      const url = days !== 30 ? `/api/metrics/daily?days=${days}` : '/api/metrics/daily';
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch daily metrics: ${response.statusText}`
        );
      }

      return response.json();
    },
  });
}
