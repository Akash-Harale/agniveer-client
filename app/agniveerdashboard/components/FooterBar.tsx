export default function FooterBar() {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: '22px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginTop: 8 }}>
      <div style={{ width: 90, height: 5, borderRadius: 3, display: 'flex', overflow: 'hidden', marginBottom: 8 }}>
        <div style={{ flex: 1, background: '#FF9933' }} />
        <div style={{ flex: 1, background: '#fff', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }} />
        <div style={{ flex: 1, background: '#138808' }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1C4587' }}>Government of India</div>
      <div style={{ fontSize: 13, color: '#666' }}>भारत सरकार</div>
      <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 3 }}>
        This is a computer generated document and does not require signature
      </div>
    </div>
  );
}