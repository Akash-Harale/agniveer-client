'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ChevronDown, ChevronRight, Building2, Layers, Pencil, Search, X, AlertCircle } from 'lucide-react';
import { getAllSubEntities, createSubEntity, updateSubEntity, SubEntityFromAPI, CreateSubEntityPayload } from '@/lib/sub-entity-service';
import { getAllEntities, Entity } from '@/lib/entity-service';
import { SubEntityModal } from '@/components/sub-entity-modal';
export default function SubEntitiesPage() {
  const [subEntities, setSubEntities]       = useState<SubEntityFromAPI[]>([]);
  const [entities, setEntities]             = useState<Entity[]>([]);
  const [loading, setLoading]               = useState(true);
  const [fetchError, setFetchError]         = useState<string | null>(null);
  const [modalOpen, setModalOpen]           = useState(false);
  const [editingSubEntity, setEditingSubEntity] = useState<SubEntityFromAPI | undefined>();
  const [expandedEntities, setExpandedEntities] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery]       = useState('');

  const loadData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [subEntitiesData, entitiesData] = await Promise.all([
        getAllSubEntities(),
        getAllEntities(),
      ]);
      setSubEntities(subEntitiesData);
      setEntities(entitiesData);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Group sub-entities by parent_entity_id
  const groupedSubEntities = useMemo(() => {
    const grouped: Record<string, SubEntityFromAPI[]> = {};
    subEntities.forEach(sub => {
      if (!grouped[sub.parent_entity_id]) grouped[sub.parent_entity_id] = [];
      grouped[sub.parent_entity_id].push(sub);
    });
    return grouped;
  }, [subEntities]);

  const filteredEntities = useMemo(() => {
    const base = !searchQuery.trim()
      ? entities
      : entities.filter(entity => {
          const q = searchQuery.toLowerCase();
          const entityMatch = entity.entity_name.toLowerCase().includes(q);
          const subs = groupedSubEntities[entity._id] || [];
          const subMatch = subs.some(s => s.sub_entity_name.toLowerCase().includes(q));
          return entityMatch || subMatch;
        });

    const ENTITY_ORDER: Record<string, number> = {
  CAPF: 1,
  ITVP: 2,   // State/UT Police
  PSARA: 3
};

return [...base].sort((a, b) => {
  return (ENTITY_ORDER[a.short_name] || 999) - (ENTITY_ORDER[b.short_name] || 999);
});
  }, [entities, groupedSubEntities, searchQuery]);

  const filteredGroupedSubEntities = useMemo(() => {
    if (!searchQuery.trim()) return groupedSubEntities;
    const q = searchQuery.toLowerCase();
    const result: Record<string, SubEntityFromAPI[]> = {};
    Object.entries(groupedSubEntities).forEach(([entityId, subs]) => {
      const entity = entities.find(e => e._id === entityId);
      const entityMatch = entity?.entity_name.toLowerCase().includes(q);
      result[entityId] = entityMatch ? subs : subs.filter(s => s.sub_entity_name.toLowerCase().includes(q));
    });
    return result;
  }, [groupedSubEntities, entities, searchQuery]);

  const toggleExpand = (entityId: string) => {
    setExpandedEntities(prev => ({ ...prev, [entityId]: !prev[entityId] }));
  };

  const handleSubmit = async (payload: CreateSubEntityPayload) => {
    if (editingSubEntity) {
      await updateSubEntity(editingSubEntity._id, payload);
    } else {
      await createSubEntity(payload);
    }
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading sub-entities…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">Sub Entities</h1>
          <p className="text-slate-500 text-sm mt-1">Manage sub-entities grouped by parent organization</p>
        </div>
        <Button
          onClick={() => { setEditingSubEntity(undefined); setModalOpen(true); }}
          className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-8 py-5 md:py-6 shadow-xl shadow-blue-200 transition-all active:scale-95 flex gap-3 text-xs uppercase tracking-widest items-center justify-center"
        >
          <Layers className="w-5 h-5 text-blue-200 shrink-0" />
          Create Sub-Entity
        </Button>
      </div>

      {/* Error */}
      {fetchError && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {fetchError}
          <button onClick={loadData} className="ml-auto text-xs underline underline-offset-2 hover:text-red-800">Retry</button>
        </div>
      )}

      {/* Search */}
      {!fetchError && (
        <div className="px-4 md:px-0">
          <div className="relative group max-w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by entity or sub-entity name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                <X className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!fetchError && subEntities.length === 0 && (
        <Card className="bg-white border-2 border-dashed border-slate-200 p-20 text-center rounded-[2.5rem] shadow-sm">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-slate-600 font-black text-2xl tracking-tight mb-2">Registry Empty</p>
          <p className="text-slate-400 text-base max-w-xs mx-auto">No sub-entities found. Create your first one.</p>
        </Card>
      )}

      {/* No search results */}
      {!fetchError && subEntities.length > 0 && filteredEntities.length === 0 && (
        <Card className="bg-white border border-slate-100 p-16 text-center rounded-[2.5rem] shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-600 font-black text-xl tracking-tight mb-1">No Results Found</p>
          <p className="text-slate-400 text-sm">No match for "<span className="font-bold">{searchQuery}</span>"</p>
        </Card>
      )}

      {/* Table */}
      {!fetchError && subEntities.length > 0 && filteredEntities.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="min-w-[800px]">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                  <th className="px-6 py-5 text-left w-12"></th>
                  <th className="px-6 py-5 text-left">Organization</th>
                  <th className="px-6 py-5 text-center">Code</th>
                  <th className="px-6 py-5 text-left">HQ</th>
                  <th className="px-6 py-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEntities.map(entity => {
                  const subsForEntity = filteredGroupedSubEntities[entity._id] || [];
                  const isExpanded = expandedEntities[entity._id];

                  return (
                    <React.Fragment key={entity._id}>
                      {/* Entity Row */}
                      <tr
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors bg-white group"
                        onClick={() => toggleExpand(entity._id)}
                      >
                        <td className="px-6 py-5 text-center">
                          {isExpanded
                            ? <ChevronDown className="w-4 h-4 text-blue-600" />
                            : <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                          }
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-50 p-2 rounded-xl">
                              <Building2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <span className="font-black text-slate-900 text-base tracking-tight block">{entity.entity_name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subsForEntity.length} Sub-entities</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <code className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg uppercase">{entity.short_name}</code>
                        </td>
                        <td className="px-6 py-5" />
                        <td className="px-6 py-5">
                          <div className="flex justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleExpand(entity._id); }}
                              className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all ${isExpanded ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600'}`}
                            >
                              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Sub-Entity Rows */}
                      {isExpanded && (
                        subsForEntity.length > 0 ? subsForEntity.map(sub => (
                          <tr key={sub._id} className="bg-slate-50/20 hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4" />
                            <td className="px-12 py-4">
                              <div className="pl-4 border-l-2 border-slate-100">
                                <span className="font-bold text-slate-700">{sub.sub_entity_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <code className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg uppercase border border-blue-100">{sub.short_name}</code>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-500 text-xs line-clamp-1">
                                {[sub.hq_city, sub.hq_state].filter(Boolean).join(', ') || '—'}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingSubEntity(sub); setModalOpen(true); }}
                                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all shadow-sm"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr className="bg-slate-50/10">
                            <td className="px-6 py-4" />
                            <td colSpan={4} className="px-12 py-6 text-slate-400 italic text-xs">
                              No sub-entities registered under this entity.
                            </td>
                          </tr>
                        )
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <SubEntityModal
        isOpen={modalOpen}
        subEntity={editingSubEntity}
        entities={entities}
        isEditing={!!editingSubEntity}
        onClose={() => { setModalOpen(false); setEditingSubEntity(undefined); }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}