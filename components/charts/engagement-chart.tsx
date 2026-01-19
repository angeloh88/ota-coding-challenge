'use client';

import {
  LineChart,
  AreaChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDailyMetrics } from '@/lib/hooks/use-daily-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatNumber, formatDate } from '@/lib/utils/format';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setChartViewType, type ChartViewType } from '@/lib/store/slices/ui-slice';

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
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      date: string;
      engagement: number;
      reach: number;
    };
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
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
 * Shows a line or area chart of engagement over the last 30 days
 * Includes toggle to switch between line and area views
 */
export function EngagementChart() {
  const { data, isLoading, isError } = useDailyMetrics(30);
  const chartViewType = useAppSelector((state) => state.ui.chartViewType);
  const dispatch = useAppDispatch();

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

  const handleViewTypeChange = (type: ChartViewType) => {
    dispatch(setChartViewType(type));
  };

  // Shared chart props
  const chartProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  // Shared axis and grid components
  const sharedComponents = (
    <>
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
    </>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Engagement Over Time</CardTitle>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Daily engagement metrics for the last 30 days
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartViewType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewTypeChange('line')}
              className="min-w-[80px]"
            >
              Line
            </Button>
            <Button
              variant={chartViewType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewTypeChange('area')}
              className="min-w-[80px]"
            >
              Area
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewType === 'line' ? (
              <LineChart {...chartProps}>
                {sharedComponents}
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <AreaChart {...chartProps}>
                {sharedComponents}
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
