'use client';

import { useDailyMetrics } from '@/lib/hooks/use-daily-metrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TestDailyMetricsPage() {
  const { data, isLoading, isError, error } = useDailyMetrics(30);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
          Daily Metrics Hook Test
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Check the browser console for detailed metrics data. Verify the data
          structure is correct for Recharts.
        </p>

        {isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>Loading Daily Metrics...</CardTitle>
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
                Error Loading Daily Metrics
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
                <CardTitle>Data Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    Total Data Points: {data.length}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Date Range: {data[0]?.date} to{' '}
                    {data[data.length - 1]?.date}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Engagement:{' '}
                    {data.reduce((sum, point) => sum + point.engagement, 0)}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total Reach:{' '}
                    {data.reduce((sum, point) => sum + point.reach, 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Structure Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ Data is an array: {Array.isArray(data) ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ Each item has &quot;date&quot; property:{' '}
                    {data.every((item) => 'date' in item) ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ Each item has &quot;engagement&quot; property:{' '}
                    {data.every((item) => 'engagement' in item) ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ Each item has &quot;reach&quot; property:{' '}
                    {data.every((item) => 'reach' in item) ? 'Yes' : 'No'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ All dates are strings:{' '}
                    {data.every((item) => typeof item.date === 'string')
                      ? 'Yes'
                      : 'No'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ All engagement values are numbers:{' '}
                    {data.every((item) => typeof item.engagement === 'number')
                      ? 'Yes'
                      : 'No'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ All reach values are numbers:{' '}
                    {data.every((item) => typeof item.reach === 'number')
                      ? 'Yes'
                      : 'No'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ No missing dates (gaps filled):{' '}
                    {data.length === 30 ? 'Yes (30 days)' : `No (${data.length} days)`}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sample Data (First 5 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.slice(0, 5).map((point, index) => (
                    <div
                      key={index}
                      className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-sm"
                    >
                      <p>
                        <strong>Date:</strong> {point.date}
                      </p>
                      <p>
                        <strong>Engagement:</strong> {point.engagement}
                      </p>
                      <p>
                        <strong>Reach:</strong> {point.reach}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw Data (JSON - First 10 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-zinc-100 dark:bg-zinc-900 p-4 rounded overflow-auto">
                  {JSON.stringify(data.slice(0, 10), null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recharts Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    This data structure is compatible with Recharts:
                  </p>
                  <pre className="text-xs bg-zinc-100 dark:bg-zinc-900 p-4 rounded overflow-auto">
{`<LineChart data={data}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
</LineChart>`}
                  </pre>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    ✓ XAxis can use <code>dataKey=&quot;date&quot;</code>
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ Line can use <code>dataKey=&quot;engagement&quot;</code>
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    ✓ All dates are filled (no gaps)
                  </p>
                </div>
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
              <li>
                Open your browser&apos;s Developer Console (F12 or
                Cmd+Option+I)
              </li>
              <li>
                Look for the &quot;Fetched daily metrics:&quot; log message
              </li>
              <li>
                Verify the data structure matches Recharts requirements
              </li>
              <li>
                Check that all 30 days are present (no missing dates)
              </li>
              <li>
                Verify missing dates are filled with 0 values
              </li>
              <li>
                Confirm data format: array of objects with date, engagement,
                and reach properties
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
