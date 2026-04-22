'use client';

import { useEffect } from 'react';
import { useFilters, QueryFilters } from '@/app/context/filter-context';


interface QuerySidebarProps {
  onFilterChange: (filters: QueryFilters) => void;
}

export function QuerySidebar({ onFilterChange }: QuerySidebarProps) {
  const { filters, setFilters } = useFilters();

  const handleChange = (key: keyof QueryFilters, value: string) => {
    const updatedFilters = { ...filters, [key]: value };
    // Reset hiredEntity if status is not Rehabilitated
    if (key === 'rehabilitationStatus' && value !== 'Rehabilitated') {
      updatedFilters.hiredEntity = '';
    }
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };



  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 overflow-y-auto">
      <h3 className="text-slate-900 font-bold text-lg mb-6">Filters</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">Rehabilitation Status</label>
          <select
            value={filters.rehabilitationStatus}
            onChange={(e) => handleChange('rehabilitationStatus', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="">All Candidates</option>
            <option value="Rehabilitated">Rehabilitated</option>
            <option value="To be Rehabilitated">To be Rehabilitated</option>
          </select>
        </div>

        {filters.rehabilitationStatus === 'Rehabilitated' && (
          <div>
            <label className="block text-slate-600 text-[10px] font-black uppercase tracking-widest mb-2">Hiring Entity</label>
            <select
              value={filters.hiredEntity}
              onChange={(e) => handleChange('hiredEntity', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
            >
              <option value="">Select an Entity</option>
              <option value="BSF">BSF</option>
              <option value="CISF">CISF</option>
              <option value="CRPF">CRPF</option>
              <option value="ITBP">ITBP</option>
              <option value="State Police">State Police</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">State</label>
          <select
            value={filters.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="">Select State</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Delhi">Delhi</option>
            <option value="Punjab">Punjab</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Batch</label>
          <select
            value={filters.batch}
            onChange={(e) => handleChange('batch', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="">Select an Option</option>
            <option value="2023-24">2023-24</option>
            <option value="2024-25">2024-25</option>
            <option value="2025-26">2025-26</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Branch</label>
          <select
            value={filters.branch}
            onChange={(e) => handleChange('branch', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="">Select an Option</option>
            <option value="Army">Army</option>
            <option value="Navy">Navy</option>
            <option value="Airforce">Airforce</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Age Group</label>
          <select
            value={filters.ageGroup}
            onChange={(e) => handleChange('ageGroup', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="">Select an Option</option>
            <option value="18-22">18-22</option>
            <option value="23-27">23-27</option>
            <option value="28-32">28-32</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Assessment Grade</label>
          <select
            value={filters.assessmentGrade}
            onChange={(e) => handleChange('assessmentGrade', e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
          >
            <option value="">Select an Option</option>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
            <option value="d">D</option>
          </select>
        </div>


      </div>
    </aside>
  );
}
