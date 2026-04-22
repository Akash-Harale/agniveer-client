'use client';

import { InfoRow } from './shared';
import AgniveerSubSection from './AgniveerSubSection';
import PostAgniveerSubSection from './PostAgniveerSubSection';
import FooterBar from './FooterBar';
import type { ProfileSubTabId } from './shared';

export default function MyProfileSection({ profileSubTab, setProfileSubTab }: {
  profileSubTab: ProfileSubTabId;
  setProfileSubTab: (t: ProfileSubTabId) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1a2a6c, #2d5986)', borderRadius: 14, padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 20, color: '#fff', flexWrap: 'wrap' }}>
        <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,153,51,0.3)', border: '3px solid #FF9933', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#1C4587', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 52 }}>👤</span></div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Mohan Singh</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>Indian Army · Infantry Regiment</div>
          <div style={{ display: 'inline-block', background: 'rgba(76,175,80,0.2)', border: '1px solid #4caf50', color: '#81c784', fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 20 }}>
            <span style={{ color: '#4caf50', marginRight: 5 }}>●</span>2024-2025
          </div>
        </div>
      </div>

      {/* Overview */}
      {profileSubTab === 'overview' && (
        <>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderBottom: '2px solid #FF9933', background: '#FAFAFA' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF9933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🪪</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1C4587' }}>Service Identity</span>
            </div>
            {[
              { label: 'Service ID',      value: 'AVRP2024-1234' },
              { label: 'Branch',          value: 'Army' },
              { label: 'Rank',            value: 'Agniveer GD' },
              { label: 'Unit',            value: '14 Rajput Regiment' },
              { label: 'Enrolment Date',  value: '01 Dec 2022' },
              { label: 'Release Date',    value: '30 Nov 2026' },
            ].map((r, i, arr) => <InfoRow key={i} label={r.label} value={r.value} isLast={i === arr.length - 1} />)}
          </div>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', borderBottom: '2px solid #FF9933', background: '#FAFAFA' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF9933', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📍</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1C4587' }}>Current Address</span>
            </div>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ background: '#F8FAFF', border: '1px solid #DDE6F7', borderRadius: 8, padding: '14px 16px', fontSize: 14, color: '#333', lineHeight: '1.7', borderLeft: '3px solid #FF9933' }}>
                Unit Lines, Secunderabad Cantonment, Telangana
              </div>
            </div>
          </div>
        </>
      )}

      {profileSubTab === 'agniveer'     && <AgniveerSubSection />}
      {profileSubTab === 'postagniveer' && <PostAgniveerSubSection />}
      <FooterBar />
    </div>
  );
}