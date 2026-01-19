'use client';

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import {
  setSelectedPlatform,
  setChartViewType,
  openModal,
  closeModal,
  type Platform,
  type ChartViewType,
} from '@/lib/store/slices/ui-slice';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/hooks/query-keys';

// Simple test query function
async function testQuery() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
  return { message: 'Query is working!', timestamp: new Date().toISOString() };
}

export default function TestStorePage() {
  const dispatch = useAppDispatch();
  const { selectedPlatform, chartViewType, isModalOpen, selectedPostId } =
    useAppSelector((state) => state.ui);

  // Test TanStack Query
  const { data: queryData, isLoading, isError } = useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: testQuery,
  });

  const platforms: Platform[] = ['all', 'instagram', 'tiktok'];
  const chartTypes: ChartViewType[] = ['line', 'area'];

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Redux & Query Provider Test Page
        </h1>

        {/* Redux Store Test */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Redux Store Test
          </h2>

          <div className="space-y-4">
            {/* Selected Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selected Platform: <span className="font-bold">{selectedPlatform}</span>
              </label>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => dispatch(setSelectedPlatform(platform))}
                    className={`px-4 py-2 rounded ${
                      selectedPlatform === platform
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart View Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chart View Type: <span className="font-bold">{chartViewType}</span>
              </label>
              <div className="flex gap-2">
                {chartTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => dispatch(setChartViewType(type))}
                    className={`px-4 py-2 rounded ${
                      chartViewType === type
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modal State: <span className="font-bold">{isModalOpen ? 'Open' : 'Closed'}</span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(openModal('test-post-123'))}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                  Open Modal (ID: test-post-123)
                </button>
                <button
                  onClick={() => dispatch(closeModal())}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Close Modal
                </button>
              </div>
              {selectedPostId && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected Post ID: {selectedPostId}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TanStack Query Test */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            TanStack Query Test
          </h2>
          <div className="space-y-2">
            {isLoading && (
              <p className="text-blue-600 dark:text-blue-400">Loading query data...</p>
            )}
            {isError && (
              <p className="text-red-600 dark:text-red-400">Error loading query data</p>
            )}
            {queryData && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  {queryData.message}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Timestamp: {queryData.timestamp}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Current State Display */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Current Redux State
          </h2>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(
              {
                selectedPlatform,
                chartViewType,
                isModalOpen,
                selectedPostId,
              },
              null,
              2
            )}
          </pre>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-300">
            How to Test:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
            <li>Click platform buttons - state should update immediately</li>
            <li>Click chart type buttons - state should update immediately</li>
            <li>Click &quot;Open Modal&quot; - modal state should change to true</li>
            <li>Click &quot;Close Modal&quot; - modal state should change to false</li>
            <li>Check the query section - should show loading then data</li>
            <li>Watch the &quot;Current Redux State&quot; section update in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
