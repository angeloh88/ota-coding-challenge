'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { usePosts } from '@/lib/hooks/use-posts';
import { Database } from '@/lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(num: number | null): string {
  if (num === null || num === undefined) {
    return '—';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatEngagementRate(rate: number | null): string {
  if (rate === null || rate === undefined) {
    return '—';
  }
  return rate.toFixed(1) + '%';
}

function formatPlatform(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

function TableSkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="w-16 h-16 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-12 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-12 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-12 ml-auto" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  );
}

export function PostsTable() {
  const { data: posts, isLoading, isError, error } = usePosts();

  return (
    <div className="mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Thumbnail</TableHead>
            <TableHead>Caption</TableHead>
            <TableHead className="w-[100px]">Platform</TableHead>
            <TableHead className="w-[80px] text-right">Likes</TableHead>
            <TableHead className="w-[90px] text-right">Comments</TableHead>
            <TableHead className="w-[80px] text-right">Shares</TableHead>
            <TableHead className="w-[130px] text-right">Engagement Rate</TableHead>
            <TableHead className="w-[120px]">Posted Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <>
              <TableSkeletonRow />
              <TableSkeletonRow />
              <TableSkeletonRow />
            </>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="text-red-600 dark:text-red-400">
                  <p className="font-semibold">Error loading posts</p>
                  <p className="text-sm mt-1 text-red-500 dark:text-red-300">
                    {error?.message || 'Failed to fetch posts'}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && (!posts || posts.length === 0) && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="text-zinc-600 dark:text-zinc-400">
                  <p className="font-medium">No posts found</p>
                  <p className="text-sm mt-1">
                    Start by connecting your social media accounts to see your posts here.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && posts && posts.length > 0 && (
            <>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    {post.thumbnail_url ? (
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={post.thumbnail_url}
                          alt="Post thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <span className="text-xs text-zinc-400">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="text-sm text-zinc-900 dark:text-zinc-50 line-clamp-2">
                        {post.caption || 'No caption'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatPlatform(post.platform)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">
                      {formatNumber(post.likes)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">
                      {formatNumber(post.comments)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">
                      {formatNumber(post.shares)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-zinc-900 dark:text-zinc-50">
                      {formatEngagementRate(post.engagement_rate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      {formatDate(post.posted_at)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
