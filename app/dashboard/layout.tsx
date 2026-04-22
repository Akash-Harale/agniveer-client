'use client';

import { useAuth } from '@/hooks/use-auth';
import { Sidebar } from '@/components/sidebar';
import { CollapsibleQuerySidebar } from '@/components/collapsible-query-sidebar';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { FilterProvider } from '@/app/context/filter-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth({ required: false });
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const isQueryPage = pathname.includes('/query');
  const isMISPage =
    pathname.includes('/mis') ||
    pathname.includes('/entities') ||
    pathname.includes('/sub-entities') ||
    pathname.includes('/officers');

  return (
    <FilterProvider>
      <div className="flex flex-col h-full bg-slate-50 relative">
        {/* Mobile Header Toggle (Only for MIS/Entities/etc) */}
        {user && isMISPage && (
          <div className="lg:hidden flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">A</span>
              </div>
              <span className="font-black text-slate-900 tracking-tight text-sm">Agniveer MIS</span>
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-xl bg-slate-50 text-slate-600 border border-slate-200 shadow-sm"
            >
              {sidebarCollapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden relative">

          {user && isQueryPage && <CollapsibleQuerySidebar />}

          {user && isMISPage && (
            <div className={`
              fixed lg:static inset-y-0 left-0 z-[60] lg:z-40 transition-transform duration-300 transform
              ${sidebarCollapsed ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              lg:block flex-shrink-0
            `}>
              <Sidebar
                isCollapsed={false}
                onToggle={() => setSidebarCollapsed(false)}
              />
            </div>
          )}

          {/* Mobile Overlay for Sidebar */}
          {user && isMISPage && sidebarCollapsed && (
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden"
              onClick={() => setSidebarCollapsed(false)}
            />
          )}

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 min-w-0">
            {children}
          </main>

        </div>
      </div>
    </FilterProvider>
  );
}