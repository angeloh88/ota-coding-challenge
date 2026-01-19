'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface DailyMetricDataPoint {
  date: string;
  engagement: number;
  reach: number;
}

export default function TestDailyMetricsAPIPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DailyMetricDataPoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [days, setDays] = useState<string>('30');

  const testAuthenticated = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setStatus(null);

    try {
      const daysNum = parseInt(days, 10) || 30;
      const url = `/api/metrics/daily${daysNum !== 30 ? `?days=${daysNum}` : ''}`;
      const response = await fetch(url);
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
      const response = await fetch('/api/metrics/daily', {
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

  const testInvalidDays = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setStatus(null);

    try {
      const response = await fetch('/api/metrics/daily?days=invalid');
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
          Daily Metrics API (Edge Route) Test
        </h1>

        <div className="space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label
                htmlFor="days"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Number of Days (default: 30)
              </label>
              <Input
                id="days"
                type="number"
                min="1"
                max="365"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="30"
                className="max-w-32"
              />
            </div>
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
              {loading ? 'Testing...' : 'Test Unauthenticated'}
            </Button>
            <Button
              onClick={testInvalidDays}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Testing...' : 'Test Invalid Days'}
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
                        : status === 400
                          ? 'text-orange-600 dark:text-orange-400'
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
                      : status === 400
                        ? 'Bad Request - Invalid parameter (expected for invalid days test)'
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
                  Daily Metrics Data ({data.length} days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      Summary:
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Total Days
                        </p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {data.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Total Engagement
                        </p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {data
                            .reduce((sum, d) => sum + d.engagement, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Total Reach
                        </p>
                        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {data
                            .reduce((sum, d) => sum + d.reach, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                      Sample Data (first 10 days):
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {data.slice(0, 10).map((metric) => (
                        <div
                          key={metric.date}
                          className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">
                              {new Date(metric.date).toLocaleDateString()}
                            </span>
                            <div className="flex gap-4 text-zinc-600 dark:text-zinc-400">
                              <span>Engagement: {metric.engagement.toLocaleString()}</span>
                              <span>Reach: {metric.reach.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                      Raw JSON (first 5 entries):
                    </p>
                    <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 p-3 rounded overflow-auto max-h-48">
                      {JSON.stringify(data.slice(0, 5), null, 2)}
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
              <strong>Authenticated Test:</strong> Click &ldqou;Test Authenticated Request&rdquo; while logged
              in. Should return 200 with daily metrics data array.
            </p>
            <p>
              <strong>Unauthenticated Test:</strong> Click &ldqou;Test Unauthenticated Request&rdquo; (or log
              out first). Should return 401 Unauthorized.
            </p>
            <p>
              <strong>Invalid Days Test:</strong> Click &ldqou;Test Invalid Days&rdquo; to verify validation.
              Should return 400 Bad Request.
            </p>
            <p>
              <strong>Days Parameter:</strong> Enter a number (1-365) to test custom day ranges.
              Default is 30 days.
            </p>
            <p>
              <strong>Edge Runtime:</strong> This route uses Edge Runtime for better performance.
              Verify it works correctly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
