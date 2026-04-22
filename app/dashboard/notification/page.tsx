'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotificationTabPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/notifications');
  }, [router]);

  return null;
}
