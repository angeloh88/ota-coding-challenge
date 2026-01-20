# Social Media Analytics Dashboard

A modern, full-stack social media analytics dashboard built with Next.js, Supabase, and TypeScript. This application allows users to track and analyze their social media posts across multiple platforms (Instagram and TikTok) with comprehensive analytics, engagement metrics, and interactive visualizations.

## Design Decisions

### **1. Where should engagement metrics be aggregated?**

#### Chosen Approach: **API Route Aggregation**

I have chosen to perform all engagement metric aggregations in the **API Route** (`/api/analytics/summary/route.ts`).

#### Implementation Details
**Location**: `app/api/analytics/summary/route.ts`

**Flow**:
1. Client component (`components/analytics/summary-cards.tsx`) calls `useAnalytics()` hook
2. Hook (`lib/hooks/use-analytics.ts`) makes HTTP request to `/api/analytics/summary`
3. API route fetches all posts from database for authenticated user
4. API route performs all aggregations server-side:
   - **Total Engagement**: Sum of (likes + comments + shares) across all posts
   - **Average Engagement Rate**: Mean of all post engagement rates
   - **Top Performing Post**: Post with highest total engagement
   - **Trend Calculation**: Compares last 30 days vs previous 30 days
5. API returns pre-aggregated JSON response
6. Client component receives and displays the aggregated data

The **API Route aggregation** approach provides the best balance of:
   - Security and data privacy
   - Performance for typical use cases
   - Maintainability and code organization
   - Flexibility for future optimizations

**Trade-offs:**
   - Network latency: HTTP round-trip (mitigated by caching)
   - Database load: fetches all posts (acceptable for < 1000 posts)
   - Computation: server CPU (efficient for current scale)
   - Real-time: not real-time (acceptable for analytics dashboard)

This approach is optimal for the current scale and requirements of the application. As the application grows, specific optimizations (database views, caching) can be added incrementally without requiring a complete architectural change.

### **2. What data should live in Redux vs. TanStack Query vs. URL state?**

#### State Management Map

| State | Location | Reasoning |
|-------|----------|-----------|
| **Current platform filter** | Redux (`ui.selectedPlatform`) | User preference that persists across navigation |
| **Current sort column/direction** | Component State (`useState`) | Ephemeral UI state, table-specific, resets on unmount |
| **Selected post (modal)** | Redux (`ui.selectedPostId`, `ui.isModalOpen`) | Modal state accessible from multiple components |
| **Chart view type (line/area)** | Redux (`ui.chartViewType`) | User preference that persists |
| **Posts data from Supabase** | TanStack Query (`usePosts` hook) | Server state with caching, refetching, error handling |
| **Daily metrics data** | TanStack Query (`useDailyMetrics` hook) | Server state with caching for time-series data |

- **Redux**: UI preferences and modal state that need to persist or be shared
- **TanStack Query**: All server-fetched data (automatic caching, refetching, cache invalidation)
- **Component State**: Ephemeral UI state specific to one component (table sorting)

### **3. How do you handle the case where a user has no data?**

#### Empty State Strategy

**Principle:** Empty states are treated as valid application states, not errors. All components gracefully handle zero data without crashing.

**Component Handling:**

1. **Posts Table**: Shows "No posts found" message with guidance to connect social accounts
2. **Engagement Chart**: Renders flat line at zero (API fills all dates with `engagement: 0`, `reach: 0`)
3. **Summary Cards**: 
   - Total Engagement: `0`
   - Average Engagement Rate: `0.00%` (not null - mathematically correct)
   - Top Performing Post: `"No posts yet"` (when `null`)
   - Trend: `0.0% no change` (neutral direction)

**API Responses:**

- **Analytics Summary** (`/api/analytics/summary`): Returns `{ totalEngagement: 0, averageEngagementRate: 0, topPerformingPost: null, trend: { percentage: 0, direction: 'neutral' } }`
- **Daily Metrics** (`/api/metrics/daily`): Returns array of all requested dates with `engagement: 0, reach: 0` (fills gaps with zeros)

**Key Decisions:**

- ✅ **Zero values** for numeric metrics (0, 0%, etc.) - not null or "N/A"
- ✅ **Consistent data structures** - APIs always return expected shape
- ✅ **Chart-safe** - Recharts handles zero arrays gracefully (flat line)
- ✅ **User-friendly messages** - Clear guidance for next steps
- ✅ **No crashes** - All components handle empty data

**Edge Cases:**
- Engagement rate with no posts = `0%` (average of empty set)
- Chart with no metrics = flat line at zero (all dates filled)
- Trend with no history = `0% neutral` (no change)

### **4. How should the "trend" percentage be calculated?**

#### Chosen Approach: **Last 30 Days vs. Prior 30 Days**

**Implementation:**
- **Current Period**: Last 30 days (from 30 days ago to today)
- **Previous Period**: Prior 30 days (from 60 days ago to 30 days ago)
- **Formula**: `((currentPeriodEngagement - previousPeriodEngagement) / previousPeriodEngagement) * 100`

**Why This Approach:**

- ✅ **Consistent with chart**: Aligns with engagement chart's 30-day view
- ✅ **Meaningful data**: 30 days provides sufficient data points, smooths weekly fluctuations
- ✅ **Clear UX**: Simple "last month vs previous month" concept
- ✅ **Better than alternatives**:
  - 7 days: Too short, high variance, may have gaps
  - Calendar months: Variable length, inconsistent with chart

**Edge Cases:**
- No previous data → `0% neutral`
- No current data → Negative percentage (decrease)
- No previous but current has data → `100% up` (new engagement)

*******

## App Features

- 🔐 **Authentication**: Secure user authentication with Supabase Auth
- 📊 **Analytics Dashboard**: Real-time analytics summary cards showing total posts, engagement, reach, and engagement rate
- 📈 **Engagement Charts**: Interactive line and area charts displaying daily engagement metrics over the last 30 days
- 📱 **Posts Management**: Comprehensive posts table with:
  - Pagination (10 posts per page)
  - Sorting by likes, comments, shares, engagement rate, and posted date
  - Platform filtering (All, Instagram, TikTok)
  - Post detail modal with full information
  - Thumbnail previews
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🔒 **Row Level Security**: Secure data access with Supabase RLS policies

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: 
  - [Redux Toolkit](https://redux-toolkit.js.org/) for UI state
  - [TanStack Query](https://tanstack.com/query) for server state
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) primitives
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [Lucide React](https://lucide.dev/) for icons
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Table Management**: [TanStack Table](https://tanstack.com/table)

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A Supabase project (sign up at [supabase.com](https://supabase.com))

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ota-coding-challenge
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under **API**.

### 4. Set Up Supabase Database

1. **Create Tables**: Run the SQL scripts in the `supabase/sql/` directory:
   - Create your `posts` and `daily_metrics` tables with appropriate schema
   - Ensure tables have `user_id` columns for multi-tenant support

2. **Enable Row Level Security (RLS)**:
   - Follow the guide in `_guide/RLS_SETUP_GUIDE.md`
   - Run the SQL from `supabase/sql/rls-policies.sql` in your Supabase SQL Editor
   - This ensures users can only access their own data

3. **Seed Data (Optional)**:
   - Use `supabase/sql/seed-data.sql` to populate test data
   - See `_guide/test-users.md` for test user credentials

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Access the Application

- **Home**: `http://localhost:3000`
- **Sign Up**: `http://localhost:3000/auth/signup`
- **Login**: `http://localhost:3000/auth/login`
- **Dashboard**: `http://localhost:3000/dashboard` (protected route)

## Project Structure

```
ota-coding-challenge/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   └── providers/         # React context providers
├── components/            # React components
│   ├── analytics/        # Analytics summary cards
│   ├── charts/           # Chart components
│   ├── posts/            # Posts table and modals
│   └── ui/               # Reusable UI components
├── lib/                   # Utility libraries
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Redux store and slices
│   ├── supabase/         # Supabase client setup
│   └── utils/            # Utility functions
├── supabase/
│   └── sql/              # Database SQL scripts
└── _guide/               # Setup and documentation guides
```

## Key Features Explained

### Authentication
- Secure authentication using Supabase Auth
- Protected routes with server-side authentication checks
- Session management with SSR support

### Analytics Dashboard
- **Summary Cards**: Display key metrics at a glance
  - Total Posts
  - Total Engagement
  - Total Reach
  - Average Engagement Rate
- **Engagement Chart**: Visualize engagement trends over time
  - Toggle between line and area chart views
  - 30-day rolling window
  - Interactive tooltips

### Posts Table
- **Pagination**: Navigate through posts 10 at a time
- **Sorting**: Click column headers to sort by:
  - Likes
  - Comments
  - Shares
  - Engagement Rate
  - Posted Date
- **Filtering**: Filter posts by platform (All, Instagram, TikTok)
- **Post Details**: Click any row to view full post details in a modal

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Schema

The application uses two main tables:

- **posts**: Stores individual social media posts with metrics
- **daily_metrics**: Aggregates daily engagement and reach metrics

Both tables use Row Level Security (RLS) to ensure users can only access their own data.

## Security

- **Row Level Security (RLS)**: Enabled on all tables
- **Server-side Authentication**: All protected routes verify authentication server-side
- **Environment Variables**: Sensitive keys stored in `.env.local` (not committed to git)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please refer to the guides in the `_guide/` directory or open an issue in the repository.
