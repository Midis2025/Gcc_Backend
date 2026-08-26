'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, getToken } from '@/utils/auth-utils';
import { ContactEnquiry } from '@/models/contact.model';

interface StatsData {
  enquiries: {
    total: number;
    pending: number;
    reviewed: number;
    archived: number;
  };
  admins: {
    total: number;
    pendingApproval: number;
  };
  recentSubmissions: ContactEnquiry[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    /*
    // OLD JWT TOKEN CHECK (COMMENTED OUT) - Route protection is handled by Clerk Middleware
    // const token = getToken();
    // if (!token) {
    //   setLoading(false);
    //   router.push('/admin/login');
    //   return;
    // }
    */
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const res = await apiFetch<StatsData>('/api/admin/stats');
    if (res.success && res.data) {
      setStats(res.data);
    } else {
      /*
      // OLD JWT UNAUTHORIZED CHECK (COMMENTED OUT)
      // if (res.message?.includes('Unauthorized') || res.message?.includes('expired') || res.message?.includes('invalid')) {
      //   router.push('/admin/login');
      //   return;
      // }
      */
      setError(res.message || 'Failed to load dashboard metrics');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-foreground-subtle)' }}>
        Loading dashboard metrics...
      </div>
    );
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
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: 'var(--color-foreground)', margin: 0 }}>CMS Overview Dashboard</h1>
          <p style={{ color: 'var(--color-foreground-subtle)', margin: '6px 0 0 0', fontSize: 'var(--text-body)' }}>Real-time summary of contact submissions & meeting requests</p>
        </div>
        <button
          onClick={fetchStats}
          style={{
            background: 'var(--color-surface-sunken)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-foreground)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div className="gcc-label">Total Submissions</div>
          <div className="gcc-numeral" style={{ color: 'var(--color-accent)', marginTop: '12px' }}>{stats?.enquiries.total || 0}</div>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div className="gcc-label">Pending Meetings</div>
          <div className="gcc-numeral" style={{ color: 'var(--color-warning)', marginTop: '12px' }}>{stats?.enquiries.pending || 0}</div>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div className="gcc-label">Reviewed</div>
          <div className="gcc-numeral" style={{ color: 'var(--color-success)', marginTop: '12px' }}>{stats?.enquiries.reviewed || 0}</div>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '24px', borderRadius: 'var(--radius-md)' }}>
          <div className="gcc-label">Admin Users</div>
          <div className="gcc-numeral" style={{ color: 'var(--color-foreground)', marginTop: '12px' }}>{stats?.admins.total || 0}</div>
          {stats?.admins.pendingApproval ? (
            <div style={{ color: 'var(--color-warning)', fontSize: 'var(--text-xs)', marginTop: '6px' }}>
              ⚠️ {stats.admins.pendingApproval} pending approval
            </div>
          ) : null}
        </div>
      </div>

      {/* Recent Submissions Section */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'var(--color-foreground)', margin: 0 }}>Recent Contact Submissions</h2>
          <Link href="/admin/enquiries" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            View All Submissions ➔
          </Link>
        </div>

        {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-foreground-subtle)' }}>
                  <th style={{ padding: '12px' }}>Client</th>
                  <th style={{ padding: '12px' }}>Company</th>
                  <th style={{ padding: '12px' }}>Area</th>
                  <th style={{ padding: '12px' }}>Requested Time</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSubmissions.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '12px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: '12px' }}>{item.company}</td>
                    <td style={{ padding: '12px' }}>{item.area}</td>
                    <td style={{ padding: '12px' }}>
                      {item.preferredDate ? `${item.preferredDate} ${item.preferredTime || ''}` : 'N/A'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          backgroundColor:
                            item.status === 'PENDING'
                              ? 'var(--color-warning-soft)'
                              : item.status === 'REVIEWED'
                              ? 'var(--color-success-soft)'
                              : 'var(--color-neutral-soft)',
                          color:
                            item.status === 'PENDING'
                              ? 'var(--color-warning)'
                              : item.status === 'REVIEWED'
                              ? 'var(--color-success)'
                              : 'var(--color-foreground-subtle)',
                        }}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <a
                        href={`https://meet.jit.si/GCC-Consultation-${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'var(--color-foreground-on-solid)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                        }}
                      >
                        🎥 Video Call
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: 'var(--color-foreground-subtle)', padding: '20px 0', textAlign: 'center' }}>No contact submissions recorded yet.</div>
        )}
      </div>
    </div>
  );
}
