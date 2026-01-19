'use client';

import { useAnalytics } from '@/lib/hooks/use-analytics';
import { SummaryCard } from './summary-card';
import { Heart, TrendingUp, Award, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Summary Cards component that displays analytics metrics
 * Shows 4 cards: Total Engagement, Average Engagement Rate, Top Performing Post, and Trend
 */
export function SummaryCards() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-red-500">
        <CardContent className="pt-6">
          <p className="text-red-600 dark:text-red-400">
            Failed to load analytics data
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format top performing post value
  const topPostValue = data.topPerformingPost
    ? `${data.topPerformingPost.engagement.toLocaleString()} interactions`
    : 'No posts yet';

  // Format average engagement rate as percentage
  const avgEngagementRateValue = `${data.averageEngagementRate.toFixed(2)}%`;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Engagement"
        value={data.totalEngagement}
        icon={Heart}
        description="Sum of all interactions"
        trend={data.trend}
      />
      <SummaryCard
        title="Average Engagement Rate"
        value={avgEngagementRateValue}
        icon={TrendingUp}
        description="Across all posts"
      />
      <SummaryCard
        title="Top Performing Post"
        value={topPostValue}
        icon={Award}
        description={
          data.topPerformingPost
            ? `${data.topPerformingPost.platform} • ${new Date(
                data.topPerformingPost.postedAt,
              ).toLocaleDateString()}`
            : undefined
        }
      />
      <SummaryCard
        title="Engagement Trend"
        value={`${data.trend.percentage.toFixed(1)}%`}
        icon={Activity}
        description="Last 30 days vs previous"
        trend={data.trend}
      />
    </div>
  );
}
