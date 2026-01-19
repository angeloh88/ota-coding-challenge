'use client';

import { AppHeader } from '@/components/app-header';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="flex min-h-screen flex-col">
      {!loading && isAuthenticated && <AppHeader />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
