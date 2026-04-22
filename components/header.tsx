'use client';

import { User } from '@/lib/data-service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true;
    if (path === '/mis') {
      return (
        pathname.includes('/mis') ||
        pathname.includes('/entities') ||
        pathname.includes('/sub-entities') ||
        pathname.includes('/officers')
      );
    }
    return pathname.includes(path);
  };

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm relative z-50">
      {/* Top Bar with Logo and User */}
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src="/images/agniveer-logo.jpg" alt="Agniveer Logo" className="h-10 w-10 rounded shadow-sm border border-slate-100" />
          <div className="text-slate-900 font-black text-xl tracking-tight">AVRP <span className="text-blue-600 text-lg font-bold">Dashboard</span></div>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-slate-900 text-sm font-bold leading-none">{user.name}</p>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter mt-1">{user.role}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full border-2 border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all outline-none">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 transition-transform active:scale-95">
                      <span className="text-white font-bold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-xl rounded-2xl p-2 mt-2">
                  <div className="px-3 py-2 mb-2 bg-slate-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">Connected As</p>
                    <p className="text-sm font-bold text-slate-700 truncate mt-1">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={onLogout} className="text-red-500 focus:bg-red-50 focus:text-red-600 cursor-pointer rounded-lg font-bold text-sm px-3 py-2">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
            >
              🔐 Login Securely
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-end gap-2 px-6 pb-3 bg-white">
        <Link
          href="/dashboard"
          className={`text-xs font-bold px-5 py-2 transition-all rounded-full border ${
            pathname === '/dashboard'
              ? 'text-white bg-blue-600 border-blue-600 shadow-lg shadow-blue-200'
              : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Dashboard
        </Link>
        
        {user && (
          <Link
            href="/dashboard/query"
            className={`text-xs font-bold px-5 py-2 transition-all rounded-full border ${
              isActive('/query')
                ? 'text-white bg-blue-600 border-blue-600 shadow-lg shadow-blue-200'
                : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            Query
          </Link>
        )}

        {user?.role === 'admin' && (
          <Link
            href="/dashboard/mis"
            className={`text-xs font-bold px-5 py-2 transition-all rounded-full border ${
              isActive('/mis')
                ? 'text-white bg-blue-600 border-blue-600 shadow-lg shadow-blue-200'
                : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            MIS
          </Link>
        )}
        
        <Link
          href="/dashboard/notifications"
          className={`text-xs font-bold px-5 py-2 transition-all rounded-full border ${
            isActive('/notifications')
              ? 'text-white bg-blue-600 border-blue-600 shadow-lg shadow-blue-200'
              : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          Job Notifications
        </Link>
      </div>
    </header>
  );
}
