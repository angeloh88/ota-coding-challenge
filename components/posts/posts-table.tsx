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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { usePosts } from '@/lib/hooks/use-posts';
import { Database } from '@/lib/database.types';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type Column,
  flexRender,
} from '@tanstack/react-table';
import React, { Fragment, useState } from 'react';
import { ArrowUp, ArrowDown, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSelectedPlatform, openModal } from '@/lib/store/slices/ui-slice';
import type { Platform } from '@/lib/store/slices/ui-slice';
import {
  formatNumber,
  formatPercentage,
  formatDate,
} from '@/lib/utils/format';
import { PostDetailModal } from './post-detail-modal';

type Post = Database['public']['Tables']['posts']['Row'];

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

function SortableHeader({
  column,
  children,
  className,
}: {
  column: Column<Post, unknown>;
  children: React.ReactNode;
  className?: string;
}) {
  const canSort = column.getCanSort();
  const sortDirection = column.getIsSorted();

  return (
    <TableHead
      className={cn(className, canSort && 'cursor-pointer select-none hover:bg-muted/50')}
      onClick={canSort ? column.getToggleSortingHandler() : undefined}
    >
      <div className="flex items-center gap-2">
        {children}
        {canSort && (
          <span className="flex flex-col">
            <ArrowUp
              className={cn(
                'h-3 w-3 transition-opacity',
                sortDirection === 'asc' ? 'opacity-100' : 'opacity-30'
              )}
            />
            <ArrowDown
              className={cn(
                'h-3 w-3 -mt-1 transition-opacity',
                sortDirection === 'desc' ? 'opacity-100' : 'opacity-30'
              )}
            />
          </span>
        )}
      </div>
    </TableHead>
  );
}

function ThumbnailCell({ thumbnailUrl }: { thumbnailUrl: string | null }) {
  const [imageError, setImageError] = useState(false);

  if (thumbnailUrl && !imageError) {
    return (
      <TableCell>
        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <Image
            src={thumbnailUrl}
            alt="Post thumbnail"
            fill
            sizes="64px"
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized={thumbnailUrl.includes('via.placeholder.com')}
          />
        </div>
      </TableCell>
    );
  }

  return (
    <TableCell>
      <div className="w-16 h-16 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
      </div>
    </TableCell>
  );
}

export function PostsTable() {
  const selectedPlatform = useAppSelector((state) => state.ui.selectedPlatform);
  const dispatch = useAppDispatch();
  const { data: posts, isLoading, isError, error } = usePosts({
    platform: selectedPlatform,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const handlePlatformChange = (value: string) => {
    dispatch(setSelectedPlatform(value as Platform));
  };

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: 'thumbnail_url',
      header: 'Thumbnail',
      enableSorting: false,
      cell: ({ row }) => (
        <ThumbnailCell thumbnailUrl={row.original.thumbnail_url} />
      ),
    },
    {
      accessorKey: 'caption',
      header: 'Caption',
      enableSorting: false,
      cell: ({ row }) => (
        <TableCell>
          <div className="max-w-md">
            <p className="text-sm text-zinc-900 dark:text-zinc-50 line-clamp-2">
              {row.original.caption || 'No caption'}
            </p>
          </div>
        </TableCell>
      ),
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      enableSorting: false,
      cell: ({ row }) => (
        <TableCell>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {formatPlatform(row.original.platform)}
          </span>
        </TableCell>
      ),
    },
    {
      accessorKey: 'likes',
      header: 'Likes',
      cell: ({ row }) => (
        <TableCell className="text-right">
          <span className="text-sm text-zinc-900 dark:text-zinc-50">
            {formatNumber(row.original.likes)}
          </span>
        </TableCell>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.likes ?? 0;
        const b = rowB.original.likes ?? 0;
        return a - b;
      },
    },
    {
      accessorKey: 'comments',
      header: 'Comments',
      cell: ({ row }) => (
        <TableCell className="text-right">
          <span className="text-sm text-zinc-900 dark:text-zinc-50">
            {formatNumber(row.original.comments)}
          </span>
        </TableCell>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.comments ?? 0;
        const b = rowB.original.comments ?? 0;
        return a - b;
      },
    },
    {
      accessorKey: 'shares',
      header: 'Shares',
      cell: ({ row }) => (
        <TableCell className="text-right">
          <span className="text-sm text-zinc-900 dark:text-zinc-50">
            {formatNumber(row.original.shares)}
          </span>
        </TableCell>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.shares ?? 0;
        const b = rowB.original.shares ?? 0;
        return a - b;
      },
    },
    {
      accessorKey: 'engagement_rate',
      header: 'Engagement Rate',
      cell: ({ row }) => (
        <TableCell className="text-right">
          <span className="text-sm text-zinc-900 dark:text-zinc-50">
            {formatPercentage(row.original.engagement_rate)}
          </span>
        </TableCell>
      ),
      sortingFn: (rowA, rowB) => {
        const a = rowA.original.engagement_rate ?? 0;
        const b = rowB.original.engagement_rate ?? 0;
        return a - b;
      },
    },
    {
      accessorKey: 'posted_at',
      header: 'Posted Date',
      cell: ({ row }) => (
        <TableCell>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {formatDate(row.original.posted_at)}
          </span>
        </TableCell>
      ),
      sortingFn: (rowA, rowB) => {
        const a = new Date(rowA.original.posted_at).getTime();
        const b = new Date(rowB.original.posted_at).getTime();
        return a - b;
      },
    },
  ];

  // React Compiler warning: TanStack Table's useReactTable returns functions that cannot be memoized safely.
  // This is expected behavior and safe to ignore - the component will work correctly.
  // @react-compiler-disable-next-line
  const table = useReactTable({
    data: posts || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
    },
  });

  return (
    <>
      <PostDetailModal />
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Posts</CardTitle>
            <div className="flex items-center gap-2">
              <label
                htmlFor="platform-filter"
                className="text-sm text-zinc-600 dark:text-zinc-400"
              >
                Platform:
              </label>
              <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
                <SelectTrigger id="platform-filter" className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const column = header.column;
                const canSort = column.getCanSort();

                if (canSort) {
                  return (
                    <SortableHeader
                      key={header.id}
                      column={column}
                      className={
                        header.id === 'likes' ||
                        header.id === 'comments' ||
                        header.id === 'shares' ||
                        header.id === 'engagement_rate'
                          ? 'text-right'
                          : undefined
                      }
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </SortableHeader>
                  );
                }

                return (
                  <TableHead
                    key={header.id}
                    className={
                      header.id === 'thumbnail_url'
                        ? 'w-[120px]'
                        : header.id === 'platform'
                          ? 'w-[100px]'
                          : header.id === 'likes'
                            ? 'w-[80px] text-right'
                            : header.id === 'comments'
                              ? 'w-[90px] text-right'
                              : header.id === 'shares'
                                ? 'w-[80px] text-right'
                                : header.id === 'engagement_rate'
                                  ? 'w-[130px] text-right'
                                  : header.id === 'posted_at'
                                    ? 'w-[120px]'
                                    : undefined
                    }
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading && (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableSkeletonRow key={index} />
              ))}
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
          {!isLoading &&
            !isError &&
            posts &&
            posts.length > 0 &&
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                onClick={() => dispatch(openModal(row.original.id))}
              >
                {row.getVisibleCells().map((cell) => (
                  <Fragment key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Fragment>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
          {!isLoading && !isError && posts && posts.length > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Showing{' '}
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </span>{' '}
                of{' '}
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {table.getFilteredRowModel().rows.length}
                </span>{' '}
                posts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  Page{' '}
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {table.getState().pagination.pageIndex + 1}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {table.getPageCount()}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
