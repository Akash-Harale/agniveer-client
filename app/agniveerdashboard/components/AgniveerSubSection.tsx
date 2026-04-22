'use client';

import { useEffect, useState } from 'react';
import { InfoRow, AgniSection } from './shared';

// ── API ──────────────────────────────────────────────────────
const GET_ALL_AGNIVEER_PROFILES = `/api/proxy/agniveer-profile/get-all-agniveer-profiles`;

// ── Types (exact API field names) ────────────────────────────
interface PersonalDetails {
  agniveer_name?: string;
  gender?: string;
  dob?: string;
  aadhar_number?: string;
  father_name?: string;
  mother_name?: string;
  permanent_address?: string;
  current_address?: string;
  agniveer_mobile?: string;
  agniveer_emailid?: string;
}

interface ServiceDetails {
  service_id?: string;
  branch_unit?: string;
  enrollment_date?: string;
  training_centre?: string;
  posting?: string;
  period_of_tenure?: string;   // ← actual field name
}

interface SkillsAndCertifications {
  weapon_training?: string;
  technical_skills?: string;
  certifications?: string;
}

interface HealthAndMedicalDetails {               // ← actual key: health_and_medical_details
  height?: string;
  weight?: string;
  blood_group?: string;
  medical_category?: string;
  last_medical_exam_date?: string;               // ← actual field name
  remarks?: string;
}

interface PerformanceAndDisciplineRecord {        // ← actual key: performance_and_discepline_record
  training_performance?: string;
  discipline_and_conduct?: string;               // ← actual field name
  operational_assessment?: string;
  disciplinary_action?: string;                  // ← actual field name (singular)
  commendations?: string;
}

interface RemarksAndRecommendations {
  remarks?: string;
  recommendations?: string;                      // ← actual field name (plural)
}

interface AgniveerProfile {
  _id?: string;
  personal_details?: PersonalDetails;
  service_details?: ServiceDetails;
  skills_and_certifications?: SkillsAndCertifications;
  health_and_medical_details?: HealthAndMedicalDetails;             // ← exact key
  performance_and_discepline_record?: PerformanceAndDisciplineRecord; // ← exact key (typo in API)
  remarks_and_recommendations?: RemarksAndRecommendations;
  rehab_status?: string;
  interested_in_rehab?: boolean;
  [key: string]: any;
}

// ── Helpers ──────────────────────────────────────────────────
const val = (v?: string) => (v && v.trim() ? v : '—');

/** Format ISO date → readable e.g. 2003-07-24T10:43:03.311Z → 24 Jul 2003 */
function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Capitalize first letter */
const capitalize = (v?: string) =>
  v ? v.charAt(0).toUpperCase() + v.slice(1) : '—';

/** Extract first profile from { agniveerProfiles: [...] } */
function extractProfile(json: unknown): AgniveerProfile | null {
  if (!json || typeof json !== 'object') return null;
  const obj = json as Record<string, unknown>;

  // ✅ Actual API shape
  if (Array.isArray(obj['agniveerProfiles']) && obj['agniveerProfiles'].length > 0) {
    return obj['agniveerProfiles'][0] as AgniveerProfile;
  }
  // Fallback wrappers
  for (const key of ['data', 'profiles', 'agniveers', 'result', 'results', 'items']) {
    if (Array.isArray(obj[key]) && (obj[key] as unknown[]).length > 0) {
      return (obj[key] as AgniveerProfile[])[0];
    }
  }
  if (Array.isArray(json) && json.length > 0) return json[0] as AgniveerProfile;
  if (obj._id) return obj as AgniveerProfile;
  return null;
}

// ── Component ────────────────────────────────────────────────
export default function AgniveerSubSection() {
  const [profile, setProfile] = useState<AgniveerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(GET_ALL_AGNIVEER_PROFILES, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) throw new Error(`Server returned ${res.status}`);

        const json = await res.json();
        if (cancelled) return;

        const found = extractProfile(json);
        if (found) {
          setProfile(found);
          setError(null);
        } else {
          setError('No agniveer profile found for this account.');
        }
      } catch (err: any) {
        if (!cancelled) setError(`Could not load profile: ${err.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // ── Loading skeleton ──────────────────────────────────────
  if (loading) {
    return (
      <div style={s.skeletonWrap}>
        {[120, 80, 100, 90, 110, 70].map((w, i) => (
          <div
            key={i}
            style={{ ...s.skeletonLine, width: `${w}%`, animationDelay: `${i * 0.12}s` }}
          />
        ))}
        <div style={s.skeletonNote}>Loading Agniveer profile…</div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (error || !profile) {
    return (
      <div style={s.errorBanner}>
        <span style={{ fontSize: 16 }}>⚠️</span>
        <span style={{ fontSize: 13, color: '#856404' }}>
          {error ?? 'Profile not available.'}
        </span>
      </div>
    );
  }

  // ── Destructure exact nested keys ─────────────────────────
  const pd = profile.personal_details                ?? {};
  const sd = profile.service_details                 ?? {};
  const sc = profile.skills_and_certifications       ?? {};
  const hm = profile.health_and_medical_details      ?? {};  // exact key
  const pf = profile.performance_and_discepline_record ?? {}; // exact key (API typo preserved)
  const rr = profile.remarks_and_recommendations     ?? {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── 1. Personal Information ── */}
      <AgniSection icon="👤" number={1} title="Personal Information">
        <InfoRow label="Name"               value={val(pd.agniveer_name)} />
        <InfoRow label="Gender"             value={capitalize(pd.gender)} />
        <InfoRow label="Date of Birth"      value={formatDate(pd.dob)} />
        <InfoRow label="Aadhaar Number"     value={val(pd.aadhar_number)} />
        <InfoRow label="Father's Name"      value={val(pd.father_name)} />
        <InfoRow label="Mother's Name"      value={val(pd.mother_name)} />
        <InfoRow label="Permanent Address"  value={val(pd.permanent_address)} />
        <InfoRow label="Current Address"    value={val(pd.current_address)} />
        <InfoRow label="Mobile Number"      value={val(pd.agniveer_mobile)} />
        <InfoRow label="Email ID"           value={val(pd.agniveer_emailid)} isLast />
      </AgniSection>

      {/* ── 2. Service Details ── */}
      <AgniSection icon="🎖️" number={2} title="Service Details">
        <InfoRow label="Service ID"         value={val(sd.service_id)} />
        <InfoRow label="Branch / Unit"      value={val(sd.branch_unit)} />
        <InfoRow label="Enrolment Date"     value={formatDate(sd.enrollment_date)} />
        <InfoRow label="Training Centre"    value={val(sd.training_centre)} />
        <InfoRow label="Posting"            value={val(sd.posting)} />
        <InfoRow label="Period of Tenure"   value={val(sd.period_of_tenure)} isLast />
      </AgniSection>

      {/* ── 3. Skills & Certifications ── */}
      <AgniSection icon="🎯" number={3} title="Skills & Certification">
        <InfoRow label="Weapons Training"   value={val(sc.weapon_training)} />
        <InfoRow label="Technical Skills"   value={val(sc.technical_skills)} />
        <InfoRow label="Certifications"     value={val(sc.certifications)} isLast />
      </AgniSection>

      {/* ── 4. Health & Medical ── */}
      <AgniSection icon="🏥" number={4} title="Health & Medical Fitness Data">
        <InfoRow label="Height"             value={val(hm.height)} />
        <InfoRow label="Weight"             value={val(hm.weight)} />
        <InfoRow label="Blood Group"        value={val(hm.blood_group)} />
        <InfoRow label="Medical Category"   value={val(hm.medical_category)} />
        <InfoRow label="Last Medical Exam"  value={formatDate(hm.last_medical_exam_date)} />
        <InfoRow label="Remarks"            value={val(hm.remarks)} isLast />
      </AgniSection>

      {/* ── 5. Performance & Discipline ── */}
      <AgniSection icon="⭐" number={5} title="Performance & Discipline Record">
        <InfoRow label="Training Performance"   value={val(pf.training_performance)} />
        <InfoRow label="Discipline & Conduct"   value={val(pf.discipline_and_conduct)} />
        <InfoRow label="Operational Assessment" value={val(pf.operational_assessment)} />
        <InfoRow label="Disciplinary Action"    value={val(pf.disciplinary_action)} />
        <InfoRow label="Commendations"          value={val(pf.commendations)} isLast />
      </AgniSection>

      {/* ── 6. Remarks & Recommendations ── */}
      <AgniSection icon="✍️" number={6} title="Remarks & Recommendations">
        <InfoRow label="Remarks"          value={val(rr.remarks)} />
        <InfoRow label="Recommendation"   value={val(rr.recommendations)} isLast highlight />
      </AgniSection>

    </div>
  );
}

// ── Local styles ─────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  skeletonWrap: {
    display: 'flex', flexDirection: 'column', gap: 14,
    padding: '32px 24px', background: '#fff',
    borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
    alignItems: 'center',
  },
  skeletonLine: {
    height: 18, borderRadius: 8,
    background: 'linear-gradient(90deg, #f0f4f8 25%, #e0e8f5 50%, #f0f4f8 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    maxWidth: '100%',
  },
  skeletonNote: { marginTop: 12, fontSize: 13, color: '#999', fontStyle: 'italic' },
  errorBanner: {
    display: 'flex', alignItems: 'center', gap: 10,
    background: '#fff8e1', border: '1px solid #ffe082',
    borderRadius: 10, padding: '12px 16px',
  },
};