'use client';

import { useState } from 'react';
import FooterBar from './FooterBar';

export default function ConsentSection() {
  const [checked, setChecked]       = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a2a6c, #2d5986)', borderRadius: 14, padding: '28px 24px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 42, marginBottom: 8 }}>📋</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Consent & Declaration</div>
        <div style={{ fontSize: 13, opacity: 0.8, lineHeight: '1.7' }}>Please read the declaration carefully and indicate your choice below.</div>
      </div>

      <div style={{ background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 10, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontSize: 18 }}>ℹ️</span>
        <span style={{ fontSize: 13, color: '#856404', lineHeight: '1.6' }}>Submitting this declaration will be permanently recorded against your service profile.</span>
      </div>

      <div style={{ background: checked ? '#F1FBF3' : '#fff', border: `1.5px solid ${checked ? '#4CAF50' : '#D0D9E8'}`, borderRadius: 14, padding: '28px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#F0F4FF', borderRadius: 10, padding: 20, border: '1px solid #C8D6EE', marginBottom: 24 }}>
          <span style={{ fontSize: 34, flexShrink: 0 }}>📜</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Declaration Statement</div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1C4587', lineHeight: '1.8' }}>
              I Hereby declare that I do not wish to avail benefits under the <span style={{ color: '#FF9933' }}>Agniveer Rehabilitation Program</span>.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px dashed #D0D9E8', marginBottom: 20 }} />
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 14, cursor: submitted ? 'not-allowed' : 'pointer' }}>
          <input type="checkbox" checked={checked} onChange={() => !submitted && setChecked(p => !p)} disabled={submitted} style={{ width: 20, height: 20, accentColor: '#1C4587', cursor: submitted ? 'not-allowed' : 'pointer', flexShrink: 0, marginTop: 3 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1C4587', marginBottom: 4 }}>I confirm that I have read and understood the above declaration.</div>
            <div style={{ fontSize: 12, color: '#888' }}>By checking this box, you are digitally signing this declaration.</div>
          </div>
          {checked && <span style={{ fontSize: 24, color: '#4CAF50', fontWeight: 700 }}>✓</span>}
        </label>
      </div>

      {submitted && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#E8F5E9', border: '1.5px solid #4CAF50', borderRadius: 12, padding: '18px 20px' }}>
          <span style={{ fontSize: 32 }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#2e7d32', marginBottom: 4 }}>Declaration Submitted Successfully</div>
            <div style={{ fontSize: 13, color: '#555' }}>Your declaration has been permanently recorded.</div>
          </div>
        </div>
      )}

      {!submitted && (
        <button disabled={!checked} onClick={() => setShowDialog(true)}
          style={{ background: 'linear-gradient(135deg, #1a2a6c, #FF9933)', color: '#fff', border: 'none', borderRadius: 12, padding: 16, fontSize: 15, fontWeight: 800, width: '100%', opacity: checked ? 1 : 0.45, cursor: checked ? 'pointer' : 'not-allowed', boxShadow: '0 4px 16px rgba(28,69,135,0.3)' }}>
          Submit Declaration
        </button>
      )}

      {showDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '32px 28px', maxWidth: 440, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>⚠️</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#1a2a6c', marginBottom: 14 }}>Confirm Submission</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: '1.8', marginBottom: 28 }}>Are you sure? This will be permanently recorded and cannot be reversed.</div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ flex: 1, padding: 14, borderRadius: 10, border: '1.5px solid #D0D9E8', background: '#fff', fontSize: 14, color: '#555', fontWeight: 700, cursor: 'pointer' }} onClick={() => setShowDialog(false)}>Cancel</button>
              <button style={{ flex: 1, padding: 14, borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #c62828, #e53935)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }} onClick={() => { setShowDialog(false); setSubmitted(true); setChecked(false); }}>Yes, Submit</button>
            </div>
          </div>
        </div>
      )}
      <FooterBar />
    </div>
  );
}