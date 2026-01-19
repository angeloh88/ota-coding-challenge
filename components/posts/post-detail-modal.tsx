'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { closeModal } from '@/lib/store/slices/ui-slice';
import { usePostDetail } from '@/lib/hooks/use-post-detail';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { ImageIcon, ExternalLink } from 'lucide-react';
import { formatNumber, formatPercentage, formatDate } from '@/lib/utils/format';
import { useState } from 'react';

function formatPlatform(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

function ThumbnailImage({ thumbnailUrl }: { thumbnailUrl: string | null }) {
  const [imageError, setImageError] = useState(false);

  if (thumbnailUrl && !imageError) {
    return (
      <div className="relative w-full h-64 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <Image
          src={thumbnailUrl}
          alt="Post thumbnail"
          fill
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-cover"
          onError={() => setImageError(true)}
          unoptimized={thumbnailUrl.includes('via.placeholder.com')}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
      <ImageIcon className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
    </div>
  );
}

export function PostDetailModal() {
  const isModalOpen = useAppSelector((state) => state.ui.isModalOpen);
  const selectedPostId = useAppSelector((state) => state.ui.selectedPostId);
  const dispatch = useAppDispatch();

  const { data: post, isLoading, isError, error } = usePostDetail(selectedPostId);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      dispatch(closeModal());
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Details</DialogTitle>
          <DialogDescription>
            View detailed information about this post including metrics, caption, and platform details.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="w-full h-64 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <div className="text-red-600 dark:text-red-400">
              <p className="font-semibold">Error loading post</p>
              <p className="text-sm mt-1 text-red-500 dark:text-red-300">
                {error?.message || 'Failed to fetch post details'}
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && post && (
          <div className="space-y-6">
            {/* Thumbnail */}
            <ThumbnailImage thumbnailUrl={post.thumbnail_url} />

            {/* Caption */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Caption
              </h3>
              <p className="text-sm text-zinc-900 dark:text-zinc-50 whitespace-pre-wrap">
                {post.caption || 'No caption'}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Likes
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatNumber(post.likes)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Comments
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatNumber(post.comments)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Shares
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatNumber(post.shares)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                  Engagement Rate
                </div>
                <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {formatPercentage(post.engagement_rate)}
                </div>
              </div>
              {post.impressions !== null && (
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Impressions
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatNumber(post.impressions)}
                  </div>
                </div>
              )}
              {post.reach !== null && (
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Reach
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatNumber(post.reach)}
                  </div>
                </div>
              )}
              {post.saves !== null && (
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                    Saves
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {formatNumber(post.saves)}
                  </div>
                </div>
              )}
            </div>

            {/* Post Info */}
            <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Platform
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {formatPlatform(post.platform)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Posted Date
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {formatDate(post.posted_at)}
                </span>
              </div>
              {post.media_type && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Media Type
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {post.media_type}
                  </span>
                </div>
              )}
            </div>

            {/* View on Platform Link */}
            {post.permalink && (
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  View on Platform
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
