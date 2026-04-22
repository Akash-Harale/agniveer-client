'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { UserFromAPI } from '@/lib/user-service';
import { X, User, Building2, Mail, Phone, Award, Star, Shield } from 'lucide-react';

/* ── Types ────────────────────────────────────────────────────────────────── */

export interface EntityFromAPI {
  _id: string;
  entity_name: string;
  short_name?: string;
}

export interface SubEntityFromAPI {
  _id: string;
  parent_entity_id: string;
  sub_entity_name: string;
  short_name?: string;
}

export interface OfficerSubmitPayload {
  entity_id: string;
  sub_entity_id: string;
  officer_name: string;
  rank: string;
  designation: string;
  phone: string;
  email: string;
}

interface OfficerModalProps {
  isOpen: boolean;
  editingUser?: UserFromAPI | null;
  entities: EntityFromAPI[];
  subEntities: SubEntityFromAPI[];
  onClose: () => void;
  onSubmit: (data: OfficerSubmitPayload) => Promise<void>;
}

/* ── Component ────────────────────────────────────────────────────────────── */

export function OfficerModal({
  isOpen,
  editingUser,
  entities,
  subEntities,
  onClose,
  onSubmit,
}: OfficerModalProps) {
  const isEditMode = !!editingUser;

  const [entityId, setEntityId]       = useState('');
  const [subEntityId, setSubEntityId] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [formData, setFormData]       = useState({
    officer_name: '',
    rank:         '',
    designation:  '',
    email:        '',
    phone:        '',
  });

  /* Re-initialise when modal opens or editingUser changes */
  useEffect(() => {
    if (editingUser) {
      setEntityId(editingUser.entity_id);
      setSubEntityId(editingUser.sub_entity_id);
      setFormData({
        officer_name: editingUser.officer_name,
        rank:         editingUser.rank,
        designation:  editingUser.designation,
        email:        editingUser.email,
        phone:        editingUser.phone,
      });
    } else {
      setEntityId('');
      setSubEntityId('');
      setFormData({ officer_name: '', rank: '', designation: '', email: '', phone: '' });
    }
  }, [editingUser, isOpen]);

  /* Reset sub-entity when entity changes (create mode only) */
  useEffect(() => {
    if (!isEditMode) setSubEntityId('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId]);

  const filteredSubEntities = subEntities.filter(s => s.parent_entity_id === entityId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entityId || !subEntityId) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...formData, entity_id: entityId, sub_entity_id: subEntityId });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputCls =
    'w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm ' +
    'placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

  const selectCls = inputCls + ' disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <Card className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div
          className="relative px-6 pt-6 pb-5 border-b border-slate-100"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white leading-tight">
                {isEditMode ? 'Edit Officer' : 'Create New User'}
              </h2>
              <p className="text-blue-200 text-xs mt-0.5">
                {isEditMode ? 'Update existing record' : 'Add new officer to registry'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Entity */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Entity
              </label>
              {isEditMode ? (
                <div className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm cursor-not-allowed select-none">
                  {entities.find(e => e._id === entityId)?.entity_name ?? entityId}
                </div>
              ) : (
                <select
                  value={entityId}
                  onChange={e => setEntityId(e.target.value)}
                  className={selectCls}
                  required
                >
                  <option value="">Select an entity</option>
                  {entities.map(ent => (
                    <option key={ent._id} value={ent._id}>{ent.entity_name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Sub Entity */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" /> Sub Entity
              </label>
              {isEditMode ? (
                <div className="w-full px-3 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm cursor-not-allowed select-none">
                  {subEntities.find(s => s._id === subEntityId)?.sub_entity_name ?? subEntityId}
                </div>
              ) : (
                <select
                  value={subEntityId}
                  onChange={e => setSubEntityId(e.target.value)}
                  className={selectCls}
                  required
                  disabled={!entityId}
                >
                  <option value="">{entityId ? 'Select a sub-entity' : '— select entity first —'}</option>
                  {filteredSubEntities.map(se => (
                    <option key={se._id} value={se._id}>{se.sub_entity_name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Officer Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" /> Officer Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.officer_name}
                onChange={e => setFormData({ ...formData, officer_name: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            {/* Rank + Designation */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> Rank
                </label>
                <input
                  type="text"
                  placeholder="e.g. Inspector"
                  value={formData.rank}
                  onChange={e => setFormData({ ...formData, rank: e.target.value })}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" /> Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g. IG"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className={inputCls}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> Email
              </label>
              <input
                type="email"
                placeholder="officer@example.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" /> Phone
              </label>
              <input
                type="tel"
                placeholder="+91-XXXXXXXXXX"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)' }}
              >
                {submitting ? 'Saving…' : isEditMode ? 'Update Record' : 'Enroll Officer'}
              </button>
            </div>

          </form>
        </div>
      </Card>
    </div>
  );
}