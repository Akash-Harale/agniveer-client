'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { exchangeCodeForToken } from '@/lib/sso';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const authorizationCode = params.get('code');
        const state = params.get('state') || '';

        if (!authorizationCode) {
          throw new Error('Authorization code missing.');
        }

        const userData = await exchangeCodeForToken(authorizationCode, state);

        if (!userData) {
          throw new Error('No user data received.');
        }

        sessionStorage.setItem('userAuth', JSON.stringify(userData));
        sessionStorage.setItem('login_type', 'SSO');
        router.replace('/dashboard');
      } catch (error) {
        console.error('Callback error:', error);
        setTimeout(() => router.replace('/login'), 2000);
      }
    };

    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <svg className="animate-spin w-10 h-10 text-[#1a2a6c]" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <h1 className="text-2xl font-semibold text-[#1a2a6c]">Processing login...</h1>
      <p className="text-slate-500 text-sm">Please wait while we verify your identity.</p>
    </div>
  );
}