'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OfficerModal } from '@/components/officer-modal';
import { getAllUsers, createUser, updateUser, deleteUser, UserFromAPI } from '@/lib/user-service';
import { getAllEntities } from '@/lib/entity-service';
import { getAllSubEntities } from '@/lib/sub-entity-service';
import type { EntityFromAPI, SubEntityFromAPI } from '@/components/officer-modal';;
import {
  ChevronDown, ChevronRight, User as UserIcon, Building2,
  Mail, Phone, Search, Trash2, Pencil,
  Star, Award, AlertCircle,
} from 'lucide-react';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function OfficersPage() {
  const [users, setUsers]               = useState<UserFromAPI[]>([]);
  const [entities, setEntities]         = useState<EntityFromAPI[]>([]);
  const [subEntities, setSubEntities]   = useState<SubEntityFromAPI[]>([]);
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState<string | null>(null);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingUser, setEditingUser]   = useState<UserFromAPI | null>(null);
  const [expandedEntities, setExpandedEntities] = useState<Record<string, boolean>>({});
  const [expandedSubs, setExpandedSubs]         = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery]   = useState('');

  /* ── Load all data ── */
  const loadData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [usersData, entitiesData, subEntitiesData] = await Promise.all([
        getAllUsers(),
        getAllEntities(),
        getAllSubEntities(),
      ]);
      setUsers(usersData);
      setEntities(entitiesData);
      setSubEntities(subEntitiesData);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ── Category counts (based on entity short_name) ── */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach(u => {
      const ent = entities.find(e => e._id === u.entity_id);
      const key = ent?.short_name?.toLowerCase() ?? 'other';
      counts[key] = (counts[key] ?? 0) + 1;
    });
    return {
      capf:        counts['capf']         ?? 0,
      statePolice: counts['state_police'] ?? counts['state police'] ?? 0,
      pasara:      counts['pasara']       ?? counts['psara'] ?? 0,
    };
  }, [users, entities]);

  /* ── Hierarchy tree: entity → sub-entity → users ── */
  const groupedData = useMemo(() => {
    const grouped: Record<string, {
      entity: EntityFromAPI;
      subs: Record<string, { sub: SubEntityFromAPI; users: UserFromAPI[] }>;
    }> = {};

    entities.forEach(ent => {
      grouped[ent._id] = { entity: ent, subs: {} };
      subEntities
        .filter(s => s.parent_entity_id === ent._id)
        .forEach(sub => {
          grouped[ent._id].subs[sub._id] = { sub, users: [] };
        });
    });

    users.forEach(u => {
      if (grouped[u.entity_id]?.subs[u.sub_entity_id]) {
        grouped[u.entity_id].subs[u.sub_entity_id].users.push(u);
      }
    });

    return Object.values(grouped);
  }, [entities, subEntities, users]);

  /* ── Handlers ── */
  const openCreate = () => { setEditingUser(null); setModalOpen(true); };
  const openEdit   = (u: UserFromAPI) => { setEditingUser(u); setModalOpen(true); };

  const handleSubmit = async (payload: {
    entity_id: string; sub_entity_id: string;
    officer_name: string; rank: string; designation: string;
    phone: string; email: string;
  }) => {
    if (editingUser) {
      await updateUser(editingUser._id, payload);
    } else {
      await createUser(payload);
    }
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this personnel record permanently?')) return;
    try { await deleteUser(id); loadData(); }
    catch (err: any) { alert(err.message); }
  };

  const toggleEntity = (id: string) =>
    setExpandedEntities(prev => ({ ...prev, [id]: !prev[id] }));

  const toggleSub = (id: string) =>
    setExpandedSubs(prev => ({ ...prev, [id]: !prev[id] }));

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Synchronizing personnel ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 px-4 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
            Portal Users
          </h1>
        </div>
        <Button
          onClick={openCreate}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all"
        >
          <UserIcon className="w-4 h-4" />
          Create New User
        </Button>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium mx-4 md:mx-0">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {fetchError}
          <button onClick={loadData} className="ml-auto text-xs underline underline-offset-2 hover:text-red-800">Retry</button>
        </div>
      )}

      {/* Category cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 md:px-0">
        <Card className="p-6 bg-white border border-slate-100 rounded-2xl shadow-none flex flex-col items-center justify-center text-center gap-2">
          <p className="text-base font-semibold text-slate-800 tracking-tight">CAPF</p>
          <p className="text-4xl font-semibold text-blue-600 tracking-tight">{categoryCounts.capf}</p>
          <p className="text-xs text-slate-400 font-medium">Users</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-100 rounded-2xl shadow-none flex flex-col items-center justify-center text-center gap-2">
          <p className="text-base font-semibold text-slate-800 tracking-tight">State Police</p>
          <p className="text-4xl font-semibold text-indigo-600 tracking-tight">{categoryCounts.statePolice}</p>
          <p className="text-xs text-slate-400 font-medium">Users</p>
        </Card>
        <Card className="p-6 bg-white border border-slate-100 rounded-2xl shadow-none flex flex-col items-center justify-center text-center gap-2">
          <p className="text-base font-semibold text-slate-800 tracking-tight">PASARA</p>
          <p className="text-4xl font-semibold text-emerald-600 tracking-tight">{categoryCounts.pasara}</p>
          <p className="text-xs text-slate-400 font-medium">Users</p>
        </Card>
      </div>

      {/* Search */}
      <div className="mx-4 md:mx-0 bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-none">
        <Search className="w-4 h-4 text-slate-300 shrink-0" />
        <input
          type="text"
          placeholder="Search personnel by name or rank..."
          className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-300"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Empty state */}
      {users.length === 0 && !fetchError ? (
        <Card className="bg-white border-2 border-dashed border-slate-100 p-20 text-center rounded-3xl mx-4 md:mx-0">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <UserIcon className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-800 font-semibold text-lg mb-1.5">Registry ledger empty</p>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            No records found. Begin enrollment to establish organisation hierarchy.
          </p>
        </Card>
      ) : (

        /* Hierarchy tree */
        <div className="space-y-4 px-4 md:px-0">
          {groupedData.map(group => {
            const isOpen = !!expandedEntities[group.entity._id];
            const totalMembers = Object.values(group.subs)
              .reduce((acc, sub) => acc + sub.users.length, 0);

            return (
              <div key={group.entity._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

                {/* Level 1 — Entity */}
                <div
                  className={`flex items-center justify-between p-5 cursor-pointer transition-colors
                    ${isOpen ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}
                  onClick={() => toggleEntity(group.entity._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-colors ${isOpen ? 'bg-blue-500' : 'bg-slate-100'}`}>
                      <Building2 className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 text-slate-400">
                        Tier 1 hierarchy
                      </p>
                      <h3 className="text-base font-semibold leading-tight">{group.entity.entity_name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-sm font-medium ${isOpen ? 'text-slate-300' : 'text-slate-400'}`}>
                      {totalMembers} members
                    </p>
                    {isOpen
                      ? <ChevronDown className="w-4 h-4 text-blue-400" />
                      : <ChevronRight className="w-4 h-4 text-slate-300" />}
                  </div>
                </div>

                {/* Level 2 — Sub-entities */}
                {isOpen && (
                  <div className="p-4 space-y-3 bg-slate-50/60">
                    {Object.values(group.subs).map(subData => {
                      const filteredUsers = subData.users.filter(u =>
                        !searchQuery ||
                        u.officer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.rank.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      if (filteredUsers.length === 0 && searchQuery) return null;

                      const subOpen = !!expandedSubs[subData.sub._id];

                      return (
                        <div key={subData.sub._id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                          <div
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors
                              ${subOpen ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                            onClick={() => toggleSub(subData.sub._id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-all
                                ${subOpen ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                                {subData.sub.sub_entity_name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{subData.sub.sub_entity_name}</p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                                  Active division · {filteredUsers.length} personnel
                                </p>
                              </div>
                            </div>
                            {subOpen
                              ? <ChevronDown className="w-4 h-4 text-blue-500" />
                              : <ChevronRight className="w-4 h-4 text-slate-300" />}
                          </div>

                          {/* Level 3 — User cards */}
                          {subOpen && (
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                              {filteredUsers.map(u => (
                                <Card key={u._id}
                                  className="p-4 bg-white border border-slate-100 hover:border-blue-300 hover:shadow-md transition-all rounded-xl group">

                                  {/* User header */}
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-500 group-hover:bg-slate-900 group-hover:text-blue-400 transition-all shrink-0">
                                      {getInitials(u.officer_name)}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-semibold text-slate-900 leading-tight truncate">
                                        {u.officer_name}
                                      </p>
                                      <p className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-0.5">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                                        {u.rank}
                                      </p>
                                    </div>
                                  </div>

                                  {/* User details */}
                                  <div className="space-y-2 text-xs text-slate-500 pt-3 border-t border-slate-50">
                                    <div className="flex items-center gap-2">
                                      <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                      <span className="font-medium">{u.designation}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-3.5 h-3.5 shrink-0" />
                                      <span className="truncate">{u.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3.5 h-3.5 shrink-0" />
                                      <span>{u.phone}</span>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
                                    <button
                                      onClick={e => { e.stopPropagation(); openEdit(u); }}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 text-[11px] font-medium transition-all"
                                    >
                                      <Pencil className="w-3 h-3" /> Modify
                                    </button>
                                    <button
                                      onClick={e => { e.stopPropagation(); handleDelete(u._id); }}
                                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-100 bg-slate-50 text-slate-400 hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-medium transition-all"
                                    >
                                      <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                  </div>
                                </Card>
                              ))}
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
      )}

      <OfficerModal
        isOpen={modalOpen}
        editingUser={editingUser}
        entities={entities}
        subEntities={subEntities}
        onClose={() => { setModalOpen(false); setEditingUser(null); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}