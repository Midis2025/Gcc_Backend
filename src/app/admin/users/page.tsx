'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getStoredUser, getToken, AuthUser } from '@/utils/auth-utils';
import { AdminRole, AdminStatus, AdminUser } from '@/models/admin.model';

export default function AdminUsersGovernancePage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();

    if (!token) {
      router.push('/admin/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN') {
      setError('Super Admin authority is required to access Admin User Governance.');
      setLoading(false);
      return;
    }

    setCurrentUser(user);
    fetchAdmins();
  }, [router]);

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await apiFetch<AdminUser[]>('/api/admin/users');
    if (res.success && res.data) {
      setAdmins(res.data);
    } else {
      setError(res.message || 'Failed to fetch admin users');
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string, updateData: { status?: AdminStatus; role?: AdminRole }) => {
    const res = await apiFetch<AdminUser>(`/api/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });

    if (res.success) {
      fetchAdmins();
    } else {
      alert(res.message || 'Failed to update admin');
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (currentUser?.id === id) {
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
    return <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-foreground-subtle)' }}>Loading admin user list...</div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: 'var(--color-danger-soft)', border: '1px solid var(--color-danger-line)', color: 'var(--color-danger)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h1 style={{ color: 'var(--color-foreground)', margin: 0 }}>Super Admin Governance</h1>
          <p style={{ color: 'var(--color-foreground-subtle)', margin: '6px 0 0 0', fontSize: 'var(--text-body)' }}>Approve, reject, or manage roles for admin registrants</p>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-foreground-subtle)', background: 'var(--color-surface-sunken)' }}>
                <th style={{ padding: '14px' }}>Admin Name</th>
                <th style={{ padding: '14px' }}>Email Address</th>
                <th style={{ padding: '14px' }}>Role</th>
                <th style={{ padding: '14px' }}>Status</th>
                <th style={{ padding: '14px' }}>Registered Date</th>
                <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((adm) => (
                <tr key={adm.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{adm.name}</td>
                  <td style={{ padding: '14px' }}>{adm.email}</td>
                  <td style={{ padding: '14px' }}>
                    <select
                      value={adm.role}
                      onChange={(e) => handleUpdate(adm.id, { role: e.target.value as AdminRole })}
                      disabled={currentUser?.id === adm.id}
                      style={{
                        background: 'var(--color-surface-sunken)',
                        border: '1px solid var(--color-border)',
                        color: adm.role === 'SUPER_ADMIN' ? 'var(--color-accent)' : 'var(--color-foreground)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
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
                        backgroundColor:
                          adm.status === 'APPROVED'
                            ? 'var(--color-success-soft)'
                            : adm.status === 'PENDING_APPROVAL'
                            ? 'var(--color-warning-soft)'
                            : 'var(--color-danger-soft)',
                        color:
                          adm.status === 'APPROVED'
                            ? 'var(--color-success)'
                            : adm.status === 'PENDING_APPROVAL'
                            ? 'var(--color-warning)'
                            : 'var(--color-danger)',
                      }}
                    >
                      {adm.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--color-foreground-subtle)' }}>
                    {new Date(adm.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    {adm.status === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          onClick={() => handleUpdate(adm.id, { status: 'APPROVED' })}
                          style={{
                            background: 'var(--color-success)',
                            color: 'var(--color-foreground-on-solid)',
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 600,
                            fontSize: 'var(--text-xs)',
                            marginRight: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdate(adm.id, { status: 'REJECTED' })}
                          style={{
                            background: 'var(--color-danger-soft)',
                            border: '1px solid var(--color-danger-line)',
                            color: 'var(--color-danger)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)',
                            marginRight: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {currentUser?.id !== adm.id && (
                      <button
                        onClick={() => handleDelete(adm.id, adm.email)}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-foreground)',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
