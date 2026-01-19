'use client';

import { usePosts } from '@/lib/hooks/use-posts';

/**
 * Temporary test component to verify usePosts hook
 * This will be removed once the posts table is implemented
 */
export function PostsTest() {
  const { data: posts, isLoading, isError, error } = usePosts();

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400 font-semibold">Error:</p>
        <p className="text-red-500 dark:text-red-300 text-sm mt-1">
          {error?.message || 'Failed to fetch posts'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
      <p className="text-green-600 dark:text-green-400 font-semibold">
        Posts Hook Test - Success!
      </p>
      <p className="text-green-500 dark:text-green-300 text-sm mt-1">
        Fetched {posts?.length ?? 0} post(s) for current user
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
        Check browser console for detailed post data
      </p>
    </div>
  );
}
