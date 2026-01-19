'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

// Static data for initial layout testing
const staticPosts = [
  {
    id: '1',
    thumbnail_url: 'https://via.placeholder.com/100',
    caption: 'Beautiful sunset at the beach 🌅 #sunset #beach',
    platform: 'instagram',
    likes: 1250,
    comments: 45,
    shares: 12,
    engagement_rate: 4.2,
    posted_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    thumbnail_url: 'https://via.placeholder.com/100',
    caption: 'New product launch! Check it out 👀',
    platform: 'tiktok',
    likes: 3200,
    comments: 180,
    shares: 95,
    engagement_rate: 6.8,
    posted_at: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    thumbnail_url: 'https://via.placeholder.com/100',
    caption: 'Behind the scenes of our latest shoot 📸',
    platform: 'instagram',
    likes: 890,
    comments: 23,
    shares: 8,
    engagement_rate: 3.1,
    posted_at: '2024-01-13T09:15:00Z',
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

function formatEngagementRate(rate: number): string {
  return rate.toFixed(1) + '%';
}

function formatPlatform(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function PostsTable() {
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
          {staticPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={post.thumbnail_url}
                    alt="Post thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-md">
                  <p className="text-sm text-zinc-900 dark:text-zinc-50 line-clamp-2">
                    {post.caption}
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
        </TableBody>
      </Table>
    </div>
  );
}
