'use client';

import { useAnalytics } from '@/lib/hooks/use-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TestAnalyticsPage() {
  const { data, isLoading, isError, error } = useAnalytics();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
          Analytics Hook Test
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Check the browser console for detailed analytics calculations.
        </p>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Loading Analytics...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card className="border-red-500">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">
                Error Loading Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 dark:text-red-400">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data.totalEngagement.toLocaleString()}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Sum of all likes, comments, and shares
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {data.averageEngagementRate.toFixed(2)}%
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Average engagement rate across all posts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Post</CardTitle>
              </CardHeader>
              <CardContent>
                {data.topPerformingPost ? (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">
                      Engagement: {data.topPerformingPost.engagement.toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Platform: {data.topPerformingPost.platform}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Posted: {new Date(data.topPerformingPost.postedAt).toLocaleDateString()}
                    </p>
                    {data.topPerformingPost.caption && (
                      <p className="text-sm mt-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded">
                        {data.topPerformingPost.caption.length > 100
                          ? `${data.topPerformingPost.caption.substring(0, 100)}...`
                          : data.topPerformingPost.caption}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-zinc-600 dark:text-zinc-400">No posts found</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend (Last 30 Days vs Previous 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    {data.trend.direction === 'up' && '↑'}
                    {data.trend.direction === 'down' && '↓'}
                    {data.trend.direction === 'neutral' && '→'}{' '}
                    {data.trend.percentage.toFixed(2)}%
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Direction: {data.trend.direction}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw Data (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-zinc-100 dark:bg-zinc-900 p-4 rounded overflow-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-300">
              Testing Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
              <li>Open your browser&apos;s Developer Console (F12 or Cmd+Option+I)</li>
              <li>Look for the &quot;Analytics calculated:&quot; log message</li>
              <li>Verify the calculations match what&apos;s displayed above</li>
              <li>Check that all metrics are calculated correctly</li>
              <li>Verify the trend calculation compares the correct time periods</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
