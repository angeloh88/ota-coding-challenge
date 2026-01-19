# Social Media Analytics Dashboard

A modern, full-stack social media analytics dashboard built with Next.js, Supabase, and TypeScript. This application allows users to track and analyze their social media posts across multiple platforms (Instagram and TikTok) with comprehensive analytics, engagement metrics, and interactive visualizations.

## Features

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
