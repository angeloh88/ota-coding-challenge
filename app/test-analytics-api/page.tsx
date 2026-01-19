'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsData {
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

export default function TestAnalyticsAPIPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  const testAuthenticated = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setStatus(null);

    try {
      const response = await fetch('/api/analytics/summary');
      setStatus(response.status);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || `HTTP ${response.status}`);
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testUnauthenticated = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setStatus(null);

    try {
      // Create a new request without cookies to simulate unauthenticated request
      const response = await fetch('/api/analytics/summary', {
        credentials: 'omit',
      });
      setStatus(response.status);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || `HTTP ${response.status}`);
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Analytics Summary API Test
        </h1>

        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={testAuthenticated}
              disabled={loading}
              variant="default"
            >
              {loading ? 'Testing...' : 'Test Authenticated Request'}
            </Button>
            <Button
              onClick={testUnauthenticated}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Unauthenticated Request'}
            </Button>
          </div>

          {status !== null && (
            <Card>
              <CardHeader>
                <CardTitle>HTTP Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    status === 200
                      ? 'text-green-600 dark:text-green-400'
                      : status === 401
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {status}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  {status === 200
                    ? 'Success - Request authenticated and processed'
                    : status === 401
                      ? 'Unauthorized - Authentication required (expected for unauthenticated test)'
                      : 'Error - Request failed'}
                </p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-500">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {data && (
            <Card className="border-green-500">
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">
                  Analytics Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Total Engagement:
                    </p>
                    <p className="text-lg text-zinc-900 dark:text-zinc-100">
                      {data.totalEngagement.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Average Engagement Rate:
                    </p>
                    <p className="text-lg text-zinc-900 dark:text-zinc-100">
                      {(data.averageEngagementRate * 100).toFixed(2)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Top Performing Post:
                    </p>
                    {data.topPerformingPost ? (
                      <div className="mt-2 p-3 bg-zinc-100 dark:bg-zinc-800 rounded">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Platform: {data.topPerformingPost.platform}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Engagement: {data.topPerformingPost.engagement.toLocaleString()}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Posted: {new Date(data.topPerformingPost.postedAt).toLocaleDateString()}
                        </p>
                        {data.topPerformingPost.caption && (
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-2">
                            {data.topPerformingPost.caption.substring(0, 100)}
                            {data.topPerformingPost.caption.length > 100 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-zinc-600 dark:text-zinc-400">No posts yet</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Trend:
                    </p>
                    <p className="text-lg text-zinc-900 dark:text-zinc-100">
                      {data.trend.direction === 'up' && '↑'}
                      {data.trend.direction === 'down' && '↓'}
                      {data.trend.direction === 'neutral' && '→'}{' '}
                      {data.trend.percentage.toFixed(2)}%
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                      Raw JSON:
                    </p>
                    <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-3 rounded overflow-auto">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              <strong>Authenticated Test:</strong> Click &ldquo;Test Authenticated Request&rdquo; while logged
              in. Should return 200 with analytics data.
            </p>
            <p>
              <strong>Unauthenticated Test:</strong> Click &ldquo;Test Unauthenticated Request&rdquo; (or log
              out first). Should return 401 Unauthorized.
            </p>
            <p>
              <strong>Verification:</strong> Compare the calculations with the client-side hook in
              the test-analytics page to ensure they match.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
