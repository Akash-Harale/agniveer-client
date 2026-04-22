"use client"
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  ChevronDown, ChevronRight, Users, Building2, Layers,
  Search, MapPin, Briefcase, User as UserIcon
} from 'lucide-react';
import { getAllEntities, Entity as APIEntity } from '@/lib/entity-service';
import { getAllSubEntities, SubEntityFromAPI } from '@/lib/sub-entity-service';
import { getAllUsers, UserFromAPI } from '@/lib/user-service';

interface Entity {
  id: number;
  name: string;
  code: string;
}

interface SubEntity {
  id: number;
  name: string;
  entityId: number;
}

interface Personnel {
  id: number;
  serviceId: string;
  name: string;
  hiredBy?: string;
  rehabilitationStatus?: string;
  state?: string;
  branch?: string;
  age?: number;
  assessmentGrade?: string;
}

interface GroupedData {
  entityId: number;
  entityName: string;
  totalPersonnel: number;
  activePersonnel: number;
  subEntities: {
    id: number;
    name: string;
    totalPersonnel: number;
    activePersonnel: number;
    personnel: Personnel[];
  }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const sharedTooltipStyle: React.CSSProperties = {
  borderRadius: '10px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: '6px 12px',
  fontSize: 11,
};

// ── Entity / Sub-entity drill-down pie chart ──────────────────────────────────
function EntitySubPieChart({ aggregatedData }: { aggregatedData: GroupedData[] }) {
  const entityOptions = aggregatedData.map(d => ({ id: d.entityId, name: d.entityName }));
  const [selectedEntityId, setSelectedEntityId] = useState<number | 'all'>('all');

  const chartData = useMemo(() => {
    if (selectedEntityId === 'all') {
      return aggregatedData
        .map(d => ({ name: d.entityName, value: d.totalPersonnel }))
        .filter(d => d.value > 0);
    }
    const entity = aggregatedData.find(d => d.entityId === selectedEntityId);
    if (!entity) return [];
    return entity.subEntities
      .map(s => ({ name: s.name, value: s.totalPersonnel }))
      .filter(d => d.value > 0);
  }, [aggregatedData, selectedEntityId]);

  return (
    <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-none">
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-sm font-semibold text-slate-800 shrink-0">
          {selectedEntityId === 'all' ? 'By Entity' : 'By Sub-Entity'}
        </p>
        <select
          value={selectedEntityId}
          onChange={e => setSelectedEntityId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
        >
          <option value="all">All Entities</option>
          {entityOptions.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="44%"
                innerRadius={52}
                outerRadius={82}
                paddingAngle={6}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`drill-cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={sharedTooltipStyle}
                formatter={(value: number) => [`${value} members`, 'Count']}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-2">
            <Building2 className="w-8 h-8 text-slate-200" />
            <p className="text-slate-400 text-xs">No data for this entity</p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function MISPage() {
  // ── Local JSON data (for charts/hierarchy) ──
  const [entities, setEntities]       = useState<Entity[]>([]);
  const [subEntities, setSubEntities] = useState<SubEntity[]>([]);
  const [personnel, setPersonnel]     = useState<Personnel[]>([]);
  const [loading, setLoading]         = useState(true);

  // ── Real-time API counts ──
  const [apiEntityCount, setApiEntityCount]       = useState<number | null>(null);
  const [apiSubEntityCount, setApiSubEntityCount] = useState<number | null>(null);
  const [apiUserCount, setApiUserCount]           = useState<number | null>(null);
  const [statsLoading, setStatsLoading]           = useState(true);

  const [activeTab, setActiveTab]     = useState<'overview' | 'personnel'>('overview');
  const [expandedEntities, setExpandedEntities] = useState<Record<number, boolean>>({});
  const [expandedSubs, setExpandedSubs]         = useState<Record<number, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // ── Fetch local JSON for charts/hierarchy ──
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entRes, subRes, agnRes] = await Promise.all([
          fetch('/data/entities.json'),
          fetch('/data/sub-entities.json'),
          fetch('/data/agniveers.json'),
        ]);
        setEntities(await entRes.json());
        setSubEntities(await subRes.json());
        setPersonnel(await agnRes.json());
      } catch (error) {
        console.error('Error fetching MIS data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Fetch real-time counts from API ──
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const [entData, subData, userData] = await Promise.all([
          getAllEntities(),
          getAllSubEntities(),
          getAllUsers(),
        ]);
        setApiEntityCount(entData.length);
        setApiSubEntityCount(subData.length);
        setApiUserCount(userData.length);
      } catch (error) {
        console.error('Error fetching API stats:', error);
        // fall back to null — cards will show '—'
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const aggregatedData = useMemo(() => {
    if (!entities.length) return [];
    const grouped: Record<number, GroupedData> = {};
    entities.forEach(entity => {
      grouped[entity.id] = {
        entityId: entity.id,
        entityName: entity.name,
        totalPersonnel: 0,
        activePersonnel: 0,
        subEntities: [],
      };
      subEntities
        .filter(s => s.entityId === entity.id)
        .forEach(sub => {
          grouped[entity.id].subEntities.push({
            id: sub.id,
            name: sub.name,
            totalPersonnel: 0,
            activePersonnel: 0,
            personnel: [],
          });
        });
    });

    personnel.forEach(p => {
      let targetEntityId = -1;
      let targetSubEntityName = '';
      const hiredBy = p.hiredBy || '';
      const entityMatch = entities.find(e => e.name === hiredBy);
      if (entityMatch) {
        targetEntityId = entityMatch.id;
        if (entityMatch.name === 'State Police' && p.state) {
          targetSubEntityName = `${p.state} Police`;
        }
      } else {
        const subMatch = subEntities.find(s => s.name === hiredBy);
        if (subMatch) {
          targetEntityId = subMatch.entityId;
          targetSubEntityName = subMatch.name;
        }
      }
      if (targetEntityId !== -1 && grouped[targetEntityId]) {
        grouped[targetEntityId].totalPersonnel++;
        if (p.rehabilitationStatus === 'Rehabilitated') grouped[targetEntityId].activePersonnel++;
        if (targetSubEntityName) {
          const subIdx = grouped[targetEntityId].subEntities.findIndex(s => s.name === targetSubEntityName);
          if (subIdx !== -1) {
            grouped[targetEntityId].subEntities[subIdx].totalPersonnel++;
            grouped[targetEntityId].subEntities[subIdx].personnel.push(p);
            if (p.rehabilitationStatus === 'Rehabilitated') {
              grouped[targetEntityId].subEntities[subIdx].activePersonnel++;
            }
          }
        }
      }
    });
    return Object.values(grouped);
  }, [entities, subEntities, personnel]);

  const entityChartData = useMemo(() =>
    aggregatedData.map(d => ({ name: d.entityName, value: d.totalPersonnel })).filter(d => d.value > 0),
  [aggregatedData]);

  const toggleExpand    = (id: number) => setExpandedEntities(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleSubExpand = (id: number) => setExpandedSubs(prev => ({ ...prev, [id]: !prev[id] }));

  /* ── Stat display helper ── */
  const statVal = (val: number | null) => {
    if (statsLoading) return <span className="inline-block w-8 h-6 bg-slate-100 rounded animate-pulse" />;
    if (val === null) return <span className="text-slate-300">—</span>;
    return val;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Synchronizing intelligence dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-12">

      {/* ── Page header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Portal Users</h1>
          <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Management summary</span>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start lg:self-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all
              ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('personnel')}
            className={`px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all
              ${activeTab === 'personnel' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Users
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">

          {/* ── Stats cards — real-time API counts ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 md:px-0">

            <Link href="/dashboard/entities" className="group">
              <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-none group-hover:border-blue-200 group-hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total entities</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-0.5">{statVal(apiEntityCount)}</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/sub-entities" className="group">
              <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-none group-hover:border-indigo-200 group-hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-50 p-3 rounded-xl group-hover:bg-indigo-100 transition-colors">
                    <Layers className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Sub-entities</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-0.5">{statVal(apiSubEntityCount)}</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-none">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-50 p-3 rounded-xl">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Total users</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-0.5">{statVal(apiUserCount)}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Two pie charts ── */}
          <div className="mx-4 md:mx-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 bg-white border border-slate-100 rounded-2xl shadow-none">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-800">Organisation distribution</p>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">By entity</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={entityChartData}
                      cx="50%"
                      cy="44%"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {entityChartData.map((_, index) => (
                        <Cell key={`entity-cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={sharedTooltipStyle}
                      formatter={(value: number) => [`${value} members`, 'Count']}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={7}
                      wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: 500 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <EntitySubPieChart aggregatedData={aggregatedData} />
          </div>
        </div>

      ) : (

        /* ── Personnel tab ── */
        <div className="space-y-6">
          <div className="mx-4 md:mx-0 bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-300 shrink-0" />
            <input
              type="text"
              placeholder="Search personnel by name or service code..."
              className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4 px-4 md:px-0">
            {aggregatedData.map(data => {
              const isOpen = !!expandedEntities[data.entityId];
              return (
                <div key={data.entityId} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <div
                    className={`flex items-center justify-between p-5 cursor-pointer transition-colors
                      ${isOpen ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
                    onClick={() => toggleExpand(data.entityId)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-blue-500' : 'bg-slate-100'}`}>
                        <Building2 className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
                          Primary organisation
                        </p>
                        <h3 className="text-base font-semibold leading-tight">{data.entityName}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`text-sm font-medium ${isOpen ? 'text-slate-300' : 'text-slate-400'}`}>
                        {data.totalPersonnel} members
                      </p>
                      {isOpen
                        ? <ChevronDown className="w-4 h-4 text-blue-400" />
                        : <ChevronRight className="w-4 h-4 text-slate-300" />}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 space-y-3 bg-slate-50/60">
                      {data.subEntities.map(sub => {
                        const subOpen = !!expandedSubs[sub.id];
                        const filtered = sub.personnel.filter(p =>
                          !searchQuery ||
                          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.serviceId.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        return (
                          <div key={sub.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                            <div
                              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                                ${subOpen ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                              onClick={() => toggleSubExpand(sub.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all
                                  ${subOpen ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                  {sub.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{sub.name}</p>
                                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                                    {sub.personnel.length} registered personnel
                                  </p>
                                </div>
                              </div>
                              {subOpen
                                ? <ChevronDown className="w-4 h-4 text-blue-500" />
                                : <ChevronRight className="w-4 h-4 text-slate-300" />}
                            </div>

                            {subOpen && (
                              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filtered.length > 0 ? filtered.map(p => (
                                  <Card key={p.id}
                                    className="p-4 bg-white border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all rounded-xl group">
                                    <div className="flex items-start justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-900 transition-all shrink-0">
                                          <UserIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-semibold text-slate-900 leading-tight">{p.name}</p>
                                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{p.serviceId}</p>
                                        </div>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold
                                        ${p.assessmentGrade === 'A' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                                        Grade {p.assessmentGrade}
                                      </span>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-50">
                                      <div className="flex items-center gap-2">
                                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                                        {p.branch} · {p.age} yrs
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                                        {p.state}
                                      </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                                      <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full
                                          ${p.rehabilitationStatus === 'Rehabilitated' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        <span className={`text-[10px] font-semibold uppercase
                                          ${p.rehabilitationStatus === 'Rehabilitated' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                          {p.rehabilitationStatus}
                                        </span>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                  </Card>
                                )) : (
                                  <div className="col-span-full py-10 text-center">
                                    <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-slate-400 text-sm">No personnel found matching your search.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}