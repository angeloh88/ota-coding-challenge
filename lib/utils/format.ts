/**
 * Utility functions for formatting numbers, percentages, and dates
 */

/**
 * Formats a number with K (thousands) and M (millions) abbreviations
 * @param num - The number to format
 * @param options - Optional formatting options
 * @returns Formatted string (e.g., "1.2K", "1.5M", "999")
 */
export function formatNumber(
  num: number | null | undefined,
  options?: {
    decimals?: number;
    fallback?: string;
  },
): string {
  if (num === null || num === undefined) {
    return options?.fallback ?? '—';
  }

  const decimals = options?.decimals ?? 1;

  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals) + 'M';
  }

  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals) + 'K';
  }

  return num.toString();
}

/**
 * Formats a number with full locale string (includes thousands separators)
 * Useful for displaying exact numbers without abbreviations
 * @param num - The number to format
 * @param options - Optional formatting options
 * @returns Formatted string with locale formatting (e.g., "1,234,567")
 */
export function formatNumberLocale(
  num: number | null | undefined,
  options?: {
    fallback?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  if (num === null || num === undefined) {
    return options?.fallback ?? '—';
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  });
}

/**
 * Formats a percentage value
 * @param rate - The percentage value (e.g., 5.5 for 5.5%)
 * @param options - Optional formatting options
 * @returns Formatted string (e.g., "5.5%")
 */
export function formatPercentage(
  rate: number | null | undefined,
  options?: {
    decimals?: number;
    fallback?: string;
  },
): string {
  if (rate === null || rate === undefined) {
    return options?.fallback ?? '—';
  }

  const decimals = options?.decimals ?? 1;
  return rate.toFixed(decimals) + '%';
}

/**
 * Formats a date string consistently across the application
 * @param dateString - ISO date string or Date object
 * @param options - Optional formatting options
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(
  dateString: string | Date | null | undefined,
  options?: {
    fallback?: string;
    includeTime?: boolean;
  },
): string {
  if (!dateString) {
    return options?.fallback ?? '—';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return options?.fallback ?? '—';
  }

  if (options?.includeTime) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats a date as a relative time (e.g., "2 days ago", "in 3 hours")
 * @param dateString - ISO date string or Date object
 * @param options - Optional formatting options
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  dateString: string | Date | null | undefined,
  options?: {
    fallback?: string;
  },
): string {
  if (!dateString) {
    return options?.fallback ?? '—';
  }

  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;

  if (isNaN(date.getTime())) {
    return options?.fallback ?? '—';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const absDiff = Math.abs(diffInSeconds);

  if (absDiff < 60) {
    return diffInSeconds >= 0 ? 'just now' : 'in a moment';
  }

  if (absDiff < 3600) {
    const minutes = Math.floor(absDiff / 60);
    return diffInSeconds >= 0
      ? `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
      : `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }

  if (absDiff < 86400) {
    const hours = Math.floor(absDiff / 3600);
    return diffInSeconds >= 0
      ? `${hours} hour${hours !== 1 ? 's' : ''} ago`
      : `in ${hours} hour${hours !== 1 ? 's' : ''}`;
  }

  if (absDiff < 604800) {
    const days = Math.floor(absDiff / 86400);
    return diffInSeconds >= 0
      ? `${days} day${days !== 1 ? 's' : ''} ago`
      : `in ${days} day${days !== 1 ? 's' : ''}`;
  }

  // For longer periods, use the standard date format
  return formatDate(date);
}
