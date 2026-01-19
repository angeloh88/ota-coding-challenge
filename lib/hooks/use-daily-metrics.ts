'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
import { Database } from '@/lib/database.types';

type DailyMetric = Database['public']['Tables']['daily_metrics']['Row'];

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
 * Hook to fetch daily metrics for the last 30 days
 * Automatically fills in missing dates with 0 values
 * @param days - Number of days to fetch (default: 30)
 * @returns Query result with daily metrics data, loading, and error states
 */
export function useDailyMetrics(days: number = 30) {
  const supabase = createClient();

  return useQuery({
    queryKey: queryKeys.metrics.dailyList({ days }),
    queryFn: async (): Promise<DailyMetricDataPoint[]> => {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(`Failed to get user: ${userError.message}`);
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate date range (last N days)
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // End of today
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0); // Start of day

      // Format dates for query (YYYY-MM-DD)
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      // Fetch metrics from database
      const { data: metrics, error } = await supabase
        .from('daily_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch daily metrics: ${error.message}`);
      }

      // Create a map of existing metrics by date for quick lookup
      const metricsMap = new Map<string, DailyMetric>();
      if (metrics) {
        for (const metric of metrics) {
          metricsMap.set(metric.date, metric);
        }
      }

      // Generate all dates in the range and fill gaps
      const result: DailyMetricDataPoint[] = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const existingMetric = metricsMap.get(dateStr);

        result.push({
          date: dateStr,
          engagement: existingMetric?.engagement ?? 0,
          reach: existingMetric?.reach ?? 0,
        });

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Temporary console.log for testing
      console.log('Fetched daily metrics:', {
        days,
        dateRange: { start: startDateStr, end: endDateStr },
        metricsCount: metrics?.length ?? 0,
        resultCount: result.length,
        sampleData: result.slice(0, 5),
      });

      return result;
    },
  });
}
