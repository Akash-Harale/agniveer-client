'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ============================================================
   TYPES & CONFIG
   ============================================================ */
type TabId = 'qualifications' | 'employment' | 'training' | 'skills' | 'certifications';

interface Field {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: string;
}

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TAB_FIELDS: Record<TabId, Field[]> = {
  qualifications: [
    { key: 'education', label: 'Education Level', placeholder: 'e.g. Class 12th - 75%' },
    { key: 'board', label: 'Board / University', placeholder: 'e.g. CBSE' },
    { key: 'subjects', label: 'Subjects / Stream', placeholder: 'e.g. Physics, Chemistry, Maths' },
    { key: 'yearOfPassing', label: 'Year of Passing', placeholder: 'e.g. 2021' },
  ],
  employment: [
    { key: 'servicePeriod', label: 'Service Period', placeholder: 'e.g. 2022 – 2026' },
    { key: 'posting', label: 'Posting Location', placeholder: 'e.g. J&K Sector' },
    { key: 'rank', label: 'Rank / Position', placeholder: 'e.g. Agniveer' },
    { key: 'specialization', label: 'Specialization', placeholder: 'e.g. Infantry – Combat Ops' },
    { key: 'experience', label: 'Experience Summary', placeholder: 'Describe your service experience', multiline: true },
  ],
  training: [
    { key: 'title', label: 'Training Title', placeholder: 'e.g. Basic Military Training' },
    { key: 'institute', label: 'Institute / Location', placeholder: 'e.g. ATC Secunderabad' },
    { key: 'duration', label: 'Duration', placeholder: 'e.g. 6 Months' },
    { key: 'details', label: 'Details', placeholder: 'Additional details about the training', multiline: true },
  ],
  skills: [
    { key: 'skillName', label: 'Skill Name', placeholder: 'e.g. Leadership' },
    { key: 'category', label: 'Category', placeholder: 'e.g. Technical / Physical / Soft Skill' },
    { key: 'proficiency', label: 'Proficiency Level', placeholder: 'e.g. Expert / Intermediate' },
  ],
  certifications: [
    { key: 'certName', label: 'Certification Name', placeholder: 'e.g. First Aid & Trauma Care' },
    { key: 'issuedBy', label: 'Issued By', placeholder: 'e.g. Ministry of Defence' },
    { key: 'year', label: 'Year', placeholder: 'e.g. 2023' },
    { key: 'details', label: 'Additional Details', placeholder: 'Optional details', multiline: true },
  ],
};

const TAB_INFO: Record<TabId, string> = {
  qualifications: '💡 Educational qualifications open doors in both government and private sectors.',
  employment: '💡 Your military service record demonstrates discipline and professional excellence.',
  training: '💡 All Agniveer training programs are recognised by civilian employers.',
  skills: '💡 Military skills are highly valued in security, law enforcement, and logistics.',
  certifications: '💡 Certifications strengthen your profile in healthcare, security, and logistics sectors.',
};

const TABS: Tab[] = [
  { id: 'qualifications', label: 'Qualifications', icon: '🎓' },
  { id: 'employment', label: 'Employment', icon: '💼' },
  { id: 'training', label: 'Training', icon: '📚' },
  { id: 'skills', label: 'Skills', icon: '🎯' },
  { id: 'certifications', label: 'Certifications', icon: '🏆' },
];

/* ============================================================
   HELPERS
   ============================================================ */
const getSummaryLine = (tab: TabId, record: any): string => {
  switch (tab) {
    case 'qualifications': return `${record.education || '—'}  |  ${record.yearOfPassing || ''}`;
    case 'employment': return `${record.rank || '—'}  ·  ${record.servicePeriod || ''}`;
    case 'training': return `${record.title || '—'}  ·  ${record.duration || ''}`;
    case 'skills': return `${record.skillName || '—'}  ·  ${record.proficiency || ''}`;
    case 'certifications': return `${record.certName || '—'}  ·  ${record.year || ''}`;
    default: return '—';
  }
};

const getSubLine = (tab: TabId, record: any): string => {
  switch (tab) {
    case 'qualifications': return record.board || '';
    case 'employment': return record.posting || '';
    case 'training': return record.institute || '';
    case 'skills': return record.category || '';
    case 'certifications': return record.issuedBy || '';
    default: return '';
  }
};

/* ============================================================
   ADD RECORD MODAL
   ============================================================ */
function AddRecordModal({
  visible, tab, onClose, onSave,
}: {
  visible: boolean;
  tab: TabId;
  onClose: () => void;
  onSave: (record: any) => void;
}) {
  const fields = TAB_FIELDS[tab] || [];
  const [form, setForm] = useState<Record<string, string>>({});

  if (!visible) return null;

  const handleSave = () => {
    const hasValue = fields.some((f) => (form[f.key] || '').trim() !== '');
    if (!hasValue) { alert('Please fill at least one field before saving.'); return; }
    onSave({ ...form, id: Date.now().toString() });
    setForm({});
  };

  const handleClose = () => { setForm({}); onClose(); };

  return (
    <div style={ms.overlay} onClick={handleClose}>
      <div style={ms.sheet} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={ms.modalHeader}>
          <span style={ms.modalTitle}>Add {TABS.find((t) => t.id === tab)?.label}</span>
          <button onClick={handleClose} style={ms.closeBtn}>✕</button>
        </div>

        {/* Body */}
        <div style={ms.modalBody}>
          {fields.map((field) => (
            <div key={field.key} style={ms.fieldWrap}>
              <label style={ms.label}>{field.label}</label>
              {field.multiline ? (
                <textarea
                  style={{ ...ms.input, ...ms.inputMulti }}
                  placeholder={field.placeholder}
                  value={form[field.key] || ''}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              ) : (
                <input
                  style={ms.input}
                  placeholder={field.placeholder}
                  value={form[field.key] || ''}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={ms.actions}>
          <button style={ms.cancelBtn} onClick={handleClose}>Cancel</button>
          <button style={ms.saveBtn} onClick={handleSave}>✓ Save Entry</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   VIEW / DELETE MODAL
   ============================================================ */
function ViewRecordModal({
  visible, tab, record, onClose, onDelete,
}: {
  visible: boolean;
  tab: TabId;
  record: any;
  onClose: () => void;
  onDelete: () => void;
}) {
  if (!visible || !record) return null;
  const fields = TAB_FIELDS[tab] || [];

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) onDelete();
  };

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={ms.modalHeader}>
          <span style={ms.modalTitle}>Details</span>
          <button onClick={onClose} style={ms.closeBtn}>✕</button>
        </div>

        <div style={ms.modalBody}>
          {fields.map((field) =>
            record[field.key] ? (
              <div key={field.key} style={ms.detailRow}>
                <span style={ms.detailLabel}>{field.label}</span>
                <span style={ms.detailValue}>{record[field.key]}</span>
              </div>
            ) : null,
          )}
        </div>

        <div style={ms.actions}>
          <button style={ms.deleteBtn} onClick={handleDelete}>🗑 Delete</button>
          <button style={ms.saveBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB SECTION
   ============================================================ */
function TabSection({
  tab, records, onAdd, onView,
}: {
  tab: TabId;
  records: any[];
  onAdd: () => void;
  onView: (r: any) => void;
}) {
  return (
    <div style={ts.wrap}>
      {/* Add Button */}
      <button style={ts.addBtn} onClick={onAdd}>
        <span style={ts.addIcon}>＋</span>
        <span>Add {TABS.find((t) => t.id === tab)?.label}</span>
      </button>

      {/* Records */}
      {records.length === 0 ? (
        <div style={ts.emptyBox}>
          <div style={ts.emptyIcon}>{TABS.find((t) => t.id === tab)?.icon}</div>
          <div style={ts.emptyTitle}>No entries yet</div>
          <div style={ts.emptyMsg}>Tap "Add" above to add your first entry.</div>
        </div>
      ) : (
        records.map((rec, idx) => (
          <button key={rec.id || idx} style={ts.recordCard} onClick={() => onView(rec)}>
            <div style={ts.recordLeft}>
              <div style={ts.recordDot} />
              <div style={{ flex: 1, textAlign: 'left' as const }}>
                <div style={ts.recordMain}>{getSummaryLine(tab, rec)}</div>
                {getSubLine(tab, rec) && (
                  <div style={ts.recordSub}>{getSubLine(tab, rec)}</div>
                )}
              </div>
            </div>
            <span style={ts.chevron}>›</span>
          </button>
        ))
      )}

      <div style={ts.infoText}>{TAB_INFO[tab]}</div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function PostAgniveerProfilePage() {
  const profile = {
    name: 'Rahul Kumar Singh',
    branch: 'Indian Army – Infantry Regiment',
    address: 'Unit Lines, Secunderabad Cantonment, Telangana',
  };

  const [activeTab, setActiveTab] = useState<TabId>('qualifications');
  const [data, setData] = useState<Record<TabId, any[]>>({
    qualifications: [],
    employment: [],
    training: [],
    skills: [],
    certifications: [],
  });
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleSave = (record: any) => {
    setData((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], record] }));
    setAddModal(false);
  };

  const handleDelete = () => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((r) => r.id !== selectedRecord.id),
    }));
    setViewModal(false);
    setSelectedRecord(null);
  };

  return (
    <div style={s.page}>
      {/* ── HEADER ── */}
      <header style={s.header}>
        <Link href="/agniveerdashboard" style={s.backBtn}>←</Link>
        <div>
          <div style={s.headerTitle}>Post Agniveer Profile</div>
          <div style={s.headerSub}>Career Profile Management</div>
        </div>
      </header>

      <div style={s.scrollArea}>
        {/* ── PROFILE HERO ── */}
        <div style={s.profileHero}>
          <div style={s.photoCircle}>👨‍✈️</div>
          <h2 style={s.profileName}>{profile.name}</h2>
          <div style={s.branchBadge}>{profile.branch}</div>
          <div style={s.statusBadge}>● Post-Service Career Profile</div>
        </div>

        {/* ── PERSONAL INFORMATION ── */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <div style={s.sectionIconWrap}><span style={s.sectionIcon}>👤</span></div>
            <span style={s.sectionTitle}>Personal Information</span>
            <div style={s.readOnlyBadge}>Read Only</div>
          </div>
          <div style={s.cardBody}>
            <div style={s.fieldLabel}>📍 Current Address</div>
            <div style={s.valueBox}>{profile.address}</div>
            <div style={s.permissionNote}>
              <span style={s.noteIcon}>ℹ</span>
              <span style={s.noteText}>Personal details are pre-filled from your Agniveer records and cannot be edited here.</span>
            </div>
          </div>
        </div>

        {/* ── PROFESSIONAL DETAILS ── */}
        <div style={s.card}>
          <div style={s.sectionHeader}>
            <div style={s.sectionIconWrap}><span style={s.sectionIcon}>💼</span></div>
            <span style={s.sectionTitle}>Professional Details</span>
          </div>

          {/* Tabs */}
          <div style={s.tabsBar}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : {}) }}
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.icon}</span>
                <span style={activeTab === tab.id ? s.tabTextActive : s.tabText}>{tab.label}</span>
                {data[tab.id].length > 0 && (
                  <span style={{ ...s.badge, ...(activeTab === tab.id ? s.badgeActive : {}) }}>
                    {data[tab.id].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <TabSection
            tab={activeTab}
            records={data[activeTab]}
            onAdd={() => setAddModal(true)}
            onView={(rec) => { setSelectedRecord(rec); setViewModal(true); }}
          />
        </div>

        {/* ── FOOTER ── */}
        <footer style={s.footer}>
          <div style={s.tricolor}>
            <div style={s.saffron} />
            <div style={s.white} />
            <div style={s.green} />
          </div>
          <div style={s.footerTitle}>Government of India</div>
          <div style={s.footerSub}>भारत सरकार</div>
        </footer>
      </div>

      {/* ── MODALS ── */}
      <AddRecordModal
        visible={addModal}
        tab={activeTab}
        onClose={() => setAddModal(false)}
        onSave={handleSave}
      />
      <ViewRecordModal
        visible={viewModal}
        tab={activeTab}
        record={selectedRecord}
        onClose={() => { setViewModal(false); setSelectedRecord(null); }}
        onDelete={handleDelete}
      />
    </div>
  );
}

/* ============================================================
   TAB SECTION STYLES
   ============================================================ */
const ts: Record<string, React.CSSProperties> = {
  wrap: { padding: '20px 24px 24px' },
  addBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
    background: '#1C4587', color: '#fff', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', marginBottom: 18,
    boxShadow: '0 4px 14px rgba(28,69,135,0.3)',
  },
  addIcon: { fontSize: 20, fontWeight: 300 },
  emptyBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '36px 20px', borderRadius: 12, border: '1.5px dashed #C8D6EE',
    background: '#F8F9FA', marginBottom: 16,
  },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyTitle: { fontSize: 15, fontWeight: 700, color: '#8899BB', marginBottom: 4 },
  emptyMsg: { fontSize: 13, color: '#AABBCC', textAlign: 'center' },
  recordCard: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #DDE6F7',
    background: '#F8FAFF', marginBottom: 10, cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(28,69,135,0.06)',
  },
  recordLeft: { display: 'flex', alignItems: 'center', flex: 1, gap: 12 },
  recordDot: { width: 10, height: 10, borderRadius: 5, background: '#FF9933', flexShrink: 0 },
  recordMain: { fontSize: 14, color: '#1C4587', fontWeight: 700, marginBottom: 2 },
  recordSub: { fontSize: 12, color: '#6B7A99', fontWeight: 500 },
  chevron: { fontSize: 22, color: '#C5CDE0', fontWeight: 300 },
  infoText: { fontSize: 12, color: '#AAAAAA', fontStyle: 'italic', marginTop: 14, lineHeight: 1.6 },
};

/* ============================================================
   MODAL STYLES
   ============================================================ */
const ms: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000,
  },
  sheet: {
    background: '#fff', borderRadius: '22px 22px 0 0', width: '100%', maxWidth: 640,
    maxHeight: '85vh', display: 'flex', flexDirection: 'column', paddingBottom: 30,
  },
  modalHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 20px', borderBottom: '1px solid #EEE',
  },
  modalTitle: { fontSize: 18, fontWeight: 700, color: '#1C4587' },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17, background: '#F0F4F8',
    border: 'none', cursor: 'pointer', fontSize: 14, color: '#555', fontWeight: 700,
  },
  modalBody: { padding: '10px 20px', overflowY: 'auto', flex: 1 },
  fieldWrap: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 6 },
  input: {
    width: '100%', border: '1.5px solid #D0D9E8', borderRadius: 10,
    padding: '12px 14px', fontSize: 15, color: '#333', background: '#FAFBFD',
    outline: 'none', boxSizing: 'border-box',
  },
  inputMulti: { minHeight: 90, resize: 'vertical' as const },
  actions: { display: 'flex', padding: '16px 20px 0', gap: 10 },
  cancelBtn: {
    flex: 1, padding: '14px 0', borderRadius: 10, border: '1.5px solid #D0D9E8',
    background: '#fff', fontSize: 15, color: '#666', fontWeight: 600, cursor: 'pointer',
  },
  saveBtn: {
    flex: 1, padding: '14px 0', borderRadius: 10, border: 'none',
    background: '#1C4587', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
  },
  deleteBtn: {
    flex: 1, padding: '14px 0', borderRadius: 10, border: '1.5px solid #FF5252',
    background: '#FFF0F0', color: '#FF5252', fontSize: 15, fontWeight: 600, cursor: 'pointer',
  },
  detailRow: { marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid #F0F4F8' },
  detailLabel: { display: 'block', fontSize: 12, color: '#888', fontWeight: 600, marginBottom: 4 },
  detailValue: { fontSize: 15, color: '#1C4587', fontWeight: 500, lineHeight: 1.6 },
};

/* ============================================================
   PAGE STYLES
   ============================================================ */
const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' },
  header: {
    background: '#1C4587', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 2px 12px rgba(0,0,0,0.2)', position: 'sticky', top: 0, zIndex: 100,
  },
  backBtn: {
    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: 24, fontWeight: 300, textDecoration: 'none', borderRadius: 8,
    background: 'rgba(255,255,255,0.15)',
  },
  headerTitle: { fontSize: 19, fontWeight: 700, color: '#fff' },
  headerSub: { fontSize: 12, color: '#E8E8E8' },
  scrollArea: { flex: 1, overflowY: 'auto', padding: '0 0 40px' },

  profileHero: {
    background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '36px 20px 28px', marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  photoCircle: {
    width: 110, height: 110, borderRadius: '50%', background: '#EEF2FF',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 50,
    border: '4px solid #FF9933', marginBottom: 16,
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
  profileName: { fontSize: 24, fontWeight: 700, color: '#1C4587', margin: '0 0 10px' },
  branchBadge: {
    background: '#E8F0FF', border: '1px solid #1C4587', color: '#1C4587',
    padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 8,
  },
  statusBadge: {
    background: '#FFF3E0', border: '1px solid #FF9800', color: '#FF9800',
    padding: '5px 14px', borderRadius: 14, fontSize: 12, fontWeight: 600,
  },

  card: {
    background: '#fff', margin: '0 0 16px', borderRadius: 0,
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 16px', borderBottom: '2px solid #FF9933', background: '#FAFAFA',
  },
  sectionIconWrap: {
    width: 36, height: 36, borderRadius: '50%', background: '#FF9933',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  sectionIcon: { fontSize: 18 },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: '#1C4587', flex: 1 },
  readOnlyBadge: {
    padding: '4px 12px', borderRadius: 10, border: '1px solid #C5CDE0',
    background: '#F0F4F8', fontSize: 11, color: '#6B7A99', fontWeight: 600,
  },
  cardBody: { padding: '20px 16px' },
  fieldLabel: { fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 },
  valueBox: {
    background: '#F8F9FA', padding: 14, borderRadius: 8,
    borderLeft: '3px solid #FF9933', fontSize: 15, color: '#333', lineHeight: 1.6,
  },
  permissionNote: {
    display: 'flex', alignItems: 'flex-start', gap: 6,
    marginTop: 12, background: '#EEF4FF', padding: 10, borderRadius: 6,
  },
  noteIcon: { fontSize: 14, color: '#1C4587', marginTop: 1 },
  noteText: { fontSize: 12, color: '#4A6FA5', fontWeight: 500, lineHeight: 1.6 },

  tabsBar: {
    display: 'flex', gap: 10, padding: '14px 16px 10px', overflowX: 'auto',
    background: '#FAFAFA', borderBottom: '1px solid #EEE',
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
    borderRadius: 20, border: '1.5px solid #E0E0E0', background: '#fff',
    fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer', whiteSpace: 'nowrap',
  },
  tabActive: { background: '#1C4587', borderColor: '#1C4587' },
  tabText: { color: '#666' },
  tabTextActive: { color: '#fff' },
  badge: {
    background: '#FF9933', color: '#fff', borderRadius: 10,
    minWidth: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, padding: '0 5px',
  },
  badgeActive: { background: 'rgba(255,255,255,0.3)' },

  footer: { background: '#fff', padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  tricolor: {
    width: 100, height: 6, borderRadius: 3, display: 'flex',
    overflow: 'hidden', marginBottom: 14,
  },
  saffron: { flex: 1, background: '#FF9933' },
  white: { flex: 1, background: '#fff', borderLeft: '1px solid #DDD', borderRight: '1px solid #DDD' },
  green: { flex: 1, background: '#138808' },
  footerTitle: { fontSize: 16, fontWeight: 700, color: '#1C4587', marginBottom: 2 },
  footerSub: { fontSize: 14, color: '#666' },
};