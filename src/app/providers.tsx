'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  const { setAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, but we need to verify it
      // For now, we'll just set it as authenticated
      // In production, you'd verify the token with the backend
    }
  }, [setAuth]);

  return <>{children}</>;
}

