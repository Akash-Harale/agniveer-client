'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EntityModal } from '@/components/entity-modal';
import { Plus, Pencil, AlertCircle } from 'lucide-react';

import {
  Entity,
  CreateEntityPayload,
  getAllEntities,
  createEntity,
  updateEntity,
} from '@/lib/entity-service';

const ENTITY_ORDER: Record<string, number> = {
  CAPF: 1,
  ITVP: 2,   // State/UT Police
  PSARA: 3
};

function sortEntities(data: Entity[]): Entity[] {
  return [...data].sort((a, b) => {
    return (ENTITY_ORDER[a.short_name] || 999) - (ENTITY_ORDER[b.short_name] || 999);
  });
}

export default function EntitiesPage() {
  const [entities, setEntities]           = useState<Entity[]>([]);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | undefined>();

  const loadEntities = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await getAllEntities();
      setEntities(sortEntities(data));
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load entities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEntities(); }, []);

  const handleSubmit = async (payload: CreateEntityPayload) => {
    if (editingEntity) {
      await updateEntity(editingEntity._id, payload);
    } else {
      await createEntity(payload);
    }
    await loadEntities();
  };

  const openEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingEntity(undefined);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading entities…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Entities
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all security entities and organizations
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-5 md:py-6 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
        >
          <Plus className="w-5 h-5 text-blue-200 shrink-0" />
          Create New Entity
        </Button>
      </div>

      {fetchError && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {fetchError}
          <button onClick={loadEntities} className="ml-auto text-xs underline underline-offset-2 hover:text-red-800">
            Retry
          </button>
        </div>
      )}

      {!fetchError && entities.length === 0 && (
        <Card className="bg-white border border-slate-200 p-12 text-center rounded-3xl shadow-sm">
          <p className="text-slate-500 font-medium text-lg">No entities found.</p>
          <p className="text-slate-400 text-sm mt-1">Create your first entity to get started.</p>
        </Card>
      )}

      {!fetchError && entities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <Card
              key={entity._id}
              className="bg-white border border-slate-100 p-6 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative"
            >
              {/* Edit button */}
              <button
                onClick={() => openEdit(entity)}
                className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 flex items-center justify-center transition-all"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500" />
              </button>

              <div className="mb-4 pr-10">
                <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {entity.entity_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Code:</span>
                  <span className="text-xs font-bold text-slate-600">{entity.short_name}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 mb-6">
                <p className="text-slate-600 text-sm italic line-clamp-2">
                  "{entity.description || 'No description provided.'}"
                </p>
              </div>

              {entity.createdAt && (
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Created: {new Date(entity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <EntityModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingEntity(undefined); }}
        onSubmit={handleSubmit}
        editingEntity={editingEntity}
      />
    </div>
  );
}