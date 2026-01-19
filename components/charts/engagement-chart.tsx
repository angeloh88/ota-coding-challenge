'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDailyMetrics } from '@/lib/hooks/use-daily-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber, formatDate } from '@/lib/utils/format';

/**
 * Formats a date string for display on the chart X-axis
 * Shows short format like "Jan 15" or "1/15"
 */
function formatChartDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }

  // Format as "MMM DD" (e.g., "Jan 15")
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Custom tooltip component for the engagement chart
 */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-3">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
          {formatDate(label)}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              Engagement:
            </span>{' '}
            {formatNumber(data.engagement)}
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-medium text-zinc-900 dark:text-zinc-50">
              Reach:
            </span>{' '}
            {formatNumber(data.reach)}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

/**
 * Engagement Chart component that displays daily engagement metrics
 * Shows a line chart of engagement over the last 30 days
 */
export function EngagementChart() {
  const { data, isLoading, isError } = useDailyMetrics(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Engagement Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 dark:text-red-400">
            Failed to load engagement data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Over Time</CardTitle>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Daily engagement metrics for the last 30 days
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-zinc-200 dark:stroke-zinc-800"
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatChartDate}
                className="text-xs text-zinc-600 dark:text-zinc-400"
                stroke="currentColor"
              />
              <YAxis
                className="text-xs text-zinc-600 dark:text-zinc-400"
                stroke="currentColor"
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
