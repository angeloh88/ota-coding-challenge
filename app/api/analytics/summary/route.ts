import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'];

/**
 * Calculate total engagement for a post (likes + comments + shares)
 */
function calculatePostEngagement(post: Post): number {
  const likes = post.likes ?? 0;
  const comments = post.comments ?? 0;
  const shares = post.shares ?? 0;
  return likes + comments + shares;
}

/**
 * Analytics data returned by the API
 */
export interface AnalyticsData {
  totalEngagement: number;
  averageEngagementRate: number;
  topPerformingPost: {
    id: string;
    caption: string | null;
    engagement: number;
    platform: string;
    postedAt: string;
  } | null;
  trend: {
    percentage: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

/**
 * GET /api/analytics/summary
 * Returns analytics summary for the authenticated user
 */
export async function GET() {
  try {
    // Create server-side Supabase client
    const supabase = await createClient();

    // Verify authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return NextResponse.json(
        { error: `Failed to get user: ${userError.message}` },
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Fetch all posts for the user
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('posted_at', { ascending: false });

    if (postsError) {
      return NextResponse.json(
        { error: `Failed to fetch posts: ${postsError.message}` },
        { status: 500 }
      );
    }

    // Handle empty posts case
    if (!posts || posts.length === 0) {
      return NextResponse.json({
        totalEngagement: 0,
        averageEngagementRate: 0,
        topPerformingPost: null,
        trend: {
          percentage: 0,
          direction: 'neutral',
        },
      });
    }

    // Calculate total engagement (sum of all interactions)
    const totalEngagement = posts.reduce((sum, post) => {
      return sum + calculatePostEngagement(post);
    }, 0);

    // Calculate average engagement rate
    const engagementRates = posts
      .map((post) => post.engagement_rate)
      .filter((rate): rate is number => rate !== null && rate !== undefined);

    const averageEngagementRate =
      engagementRates.length > 0
        ? engagementRates.reduce((sum, rate) => sum + rate, 0) /
          engagementRates.length
        : 0;

    // Find top performing post (highest engagement)
    let topPerformingPost: AnalyticsData['topPerformingPost'] = null;
    let maxEngagement = -1;

    for (const post of posts) {
      const engagement = calculatePostEngagement(post);
      if (engagement > maxEngagement) {
        maxEngagement = engagement;
        topPerformingPost = {
          id: post.id,
          caption: post.caption,
          engagement,
          platform: post.platform,
          postedAt: post.posted_at,
        };
      }
    }

    // Calculate trend: compare current period (last 30 days) vs previous period (30 days before that)
    const now = new Date();
    const currentPeriodStart = new Date(now);
    currentPeriodStart.setDate(currentPeriodStart.getDate() - 30);
    const previousPeriodStart = new Date(currentPeriodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 30);

    const currentPeriodPosts = posts.filter((post) => {
      const postDate = new Date(post.posted_at);
      return postDate >= currentPeriodStart && postDate <= now;
    });

    const previousPeriodPosts = posts.filter((post) => {
      const postDate = new Date(post.posted_at);
      return (
        postDate >= previousPeriodStart && postDate < currentPeriodStart
      );
    });

    const currentPeriodEngagement = currentPeriodPosts.reduce(
      (sum, post) => sum + calculatePostEngagement(post),
      0
    );

    const previousPeriodEngagement = previousPeriodPosts.reduce(
      (sum, post) => sum + calculatePostEngagement(post),
      0
    );

    // Calculate trend percentage
    let trendPercentage = 0;
    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral';

    if (previousPeriodEngagement > 0) {
      trendPercentage =
        ((currentPeriodEngagement - previousPeriodEngagement) /
          previousPeriodEngagement) *
        100;
      if (trendPercentage > 0) {
        trendDirection = 'up';
      } else if (trendPercentage < 0) {
        trendDirection = 'down';
      }
    } else if (currentPeriodEngagement > 0) {
      // If previous period had no engagement but current does, it's 100% up
      trendPercentage = 100;
      trendDirection = 'up';
    }

    // Return analytics data
    const analyticsData: AnalyticsData = {
      totalEngagement,
      averageEngagementRate,
      topPerformingPost,
      trend: {
        percentage: Math.abs(trendPercentage),
        direction: trendDirection,
      },
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error in analytics summary API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
