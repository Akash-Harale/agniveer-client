'use client';

import { useState, useEffect } from 'react';
import { X, Building2, Hash, MapPin, Globe, Layers, Lock } from 'lucide-react';
import { SubEntityFromAPI, CreateSubEntityPayload } from '@/lib/sub-entity-service';
import { Entity } from '@/lib/entity-service';

interface SubEntityModalProps {
  isOpen: boolean;
  subEntity?: SubEntityFromAPI;
  entities: Entity[];
  isEditing?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubEntityPayload) => Promise<void>;
}

export function SubEntityModal({
  isOpen,
  subEntity,
  entities,
  isEditing = false,
  onClose,
  onSubmit,
}: SubEntityModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateSubEntityPayload>({
    parent_entity_id: '',
    sub_entity_name: '',
    short_name: '',
    hq_street_address: '',
    hq_pincode: undefined,
    hq_city: '',
    hq_state: '',
    official_website_url: '',
  });

  useEffect(() => {
    if (subEntity) {
      setFormData({
        parent_entity_id: subEntity.parent_entity_id,
        sub_entity_name: subEntity.sub_entity_name,
        short_name: subEntity.short_name,
        hq_street_address: subEntity.hq_street_address || '',
        hq_pincode: subEntity.hq_pincode,
        hq_city: subEntity.hq_city || '',
        hq_state: subEntity.hq_state || '',
        official_website_url: subEntity.official_website_url || '',
      });
    } else {
      setFormData({
        parent_entity_id: entities[0]?._id || '',
        sub_entity_name: '',
        short_name: '',
        hq_street_address: '',
        hq_pincode: undefined,
        hq_city: '',
        hq_state: '',
        official_website_url: '',
      });
    }
    setError(null);
  }, [subEntity, isOpen, entities]);

  const set = (field: keyof CreateSubEntityPayload, value: string | number) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputCls = `w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200
    text-slate-800 placeholder-slate-300 text-sm font-medium
    focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400
    transition-all duration-200`;

  const lockedInputCls = `w-full px-4 py-3 rounded-2xl bg-slate-100 border border-slate-150
    text-slate-400 text-sm font-medium cursor-not-allowed select-none`;

  const labelCls = 'block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2';

  const parentEntityName = entities.find(e => e._id === formData.parent_entity_id)?.entity_name ?? '—';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-slate-300/40 border border-slate-100 max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white rounded-t-[2rem] border-b border-slate-100 px-8 pt-7 pb-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  {isEditing ? 'Edit Sub-Entity' : 'Create Sub-Entity'}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                  {isEditing ? (
                    <><Lock className="w-3 h-3" /> Some fields are locked</>
                  ) : (
                    'Fill in the details to register a new sub-entity'
                  )}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all active:scale-95">
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">

          {error && (
            <div className="px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-md bg-blue-100 flex items-center justify-center">
                <Building2 className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic Information</span>
              <div className="flex-1 h-px bg-slate-100 ml-1" />
            </div>

            <div className="space-y-4">
              {/* Parent Entity */}
              <div>
                <label className={`${labelCls} flex items-center gap-1.5`}>
                  Parent Entity {isEditing && <Lock className="w-2.5 h-2.5 text-slate-300" />}
                </label>
                {isEditing ? (
                  <div className={lockedInputCls}>{parentEntityName}</div>
                ) : (
                  <select
                    className={inputCls}
                    value={formData.parent_entity_id}
                    onChange={(e) => set('parent_entity_id', e.target.value)}
                    required
                  >
                    <option value="">Select a parent entity</option>
                    {entities.map((entity) => (
                      <option key={entity._id} value={entity._id}>{entity.entity_name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sub-Entity Name */}
                <div>
                  <label className={`${labelCls} flex items-center gap-1.5`}>
                    Sub-Entity Name {isEditing && <Lock className="w-2.5 h-2.5 text-slate-300" />}
                  </label>
                  <input
                    className={isEditing ? lockedInputCls : inputCls}
                    type="text"
                    placeholder="e.g. Indo Tibetan Border Police"
                    value={formData.sub_entity_name}
                    onChange={(e) => !isEditing && set('sub_entity_name', e.target.value)}
                    disabled={isEditing}
                    required
                  />
                </div>

                {/* Short Name */}
                <div>
                  <label className={`${labelCls} flex items-center gap-1.5`}>
                    Short Name {isEditing && <Lock className="w-2.5 h-2.5 text-slate-300" />}
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                    <input
                      className={`${isEditing ? lockedInputCls : inputCls} pl-9`}
                      type="text"
                      placeholder="e.g. ITBP"
                      value={formData.short_name}
                      onChange={(e) => !isEditing && set('short_name', e.target.value)}
                      disabled={isEditing}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HQ Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-md bg-emerald-100 flex items-center justify-center">
                <MapPin className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headquarters Details</span>
              <div className="flex-1 h-px bg-slate-100 ml-1" />
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>HQ Street Address</label>
                <input
                  className={inputCls}
                  type="text"
                  placeholder="e.g. 123 Main St"
                  value={formData.hq_street_address}
                  onChange={(e) => set('hq_street_address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>City</label>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="e.g. New Delhi"
                    value={formData.hq_city}
                    onChange={(e) => set('hq_city', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input
                    className={inputCls}
                    type="text"
                    placeholder="e.g. Delhi"
                    value={formData.hq_state}
                    onChange={(e) => set('hq_state', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelCls}>Pincode</label>
                  <input
                    className={inputCls}
                    type="number"
                    placeholder="112505"
                    value={formData.hq_pincode ?? ''}
                    onChange={(e) => set('hq_pincode', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Website */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
                <Globe className="w-3 h-3 text-indigo-600" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Online Presence</span>
              <div className="flex-1 h-px bg-slate-100 ml-1" />
            </div>
            <div>
              <label className={labelCls}>Official Website</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 pointer-events-none" />
                <input
                  className={`${inputCls} pl-9`}
                  type="url"
                  placeholder="https://example.com"
                  value={formData.official_website_url}
                  onChange={(e) => set('official_website_url', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? (isEditing ? 'Saving…' : 'Creating…') : (isEditing ? 'Update Sub-Entity' : 'Create Sub-Entity')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}