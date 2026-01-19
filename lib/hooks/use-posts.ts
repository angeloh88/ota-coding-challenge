'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
import { Database } from '@/lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'];

interface UsePostsOptions {
  platform?: string;
}

/**
 * Hook to fetch posts for the current authenticated user
 * @param options - Optional filters (e.g., platform)
 * @returns Query result with posts data, loading, and error states
 */
export function usePosts(options?: UsePostsOptions) {
  const supabase = createClient();

  return useQuery({
    queryKey: queryKeys.posts.list(options),
    queryFn: async () => {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw new Error(`Failed to get user: ${userError.message}`);
      }

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Build query
      let query = supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('posted_at', { ascending: false });

      // Apply platform filter if provided
      if (options?.platform && options.platform !== 'all') {
        query = query.eq('platform', options.platform);
      }

      // Execute query
      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch posts: ${error.message}`);
      }

      // Temporary console.log for testing
      console.log('Fetched posts:', {
        count: data?.length ?? 0,
        userId: user.id,
        platform: options?.platform,
        posts: data,
      });

      return data as Post[];
    },
  });
}
