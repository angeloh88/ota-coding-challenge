'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Minus, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumberLocale, formatPercentage } from '@/lib/utils/format';

export interface SummaryCardTrend {
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
}

export interface SummaryCardProps {
  title: string;
  value: string | number;
  trend?: SummaryCardTrend;
  icon?: LucideIcon;
  description?: string;
}

/**
 * Summary Card component for displaying analytics metrics
 * Displays a title, value, optional trend indicator, and optional icon
 */
export function SummaryCard({
  title,
  value,
  trend,
  icon: Icon,
  description,
}: SummaryCardProps) {
  const formattedValue =
    typeof value === 'number' ? formatNumberLocale(value) : value;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {formattedValue}
        </div>
        {description && (
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 mt-2 text-xs',
              trend.direction === 'up' &&
                'text-green-600 dark:text-green-400',
              trend.direction === 'down' &&
                'text-red-600 dark:text-red-400',
              trend.direction === 'neutral' &&
                'text-zinc-600 dark:text-zinc-400',
            )}
          >
            {trend.direction === 'up' && (
              <ArrowUp className="h-3 w-3" />
            )}
            {trend.direction === 'down' && (
              <ArrowDown className="h-3 w-3" />
            )}
            {trend.direction === 'neutral' && (
              <Minus className="h-3 w-3" />
            )}
            <span>
              {formatPercentage(trend.percentage)}{' '}
              {trend.direction === 'up' && 'increase'}
              {trend.direction === 'down' && 'decrease'}
              {trend.direction === 'neutral' && 'no change'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
