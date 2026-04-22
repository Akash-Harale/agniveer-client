'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFilters, QueryFilters } from '@/app/context/filter-context';
import { useAuth } from '@/hooks/use-auth';
import { useSearchParams } from 'next/navigation';
import { Download, MessageSquare, Mail, Filter, Users, UserCheck, UserMinus } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Agniveer {
  id: number;
  serviceId: string;
  batch: string;
  name: string;
  dob: string;
  age: number;
  state: string;
  branch: string;
  unit: string;
  trainingCentre: string;
  servingZone: string;
  assessmentGrade: string;
  rehabilitationStatus: string;
  hiredBy?: string;
}

function applyFilters(data: Agniveer[], f: QueryFilters): Agniveer[] {
  return data.filter((a) => {
    if (f.state && a.state.toLowerCase() !== f.state.toLowerCase()) return false;
    if (f.batch && a.batch !== f.batch) return false;
    if (f.branch && a.branch.toLowerCase() !== f.branch.toLowerCase()) return false;
    if (f.ageGroup) {
      const [min, max] = f.ageGroup.split('-').map(Number);
      if (a.age < min || a.age > max) return false;
    }
    if (f.assessmentGrade && a.assessmentGrade.toLowerCase() !== f.assessmentGrade.toLowerCase()) return false;
    if (f.rehabilitationStatus && a.rehabilitationStatus !== f.rehabilitationStatus) return false;
    if (f.hiredEntity && a.hiredBy !== f.hiredEntity) return false;
    return true;
  });
}

function getFormattedNow(): string {
  const now = new Date();
  const dd   = String(now.getDate()).padStart(2, '0');
  const mm   = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh   = String(now.getHours()).padStart(2, '0');
  const min  = String(now.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min} Hrs`;
}

export default function QueryPage() {
  const { user } = useAuth({ required: false });
  const { filters, setFilters } = useFilters();
  const searchParams = useSearchParams();
  const [agniveers, setAgniveers] = useState<Agniveer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt] = useState(getFormattedNow);

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      const newFilters = {
        state: '', batch: '', branch: '', ageGroup: '',
        assessmentGrade: '', rehabilitationStatus: '', hiredEntity: ''
      };
      if (status === 'rehabilitated') {
        newFilters.rehabilitationStatus = 'Rehabilitated';
      } else if (status === 'to-be-rehabilitated') {
        newFilters.rehabilitationStatus = 'To be Rehabilitated';
      }
      setFilters(newFilters);
    }
  }, [searchParams, setFilters]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/data/agniveers.json');
        const data: Agniveer[] = await res.json();
        setAgniveers(data);
      } catch (err) {
        console.error('Error loading agniveers:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredAgniveers = useMemo(() => applyFilters(agniveers, filters), [agniveers, filters]);

  // Summary counts from full pool
  const totalAgniveers     = agniveers.length;
  const rehabilitatedCount = useMemo(() => agniveers.filter(a => a.rehabilitationStatus === 'Rehabilitated').length, [agniveers]);
  const toBeRehabCount     = useMemo(() => agniveers.filter(a => a.rehabilitationStatus === 'To be Rehabilitated').length, [agniveers]);

  const filteredStats = useMemo(() => {
    if (filteredAgniveers.length === 0) return null;
    const total = filteredAgniveers.length;
    return { total };
  }, [filteredAgniveers]);

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing recruitment records...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">

      {/* ── Page Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">Query</h1>
          <p className="text-slate-500 text-sm mt-1">Refine and explore the Agniveer profile pool</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Updated as on badge */}
          <div className="bg-slate-100/50 px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Updated as on</span>
              <span className="text-[11px] font-black text-slate-700 uppercase mt-1">{updatedAt}</span>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* ── Dashboard Summary Cards ── */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="mb-6">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Dashboard Summary</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-widest">
            Aggregated statistics for the full Agniveer pool
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200 shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Total Agniveers</p>
              <p className="text-3xl font-black text-blue-700 leading-none">{totalAgniveers}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
            <div className="bg-emerald-600 p-3 rounded-xl shadow-lg shadow-emerald-200 shrink-0">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">Rehabilitated</p>
              <p className="text-3xl font-black text-emerald-700 leading-none">{rehabilitatedCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="bg-amber-500 p-3 rounded-xl shadow-lg shadow-amber-200 shrink-0">
              <UserMinus className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest leading-none mb-1">To Be Rehabilitated</p>
              <p className="text-3xl font-black text-amber-600 leading-none">{toBeRehabCount}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Data Table ── */}
      <DataTable filteredStats={filteredStats} filteredAgniveers={filteredAgniveers} />

    </div>
  );
}

function DataTable({ filteredStats, filteredAgniveers }: { filteredStats: any; filteredAgniveers: Agniveer[] }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Toolbar */}
      <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100 lg:border-none lg:bg-transparent">
          <div className="bg-blue-50 p-2.5 rounded-xl shrink-0">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Agniveers</p>
            <p className="text-lg font-black text-slate-900 leading-tight">{filteredStats?.total || 0}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 self-stretch xl:self-center">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition-all border border-slate-200 hover:border-emerald-200 text-[10px] font-black uppercase tracking-widest shadow-sm group">
            <Download className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
            <span>Export</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl transition-all border border-slate-200 hover:border-blue-200 text-[10px] font-black uppercase tracking-widest shadow-sm group">
            <MessageSquare className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            <span>SMS</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-xl transition-all border border-slate-200 hover:border-purple-200 text-[10px] font-black uppercase tracking-widest shadow-sm group">
            <Mail className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
            <span>Email</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Agniveer Details</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Info</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">State</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Grade & Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAgniveers.length > 0 ? (
              filteredAgniveers.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 text-base">{a.name}</span>
                      <span className="text-slate-500 text-xs tracking-tighter uppercase font-medium">{a.branch} • {a.age} Yrs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-blue-600 leading-tight">{a.serviceId}</span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase">{a.unit} / {a.batch}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700">{a.state}</span>
                      <span className="text-slate-400 text-[10px] font-bold uppercase">{a.servingZone} Zone</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-lg border text-[10px] font-black uppercase ${getGradeColor(a.assessmentGrade)}`}>
                        Grade {a.assessmentGrade}
                      </span>
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-bold uppercase ${a.rehabilitationStatus === 'Rehabilitated' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {a.rehabilitationStatus}
                        </span>
                        {a.hiredBy && (
                          <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">by {a.hiredBy}</span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="bg-slate-50 p-4 rounded-full">
                      <Filter className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No candidates match these specific parameters.</p>
                    <button className="text-blue-600 text-xs font-bold uppercase tracking-widest hover:underline">Clear all filters</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getGradeColor(grade: string) {
  switch (grade.toUpperCase()) {
    case 'A': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'C': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'D': return 'bg-rose-100 text-rose-800 border-rose-200';
    default:  return 'bg-slate-100 text-slate-800 border-slate-200';
  }
}