import React from 'react';

export type CSSProps = React.CSSProperties;
export type TabId = 'myprofile' | 'notifications' | 'consent';
export type ProfileSubTabId = 'overview' | 'agniveer' | 'postagniveer';

export function InfoRow({ label, value, isLast = false, highlight = false }: {
  label: string; value: string; isLast?: boolean; highlight?: boolean;
}) {
  return (
    <div style={{ display: 'flex', borderBottom: isLast ? 'none' : '1px solid #E0E0E0', minHeight: 45 }}>
      <div style={{ width: '35%', background: '#F5F5F5', padding: '12px', display: 'flex', alignItems: 'center', borderRight: '1px solid #E0E0E0', flexShrink: 0, fontSize: 13, color: '#555', fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ flex: 1, padding: '12px', display: 'flex', alignItems: 'center', background: highlight ? '#FFFDE7' : '#fff', fontSize: 13, color: '#333', lineHeight: '20px' }}>
        {value}
      </div>
    </div>
  );
}

export function AgniSection({ icon, number, title, children }: {
  icon: string; number: number; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '2px solid #FF9933', background: '#FAFAFA', fontSize: 15, fontWeight: 700, color: '#1C4587' }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FF9933', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 17 }}>{icon}</span>
        </div>
        <span>{number}. {title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

export const sharedStyles: Record<string, CSSProps> = {
  sectionWrap: { display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000, margin: '0 auto', width: '100%' },
};