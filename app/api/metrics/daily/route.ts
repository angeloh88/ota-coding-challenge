import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

export const runtime = 'edge';

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
 * GET /api/metrics/daily
 * Returns daily metrics for the last N days (default: 30)
 * Query parameters:
 *   - days: number of days to fetch (default: 30)
 * @returns JSON response with array of daily metric data points
 */
export async function GET(request: NextRequest) {
  try {
    // Create server-side Supabase client
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        { error: `Failed to get user: ${userError.message}` },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get days parameter from query string (default: 30)
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    const days = daysParam ? parseInt(daysParam, 10) : 30;

    // Validate days parameter
    if (isNaN(days) || days < 1 || days > 365) {
      return NextResponse.json(
        { error: 'Days parameter must be between 1 and 365' },
        { status: 400 }
      );
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
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDateStr)
      .lte('date', endDateStr)
      .order('date', { ascending: true });

    if (metricsError) {
      return NextResponse.json(
        { error: `Failed to fetch daily metrics: ${metricsError.message}` },
        { status: 500 }
      );
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in daily metrics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
