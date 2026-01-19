'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { queryKeys } from './query-keys';
import { Database } from '@/lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'];

/**
 * Hook to fetch a single post by ID for the current authenticated user
 * @param postId - The ID of the post to fetch
 * @returns Query result with post data, loading, and error states
 */
export function usePostDetail(postId: string | null) {
  const supabase = createClient();

  return useQuery({
    queryKey: queryKeys.posts.detail(postId || ''),
    queryFn: async () => {
      if (!postId) {
        throw new Error('Post ID is required');
      }

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

      // Fetch the post
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch post: ${error.message}`);
      }

      return data as Post;
    },
    enabled: !!postId, // Only run query if postId is provided
  });
}
