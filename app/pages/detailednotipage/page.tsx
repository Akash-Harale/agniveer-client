'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

/* ============================================================
   AGNIVEER HARDCODED NOTIFICATIONS  (source A)
   Keep in sync with agniveerdashboard/page.tsx
   ============================================================ */
const agniveerNotificationsData = [
  {
    id: '1',
    advtId: 'CAPF-AGN-2025-001',
    title: 'New Recruitment Drive - CAPF 2025',
    entityName: 'Central Armed Police Forces (MHA)',
    dateOfOpening: '10 Nov 2025',
    dateOfClosing: '15 Dec 2025',
    date: 'Nov 2, 2025',
    tag: 'Recruitment',
    tagColor: '#1C4587',
    icon: '📢',
    summary: 'Applications open for Central Armed Police Forces. Agniveers with Army background are eligible.',
    body: 'The Ministry of Home Affairs has announced a special recruitment drive for ex-Agniveers under CAPF 2025.',
    jobUrl: 'https://www.mha.gov.in/en/capf-recruitment',
  },
  {
    id: '2',
    advtId: 'NSDC-AVRP-WS-2025-02',
    title: 'Skill Development Workshop – Delhi',
    entityName: 'National Skill Development Corporation (NSDC)',
    dateOfOpening: '01 Nov 2025',
    dateOfClosing: '12 Nov 2025',
    date: 'Oct 30, 2025',
    tag: 'Workshop',
    tagColor: '#138808',
    icon: '🎓',
    summary: 'Free 10-day skill certification workshop for post-Agniveers in logistics and supply chain management.',
    body: 'NSDC in partnership with AVRP is organizing a 10-day residential skill development workshop in New Delhi.',
    jobUrl: 'https://www.nsdcindia.org/agniveer-skill-workshop',
  },
  {
    id: '3',
    advtId: 'MOD-EDU-BNF-2025-03',
    title: 'Benefits Update: Education Allowance',
    entityName: 'Ministry of Defence (MoD)',
    dateOfOpening: '01 Nov 2025',
    dateOfClosing: '31 Jan 2026',
    date: 'Oct 26, 2025',
    tag: 'Benefits',
    tagColor: '#FF9933',
    icon: '🏦',
    summary: 'Education allowance for children of serving Agniveers has been revised upward effective November 2025.',
    body: 'The Ministry of Defence has issued a circular revising the Education Allowance for children of serving Agniveers.',
    jobUrl: 'https://mod.gov.in/education-allowance-circular-2025',
  },
  {
    id: '4',
    advtId: 'ARMY-APFT-2026-04',
    title: 'Annual Physical Fitness Test',
    entityName: 'Indian Army – Unit Level',
    dateOfOpening: '01 Apr 2026',
    dateOfClosing: '15 Apr 2026',
    date: '15 Apr 2026',
    tag: 'Alert',
    tagColor: '#c62828',
    icon: '⚠️',
    summary: 'APFT scheduled at unit level. Report to PT ground by 0600 hrs.',
    body: 'Annual Physical Fitness Test (APFT) is scheduled for all serving Agniveers.',
    jobUrl: 'https://joinindianarmy.nic.in/apft-schedule-2026',
  },
  {
    id: '5',
    advtId: 'PAY-MAR-2026-05',
    title: 'Salary Credited – March 2026',
    entityName: 'Controller of Defence Accounts (CDA)',
    dateOfOpening: '31 Mar 2026',
    dateOfClosing: '07 Apr 2026',
    date: '31 Mar 2026',
    tag: 'Finance',
    tagColor: '#2e7d32',
    icon: '✅',
    summary: 'Monthly emoluments of ₹30,000 credited to your bank account.',
    body: 'Your monthly emoluments for March 2026 have been successfully credited.',
    jobUrl: 'https://pcdaolq.gov.in/salary-statement-march-2026',
  },
];

/* ============================================================
   NORMALISED SHAPE — one internal type used everywhere
   ============================================================ */
interface NormNotif {
  id: string;
  advtId: string;
  title: string;
  entityName: string;
  dateOfOpening: string;       // display string
  dateOfClosing: string;       // display string
  dateOfClosingRaw?: Date;     // for open/closed pill
  postedDisplay: string;
  tag: string;
  tagColor: string;
  icon: string;
  body: string;
  jobUrl: string;
}

/* ── dataService type → NormNotif ── */
const dsColorMap: Record<string, string> = {
  info: '#1C4587', success: '#138808', warning: '#FF9933', error: '#c62828',
};
const dsIconMap: Record<string, string> = {
  info: '📢', success: '✅', warning: '⚠️', error: '🚨',
};
const dsTagMap: Record<string, string> = {
  info: 'Recruitment', success: 'Opportunity', warning: 'Workshop', error: 'Alert',
};
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

function fromDataService(n: any): NormNotif {
  return {
    id: String(n.id),
    advtId: n.advtId || `DS-${n.id}`,
    title: n.title,
    entityName: n.entity || '—',
    dateOfOpening: fmtDate(n.createdAt),
    dateOfClosing: n.lastDate ? fmtDate(n.lastDate) : '—',
    dateOfClosingRaw: n.lastDate ? new Date(n.lastDate) : undefined,
    postedDisplay: fmtDate(n.createdAt),
    tag: dsTagMap[n.type] ?? 'Update',
    tagColor: dsColorMap[n.type] ?? '#1C4587',
    icon: dsIconMap[n.type] ?? '📢',
    body: n.message || n.title,
    jobUrl:
      n.jobUrl && n.jobUrl !== '' && n.jobUrl !== '#'
        ? n.jobUrl
        : 'https://joinindianarmy.nic.in/Authentication.aspx',
  };
}

/* ── agniveer hardcoded entry → NormNotif ── */
function parseShortDate(str: string): Date | null {
  const mon: Record<string, number> = {
    Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
  };
  const p = str.trim().split(' ');
  if (p.length === 3) {
    const d = parseInt(p[0], 10), m = mon[p[1]], y = parseInt(p[2], 10);
    if (!isNaN(d) && m !== undefined && !isNaN(y)) return new Date(y, m, d);
  }
  return null;
}
function fromAgniveer(n: (typeof agniveerNotificationsData)[0]): NormNotif {
  return {
    id: n.id,
    advtId: n.advtId,
    title: n.title,
    entityName: n.entityName,
    dateOfOpening: n.dateOfOpening,
    dateOfClosing: n.dateOfClosing,
    dateOfClosingRaw: parseShortDate(n.dateOfClosing) ?? undefined,
    postedDisplay: n.date,
    tag: n.tag,
    tagColor: n.tagColor,
    icon: n.icon,
    body: n.body || n.summary,
    jobUrl: n.jobUrl,
  };
}

/* ============================================================
   UNIFIED LOADER
   1. Check agniveer hardcoded list first
   2. Fall back to dataService (admin dashboard)
   ============================================================ */
async function loadNotification(
  id: string,
): Promise<{ notif: NormNotif; others: NormNotif[] } | null> {
  // ── source A: agniveer hardcoded ──
  const agniEntry = agniveerNotificationsData.find((n) => n.id === id);
  if (agniEntry) {
    return {
      notif: fromAgniveer(agniEntry),
      others: agniveerNotificationsData
        .filter((n) => n.id !== id)
        .slice(0, 3)
        .map(fromAgniveer),
    };
  }

  // ── source B: dataService (admin) ──
  try {
    const { dataService } = await import('@/lib/data-service');
    const all = await dataService.getNotifications();
    const found = all.find((n: any) => String(n.id) === id);
    if (!found) return null;
    return {
      notif: fromDataService(found),
      others: all
        .filter((n: any) => String(n.id) !== id)
        .slice(0, 3)
        .map(fromDataService),
    };
  } catch {
    return null;
  }
}

/* ============================================================
   INNER CONTENT
   ============================================================ */
function NotificationDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';

  const [notif, setNotif]       = useState<NormNotif | null>(null);
  const [others, setOthers]     = useState<NormNotif[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    loadNotification(id).then((res) => {
      if (!res) setNotFound(true);
      else { setNotif(res.notif); setOthers(res.others); }
      setLoading(false);
    });
  }, [id]);

  /* ── Loading spinner ── */
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{
          display: 'inline-block', width: 44, height: 44,
          border: '4px solid #E0E8F7', borderTopColor: '#1C4587',
          borderRadius: '50%', animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ marginTop: 16, color: '#888', fontWeight: 600, fontSize: 14 }}>
          Loading notification…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Not found ── */
  if (notFound || !notif) {
    return (
      <div style={s.notFoundWrap}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <div style={s.notFoundTitle}>Notification Not Found</div>
        <div style={s.notFoundSub}>
          The notification you are looking for does not exist or has been removed.
        </div>
      </div>
    );
  }

  const isOpen = notif.dateOfClosingRaw ? notif.dateOfClosingRaw >= new Date() : false;

  return (
    <div style={s.pageWrap}>

      {/* ─── Main Card ─── */}
      <div style={s.card}>

        {/* Top row: icon · tag pill · open/closed pill · posted date */}
        <div style={s.topRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={s.iconCircle}>{notif.icon}</span>

            <span style={{
              ...s.tagBadge,
              background: notif.tagColor + '18',
              color: notif.tagColor,
              border: `1px solid ${notif.tagColor}30`,
            }}>
              {notif.tag}
            </span>

            <span style={{
              fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
              background: isOpen ? '#E8F5E9' : '#FFEBEE',
              color:      isOpen ? '#2e7d32' : '#c62828',
            }}>
              {isOpen ? '● Open' : '● Closed'}
            </span>
          </div>

          <span style={s.postedDate}>Posted: {notif.postedDisplay}</span>
        </div>

        {/* Title */}
        <h1 style={s.jobTitle}>{notif.title}</h1>

        {/* Full body */}
        <p style={s.description}>{notif.body}</p>

        <div style={s.divider} />

        {/* 4-cell meta grid */}
        <div style={s.metaGrid}>
          <div style={s.metaItem}>
            <div style={s.metaLabel}>📋 Advt. ID</div>
            <div style={s.metaValue}>{notif.advtId}</div>
          </div>
          <div style={s.metaItem}>
            <div style={s.metaLabel}>🏛️ Organisation</div>
            <div style={s.metaValue}>{notif.entityName}</div>
          </div>
          <div style={s.metaItem}>
            <div style={s.metaLabel}>📅 Opening Date</div>
            <div style={{ ...s.metaValue, color: '#2e7d32' }}>{notif.dateOfOpening}</div>
          </div>
          <div style={s.metaItem}>
            <div style={s.metaLabel}>⏳ Closing Date</div>
            <div style={{ ...s.metaValue, color: isOpen ? '#1565c0' : '#c62828' }}>
              {notif.dateOfClosing}
            </div>
          </div>
        </div>

        {/* Job URL + Apply Now */}
        <div style={s.divider} />
        <div style={s.urlRow}>
          <div style={s.metaLabel}>🔗 Job URL</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
            <a
              href={notif.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={s.urlBlueLink}
            >
              {notif.jobUrl}
            </a>
            <a
              href={notif.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={s.applyNowBtn}
            >
              Apply Now →
            </a>
          </div>
        </div>
      </div>

      {/* ─── Other Notifications ─── */}
      {others.length > 0 && (
        <div style={s.othersCard}>
          <div style={s.othersHeader}>Other Notifications</div>
          {others.map((n) => (
            <Link
              key={n.id}
              href={`/pages/detailednotipage?id=${n.id}`}
              style={s.otherItem}
            >
              <div style={{ ...s.otherIconWrap, background: n.tagColor + '18' }}>
                {n.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={s.otherTitle}>{n.title}</div>
                <div style={s.otherSub}>{n.entityName}</div>
                <div style={s.otherDate}>{n.postedDisplay}</div>
              </div>
              <span style={{ color: '#C5CDE0', fontSize: 20, fontWeight: 300, flexShrink: 0 }}>
                ›
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAGE SHELL
   ============================================================ */
export default function DetailedNotiPage() {
  return (
    <div style={s.shell}>

      {/* Gov bar */}
      <div style={s.govBar}>
        <span>भारत सरकार &nbsp;|&nbsp; Government of India</span>
        <div style={s.govBarRight}>
          <span>हिन्दी</span>&nbsp;|&nbsp;<span>English</span>
        </div>
      </div>

      {/* Header */}
      <header style={s.header}>
        <div style={s.headerInner}>
          <div style={s.headerLeft}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
              alt="Emblem of India"
              style={{ height: 52, width: 'auto' }}
            />
            <div>
              <div style={s.headerPortalLabel}>Ministry of Defence</div>
              <div style={s.headerPortalName}>Agniveer Rehabilitation Program Portal</div>
              <div style={s.headerPortalHindi}>अग्निवीर पुनर्वास पोर्टल</div>
            </div>
          </div>
        </div>
      </header>

      {/* Title bar */}
      <div style={s.titleBar}>
        <div style={s.titleBarInner}>
          <span style={s.titleBarText}>🔔 Notification Details</span>
          <span style={s.titleBarDate}>
            {new Date().toLocaleDateString('en-IN', {
              day: '2-digit', month: 'long', year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Main */}
      <main style={s.main}>
        <Suspense
          fallback={
            <div style={{ textAlign: 'center', padding: 60, color: '#888', fontWeight: 600 }}>
              Loading…
            </div>
          }
        >
          <NotificationDetailContent />
        </Suspense>
      </main>
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const s: Record<string, React.CSSProperties> = {
  /* Shell */
  shell: {
    minHeight: '100vh', background: '#EFF3F8',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex', flexDirection: 'column',
  },

  /* Gov bar */
  govBar: {
    background: '#1a2a6c', color: 'rgba(255,255,255,0.8)',
    fontSize: 12, padding: '6px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  govBarRight: { display: 'flex', gap: 4 },

  /* Header */
  header: {
    background: '#fff', borderBottom: '1px solid #e0e8f0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  headerInner: {
    maxWidth: 1000, margin: '0 auto', padding: '14px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  headerPortalLabel: { fontSize: 11, color: '#888', fontWeight: 600 },
  headerPortalName: { fontSize: 18, fontWeight: 800, color: '#1a2a6c', lineHeight: '1.2' },
  headerPortalHindi: { fontSize: 12, color: '#666', marginTop: 2 },

  /* Title bar */
  titleBar: { background: 'linear-gradient(135deg, #1a2a6c, #1C4587)', color: '#fff' },
  titleBarInner: {
    maxWidth: 1000, margin: '0 auto', padding: '10px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  titleBarText: { fontSize: 14, fontWeight: 700, letterSpacing: 0.3 },
  titleBarDate: { fontSize: 12, opacity: 0.7 },

  /* Main */
  main: {
    flex: 1, padding: '24px',
    maxWidth: 1000, margin: '0 auto',
    width: '100%', boxSizing: 'border-box',
  },
  pageWrap: { display: 'flex', flexDirection: 'column', gap: 16 },

  /* Main card */
  card: {
    background: '#fff', borderRadius: 14, padding: '28px',
    boxShadow: '0 2px 14px rgba(0,0,0,0.08)', borderTop: '4px solid #FF9933',
  },
  topRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16, flexWrap: 'wrap', gap: 8,
  },
  iconCircle: {
    width: 38, height: 38, borderRadius: '50%',
    background: '#F0F4FF', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 18, flexShrink: 0,
  },
  tagBadge: {
    fontSize: 11, fontWeight: 700, padding: '4px 12px',
    borderRadius: 20, letterSpacing: 0.4,
  },
  postedDate: { fontSize: 12, color: '#aaa', fontWeight: 500 },
  jobTitle: { fontSize: 22, fontWeight: 900, color: '#1a2a6c', margin: '0 0 12px', lineHeight: '1.3' },
  description: { fontSize: 14, color: '#555', lineHeight: '1.8', margin: 0 },
  divider: { border: 'none', borderTop: '1px solid #F0F4F8', margin: '20px 0' },
  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px', marginBottom: 4 },
  metaItem: { display: 'flex', flexDirection: 'column', gap: 4 },
  metaLabel: {
    fontSize: 10, color: '#999', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: 0.7,
  },
  metaValue: { fontSize: 14, color: '#1a2a6c', fontWeight: 700 },
  urlRow: { marginBottom: 4 },
  urlBlueLink: {
    fontSize: 13, color: '#1565c0', wordBreak: 'break-all',
    textDecoration: 'underline', fontWeight: 600,
  },
  applyNowBtn: {
    flexShrink: 0, padding: '9px 24px', borderRadius: 9,
    background: 'linear-gradient(135deg, #FF9933, #e67e00)',
    color: '#fff', fontSize: 13, fontWeight: 800,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(255,153,51,0.4)',
    whiteSpace: 'nowrap', letterSpacing: 0.3,
  },

  /* Other notifications */
  othersCard: {
    background: '#fff', borderRadius: 12,
    overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
  },
  othersHeader: {
    fontSize: 14, fontWeight: 800, color: '#1C4587',
    padding: '14px 20px', borderBottom: '2px solid #FF9933', background: '#FAFAFA',
  },
  otherItem: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 20px', borderBottom: '1px solid #F0F4F8', textDecoration: 'none',
  },
  otherIconWrap: {
    width: 38, height: 38, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 17, flexShrink: 0,
  },
  otherTitle: {
    fontSize: 13, fontWeight: 700, color: '#1C4587', marginBottom: 2,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  otherSub:  { fontSize: 11, color: '#888',  fontWeight: 500, marginBottom: 2 },
  otherDate: { fontSize: 11, color: '#bbb',  fontWeight: 500 },

  /* Not found */
  notFoundWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '60px 20px', textAlign: 'center',
  },
  notFoundTitle: { fontSize: 22, fontWeight: 800, color: '#1a2a6c', marginBottom: 8 },
  notFoundSub:   { fontSize: 14, color: '#888', marginBottom: 24, maxWidth: 400 },
};