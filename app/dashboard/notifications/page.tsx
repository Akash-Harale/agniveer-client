'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NotificationModal } from '@/components/notification-modal';
import { getAllNotifications, createNotification, NotificationFromAPI, CreateNotificationPayload } from '@/lib/notification-service';
import { getAllEntities, Entity } from '@/lib/entity-service';
import { getAllSubEntities, SubEntityFromAPI } from '@/lib/sub-entity-service';
import {
  Bell, BellOff, Briefcase, Building2, Calendar,
  Clock, AlertCircle, ExternalLink
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationFromAPI[]>([]);
  const [entities, setEntities]           = useState<Entity[]>([]);
  const [subEntities, setSubEntities]     = useState<SubEntityFromAPI[]>([]);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [modalOpen, setModalOpen]         = useState(false);
  const [activeFilter, setActiveFilter]   = useState<'total' | 'current'>('current');

  const loadData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [notifData, entitiesData, subEntitiesData] = await Promise.all([
        getAllNotifications(),
        getAllEntities(),
        getAllSubEntities(),
      ]);
      setNotifications(notifData.sort((a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      ));
      setEntities(entitiesData);
      setSubEntities(subEntitiesData);
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const counts = useMemo(() => {
    const today = new Date();
    return {
      total: notifications.length,
      current: notifications.filter(n =>
        n.application_closing_date && new Date(n.application_closing_date) >= today
      ).length,
    };
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const today = new Date();
    if (activeFilter === 'total') return notifications;
    return notifications.filter(n =>
      n.application_closing_date && new Date(n.application_closing_date) >= today
    );
  }, [notifications, activeFilter]);

  const handleSubmit = async (payload: CreateNotificationPayload) => {
    await createNotification(payload);
    await loadData();
  };

  const getEntityName = (id: string) =>
    entities.find(e => e._id === id)?.entity_name || '—';

  const getSubEntityName = (id: string) =>
    subEntities.find(s => s._id === id)?.sub_entity_name || '—';

  if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading notifications…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-[900px] mx-auto space-y-8 px-4 md:px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8">
          <div className="border-l-4 border-blue-600 pl-4">
            <h1 className="text-2xl font-bold text-slate-900">Job Notifications</h1>
            <p className="text-sm text-slate-500 mt-0.5">AVRP Portal · Ministry of Defence</p>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition-all active:scale-95 flex items-center gap-2"
          >
            <Bell className="w-4 h-4 text-blue-400" />
            Create Notification
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

        {/* Filter Cards */}
        {!fetchError && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setActiveFilter('total')}
              className={`text-left transition-all duration-200 ${activeFilter === 'total' ? 'scale-[1.01]' : 'opacity-70 hover:opacity-100'}`}
            >
              <Card className={`p-6 border-2 rounded-2xl transition-all duration-300 ${activeFilter === 'total' ? 'border-blue-500 bg-white shadow-lg shadow-blue-100' : 'border-slate-200 bg-white/60 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900">{counts.total}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">Total Openings</p>
                  </div>
                  <div className={`p-4 rounded-xl ${activeFilter === 'total' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                    <Briefcase className="w-7 h-7" />
                  </div>
                </div>
              </Card>
            </button>

            <button
              onClick={() => setActiveFilter('current')}
              className={`text-left transition-all duration-200 ${activeFilter === 'current' ? 'scale-[1.01]' : 'opacity-70 hover:opacity-100'}`}
            >
              <Card className={`p-6 border-2 rounded-2xl transition-all duration-300 ${activeFilter === 'current' ? 'border-emerald-500 bg-white shadow-lg shadow-emerald-100' : 'border-slate-200 bg-white/60 shadow-sm'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900">{counts.current}</h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1">Current Openings</p>
                  </div>
                  <div className={`p-4 rounded-xl ${activeFilter === 'current' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
                    <Clock className="w-7 h-7" />
                  </div>
                </div>
              </Card>
            </button>
          </div>
        )}

        {/* Section Label */}
        {!fetchError && (
          <div className="px-1">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              {activeFilter === 'current' ? 'Current Active Openings' : 'All Historical Listings'}
            </h2>
          </div>
        )}

        {/* Empty State */}
        {!fetchError && filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
            <div className="p-7 rounded-2xl bg-slate-50 mb-5 border border-slate-100">
              <BellOff className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-800 font-bold text-lg mb-1">No Active Openings</p>
            <p className="text-slate-400 text-sm max-w-xs">No notifications found for this filter.</p>
          </div>
        )}

        {/* Notification Cards */}
        {!fetchError && filteredNotifications.length > 0 && (
          <div className="space-y-4">
            {filteredNotifications.map((n) => (
              <div key={n._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-6">

                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-xl">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                        Recruitment
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      Posted: {n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-blue-700 mb-1">{n.notification_title}</h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">{n.description}</p>

                  {/* Meta grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
                        <Calendar className="w-3 h-3" /> Advt. No
                      </p>
                      <p className="text-sm font-semibold text-slate-700">{n.advertisement_number}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
                        <Building2 className="w-3 h-3" /> Organisation
                      </p>
                      <p className="text-sm font-semibold text-slate-700">{getEntityName(n.entity_id)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
                        <Calendar className="w-3 h-3" /> Opening Date
                      </p>
                      <p className="text-sm font-bold text-emerald-600">
                        {new Date(n.application_opening_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-0.5">
                        <Clock className="w-3 h-3" /> Closing Date
                      </p>
                      <p className="text-sm font-bold text-rose-500">
                        {new Date(n.application_closing_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-400">{getSubEntityName(n.sub_entity_id)}</span>
                    <Link
                      href={`/dashboard/notifications/${n._id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                      View Details <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NotificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        entities={entities}
        subEntities={subEntities}
      />
    </div>
  );
}