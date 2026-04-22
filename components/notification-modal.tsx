'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CreateNotificationPayload } from '@/lib/notification-service';
import { Entity } from '@/lib/entity-service';
import { SubEntityFromAPI } from '@/lib/sub-entity-service';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNotificationPayload) => Promise<void>;
  entities: Entity[];
  subEntities: SubEntityFromAPI[];
}

const emptyForm = (): CreateNotificationPayload => ({
  advertisement_number: '',
  date_of_advertisement: '',
  application_opening_date: '',
  application_closing_date: '',
  notification_title: '',
  description: '',
  job_link_url: '',
  entity_id: '',
  sub_entity_id: '',
});

export function NotificationModal({
  isOpen,
  onClose,
  onSubmit,
  entities,
  subEntities,
}: NotificationModalProps) {
  const [formData, setFormData] = useState<CreateNotificationPayload>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredSubEntities = subEntities.filter(
    s => s.parent_entity_id === formData.entity_id
  );

  useEffect(() => {
    if (!isOpen) {
      setFormData(emptyForm());
      setError(null);
    }
  }, [isOpen]);

  const handleEntityChange = (entity_id: string) => {
    setFormData(prev => ({ ...prev, entity_id, sub_entity_id: '' }));
  };

  const set = (field: keyof CreateNotificationPayload, value: string) =>
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

  const inputCls = `w-full px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 
    placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 
    focus:ring-blue-500 transition-colors`;
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1a2a6c] to-[#1e3a8a] px-6 py-4 rounded-t-2xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-white">Create Job Notification</h2>
            <p className="text-blue-200 text-xs mt-0.5">Fill the details to post a new job opening</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Advertisement No & Date of Advertisement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Advertisement No.</label>
              <input
                className={inputCls}
                type="text"
                placeholder="e.g. ITBP/REC/2026/45"
                value={formData.advertisement_number}
                onChange={(e) => set('advertisement_number', e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Date of Advertisement</label>
              <input
                className={inputCls}
                type="date"
                value={formData.date_of_advertisement}
                onChange={(e) => set('date_of_advertisement', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Opening & Closing Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Application Opening Date</label>
              <input
                className={inputCls}
                type="date"
                value={formData.application_opening_date}
                onChange={(e) => set('application_opening_date', e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelCls}>Application Closing Date</label>
              <input
                className={inputCls}
                type="date"
                value={formData.application_closing_date}
                onChange={(e) => set('application_closing_date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Notification Title */}
          <div>
            <label className={labelCls}>Notification Title</label>
            <input
              className={inputCls}
              type="text"
              placeholder="e.g. Agniveer Recruitment 2026"
              value={formData.notification_title}
              onChange={(e) => set('notification_title', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={4}
              placeholder="Enter full notification details..."
              value={formData.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>

          {/* Job Link */}
          <div>
            <label className={labelCls}>Job Link URL</label>
            <input
              className={inputCls}
              type="url"
              placeholder="https://agniveer.gov.in/"
              value={formData.job_link_url}
              onChange={(e) => set('job_link_url', e.target.value)}
            />
          </div>

          {/* Entity & Sub-Entity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Entity</label>
              <select
                className={inputCls}
                value={formData.entity_id}
                onChange={(e) => handleEntityChange(e.target.value)}
                required
              >
                <option value="">Select entity</option>
                {entities.map(e => (
                  <option key={e._id} value={e._id}>{e.entity_name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Sub-Entity</label>
              <select
                className={inputCls}
                value={formData.sub_entity_id}
                onChange={(e) => set('sub_entity_id', e.target.value)}
                required
                disabled={!formData.entity_id}
              >
                <option value="">Select sub-entity</option>
                {filteredSubEntities.map(s => (
                  <option key={s._id} value={s._id}>{s.sub_entity_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg bg-[#1a2a6c] hover:bg-[#162059] text-white font-bold text-sm transition-colors shadow-md disabled:opacity-60"
            >
              {submitting ? 'Creating…' : 'Create Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}