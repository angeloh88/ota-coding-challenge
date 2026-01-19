import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';
import { cookies } from 'next/headers';

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
 * Validates authentication token presence in cookies (edge-compatible)
 */
async function validateAuthToken(): Promise<{ isValid: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const authCookies = cookieStore.getAll().filter((cookie) =>
      cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
    );

    if (authCookies.length === 0) {
      return {
        isValid: false,
        error: 'Authentication token not found. Please log in to access this resource.',
      };
    }

    // Check if token exists and has a value
    const hasValidToken = authCookies.some(
      (cookie) => cookie.value && cookie.value.length > 0
    );

    if (!hasValidToken) {
      return {
        isValid: false,
        error: 'Invalid authentication token. Token is empty or malformed.',
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: 'Failed to validate authentication token.',
    };
  }
}

/**
 * Validates and parses the days query parameter
 */
function validateDaysParameter(daysParam: string | null): {
  isValid: boolean;
  days?: number;
  error?: string;
} {
  if (!daysParam) {
    return { isValid: true, days: 30 }; // Default value
  }

  // Trim whitespace
  const trimmed = daysParam.trim();

  // Check if it contains only digits (reject decimals and negative signs)
  if (!/^\d+$/.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid days parameter. Must be a positive integer (no decimals or negative numbers).',
    };
  }

  // Parse as integer
  const days = parseInt(trimmed, 10);

  // Double-check it's a valid number (shouldn't happen after regex, but safety check)
  if (isNaN(days)) {
    return {
      isValid: false,
      error: 'Invalid days parameter. Must be a valid number.',
    };
  }

  // Check range
  if (days < 1) {
    return {
      isValid: false,
      error: 'Invalid days parameter. Must be at least 1.',
    };
  }

  if (days > 365) {
    return {
      isValid: false,
      error: 'Invalid days parameter. Must be at most 365.',
    };
  }

  return { isValid: true, days };
}

/**
 * GET /api/metrics/daily
 * Returns daily metrics for the last N days (default: 30)
 * Query parameters:
 *   - days: number of days to fetch (default: 30, min: 1, max: 365)
 * @returns JSON response with array of daily metric data points
 */
export async function GET(request: NextRequest) {
  try {
    // Validate request method
    if (request.method !== 'GET') {
      return NextResponse.json(
        {
          error: 'Method not allowed',
          code: 'METHOD_NOT_ALLOWED',
          message: 'Only GET requests are supported for this endpoint.',
        },
        { status: 405 }
      );
    }

    // Validate authentication token presence
    const tokenValidation = await validateAuthToken();
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Authentication required',
          code: 'AUTH_TOKEN_MISSING',
          message: tokenValidation.error || 'Authentication token is required.',
        },
        { status: 401 }
      );
    }

    // Create server-side Supabase client
    const supabase = await createClient();

    // Verify authentication with Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        {
          error: 'Authentication failed',
          code: 'AUTH_VALIDATION_ERROR',
          message: `Failed to validate user session: ${userError.message}`,
        },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error: 'User not authenticated',
          code: 'USER_NOT_FOUND',
          message: 'No authenticated user found. Please log in and try again.',
        },
        { status: 401 }
      );
    }

    // Validate user ID format (UUID)
    if (!user.id || typeof user.id !== 'string' || user.id.length < 10) {
      return NextResponse.json(
        {
          error: 'Invalid user ID',
          code: 'INVALID_USER_ID',
          message: 'User ID format is invalid.',
        },
        { status: 400 }
      );
    }

    // Get and validate days parameter from query string
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    const daysValidation = validateDaysParameter(daysParam);

    if (!daysValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid query parameter',
          code: 'INVALID_DAYS_PARAMETER',
          message: daysValidation.error || 'Days parameter is invalid.',
        },
        { status: 400 }
      );
    }

    const days = daysValidation.days!;

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
        {
          error: 'Database query failed',
          code: 'DATABASE_ERROR',
          message: `Failed to fetch daily metrics: ${metricsError.message}`,
        },
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
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        message: `An unexpected error occurred: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
