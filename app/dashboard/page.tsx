'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { dataService, Notification } from '@/lib/data-service';
import {
  Users, Briefcase, UserCheck, UserMinus,
  Building2, Activity,
} from 'lucide-react';

interface Agniveer {
  id: number;
  name: string;
  serviceId: string;
  branch: string;
  state: string;
  assessmentGrade: string;
  unit: string;
  age: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth({ required: false });
  const [agniveers, setAgniveers]         = useState<Agniveer[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const loadData = async () => {
      try {
        const [agniveerRes, notifData] = await Promise.all([
          fetch('/data/agniveers.json').then(r => r.json()),
          dataService.getNotifications(),
        ]);
        setAgniveers(agniveerRes);
        // Sort newest first
        setNotifications(
          notifData.sort(
            (a: Notification, b: Notification) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [authLoading]);

  const isAdmin  = user?.role === 'admin';
  const isPublic = !user;
  const entityName = !isAdmin && !isPublic ? user?.username?.toUpperCase() : null;

  const filteredData = useMemo(() => {
    if (isAdmin || isPublic) return agniveers;
    return agniveers.filter(
      a => a?.branch?.toLowerCase() === user?.username?.toLowerCase(),
    );
  }, [agniveers, user, isAdmin, isPublic]);

  const totalAgniveers     = 50;
  const rehabilitatedCount = 22;
  const toBeRehabCount     = 28;

  const unitDistribution = useMemo(() => {
    if (isAdmin || isPublic) return [];
    const counts: Record<string, number> = {};
    filteredData.forEach(a => (counts[a.unit] = (counts[a.unit] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredData, isAdmin, isPublic]);

  const today = new Date();
  const totalOpenings   = notifications.filter(n => n.vacancies || n.entity).length;
  const currentOpenings = notifications.filter(n => {
    if (!n.lastDate) return false;
    return new Date(n.lastDate) >= today;
  }).length;

  const agniveerProfileData = [
    { name: 'Total Agniveers',     value: totalAgniveers },
    { name: 'Rehabilitated',       value: rehabilitatedCount },
    { name: 'To be Rehabilitated', value: toBeRehabCount },
  ];

  const openingsData = [
    { name: 'Total Openings',   value: totalOpenings   || 229 },
    { name: 'Current Openings', value: currentOpenings || 12  },
  ];

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="relative text-center">
          <div className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-medium animate-pulse">Analyzing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 font-sans">

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {isPublic
              ? 'Public Analytics Portal'
              : isAdmin
              ? 'Agniveer Rehabilitation Program (AVRP) Dashboard'
              : `${user?.name || entityName} Operations Panel`}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* ════ LEFT COLUMN ════ */}
        <div className="lg:col-span-8 space-y-8">

          {/* Agniveer Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Users className="w-4 h-4" /> Agniveer Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard title="Total Agniveers"     value={totalAgniveers}     icon={<Users    className="w-6 h-6 text-blue-600"    />} color="blue"    href="/dashboard/query?status=all" />
              <SummaryCard title="Rehabilitated"       value={rehabilitatedCount} icon={<UserCheck className="w-6 h-6 text-emerald-600" />} color="emerald" href="/dashboard/query?status=rehabilitated" />
              <SummaryCard title="To be Rehabilitated" value={toBeRehabCount}     icon={<UserMinus className="w-6 h-6 text-amber-600"   />} color="amber"   href="/dashboard/query?status=to-be-rehabilitated" />
            </div>
          </div>

          {/* Entities & Openings */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Entities & Openings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SummaryCard title="Total Entities"   value={isAdmin || isPublic ? 3 : unitDistribution.length} icon={<Building2  className="w-6 h-6 text-indigo-600" />} color="indigo" />
              <SummaryCard title="Total Openings"   value={totalOpenings   || 229} icon={<Briefcase className="w-6 h-6 text-orange-600" />} color="orange" href="/dashboard/query" />
              <SummaryCard title="Current Openings" value={currentOpenings || 12}  icon={<Activity   className="w-6 h-6 text-rose-600"   />} color="rose"   href="/dashboard/query" />
            </div>
          </div>

          {/* Pie Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="p-6 rounded-3xl border border-slate-100 shadow-sm bg-white">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Agniveer Profile Breakup</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Rehabilitation status distribution</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={agniveerProfileData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {agniveerProfileData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 700 }} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 rounded-3xl border border-slate-100 shadow-sm bg-white">
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-1">Openings Breakup</h3>
              <p className="text-xs text-slate-400 font-medium mb-4">Total vs currently active openings</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={openingsData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {openingsData.map((_, i) => <Cell key={i} fill={['#f59e0b', '#ef4444'][i % 2]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 700 }} />
                  <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>

        {/* ════ RIGHT COLUMN — NOTIFICATION HUB ════ */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <Card className="flex-1 rounded-[2.5rem] border-none shadow-2xl shadow-slate-200/50 bg-white flex flex-col overflow-hidden lg:sticky lg:top-24 min-h-[500px] lg:max-h-[85vh]">

            {/* Hub Header */}
            <div className="p-6 pb-4 border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Notification Hub</h3>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium">Real-time ecosystem updates and alerts</p>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
              <div className="animate-scroll-y flex flex-col gap-3 px-3 pt-4 pb-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm font-medium">No notifications yet</div>
                ) : (
                  [...notifications, ...notifications].map((n, idx) => (
                    <NotifCard key={`${n.id}-${idx}`} n={n} />
                  ))
                )}
              </div>
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   NOTIFICATION CARD — uses dataService Notification type
   ══════════════════════════════════════════════════════════ */
function NotifCard({ n }: { n: Notification }) {
  // Map notification type to tag color
  const typeColorMap: Record<string, string> = {
    info:    '#1C4587',
    success: '#138808',
    warning: '#FF9933',
    error:   '#c62828',
  };
  const tagColor = typeColorMap[n.type] ?? '#1C4587';
  const tagBg    = tagColor + '18';

  const typeIconMap: Record<string, string> = {
    info:    '📢',
    success: '✅',
    warning: '⚠️',
    error:   '🚨',
  };
  const icon = typeIconMap[n.type] ?? '📢';

  const typeLabelMap: Record<string, string> = {
    info:    'Recruitment',
    success: 'Opportunity',
    warning: 'Workshop',
    error:   'Alert',
  };
  const tag = typeLabelMap[n.type] ?? 'Update';

  const postedDate = new Date(n.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <Link href={`/pages/detailednotipage?id=${n.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #E8EEF8',
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(28,69,135,0.13)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Top row: icon · tag · posted date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
              {icon}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: tagBg, color: tagColor, letterSpacing: 0.3 }}>
              {tag}
            </span>
          </div>
          <span style={{ fontSize: 10, color: '#aaa', fontWeight: 500, whiteSpace: 'nowrap' }}>
            Posted: {postedDate}
          </span>
        </div>

        {/* Title */}
        <div style={{ fontSize: 13, fontWeight: 800, color: '#1C4587', padding: '4px 14px 4px', lineHeight: '1.45' }}>
          {n.title}
        </div>

        {/* Message */}
        {n.message && (
          <div style={{ fontSize: 11, color: '#666', lineHeight: '1.55', padding: '0 14px 10px' }}>
            {n.message}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: '#EEF2F8', margin: '0 14px' }} />

        {/* Meta grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 10, columnGap: 10, padding: '11px 14px', background: '#F8FAFF' }}>

          {/* Organisation */}
          {n.entity && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={metaLabel}>🏛️ Organisation</span>
              <span style={{ ...metaValue, lineHeight: '1.35' }}>{n.entity}</span>
            </div>
          )}

          {/* Opening Date */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={metaLabel}>📅 Opening Date</span>
            <span style={{ ...metaValue, color: '#2e7d32', fontWeight: 700 }}>
              {new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Closing Date */}
          {n.lastDate && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={metaLabel}>⏳ Closing Date</span>
              <span style={{ ...metaValue, color: '#c62828', fontWeight: 700 }}>
                {new Date(n.lastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* View Details footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, padding: '8px 14px', borderTop: '1px solid #EEF2F8', background: '#fff' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1C4587' }}>View Details</span>
          <span style={{ fontSize: 16, color: '#1C4587', lineHeight: 1 }}>›</span>
        </div>
      </div>
    </Link>
  );
}

const metaLabel: React.CSSProperties = {
  fontSize: 9, color: '#999', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: 0.5,
};
const metaValue: React.CSSProperties = {
  fontSize: 11, color: '#333', fontWeight: 600, lineHeight: '1.4',
};

/* ══════════════════════════════════════════════════════════
   SUMMARY CARD
   ══════════════════════════════════════════════════════════ */
function SummaryCard({ title, value, icon, color, href, trend }: any) {
  const colorMap: any = {
    blue:    'from-blue-50    to-blue-100/50    text-blue-700    border-blue-100',
    emerald: 'from-emerald-50 to-emerald-100/50 text-emerald-700 border-emerald-100',
    amber:   'from-amber-50   to-amber-100/50   text-amber-700   border-amber-100',
    indigo:  'from-indigo-50  to-indigo-100/50  text-indigo-700  border-indigo-100',
    orange:  'from-orange-50  to-orange-100/50  text-orange-700  border-orange-100',
    rose:    'from-rose-50    to-rose-100/50    text-rose-700    border-rose-100',
  };

  const CardContent = (
    <Card className={`group p-6 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl ${href ? 'hover:-translate-y-1' : ''} bg-white overflow-hidden relative h-full`}>
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorMap[color] || colorMap.blue} opacity-20 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150`} />
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h4 className="text-4xl font-black text-slate-900">{value}</h4>
          {trend && <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{trend}</span>}
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorMap[color] || colorMap.blue} shadow-sm border shadow-slate-200`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return href ? <Link href={href} className="block h-full">{CardContent}</Link> : CardContent;
}