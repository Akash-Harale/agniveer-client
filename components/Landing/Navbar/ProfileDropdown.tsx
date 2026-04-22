'use client';

import { useState } from 'react';
import {
  User,
  LogOut,
  Phone,
  Mail,
  X,
  Edit2,
  Save,
  Star,
  Briefcase,
  CheckCircle,
} from 'lucide-react';

interface ProfileDropdownProps {
  showDropdown: boolean;
  toggleDropdown: () => void;
  handleLogout: () => void;
  userEmail: string;
  userName?: string;
  userDesignation?: string;
  userPhone?: string;
  userRole?: 'admin' | 'manager' | 'user';
  loginType?: 'email' | 'mobile';
}

const roleConfig = {
  admin: {
    label: 'Admin',
    icon: Star,
    permissions: ['Manage users', 'Edit settings', 'View reports', 'Delete records', 'Audit logs', 'API access'],
    badgeStyle: { background: '#faeeda', color: '#633806' },
  },
  manager: {
    label: 'Manager',
    icon: Briefcase,
    permissions: ['View reports', 'Edit records', 'Manage team', 'API access'],
    badgeStyle: { background: '#e6f1fb', color: '#0c447c' },
  },
  user: {
    label: 'User',
    icon: User,
    permissions: ['View records', 'Edit own data'],
    badgeStyle: { background: '#eaf3de', color: '#27500a' },
  },
};

const DUMMY = {
  name: 'Mohan Singh',
  designation: 'Product Designer',
  email: 'user@mha.gov.in',
  phone: '+91 98765 43210',
};

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function ProfileDropdown({
  showDropdown,
  toggleDropdown,
  handleLogout,
  userEmail,
  userName = '',
  userDesignation = '',
  userPhone = '',
  userRole = 'user',
  loginType = 'email',
}: ProfileDropdownProps) {
  // Always resolve to a non-empty value
  const resolvedName        = userName.trim()        || DUMMY.name;
  const resolvedDesignation = userDesignation.trim() || DUMMY.designation;
  const resolvedEmail       = userEmail.trim()       || DUMMY.email;
  const resolvedPhone       = userPhone.trim()       || DUMMY.phone;

  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name:        resolvedName,
    designation: resolvedDesignation,
    email:       resolvedEmail,
    phone:       resolvedPhone,
    role:        userRole,
  });
  const [saved, setSaved] = useState({ ...userData });

  const role     = roleConfig[saved.role];
  const RoleIcon = role.icon;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleSave = () => { setSaved({ ...userData }); setEditMode(false); };
  const handleCancel = () => { setUserData({ ...saved }); setEditMode(false); };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Avatar trigger */}
      <div
        onClick={toggleDropdown}
        title="Profile"
        style={{
          width: 38, height: 38, borderRadius: '50%',
          background: '#e6f1fb', border: '1.5px solid #b5d4f4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 0.15s',
          fontSize: 15, fontWeight: 500, color: '#185fa5', userSelect: 'none',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {getInitials(saved.name)}
      </div>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div onClick={toggleDropdown} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />

          {/* Dropdown panel */}
          <div style={{
            position: 'absolute', top: 46, right: 0, width: 300,
            background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)',
            borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            zIndex: 50, overflow: 'hidden', animation: 'pdPop 0.18s ease',
          }}>
            <style>{`
              @keyframes pdPop {
                from { opacity:0; transform:translateY(-6px) scale(0.98); }
                to   { opacity:1; transform:translateY(0)    scale(1);    }
              }
            `}</style>

            {/* Close button */}
            <button onClick={toggleDropdown} style={{
              position: 'absolute', top: 10, right: 10,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94a3b8', display: 'flex', padding: 4, borderRadius: 6,
            }}>
              <X size={14} />
            </button>

            {/* ── Header ── */}
            <div style={{
              padding: '20px 20px 14px', display: 'flex', gap: 14,
              alignItems: 'flex-start', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: '#e6f1fb', border: '1.5px solid #b5d4f4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 500, color: '#185fa5',
                }}>
                  {getInitials(saved.name)}
                </div>
                {/* Online dot */}
                <div style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 11, height: 11, borderRadius: '50%',
                  background: '#22c55e', border: '2px solid #fff',
                }} />
                {/* Edit pencil */}
                {!editMode && (
                  <button onClick={() => setEditMode(true)} title="Edit profile" style={{
                    position: 'absolute', bottom: -3, right: -3,
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#e6f1fb', border: '1.5px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#185fa5',
                  }}>
                    <Edit2 size={9} />
                  </button>
                )}
              </div>

              {/* Name / designation / role badge */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 15, fontWeight: 500, color: '#0f172a', marginBottom: 2,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {saved.name}
                </div>
                <div style={{
                  fontSize: 12, color: '#64748b', marginBottom: 6,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {saved.designation}
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 500, padding: '3px 9px',
                  borderRadius: 20, ...role.badgeStyle,
                }}>
                  <RoleIcon size={10} />
                  {role.label}
                </span>
              </div>
            </div>

            {/* ── Contact info (view mode) ── */}
            {!editMode && (
              <div style={{
                padding: '12px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column', gap: 7,
              }}>
                {/* Phone — always shown for both login types */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#64748b' }}>
                  <Phone size={13} style={{ flexShrink: 0 }} />
                  <span>{saved.phone}</span>
                </div>

                {/* Email — always shown for both login types */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#64748b' }}>
                  <Mail size={13} style={{ flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {saved.email}
                  </span>
                </div>
              </div>
            )}

            {/* ── Permissions (view mode) ── */}
            {!editMode && (
              <div style={{ padding: '12px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{
                  fontSize: 10, fontWeight: 600, color: '#94a3b8',
                  textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 8,
                }}>
                  Access permissions
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                  {role.permissions.map(perm => (
                    <div key={perm} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 11, color: '#334155',
                      padding: '4px 8px', background: '#f8fafc', borderRadius: 6,
                    }}>
                      <CheckCircle size={10} color="#16a34a" />
                      {perm}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Edit form ── */}
            {editMode && (
              <div style={{
                padding: '14px 20px', borderBottom: '0.5px solid rgba(0,0,0,0.08)',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {[
                  { label: 'Full name',      name: 'name',        type: 'text'  },
                  { label: 'Designation',    name: 'designation', type: 'text'  },
                  { label: 'Mobile number',  name: 'phone',       type: 'text'  },
                  { label: 'Email address',  name: 'email',       type: 'email' },
                ].map(field => (
                  <div key={field.name}>
                    <label style={{
                      display: 'block', fontSize: 10, fontWeight: 600,
                      color: '#94a3b8', textTransform: 'uppercase',
                      letterSpacing: '0.7px', marginBottom: 4,
                    }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={(userData as Record<string, string>)[field.name]}
                      onChange={handleChange}
                      style={{
                        width: '100%', fontSize: 13, padding: '7px 10px',
                        borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.18)',
                        background: '#f8fafc', color: '#0f172a',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}

                {/* Role selector */}
                <div>
                  <label style={{
                    display: 'block', fontSize: 10, fontWeight: 600,
                    color: '#94a3b8', textTransform: 'uppercase',
                    letterSpacing: '0.7px', marginBottom: 4,
                  }}>
                    Role
                  </label>
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                    style={{
                      width: '100%', fontSize: 13, padding: '7px 10px',
                      borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.18)',
                      background: '#f8fafc', color: '#0f172a', outline: 'none',
                    }}
                  >
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                  <button onClick={handleSave} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 5, padding: '7px', borderRadius: 8,
                    border: '0.5px solid #b5d4f4', background: '#e6f1fb',
                    color: '#185fa5', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  }}>
                    <Save size={11} /> Save
                  </button>
                  <button onClick={handleCancel} style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 5, padding: '7px', borderRadius: 8,
                    border: '0.5px solid rgba(0,0,0,0.12)', background: '#f1f5f9',
                    color: '#64748b', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  }}>
                    <X size={11} /> Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── Sign out ── */}
            <div style={{ padding: 8 }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '8px 12px', borderRadius: 8,
                  border: 'none', background: 'none',
                  fontSize: 13, color: '#64748b', cursor: 'pointer', textAlign: 'left',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#b91c1c'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none';    e.currentTarget.style.color = '#64748b'; }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}