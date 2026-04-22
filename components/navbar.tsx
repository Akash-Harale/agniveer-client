'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    return pathname.startsWith(path) && path !== '/dashboard';
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-6 md:gap-8 shadow-sm overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth relative z-30">
      <Link
        href="/dashboard"
        className={`pb-1 md:pb-2 font-black text-xs md:text-sm uppercase tracking-widest transition-all border-b-2 flex-shrink-0 ${
          pathname === '/dashboard'
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
        }`}
      >
        Main Dashboard
      </Link>

      <Link
        href="/dashboard/query"
        className={`pb-1 md:pb-2 font-black text-xs md:text-sm uppercase tracking-widest transition-all border-b-2 flex-shrink-0 ${
          isActive('/dashboard/query')
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
        }`}
      >
        Query Intelligence
      </Link>

      <Link
        href="/dashboard/mis"
        className={`pb-1 md:pb-2 font-black text-xs md:text-sm uppercase tracking-widest transition-all border-b-2 flex-shrink-0 ${
          isActive('/dashboard/mis')
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
        }`}
      >
        MIS Dashboard
      </Link>

      <Link
        href="/dashboard/notification"
        className={`pb-1 md:pb-2 font-black text-xs md:text-sm uppercase tracking-widest transition-all border-b-2 flex-shrink-0 ${
          isActive('/dashboard/notification')
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-slate-400 hover:text-slate-600'
        }`}
      >
        Notifications
      </Link>
    </nav>
  );
}
