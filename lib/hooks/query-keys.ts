/**
 * Query key factory pattern for TanStack Query
 * Provides type-safe query keys and easy invalidation
 */

export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    list: (filters?: { platform?: string }) =>
      [...queryKeys.posts.lists(), filters] as const,
    details: () => [...queryKeys.posts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.posts.details(), id] as const,
  },
  metrics: {
    all: ['metrics'] as const,
    daily: () => [...queryKeys.metrics.all, 'daily'] as const,
    dailyList: (filters?: { days?: number }) =>
      [...queryKeys.metrics.daily(), filters] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    summary: () => [...queryKeys.analytics.all, 'summary'] as const,
  },
} as const;
