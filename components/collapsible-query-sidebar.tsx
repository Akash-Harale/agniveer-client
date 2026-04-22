'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { QuerySidebar } from './query-sidebar';
import { useFilters } from '@/app/context/filter-context';

export function CollapsibleQuerySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilters } = useFilters();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 transition-colors shadow-sm"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 left-0 h-screen lg:h-full w-80 z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="pt-20 lg:pt-0">
          <QuerySidebar onFilterChange={setFilters} />
        </div>
      </div>
    </>
  );
}