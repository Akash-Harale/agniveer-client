'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MyProfileSection     from './components/MyProfileSection';
import NotificationsSection from './components/NotificationsSection';
import ConsentSection       from './components/ConsentSection';
import type { TabId, ProfileSubTabId } from './components/shared';

type CSSProps = React.CSSProperties;

function DashboardInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab]         = useState<TabId>('notifications');
  const [profileSubTab, setProfileSubTab] = useState<ProfileSubTabId>('overview');
  const [sidebarOpen, setSidebarOpen]     = useState(true);

  useEffect(() => {
    const param = searchParams.get('tab');
    if (param === 'consent')        { setActiveTab('consent'); }
    else if (param === 'myprofile') { setActiveTab('myprofile'); setProfileSubTab('overview'); }
    else                            { setActiveTab('notifications'); }
  }, [searchParams]);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'myprofile',     label: 'My Profile',     icon: '👤' },
    { id: 'notifications', label: 'Notifications',  icon: '🔔' },
    { id: 'consent',       label: 'Consent',         icon: '📋' },
  ];

  const profileSubTabs: { id: ProfileSubTabId; label: string; icon: string }[] = [
    { id: 'overview',      label: 'Overview',      icon: '👤' },
    { id: 'agniveer',      label: 'Agniveer',      icon: '🎖️' },
    { id: 'postagniveer',  label: 'Post Agniveer', icon: '🌟' },
  ];

  const sectionTitles: Record<TabId, string> = {
    myprofile:     'My Profile',
    notifications: 'Job Notifications',
    consent:       'Consent & Declaration',
  };

  return (
    <div style={s.shell}>
      {/* ── Sidebar ── */}
      <aside style={{ ...s.sidebar, width: sidebarOpen ? 240 : 64 }}>
        <div style={s.sidebarLogo}>
          {sidebarOpen && <span style={s.sidebarLogoText}>AVRP Portal</span>}
        </div>
        {sidebarOpen && (
          <div style={s.userStrip}>
            <div style={s.avatar}>MS</div>
            <div>
              <div style={s.userName}>Mohan Singh</div>
              <div style={s.userStatus}><span style={{ color: '#4caf50' }}>●</span> Active Service</div>
            </div>
          </div>
        )}
        <nav style={s.nav}>
          {tabs.map(t => (
            <div key={t.id}>
              <button onClick={() => setActiveTab(t.id)}
                style={{ ...s.navItem, ...(activeTab === t.id ? s.navItemActive : {}) }} title={t.label}>
                {activeTab === t.id && <div style={s.navBar} />}
                <span style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</span>
                {sidebarOpen && <span style={{ flex: 1 }}>{t.label}</span>}
                {sidebarOpen && t.id === 'myprofile' && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginLeft: 'auto' }}>
                    {activeTab === 'myprofile' ? '▾' : '▸'}
                  </span>
                )}
              </button>
              {t.id === 'myprofile' && activeTab === 'myprofile' && sidebarOpen && (
                <div style={s.subGroup}>
                  {profileSubTabs.map(st => (
                    <button key={st.id} onClick={() => setProfileSubTab(st.id)}
                      style={{ ...s.subItem, ...(profileSubTab === st.id ? s.subItemActive : {}) }}>
                      {profileSubTab === st.id && <div style={s.subDot} />}
                      <span style={{ fontSize: 14 }}>{st.icon}</span>
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div style={s.sidebarBottom}>
          <button onClick={() => setSidebarOpen(p => !p)} style={s.toggleBtn}>{sidebarOpen ? '◀' : '▶'}</button>
          <Link href="/login" style={s.logoutBtn} title="Logout">
            <span style={{ flexShrink: 0 }}>🚪</span>
            {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>Logout</span>}
          </Link>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <div style={s.topBar}>
          <div>
            <div style={s.topBarTitle}>{sectionTitles[activeTab]}</div>
            <div style={s.topBarSub}>AVRP Portal · Ministry of Defence · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          </div>
          {activeTab === 'myprofile' && (
            <div style={s.welcomeBanner}>
              <span style={{ fontSize: 18 }}>🎖️</span>
              <span>Welcome to&nbsp;<strong style={{ color: '#1a2a6c' }}>Agniveer Module</strong></span>
            </div>
          )}
          <div />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', boxSizing: 'border-box' }}>
          {activeTab === 'myprofile'     && <MyProfileSection profileSubTab={profileSubTab} setProfileSubTab={setProfileSubTab} />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'consent'       && <ConsentSection />}
        </div>
      </div>
    </div>
  );
}

export default function AVRPDashboard() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', color: '#1C4587' }}>Loading…</div>}>
      <DashboardInner />
    </Suspense>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s: Record<string, CSSProps> = {
  shell:         { minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#EFF3F8', display: 'flex' },
  sidebar:       { background: 'linear-gradient(180deg, #1a2a6c 0%, #1C4587 100%)', display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', boxShadow: '3px 0 20px rgba(0,0,0,0.25)' },
  sidebarLogo:   { display: 'flex', alignItems: 'center', gap: 10, padding: '18px 14px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 },
  sidebarLogoText:{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: 0.5, whiteSpace: 'nowrap' },
  userStrip:     { display: 'flex', alignItems: 'center', gap: 10, padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 },
  avatar:        { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #FF9933, #f06a12)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 },
  userName:      { color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 2 },
  userStatus:    { color: 'rgba(255,255,255,0.65)', fontSize: 11 },
  nav:           { flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' },
  navItem:       { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'left', width: '100%', position: 'relative', whiteSpace: 'nowrap' },
  navItemActive: { background: 'rgba(255,255,255,0.15)', color: '#fff' },
  navBar:        { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 4, height: '60%', background: '#FF9933', borderRadius: '0 3px 3px 0' },
  subGroup:      { marginTop: 2, marginBottom: 4, marginLeft: 14, paddingLeft: 12, borderLeft: '2px solid rgba(255,153,51,0.35)', display: 'flex', flexDirection: 'column', gap: 2 },
  subItem:       { display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px 9px 14px', borderRadius: 8, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 12, fontWeight: 600, textAlign: 'left', width: '100%', position: 'relative' },
  subItemActive: { background: 'rgba(255,153,51,0.15)', color: '#FF9933' },
  subDot:        { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: '50%', background: '#FF9933', borderRadius: '0 2px 2px 0' },
  sidebarBottom: { padding: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 4 },
  toggleBtn:     { padding: 10, background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 12, fontWeight: 700, width: '100%' },
  logoutBtn:     { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', color: '#ff8080', textDecoration: 'none', fontSize: 13, fontWeight: 600, borderRadius: 8, background: 'rgba(255,100,100,0.1)' },
  topBar:        { background: '#fff', borderBottom: '1px solid #e0e8f0', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', flexShrink: 0, position: 'sticky', top: 0, zIndex: 30 },
  topBarTitle:   { fontSize: 20, fontWeight: 800, color: '#1a2a6c' },
  topBarSub:     { fontSize: 12, color: '#888', marginTop: 2 },
  welcomeBanner: { display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #EEF4FF, #FFF4E6)', border: '1px solid #D0D9EE', borderRadius: 20, padding: '8px 18px', fontSize: 14, fontWeight: 600, color: '#444', boxShadow: '0 1px 6px rgba(28,69,135,0.08)' },
};