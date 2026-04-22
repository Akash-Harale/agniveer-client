'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Entity, CreateEntityPayload } from '@/lib/entity-service';
import { X } from 'lucide-react';

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEntityPayload) => Promise<void>;
  editingEntity?: Entity;
}

export function EntityModal({ isOpen, onClose, onSubmit, editingEntity }: EntityModalProps) {
  const isEditMode = !!editingEntity;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEntityPayload>({
    entity_name: '',
    short_name: '',
    description: '',
  });

  // Populate form when editing
  useEffect(() => {
    if (editingEntity) {
      setFormData({
        entity_name: editingEntity.entity_name,
        short_name: editingEntity.short_name,
        description: editingEntity.description,
      });
    } else {
      setFormData({ entity_name: '', short_name: '', description: '' });
    }
    setError(null);
  }, [editingEntity, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      setFormData({ entity_name: '', short_name: '', description: '' });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ entity_name: '', short_name: '', description: '' });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border border-slate-100 shadow-2xl shadow-slate-200/60 rounded-3xl">
        <div className="p-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Entity' : 'Create New Entity'}
              </h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">
                {isEditMode ? 'Update the details below' : 'Fill in the details below'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Entity Name
              </label>
              <Input
                type="text"
                placeholder="e.g., Central Armed Police Force"
                value={formData.entity_name}
                onChange={(e) => setFormData({ ...formData, entity_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Short Name
              </label>
              <Input
                type="text"
                placeholder="e.g., CAPF"
                value={formData.short_name}
                onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl py-5 transition-all active:scale-95"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl py-5 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-60"
              >
                {submitting ? (isEditMode ? 'Saving…' : 'Creating…') : (isEditMode ? 'Save Changes' : 'Create')}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}