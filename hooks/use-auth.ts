'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout, getCurrentUser } from '@/lib/auth';
import { User } from '@/lib/data-service';

export function useAuth({ required = true }: { required?: boolean } = {}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session.user);
    } else if (required) {
      router.push('/login');
    }
    setLoading(false);
  }, [router, required]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return {
    user,
    loading,
    logout: handleLogout,
    isAuthenticated: !!user,
  };
}

export function useCurrentUser(): User | null {
  return getCurrentUser();
}
