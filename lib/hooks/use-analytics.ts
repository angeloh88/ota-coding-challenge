'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './query-keys';

/**
 * Analytics data returned by the hook
 */
export interface AnalyticsData {
  totalEngagement: number;
  averageEngagementRate: number;
  topPerformingPost: {
    id: string;
    caption: string | null;
    engagement: number;
    platform: string;
    postedAt: string;
  } | null;
  trend: {
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

/**
 * Hook to fetch analytics data for the current authenticated user from the API
 * @returns Query result with analytics data, loading, and error states
 */
export function useAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: async (): Promise<AnalyticsData> => {
      const response = await fetch('/api/analytics/summary');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch analytics: ${response.statusText}`
        );
      }

      return response.json();
    },
  });
}
