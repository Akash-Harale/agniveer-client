'use client';

import { useRouter } from 'next/navigation';
import FooterBar from './FooterBar';

export const notificationsData = [
  { id: '1', advtId: 'CAPF-AGN-2025-001', title: 'New Recruitment Drive - CAPF 2025', entityName: 'Central Armed Police Forces (MHA)', dateOfOpening: '10 Nov 2025', dateOfClosing: '15 Dec 2025', date: 'Nov 2, 2025', tag: 'Recruitment', tagColor: '#1C4587', icon: '📢', summary: 'Applications open for Central Armed Police Forces. Agniveers with Army background are eligible.', body: '', jobUrl: 'https://www.mha.gov.in/en/capf-recruitment' },
  { id: '2', advtId: 'NSDC-AVRP-WS-2025-02', title: 'Skill Development Workshop – Delhi', entityName: 'National Skill Development Corporation (NSDC)', dateOfOpening: '01 Nov 2025', dateOfClosing: '12 Nov 2025', date: 'Oct 30, 2025', tag: 'Workshop', tagColor: '#138808', icon: '🎓', summary: 'Free 10-day skill certification workshop for post-Agniveers in logistics and supply chain management.', body: '', jobUrl: '' },
  { id: '3', advtId: 'MOD-EDU-BNF-2025-03', title: 'Benefits Update: Education Allowance', entityName: 'Ministry of Defence (MoD)', dateOfOpening: '01 Nov 2025', dateOfClosing: '31 Jan 2026', date: 'Oct 26, 2025', tag: 'Benefits', tagColor: '#FF9933', icon: '🏦', summary: 'Education allowance for children of serving Agniveers has been revised upward effective November 2025.', body: '', jobUrl: '' },
  { id: '4', advtId: 'ARMY-APFT-2026-04', title: 'Annual Physical Fitness Test', entityName: 'Indian Army – Unit Level', dateOfOpening: '01 Apr 2026', dateOfClosing: '15 Apr 2026', date: '15 Apr 2026', tag: 'Alert', tagColor: '#c62828', icon: '⚠️', summary: 'APFT scheduled at unit level. Report to PT ground by 0600 hrs.', body: '', jobUrl: '' },
  { id: '5', advtId: 'PAY-MAR-2026-05', title: 'Salary Credited – March 2026', entityName: 'Controller of Defence Accounts (CDA)', dateOfOpening: '31 Mar 2026', dateOfClosing: '07 Apr 2026', date: '31 Mar 2026', tag: 'Finance', tagColor: '#2e7d32', icon: '✅', summary: 'Monthly emoluments of ₹30,000 credited to your bank account.', body: '', jobUrl: '' },
];

export default function NotificationsSection() {
  const router = useRouter();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      {notificationsData.map(n => (
        <button key={n.id} onClick={() => router.push(`/pages/detailednotipage?id=${n.id}`)}
          style={{ display: 'flex', flexDirection: 'column', gap: 0, padding: 0, background: '#fff', borderRadius: 14, border: 'none', width: '100%', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', cursor: 'pointer', textAlign: 'left', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, background: '#F0F4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{n.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 10, background: n.tagColor + '18', color: n.tagColor }}>{n.tag}</span>
            </div>
            <span style={{ fontSize: 11, color: '#aaa' }}>Posted: {n.date}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1C4587', padding: '0 16px 6px', lineHeight: '1.4' }}>{n.title}</div>
          <div style={{ fontSize: 12, color: '#666', lineHeight: '1.6', padding: '0 16px 12px' }}>{n.summary}</div>
          <div style={{ height: 1, background: '#EEF2F8', margin: '0 16px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, padding: '12px 16px', background: '#F8FAFF', rowGap: 10, columnGap: 12 }}>
            {[
              { label: '📋 Advt. ID', val: n.advtId },
              { label: '🏛️ Organisation', val: n.entityName },
              { label: '📅 Opening Date', val: n.dateOfOpening, color: '#2e7d32' },
              { label: '⏳ Closing Date', val: n.dateOfClosing, color: '#c62828' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontSize: 10, color: '#999', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{m.label}</span>
                <span style={{ fontSize: 12, color: (m as any).color || '#333', fontWeight: 600 }}>{m.val}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, padding: '10px 16px', borderTop: '1px solid #EEF2F8' }}>
            <span style={{ fontSize: 12, color: '#1C4587', fontWeight: 700 }}>View Details</span>
            <span style={{ fontSize: 18, color: '#1C4587' }}>›</span>
          </div>
        </button>
      ))}
      <FooterBar />
    </div>
  );
}