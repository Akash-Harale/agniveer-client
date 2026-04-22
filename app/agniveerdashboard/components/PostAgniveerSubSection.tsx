'use client';

import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api-config';

// ── Types ────────────────────────────────────────────────────
type PostTabId = 'qualifications' | 'employment' | 'training' | 'certifications';
interface Field { key: string; label: string; placeholder: string; multiline?: boolean; type?: string; keyTo?: string; }
interface PostTab { id: PostTabId; label: string; icon: string; }

const POST_TABS: PostTab[] = [
  { id: 'qualifications', label: 'Qualifications', icon: '🎓' },
  { id: 'employment',     label: 'Employment',     icon: '💼' },
  { id: 'training',       label: 'Training',       icon: '📚' },
  { id: 'certifications', label: 'Certifications', icon: '🏆' },
];

const TAB_FIELDS: Record<PostTabId, Field[]> = {
  qualifications: [
    { key: 'education',     label: 'Education Level',    placeholder: 'e.g. Class 12th - 75%' },
    { key: 'board',         label: 'Board / University', placeholder: 'e.g. CBSE' },
    { key: 'subjects',      label: 'Subjects / Stream',  placeholder: 'e.g. Physics, Chemistry, Maths' },
    { key: 'yearOfPassing', label: 'Year of Passing',    placeholder: 'e.g. 2021' },
    { key: 'grade',         label: 'Grade',              placeholder: 'e.g. A+ / Distinction / 85%' },
  ],
  employment: [
    { key: 'servicePeriodFrom', label: 'Service Period', placeholder: 'From', type: 'dateRange', keyTo: 'servicePeriodTo' },
    { key: 'posting',           label: 'Posting Location',   placeholder: 'e.g. J&K Sector' },
    { key: 'rank',              label: 'Rank / Position',    placeholder: 'e.g. Agniveer' },
    { key: 'specialization',    label: 'Specialization',     placeholder: 'e.g. Infantry – Combat Ops' },
    { key: 'experience',        label: 'Experience Summary', placeholder: 'Describe your service experience', multiline: true },
  ],
  training: [
    { key: 'title',        label: 'Training Title',      placeholder: 'e.g. Basic Military Training' },
    { key: 'institute',    label: 'Institute / Location', placeholder: 'e.g. ATC Secunderabad' },
    { key: 'durationFrom', label: 'Duration',            placeholder: 'From', type: 'dateRange', keyTo: 'durationTo' },
    { key: 'details',      label: 'Details',             placeholder: 'Additional details about the training', multiline: true },
  ],
  certifications: [
    { key: 'certName', label: 'Certification Name', placeholder: 'e.g. First Aid & Trauma Care' },
    { key: 'issuedBy', label: 'Issued By',          placeholder: 'e.g. Ministry of Defence' },
    { key: 'year',     label: 'Year',               placeholder: 'e.g. 2023' },
    { key: 'details',  label: 'Additional Details', placeholder: 'Optional details', multiline: true },
  ],
};

const TAB_INFO: Record<PostTabId, string> = {
  qualifications: '💡 Educational qualifications open doors in both government and private sectors.',
  employment:     '💡 Your military service record demonstrates discipline and professional excellence.',
  training:       '💡 All Agniveer training programs are recognised by civilian employers.',
  certifications: '💡 Certifications strengthen your profile in healthcare, security, and logistics sectors.',
};

// ── API payload builders ──────────────────────────────────────
function buildPayload(tab: PostTabId, form: Record<string, string>) {
  switch (tab) {
    case 'qualifications':
      return {
        education_level:     form.education     || '',
        board_or_university: form.board         || '',
        subject_or_stream:   form.subjects      || '',
        year_of_passing:     form.yearOfPassing
          ? new Date(`${form.yearOfPassing}-01-01`).toISOString()
          : '',
        grade: form.grade || '',
      };
    case 'employment':
      return {
        posting_location:   form.posting        || '',
        rank_or_position:   form.rank           || '',
        specialization:     form.specialization || '',
        experience_summary: form.experience     || '',
        start_date: form.servicePeriodFrom ? new Date(form.servicePeriodFrom).toISOString() : '',
        end_date:   form.servicePeriodTo   ? new Date(form.servicePeriodTo).toISOString()   : '',
      };
    case 'training':
      return {
        training_title:                    form.title     || '',
        training_institution_and_location: form.institute || '',
        details:                           form.details   || '',
        start_date: form.durationFrom ? new Date(form.durationFrom).toISOString() : '',
        end_date:   form.durationTo   ? new Date(form.durationTo).toISOString()   : '',
      };
    case 'certifications':
      return {
        certificate_name:   form.certName || '',
        issued_by:          form.issuedBy  || '',
        year:               form.year      || '',
        additional_details: form.details   || '',
      };
  }
}

// ── Map API response → internal tab data ─────────────────────
function mapApiToTabData(profile: any): Record<PostTabId, any[]> {
  const pd = profile?.professional_details ?? {};

  const qualifications = (pd.qualifications ?? []).map((q: any) => ({
    id:            q._id,
    education:     q.education_level,
    board:         q.board_or_university,
    subjects:      q.subject_or_stream,
    yearOfPassing: q.year_of_passing ? new Date(q.year_of_passing).getFullYear().toString() : '',
    grade:         q.grade,
  }));

  const employment = (pd.employments ?? []).map((e: any) => ({
    id:                e._id,
    servicePeriodFrom: e.start_date ? e.start_date.slice(0, 10) : '',
    servicePeriodTo:   e.end_date   ? e.end_date.slice(0, 10)   : '',
    posting:           e.posting_location,
    rank:              e.rank_or_position,
    specialization:    e.specialization,
    experience:        e.experience_summary,
  }));

  const training = (pd.trainings ?? []).map((t: any) => ({
    id:           t._id,
    title:        t.training_title,
    institute:    t.training_institution_and_location,
    durationFrom: t.start_date ? t.start_date.slice(0, 10) : '',
    durationTo:   t.end_date   ? t.end_date.slice(0, 10)   : '',
    details:      t.details,
  }));

  const certifications = (pd.certifications ?? []).map((c: any) => ({
    id:       c._id,
    certName: c.certificate_name,
    issuedBy: c.issued_by,
    year:     c.year,
    details:  c.additional_details,
  }));

  return { qualifications, employment, training, certifications };
}

// ── Card content renderers ────────────────────────────────────
// Returns an array of { label, value } rows to display inside each card.
function getCardRows(tab: PostTabId, rec: any): { label: string; value: string }[] {
  switch (tab) {
    case 'qualifications':
      return [
        { label: 'Education',  value: rec.education     || '—' },
        { label: 'Board',      value: rec.board         || '—' },
        { label: 'Subjects',   value: rec.subjects      || '—' },
        { label: 'Year',       value: rec.yearOfPassing || '—' },
        { label: 'Grade',      value: rec.grade         || '—' },
      ];
    case 'employment':
      return [
        { label: 'Rank',           value: rec.rank           || '—' },
        { label: 'Posting',        value: rec.posting        || '—' },
        { label: 'Specialization', value: rec.specialization || '—' },
        { label: 'From',           value: rec.servicePeriodFrom || '—' },
        { label: 'To',             value: rec.servicePeriodTo   || '—' },
      ];
    case 'training':
      return [
        { label: 'Title',     value: rec.title     || '—' },
        { label: 'Institute', value: rec.institute  || '—' },
        { label: 'From',      value: rec.durationFrom || '—' },
        { label: 'To',        value: rec.durationTo   || '—' },
      ];
    case 'certifications':
      return [
        { label: 'Certificate', value: rec.certName || '—' },
        { label: 'Issued By',   value: rec.issuedBy  || '—' },
        { label: 'Year',        value: rec.year       || '—' },
      ];
  }
}

// Primary bold line (top of card)
function getCardTitle(tab: PostTabId, rec: any): string {
  switch (tab) {
    case 'qualifications': return rec.education || '—';
    case 'employment':     return rec.rank      || '—';
    case 'training':       return rec.title     || '—';
    case 'certifications': return rec.certName  || '—';
  }
}

// ── Add / Edit Modal ─────────────────────────────────────────
function EntryModal({
  visible, tab, initial, mode, saving, saveError,
  onClose, onSave,
}: {
  visible: boolean;
  tab: PostTabId;
  initial?: Record<string, string>;
  mode: 'add' | 'edit';
  saving: boolean;
  saveError: string | null;
  onClose: () => void;
  onSave: (form: Record<string, string>) => void;
}) {
  const fields = TAB_FIELDS[tab];
  const [form, setForm] = useState<Record<string, string>>(initial ?? {});

  useEffect(() => {
    if (visible) setForm(initial ?? {});
  }, [visible, tab]);

  if (!visible) return null;

  return (
    <div style={ms.overlay} onClick={onClose}>
      <div style={ms.sheet} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={ms.hdr}>
          <span style={ms.hdrTitle}>
            {mode === 'add' ? '＋ Add' : '✏️ Edit'} {POST_TABS.find(t => t.id === tab)?.label}
          </span>
          <button style={ms.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Error banner */}
        {saveError && (
          <div style={ms.errorBanner}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span>{saveError}</span>
          </div>
        )}

        {/* Body */}
        <div style={ms.body}>
          {fields.map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={ms.label}>{f.label}</label>
              {f.multiline ? (
                <textarea
                  style={{ ...ms.input, minHeight: 90, resize: 'vertical' }}
                  placeholder={f.placeholder}
                  value={form[f.key] || ''}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                />
              ) : f.type === 'dateRange' ? (
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={ms.rangeLabel}>FROM</div>
                    <input type="date" style={ms.input} value={form[f.key] || ''}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                  <div style={{ fontSize: 16, color: '#C5CDE0', alignSelf: 'flex-end', paddingBottom: 10 }}>→</div>
                  <div style={{ flex: 1 }}>
                    <div style={ms.rangeLabel}>TO</div>
                    <input type="date" style={ms.input} value={form[f.keyTo || ''] || ''}
                      onChange={e => setForm({ ...form, [f.keyTo || '']: e.target.value })} />
                  </div>
                </div>
              ) : (
                <input style={ms.input} placeholder={f.placeholder}
                  value={form[f.key] || ''}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={ms.actions}>
          <button style={ms.cancelBtn} onClick={onClose} disabled={saving}>Cancel</button>
          <button
            style={{ ...ms.saveBtn, opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
            onClick={() => onSave(form)}
            disabled={saving}
          >
            {saving ? '⏳ Saving…' : mode === 'add' ? '✓ Save Entry' : '✓ Update Entry'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tab Section ──────────────────────────────────────────────
function PostTabSection({
  tab, records, onAdd, onEdit,
}: {
  tab: PostTabId;
  records: any[];
  onAdd: () => void;
  onEdit: (rec: any) => void;
}) {
  return (
    <div style={{ padding: '20px 24px 24px' }}>
      <button style={pts.addBtn} onClick={onAdd}>
        <span style={{ fontSize: 20, fontWeight: 300 }}>＋</span>
        <span>Add {POST_TABS.find(t => t.id === tab)?.label}</span>
      </button>

      {records.length === 0 ? (
        <div style={pts.empty}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>{POST_TABS.find(t => t.id === tab)?.icon}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#8899BB' }}>No entries yet</div>
        </div>
      ) : (
        records.map((rec, i) => {
          const rows = getCardRows(tab, rec);
          return (
            <div key={rec.id || i} style={pts.card}>
              {/* Card header row */}
              <div style={pts.cardTop}>
                <div style={pts.dot} />
                <div style={{ fontSize: 14, color: '#1C4587', fontWeight: 700, flex: 1 }}>
                  {getCardTitle(tab, rec)}
                </div>
                <button style={pts.editBtn} title="Edit" onClick={() => onEdit(rec)}>✏️</button>
              </div>

              {/* Card detail rows — all fields visible */}
              <div style={pts.cardBody}>
                {rows.map(row => (
                  <div key={row.label} style={pts.detailRow}>
                    <span style={pts.detailLabel}>{row.label}</span>
                    <span style={pts.detailValue}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      <div style={pts.info}>{TAB_INFO[tab]}</div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────
const EMPTY_DATA: Record<PostTabId, any[]> = {
  qualifications: [], employment: [], training: [], certifications: [],
};

export default function PostAgniveerSubSection() {
  const [activeTab,  setActiveTab]  = useState<PostTabId>('qualifications');
  const [data,       setData]       = useState<Record<PostTabId, any[]>>(EMPTY_DATA);
  const [profileId,  setProfileId]  = useState<string>('');
  const [address,    setAddress]    = useState<string>('');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [modalMode,  setModalMode]  = useState<'add' | 'edit'>('add');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [saving,     setSaving]     = useState(false);
  const [saveError,  setSaveError]  = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(API_ENDPOINTS.GET_ALL_POST_AGNIVEER_PROFILES);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        const profiles: any[] = json.postAgniveerProfiles ?? [];
        if (profiles.length > 0) {
          setData(mapApiToTabData(profiles[0]));
          setProfileId(profiles[0]._id ?? '');
          setAddress(profiles[0].current_residential_address ?? '');
        }
      } catch (err: any) {
        setError(err.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAdd = () => {
    setEditRecord(null);
    setModalMode('add');
    setSaveError(null);
    setModalOpen(true);
  };

  const handleEdit = (rec: any) => {
    setEditRecord(rec);
    setModalMode('edit');
    setSaveError(null);
    setModalOpen(true);
  };

  const handleSave = async (form: Record<string, string>) => {
    if (!profileId) { setSaveError('Profile ID not loaded yet.'); return; }
    setSaving(true);
    setSaveError(null);
    try {
      let url = '';
      if (modalMode === 'add') {
        switch (activeTab) {
          case 'qualifications': url = API_ENDPOINTS.ADD_QUALIFICATION(profileId); break;
          case 'employment':     url = API_ENDPOINTS.ADD_EMPLOYMENT(profileId);    break;
          case 'training':       url = API_ENDPOINTS.ADD_TRAINING(profileId);      break;
          case 'certifications': url = API_ENDPOINTS.ADD_CERTIFICATION(profileId); break;
        }
      } else {
        const recordId = editRecord?.id ?? '';
        switch (activeTab) {
          case 'qualifications': url = API_ENDPOINTS.UPDATE_QUALIFICATION(profileId, recordId); break;
          case 'employment':     url = API_ENDPOINTS.UPDATE_EMPLOYMENT(profileId, recordId);    break;
          case 'training':       url = API_ENDPOINTS.UPDATE_TRAINING(profileId, recordId);      break;
          case 'certifications': url = API_ENDPOINTS.UPDATE_CERTIFICATION(profileId, recordId); break;
        }
      }

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(activeTab, form)),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.message ?? `Request failed: ${res.status}`);
      }

      // Re-fetch to sync UI
      const getRes = await fetch(API_ENDPOINTS.GET_ALL_POST_AGNIVEER_PROFILES);
      if (getRes.ok) {
        const json = await getRes.json();
        const profiles: any[] = json.postAgniveerProfiles ?? [];
        if (profiles.length > 0) setData(mapApiToTabData(profiles[0]));
      }

      setModalOpen(false);
      setEditRecord(null);
    } catch (err: any) {
      setSaveError(err.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ ...pst.card, padding: '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <div style={spinnerStyle} />
        <span style={{ fontSize: 15, color: '#6B7A99', fontWeight: 600 }}>Loading Post Agniveer Profile…</span>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ ...pst.card, padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#CC3333', marginBottom: 6 }}>Failed to load profile</div>
        <div style={{ fontSize: 13, color: '#888' }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Personal Info */}
      <div style={pst.card}>
        <div style={pst.sectionHdr}>
          <div style={pst.iconWrap}><span style={{ fontSize: 18 }}>👤</span></div>
          <span style={pst.sectionTitle}>Personal Information</span>
          <div style={pst.badge}>Read Only</div>
        </div>
        <div style={{ padding: '20px 16px' }}>
          <div style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 8 }}>📍 Current Address</div>
          <div style={pst.valBox}>{address || 'Unit Lines, Secunderabad Cantonment, Telangana'}</div>
          <div style={pst.note}>
            <span style={{ fontSize: 14, color: '#1C4587' }}>ℹ</span>
            <span style={{ fontSize: 12, color: '#4A6FA5', fontWeight: 500 }}>
              Personal details are pre-filled from your Agniveer records and cannot be edited here.
            </span>
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div style={pst.card}>
        <div style={pst.sectionHdr}>
          <div style={pst.iconWrap}><span style={{ fontSize: 18 }}>💼</span></div>
          <span style={pst.sectionTitle}>Professional Details</span>
        </div>
        <div style={pst.tabsBar}>
          {POST_TABS.map(t => (
            <button key={t.id}
              style={{ ...pst.tab, ...(activeTab === t.id ? pst.tabActive : {}) }}
              onClick={() => setActiveTab(t.id)}
            >
              <span>{t.icon}</span>
              <span style={{ color: activeTab === t.id ? '#fff' : '#666' }}>{t.label}</span>
              {data[t.id].length > 0 && (
                <span style={{
                  background: activeTab === t.id ? 'rgba(255,255,255,0.3)' : '#FF9933',
                  color: '#fff', borderRadius: 10, minWidth: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, padding: '0 5px',
                }}>
                  {data[t.id].length}
                </span>
              )}
            </button>
          ))}
        </div>
        <PostTabSection tab={activeTab} records={data[activeTab]} onAdd={handleAdd} onEdit={handleEdit} />
      </div>

      <EntryModal
        visible={modalOpen}
        tab={activeTab}
        mode={modalMode}
        initial={modalMode === 'edit' && editRecord ? editRecord : {}}
        saving={saving}
        saveError={saveError}
        onClose={() => { setModalOpen(false); setEditRecord(null); setSaveError(null); }}
        onSave={handleSave}
      />
    </div>
  );
}

// ── Spinner ──────────────────────────────────────────────────
const spinnerStyle: React.CSSProperties = {
  width: 22, height: 22, borderRadius: '50%',
  border: '3px solid #DDE6F7', borderTopColor: '#1C4587',
  animation: 'spin 0.8s linear infinite',
};

// ── Styles ───────────────────────────────────────────────────
const pst: Record<string, React.CSSProperties> = {
  card:        { background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.07)' },
  sectionHdr:  { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '2px solid #FF9933', background: '#FAFAFA' },
  iconWrap:    { width: 36, height: 36, borderRadius: '50%', background: '#FF9933', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sectionTitle:{ fontSize: 15, fontWeight: 700, color: '#1C4587', flex: 1 },
  badge:       { padding: '4px 12px', borderRadius: 10, border: '1px solid #C5CDE0', background: '#F0F4F8', fontSize: 11, color: '#6B7A99', fontWeight: 600 },
  valBox:      { background: '#F8F9FA', padding: 14, borderRadius: 8, borderLeft: '3px solid #FF9933', fontSize: 15, color: '#333', lineHeight: '1.6' },
  note:        { display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 12, background: '#EEF4FF', padding: 10, borderRadius: 6 },
  tabsBar:     { display: 'flex', gap: 10, padding: '14px 16px 10px', overflowX: 'auto', background: '#FAFAFA', borderBottom: '1px solid #EEE', flexWrap: 'wrap' },
  tab:         { display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 20, border: '1.5px solid #E0E0E0', background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  tabActive:   { background: '#1C4587', borderColor: '#1C4587' },
};

const pts: Record<string, React.CSSProperties> = {
  addBtn:      { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '13px 0', borderRadius: 10, border: 'none', background: '#1C4587', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginBottom: 18, boxShadow: '0 4px 14px rgba(28,69,135,0.3)' },
  empty:       { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '36px 20px', borderRadius: 12, border: '1.5px dashed #C8D6EE', background: '#F8F9FA', marginBottom: 16 },
  // card is now a column
  card:        { borderRadius: 10, border: '1px solid #DDE6F7', background: '#F8FAFF', marginBottom: 10, boxShadow: '0 1px 4px rgba(28,69,135,0.06)', overflow: 'hidden' },
  cardTop:     { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderBottom: '1px solid #EEF2FB', background: '#EEF4FF' },
  dot:         { width: 10, height: 10, borderRadius: 5, background: '#FF9933', flexShrink: 0 },
  editBtn:     { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 7, border: '1.5px solid #DDE6F7', background: '#fff', cursor: 'pointer', fontSize: 14, flexShrink: 0 },
  cardBody:    { padding: '10px 14px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' },
  detailRow:   { display: 'flex', flexDirection: 'column', gap: 2 },
  detailLabel: { fontSize: 11, color: '#999', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em' },
  detailValue: { fontSize: 13, color: '#1C4587', fontWeight: 600 },
  info:        { fontSize: 12, color: '#AAAAAA', fontStyle: 'italic', marginTop: 14, lineHeight: '1.6' },
};

const ms: Record<string, React.CSSProperties> = {
  overlay:     { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  sheet:       { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' },
  hdr:         { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #EEE' },
  hdrTitle:    { fontSize: 18, fontWeight: 700, color: '#1C4587' },
  closeBtn:    { width: 34, height: 34, borderRadius: 17, background: '#F0F4F8', border: 'none', cursor: 'pointer', fontSize: 14, color: '#555', fontWeight: 700 },
  errorBanner: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 20px', background: '#FFF0F0', borderBottom: '1px solid #FFCCCC', color: '#CC3333', fontSize: 13, fontWeight: 600, lineHeight: '1.5' },
  body:        { padding: '10px 20px', overflowY: 'auto', flex: 1 },
  label:       { display: 'block', fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 6 },
  rangeLabel:  { fontSize: 11, color: '#999', fontWeight: 600, marginBottom: 4 },
  input:       { width: '100%', border: '1.5px solid #D0D9E8', borderRadius: 10, padding: '12px 14px', fontSize: 15, color: '#333', background: '#FAFBFD', outline: 'none', boxSizing: 'border-box' },
  actions:     { display: 'flex', padding: '16px 20px', gap: 10 },
  cancelBtn:   { flex: 1, padding: '14px 0', borderRadius: 10, border: '1.5px solid #D0D9E8', background: '#fff', fontSize: 15, color: '#666', fontWeight: 600, cursor: 'pointer' },
  saveBtn:     { flex: 1, padding: '14px 0', borderRadius: 10, border: 'none', background: '#1C4587', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
};