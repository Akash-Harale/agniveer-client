'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getNotificationById, NotificationFromAPI } from '@/lib/notification-service';
import { getAllEntities, Entity } from '@/lib/entity-service';
import { getAllSubEntities, SubEntityFromAPI } from '@/lib/sub-entity-service';

/* ============================================================
   HELPERS
   ============================================================ */
function fmt(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function fmtFull(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function isActive(closingDate?: string) {
  if (!closingDate) return false;
  return new Date(closingDate) >= new Date();
}

/* ============================================================
   INFO ROW
   ============================================================ */
function InfoRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  valueColor?: string;
}) {
  return (
    <div style={s.infoRow}>
      <div style={s.infoIconBox}>
        <span style={{ fontSize: 15 }}>{icon}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={s.infoLabel}>{label}</p>
        <p style={{ ...s.infoValue, color: valueColor || '#1e293b' }}>{value}</p>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION CARD
   ============================================================ */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={s.sectionCard}>
      <h2 style={s.sectionTitle}>{title}</h2>
      <div>{children}</div>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function NotificationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [notification, setNotification] = useState<NotificationFromAPI | null>(null);
  const [entities, setEntities]         = useState<Entity[]>([]);
  const [subEntities, setSubEntities]   = useState<SubEntityFromAPI[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [notif, ents, subs] = await Promise.all([
          getNotificationById(id),
          getAllEntities(),
          getAllSubEntities(),
        ]);
        setNotification(notif);
        setEntities(ents);
        setSubEntities(subs);
      } catch (err: any) {
        setError(err.message || 'Failed to load notification.');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const entityName    = entities.find(e => e._id === notification?.entity_id)?.entity_name    || '—';
  const subEntityName = subEntities.find(s => s._id === notification?.sub_entity_id)?.sub_entity_name || '—';
  const active        = isActive(notification?.application_closing_date);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={s.centerWrap}>
          <div style={s.spinner} />
          <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, margin: 0 }}>
            Loading notification details…
          </p>
        </div>
      </>
    );
  }

  /* ── Error ── */
  if (error || !notification) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 16px' }}>
        <div style={s.errorBox}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <span>{error || 'Notification not found.'}</span>
        </div>
        <button onClick={() => router.back()} style={s.backBtn}>
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        .nd-card           { animation: fadeUp 0.4s ease both; }
        .nd-card:nth-child(2) { animation-delay: 0.07s; }
        .nd-card:nth-child(3) { animation-delay: 0.14s; }
        .nd-card:nth-child(4) { animation-delay: 0.21s; }
        .nd-card:nth-child(5) { animation-delay: 0.28s; }
        .nd-back:hover     { color: #1e293b !important; }
        .nd-apply:hover    { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(30,58,95,0.35) !important; }
        .nd-apply          { transition: transform 0.2s ease, box-shadow 0.2s ease; }
      `}</style>

      <div style={s.page}>
        <div style={s.container}>

          {/* Back button */}
          <div style={{ paddingTop: 32, paddingBottom: 16 }}>
           
          </div>

          {/* ── Hero card ── */}
          <div className="nd-card" style={s.heroCard}>
            {/* Decorative circles */}
            <div style={s.circle1} />
            <div style={s.circle2} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Top row */}
              <div style={s.heroTopRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={s.heroBellWrap}>
                    <span style={{ fontSize: 20 }}>🔔</span>
                  </div>
                  <span style={s.heroTagPill}>Recruitment Notification</span>
                </div>
                <span style={{
                  ...s.statusPill,
                  background: active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                  color:      active ? '#6ee7b7'              : '#fca5a5',
                  border:     `1px solid ${active ? 'rgba(52,211,153,0.3)' : 'rgba(252,165,165,0.3)'}`,
                }}>
                  {active ? '● Active' : '○ Closed'}
                </span>
              </div>

              <h1 style={s.heroTitle}>{notification.notification_title}</h1>
              <p style={s.heroDesc}>{notification.description}</p>
            </div>
          </div>

          {/* ── Two-column grid ── */}
          <div style={s.twoCol}>

            {/* Advertisement Details */}
            <div className="nd-card">
              <SectionCard title="Advertisement Details">
                <InfoRow icon="🔢" label="Advertisement Number"  value={notification.advertisement_number} />
                <InfoRow icon="📄" label="Date of Advertisement" value={fmt(notification.date_of_advertisement)} />
              </SectionCard>
            </div>

            {/* Organisation */}
            <div className="nd-card">
              <SectionCard title="Organisation">
                <InfoRow icon="🏛️" label="Entity"     value={entityName} />
                <InfoRow icon="🏢" label="Sub Entity" value={subEntityName} />
              </SectionCard>
            </div>
          </div>

          {/* ── Application Window ── */}
          <div className="nd-card" style={{ marginBottom: 16 }}>
            <SectionCard title="Application Window">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <InfoRow
                  icon="✅"
                  label="Opening Date"
                  value={fmt(notification.application_opening_date)}
                  valueColor="#059669"
                />
                <InfoRow
                  icon={active ? '🕐' : '🔴'}
                  label="Closing Date"
                  value={fmt(notification.application_closing_date)}
                  valueColor={active ? '#f43f5e' : '#94a3b8'}
                />
              </div>
            </SectionCard>
          </div>

          {/* ── System Information ── */}
          <div className="nd-card" style={{ marginBottom: 16 }}>
            <SectionCard title="System Information">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <InfoRow icon="🕒" label="Created At"  value={fmtFull(notification.createdAt)} />
                <InfoRow icon="📅" label="Updated At"  value={fmtFull(notification.updatedAt)} />
                <InfoRow
                  icon="🪪"
                  label="Notification ID"
                  value={
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748b', wordBreak: 'break-all' }}>
                      {notification._id}
                    </span>
                  }
                />
                <InfoRow
                  icon="📍"
                  label="Entity ID"
                  value={
                    <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748b', wordBreak: 'break-all' }}>
                      {notification.entity_id}
                    </span>
                  }
                />
              </div>
            </SectionCard>
          </div>

          {/* ── Apply button ── */}
          {notification.job_link_url && (
            <a
              href={notification.job_link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="nd-apply nd-card"
              style={s.applyBtn}
            >
              Apply / View Official Notice &nbsp; ↗
            </a>
          )}

        </div>
      </div>
    </>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const s: Record<string, React.CSSProperties> = {

  page: {
    minHeight: '100vh',
    background: '#f1f5f9',
    paddingBottom: 64,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  container: {
    maxWidth: 768,
    margin: '0 auto',
    padding: '0 16px',
  },

  /* Loading */
  centerWrap: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: '70vh', gap: 12,
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid #e2e8f0',
    borderTopColor: '#1d4ed8',
    borderRadius: '50%',
    animation: 'spin 0.75s linear infinite',
  },

  /* Error */
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 20px', borderRadius: 16,
    background: '#fef2f2', border: '1px solid #fee2e2',
    color: '#dc2626', fontSize: 14, fontWeight: 600,
    marginBottom: 20,
  },

  /* Back button */
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 13, color: '#64748b', fontWeight: 600,
    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
    transition: 'color 0.15s',
  },

  /* Hero */
  heroCard: {
    borderRadius: 20,
    padding: '24px',
    marginBottom: 20,
    background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(30,58,95,0.28)',
  },
  circle1: {
    position: 'absolute', top: 0, right: 0,
    width: 220, height: 220, borderRadius: '50%',
    background: 'rgba(255,255,255,0.06)',
    transform: 'translate(50%,-50%)',
  },
  circle2: {
    position: 'absolute', bottom: 0, left: 0,
    width: 140, height: 140, borderRadius: '50%',
    background: 'rgba(255,255,255,0.05)',
    transform: 'translate(-40%,40%)',
  },
  heroTopRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', gap: 12,
    marginBottom: 16, flexWrap: 'wrap',
  },
  heroBellWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: 'rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  heroTagPill: {
    fontSize: 11, fontWeight: 700,
    padding: '4px 14px', borderRadius: 20,
    background: 'rgba(255,255,255,0.15)',
    color: '#bfdbfe', letterSpacing: 0.4,
  },
  statusPill: {
    fontSize: 11, fontWeight: 700,
    padding: '5px 14px', borderRadius: 20,
    flexShrink: 0,
  },
  heroTitle: {
    fontSize: 22, fontWeight: 900, color: '#fff',
    margin: '0 0 10px', lineHeight: '1.3',
  },
  heroDesc: {
    fontSize: 14, color: '#bfdbfe',
    lineHeight: '1.8', margin: 0,
  },

  /* Two col */
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16,
  },

  /* Section card */
  sectionCard: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    height: '100%',
  },
  sectionTitle: {
    fontSize: 10, fontWeight: 800,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: 1.2,
    padding: '14px 20px 10px',
    margin: 0,
    borderBottom: '1px solid #f1f5f9',
    background: '#fafbfc',
  },

  /* Info row */
  infoRow: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 20px',
    borderBottom: '1px solid #f8fafc',
  },
  infoIconBox: {
    width: 32, height: 32, borderRadius: 8,
    background: '#f1f5f9',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: 10, fontWeight: 700, color: '#94a3b8',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8, margin: '0 0 3px',
  },
  infoValue: {
    fontSize: 13, fontWeight: 700, margin: 0,
    wordBreak: 'break-word' as const,
  },

  /* Apply */
  applyBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, width: '100%', padding: '16px 24px',
    borderRadius: 16,
    background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
    color: '#fff', fontSize: 14, fontWeight: 800,
    textDecoration: 'none',
    boxShadow: '0 6px 20px rgba(30,58,95,0.25)',
    letterSpacing: 0.3,
    boxSizing: 'border-box' as const,
  },
};