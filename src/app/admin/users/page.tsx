'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { apiFetch } from '@/utils/auth-utils';

export interface ClerkAdminUser {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING';
  approved: boolean;
  createdAt: string;
}

function AdminUserRow({
  adm,
  isSelf,
  onUpdate,
  onDelete,
}: {
  adm: ClerkAdminUser;
  isSelf: boolean;
  onUpdate: (id: string, updateData: { status?: 'ACTIVE' | 'PENDING'; approved?: boolean; role?: 'SUPER_ADMIN' | 'ADMIN' }) => void;
  onDelete: (id: string, email: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const [approveHover, setApproveHover] = useState(false);
  const [removeHover, setRemoveHover] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: '1px solid #263541',
        backgroundColor: hover ? '#1D2A36' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
    >
      <td style={{ padding: '14px', fontWeight: 600, color: '#F4F1E9' }}>{adm.name}</td>
      <td style={{ padding: '14px', color: '#B5BEC7' }}>{adm.email}</td>
      <td style={{ padding: '14px' }}>
        <select
          value={adm.role}
          onChange={(e) => onUpdate(adm.id, { role: e.target.value as 'SUPER_ADMIN' | 'ADMIN' })}
          disabled={isSelf}
          style={{
            background: '#101821',
            border: '1px solid #263541',
            color: adm.role === 'SUPER_ADMIN' ? '#C6A15B' : '#F4F1E9',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            cursor: isSelf ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>
      </td>
      <td style={{ padding: '14px' }}>
        <span
          style={{
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            backgroundColor: adm.approved ? 'rgba(127, 198, 154, 0.15)' : 'rgba(198, 161, 91, 0.15)',
            color: adm.approved ? '#7FC69A' : '#C6A15B',
            border: adm.approved ? '1px solid rgba(127, 198, 154, 0.3)' : '1px solid rgba(198, 161, 91, 0.3)',
          }}
        >
          {adm.approved ? 'APPROVED (ACTIVE)' : 'PENDING APPROVAL'}
        </span>
      </td>
      <td style={{ padding: '14px', color: '#788692' }}>
        {new Date(adm.createdAt).toLocaleDateString()}
      </td>
      <td style={{ padding: '14px', textAlign: 'right' }}>
        {!adm.approved && (
          <button
            onClick={() => onUpdate(adm.id, { approved: true, status: 'ACTIVE' })}
            onMouseEnter={() => setApproveHover(true)}
            onMouseLeave={() => setApproveHover(false)}
            style={{
              background: approveHover ? '#D4B16B' : '#C6A15B',
              color: '#101821',
              border: 'none',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: 'var(--text-xs)',
              marginRight: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            ✓ Approve User
          </button>
        )}
        {!isSelf && (
          <button
            onClick={() => onDelete(adm.id, adm.email)}
            onMouseEnter={() => setRemoveHover(true)}
            onMouseLeave={() => setRemoveHover(false)}
            style={{
              background: removeHover ? '#B56868' : '#C87979',
              color: '#101821',
              border: 'none',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              transition: 'background-color 0.2s ease',
            }}
          >
            Remove
          </button>
        )}
      </td>
    </tr>
  );
}

export default function AdminUsersGovernancePage() {
  const { user: clerkCurrentUser } = useUser();
  const [admins, setAdmins] = useState<ClerkAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshHover, setRefreshHover] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await apiFetch<ClerkAdminUser[]>('/api/admin/users');
    if (res.success && res.data) {
      setAdmins(res.data);
    } else {
      setError(res.message || 'Failed to fetch admin users');
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string, updateData: { status?: 'ACTIVE' | 'PENDING'; approved?: boolean; role?: 'SUPER_ADMIN' | 'ADMIN' }) => {
    const res = await apiFetch<ClerkAdminUser>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });

    if (res.success) {
      fetchAdmins();
    } else {
      alert(res.message || 'Failed to update admin user');
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (clerkCurrentUser?.id === id) {
      alert('Super Admin cannot delete their own active account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to remove admin user '${email}'?`)) return;

    const res = await apiFetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });

    if (res.success) {
      fetchAdmins();
    } else {
      alert(res.message || 'Failed to delete admin');
    }
  };

  if (loading) {
    return <div style={{ padding: '60px 20px', textAlign: 'center', color: '#788692' }}>Loading admin user list...</div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: 'rgba(200, 121, 121, 0.15)', border: '1px solid #C87979', color: '#C87979', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ color: '#F4F1E9', margin: 0 }}>Super Admin Governance</h1>
          <p style={{ color: '#788692', margin: '6px 0 0 0', fontSize: 'var(--text-body)' }}>Approve, reject, or manage roles for admin registrants</p>
        </div>
        <button
          onClick={fetchAdmins}
          onMouseEnter={() => setRefreshHover(true)}
          onMouseLeave={() => setRefreshHover(false)}
          style={{
            background: refreshHover ? '#1D2A36' : '#17222D',
            border: '1px solid #263541',
            color: '#B5BEC7',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background-color 0.2s ease',
          }}
        >
          🔄 Refresh User List
        </button>
      </div>

      <div style={{ background: '#17222D', border: '1px solid #263541', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ background: '#101821', borderBottom: '1px solid #263541' }}>
                <th style={{ padding: '14px', color: '#788692', fontWeight: 600 }}>ADMIN NAME</th>
                <th style={{ padding: '14px', color: '#788692', fontWeight: 600 }}>EMAIL ADDRESS</th>
                <th style={{ padding: '14px', color: '#788692', fontWeight: 600 }}>ROLE</th>
                <th style={{ padding: '14px', color: '#788692', fontWeight: 600 }}>APPROVAL STATUS</th>
                <th style={{ padding: '14px', color: '#788692', fontWeight: 600 }}>REGISTERED DATE</th>
                <th style={{ padding: '14px', textAlign: 'right', color: '#788692', fontWeight: 600 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((adm) => (
                <AdminUserRow
                  key={adm.id}
                  adm={adm}
                  isSelf={clerkCurrentUser?.id === adm.id}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
