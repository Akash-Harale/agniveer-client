'use client';

import { useState } from 'react';
import Link from 'next/link';

type CSSProps = React.CSSProperties;

const formDataInitial = {
  name: 'Rahul Kumar Singh',
  dob: '12 March 2004',
  aadhaar: 'XXXX XXXX 1234',
  father: 'Sh. Mahesh Singh',
  mother: 'Smt. Sunita Singh',
  permanentAddress: 'Village Bhagalpur, District Gaya, Bihar',
  currentAddress: 'Unit Lines, Secunderabad Cantonment, Telangana',
  mobile: '+91-9XXXXXXXX',
  email: 'rahul.singh@agniveer.mod.in',
  branch: 'Indian Army - Infantry Regiment',
  serviceId: 'AGN/ARMY/2022/1045',
  dateOfJoining: '15 August 2022',
  trainingCentre: 'Army Training Centre, Secunderabad',
  posting: 'Jammu & Kashmir Sector (Operational Area)',
  tenure: '2022 - 2026',
  weaponTraining: 'INSAS Rifle, AK-47, Light Machine Gun',
  technicalSkills: 'Computer Literacy, Basic Networking',
  certifications: 'First Aid & Trauma Care, Driving License (Heavy Vehicle)',
  height: '177 cm',
  weight: '72 kg',
  bloodGroup: 'O+',
  medicalCategory: 'SHAPE-1 (Fully Fit)',
  lastMedicalExam: '12 June 2024',
  medicalRemarks: 'Medically fit for field and combat duties',
  trainingPerformance: 'Physical Training: Excellent, Weapons Handling: Very Good',
  discipline: 'Outstanding',
  operationalAssessment: 'Efficient in field operations, teamwork and leadership qualities',
  disciplinaryActions: 'None',
  commendations: 'Awarded "Best Trainee" Medal (2023)',
  remarks: 'Agniveer Rahul Kumar Singh has successfully completed 2 years of service with an excellent record.',
  recommendation: 'Recommended for Induction in CAPF (CRPF/BSF/ITBP) post completion of tenure.',
};

/* ============================================================
   INFO ROW
   ============================================================ */
function InfoRow({
  label,
  value,
  isLast = false,
  highlight = false,
  editable = false,
  onChange,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  highlight?: boolean;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div style={{ ...s.infoRow, ...(isLast ? s.infoRowLast : {}) }}>
      <div style={s.labelCell}>
        <span style={s.labelText}>{label}</span>
      </div>
      <div style={{ ...s.valueCell, ...(highlight ? s.valueCellHighlight : {}) }}>
        {editable ? (
          <textarea
            style={s.input}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            rows={3}
          />
        ) : (
          <span style={s.valueText}>{value}</span>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   SECTION WRAPPER
   ============================================================ */
function Section({
  icon,
  number,
  title,
  children,
}: {
  icon: string;
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={s.section}>
      <div style={s.sectionHeaderBar}>
        <div style={s.sectionIconContainer}>
          <span style={{ fontSize: 17 }}>{icon}</span>
        </div>
        <span style={s.sectionTitle}>{number}. {title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function AgniveerProfilePage() {
  const [formData, setFormData] = useState(formDataInitial);
  const [isEditing, setIsEditing] = useState(false);

  const update = (key: keyof typeof formDataInitial) => (val: string) =>
    setFormData(p => ({ ...p, [key]: val }));

  return (
    <div style={s.page}>
      {/* ===== HEADER ===== */}
      <div style={s.header}>
        <Link href="/agniveerdashboard" style={s.backBtn}>
          <span style={s.backText}>←</span>
        </Link>
        <div style={s.headerTextContainer}>
          <div style={s.headerTitle}>Agniveer Profile</div>
          <div style={s.headerSubtitle}>Service Record Management</div>
        </div>
        <button
          style={{ ...s.editBtnContainer, ...(isEditing ? s.editBtnActive : {}) }}
          onClick={() => setIsEditing(p => !p)}
        >
          <span style={s.editText}>{isEditing ? '✓' : '✎'}</span>
        </button>
      </div>

      {/* ===== SCROLLABLE CONTENT ===== */}
      <div style={s.content}>
        {/* Profile Header Card */}
        <div style={s.profileHeader}>
          <div style={s.photoCircle}>
            <span style={{ fontSize: 40, color: 'white' }}>👤</span>
          </div>
          <div style={s.profileName}>{formData.name}</div>
          <div style={s.branchBadge}>
            <span style={s.profileBranch}>{formData.branch}</span>
          </div>
          <div style={s.serviceIdText}>Service ID: {formData.serviceId}</div>
          <div style={s.statusBadge}>
            <span style={s.statusText}>● Active Service</span>
          </div>
        </div>

        {/* Section 1: Personal Information */}
        <Section icon="👤" number={1} title="Personal Information">
          <InfoRow label="Name" value={formData.name} />
          <InfoRow label="Date of Birth" value={formData.dob} />
          <InfoRow label="Aadhaar Number" value={formData.aadhaar} />
          <InfoRow label="Father's Name" value={formData.father} />
          <InfoRow label="Mother's Name" value={formData.mother} />
          <InfoRow label="Permanent Address" value={formData.permanentAddress} />
          <InfoRow
            label="Current Address"
            value={formData.currentAddress}
            editable={isEditing}
            onChange={update('currentAddress')}
          />
          {isEditing && (
            <div style={s.permissionNote}>
              <span style={s.permissionIcon}>✓</span>
              <span style={s.note}>Allowed to edit current address only</span>
            </div>
          )}
          <InfoRow label="Mobile Number" value={formData.mobile} />
          <InfoRow label="Email ID" value={formData.email} isLast />
        </Section>

        {/* Section 2: Service Details */}
        <Section icon="🎖️" number={2} title="Service Details">
          <InfoRow label="Service ID" value={formData.serviceId} />
          <InfoRow label="Branch / Unit" value={formData.branch} />
          <InfoRow label="Enrolment Date" value={formData.dateOfJoining} />
          <InfoRow label="Training Centre" value={formData.trainingCentre} />
          <InfoRow label="Posting" value={formData.posting} />
          <InfoRow label="Period of Tenure" value={formData.tenure} isLast />
        </Section>

        {/* Section 3: Skills & Certification */}
        <Section icon="🎯" number={3} title="Skills & Certification">
          <InfoRow label="Weapons Training" value={formData.weaponTraining} />
          <InfoRow label="Technical Skills" value={formData.technicalSkills} />
          <InfoRow label="Certifications" value={formData.certifications} isLast />
        </Section>

        {/* Section 4: Health & Medical */}
        <Section icon="🏥" number={4} title="Health & Medical Fitness Data">
          <InfoRow label="Height" value={formData.height} />
          <InfoRow label="Weight" value={formData.weight} />
          <InfoRow label="Blood Group" value={formData.bloodGroup} />
          <InfoRow label="Medical Category" value={formData.medicalCategory} />
          <InfoRow label="Last Medical Exam Date" value={formData.lastMedicalExam} />
          <InfoRow label="Remarks" value={formData.medicalRemarks} isLast />
        </Section>

        {/* Section 5: Performance & Discipline */}
        <Section icon="⭐" number={5} title="Performance & Discipline Record">
          <InfoRow label="Training Performance" value={formData.trainingPerformance} />
          <InfoRow label="Discipline & Conduct" value={formData.discipline} />
          <InfoRow label="Operational Assessment" value={formData.operationalAssessment} />
          <InfoRow label="Disciplinary Actions" value={formData.disciplinaryActions} />
          <InfoRow label="Commendations" value={formData.commendations} isLast />
        </Section>

        {/* Section 6: Remarks & Recommendations */}
        <Section icon="✍️" number={6} title="Remarks & Recommendations">
          <InfoRow label="Remarks" value={formData.remarks} />
          <InfoRow label="Recommendation" value={formData.recommendation} isLast highlight />
        </Section>

        {/* Save Button */}
        {isEditing && (
          <button style={s.saveBtn} onClick={() => setIsEditing(false)}>
            ✓ Save Changes
          </button>
        )}

        {/* Footer */}
        <div style={s.footer}>
          <div style={s.tricolor}>
            <div style={s.saffron} />
            <div style={s.white} />
            <div style={s.green} />
          </div>
          <div style={s.footerText}>Government of India</div>
          <div style={s.footerSubtext}>भारत सरकार</div>
          <div style={s.footerNote}>
            This is a computer generated document and does not require signature
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STYLES
   ============================================================ */
const s: Record<string, CSSProps> = {
  page: {
    minHeight: '100vh',
    background: '#F0F4F8',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },

  /* Header */
  header: {
    background: '#1C4587',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  backBtn: {
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    textDecoration: 'none',
    flexShrink: 0,
  },
  backText: { fontSize: 24, color: '#fff', fontWeight: 300, lineHeight: 1 },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 19, fontWeight: 700, color: '#fff', marginBottom: 2 },
  headerSubtitle: { fontSize: 12, color: '#dde8ff' },
  editBtnContainer: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s',
  },
  editBtnActive: { background: '#4CAF50' },
  editText: { fontSize: 20, color: '#fff' },

  /* Content */
  content: {
    maxWidth: 860,
    width: '100%',
    margin: '0 auto',
    padding: '20px 16px 40px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  /* Profile Header */
  profileHeader: {
    background: '#fff',
    borderRadius: 12,
    padding: '28px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  photoCircle: {
    width: 110,
    height: 110,
    borderRadius: '50%',
    background: '#1C4587',
    border: '4px solid #FF9933',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  profileName: { fontSize: 24, fontWeight: 700, color: '#1C4587' },
  branchBadge: {
    background: '#E8F0FF',
    border: '1px solid #1C4587',
    borderRadius: 20,
    padding: '5px 16px',
  },
  profileBranch: { fontSize: 12, color: '#1C4587', fontWeight: 600 },
  serviceIdText: { fontSize: 12, color: '#666', fontWeight: 500 },
  statusBadge: {
    background: '#E8F5E9',
    border: '1px solid #4CAF50',
    borderRadius: 15,
    padding: '5px 14px',
  },
  statusText: { fontSize: 12, color: '#4CAF50', fontWeight: 600 },

  /* Section */
  section: {
    background: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
  },
  sectionHeaderBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '2px solid #FF9933',
    background: '#FAFAFA',
  },
  sectionIconContainer: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: '#FF9933',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#1C4587' },

  /* Info Row */
  infoRow: {
    display: 'flex',
    borderBottom: '1px solid #E0E0E0',
    minHeight: 45,
  },
  infoRowLast: { borderBottom: 'none' },
  labelCell: {
    width: '35%',
    background: '#F5F5F5',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    borderRight: '1px solid #E0E0E0',
    flexShrink: 0,
  },
  labelText: { fontSize: 13, color: '#555', fontWeight: 600 },
  valueCell: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
  },
  valueCellHighlight: { background: '#FFFDE7' },
  valueText: { fontSize: 13, color: '#333', lineHeight: '20px' },
  input: {
    width: '100%',
    border: '1.5px solid #1C4587',
    borderRadius: 6,
    padding: '8px 10px',
    fontSize: 13,
    color: '#333',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
    outline: 'none',
  },

  /* Permission note */
  permissionNote: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '0 12px 8px',
    background: '#E8F5E9',
    padding: '8px 12px',
    borderRadius: 6,
  },
  permissionIcon: { fontSize: 14, color: '#4CAF50' },
  note: { fontSize: 11, color: '#4CAF50', fontWeight: 500 },

  /* Save Button */
  saveBtn: {
    background: '#FF9933',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '14px',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    boxShadow: '0 3px 10px rgba(255,153,51,0.4)',
    transition: 'opacity 0.2s',
  },

  /* Footer */
  footer: {
    background: '#fff',
    borderRadius: 10,
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
  },
  tricolor: {
    width: 100,
    height: 6,
    borderRadius: 3,
    display: 'flex',
    overflow: 'hidden',
    marginBottom: 10,
  },
  saffron: { flex: 1, background: '#FF9933' },
  white: { flex: 1, background: '#fff', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' },
  green: { flex: 1, background: '#138808' },
  footerText: { fontSize: 16, fontWeight: 700, color: '#1C4587' },
  footerSubtext: { fontSize: 14, color: '#666' },
  footerNote: { fontSize: 11, color: '#999', textAlign: 'center' as const, marginTop: 4 },
};