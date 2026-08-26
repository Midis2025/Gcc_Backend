'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/utils/auth-utils';
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

/* Minimal Icons */
function InboxIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function StatCard({ label, count, color, subtitle }: { label: string; count: number; color: string; subtitle?: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#1D2A36' : '#17222D',
        border: hover ? '1px solid #C6A15B' : '1px solid #263541',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all 200ms ease',
        boxShadow: hover ? '0 10px 25px rgba(0, 0, 0, 0.15)' : 'none',
      }}
    >
      <div className="gcc-label" style={{ color: '#788692' }}>{label}</div>
      <div className="gcc-numeral" style={{ color, marginTop: '12px' }}>{count}</div>
      {subtitle}
    </div>
  );
}

function LightweightTableRow({ item }: { item: ContactEnquiry }) {
  const [hover, setHover] = useState(false);

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
      <td style={{ padding: '16px 14px', fontWeight: 600, color: '#F4F1E9' }}>{item.name}</td>
      <td style={{ padding: '16px 14px', color: '#B5BEC7' }}>{item.company}</td>
      <td style={{ padding: '16px 14px', color: '#788692', fontSize: 'var(--text-xs)' }}>
        {item.preferredDate ? item.preferredDate : 'N/A'}
      </td>
      <td style={{ padding: '16px 14px' }}>
        <span
          style={{
            padding: '3px 10px',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            backgroundColor:
              item.status === 'PENDING'
                ? 'rgba(198, 161, 91, 0.15)'
                : item.status === 'REVIEWED'
                ? 'rgba(127, 198, 154, 0.15)'
                : 'rgba(181, 190, 199, 0.1)',
            color:
              item.status === 'PENDING'
                ? '#C6A15B'
                : item.status === 'REVIEWED'
                ? '#7FC69A'
                : '#788692',
            border:
              item.status === 'PENDING'
                ? '1px solid rgba(198, 161, 91, 0.3)'
                : item.status === 'REVIEWED'
                ? '1px solid rgba(127, 198, 154, 0.3)'
                : '1px solid #263541',
          }}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );
}

function QuickActionCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        background: hover ? '#1D2A36' : '#17222D',
        border: hover ? '1px solid #C6A15B' : '1px solid #263541',
        padding: '20px',
        borderRadius: 'var(--radius-md)',
        textDecoration: 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all 200ms ease',
      }}
    >
      <div style={{ padding: '8px', background: '#101821', borderRadius: 'var(--radius-sm)', border: '1px solid #263541' }}>
        {icon}
      </div>
      <div>
        <div style={{ color: '#F4F1E9', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{title}</div>
        <div style={{ color: '#788692', fontSize: 'var(--text-xs)', marginTop: '4px' }}>{description}</div>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshHover, setRefreshHover] = useState(false);
  const [viewLinkHover, setViewLinkHover] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    const res = await apiFetch<StatsData>('/api/admin/stats');
    if (res.success && res.data) {
      setStats(res.data);
    } else {
      setError(res.message || 'Failed to load dashboard metrics');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#788692' }}>
        Loading dashboard metrics...
      </div>
    );
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

  const recentItems = stats?.recentSubmissions ? stats.recentSubmissions.slice(0, 5) : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#F4F1E9', margin: 0 }}>CMS Overview Dashboard</h1>
          <p style={{ color: '#788692', margin: '6px 0 0 0', fontSize: 'var(--text-body)' }}>Real-time summary of contact submissions & meeting requests</p>
        </div>
        <button
          onClick={fetchStats}
          onMouseEnter={() => setRefreshHover(true)}
          onMouseLeave={() => setRefreshHover(false)}
          style={{
            background: refreshHover ? '#1D2A36' : '#17222D',
            border: refreshHover ? '1px solid #C6A15B' : '1px solid #263541',
            color: refreshHover ? '#F4F1E9' : '#B5BEC7',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            transition: 'all 0.2s ease',
          }}
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '35px' }}>
        <StatCard label="Total Submissions" count={stats?.enquiries.total || 0} color="#C6A15B" />
        <StatCard label="Pending Meetings" count={stats?.enquiries.pending || 0} color="#C6A15B" />
        <StatCard label="Reviewed" count={stats?.enquiries.reviewed || 0} color="#7FC69A" />
        <StatCard
          label="Admin Users"
          count={stats?.admins.total || 0}
          color="#F4F1E9"
          subtitle={
            stats?.admins.pendingApproval ? (
              <div style={{ color: '#C6A15B', fontSize: 'var(--text-xs)', marginTop: '6px', fontWeight: 600 }}>
                ⚠️ {stats.admins.pendingApproval} pending approval
              </div>
            ) : null
          }
        />
      </div>

      {/* Lightweight Recent Activity Table Section */}
      <div style={{ background: '#17222D', border: '1px solid #263541', borderRadius: 'var(--radius-md)', padding: '25px', marginBottom: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#F4F1E9', margin: 0, fontSize: '1.2rem' }}>Recent Contact Submissions</h2>
          <Link
            href="/admin/enquiries"
            onMouseEnter={() => setViewLinkHover(true)}
            onMouseLeave={() => setViewLinkHover(false)}
            style={{
              color: viewLinkHover ? '#D4B16B' : '#C6A15B',
              textDecoration: 'none',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              transition: 'color 0.2s ease',
            }}
          >
            View All Submissions →
          </Link>
        </div>

        {recentItems.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: '#101821', borderBottom: '1px solid #263541' }}>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em' }}>CLIENT</th>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em' }}>COMPANY</th>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em' }}>DATE</th>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.1em' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item) => (
                  <LightweightTableRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: '#788692', padding: '20px 0', textAlign: 'center' }}>No contact submissions recorded yet.</div>
        )}
      </div>

      {/* Quick Navigation Actions Section */}
      <div>
        <h2 style={{ color: '#F4F1E9', margin: '0 0 16px 0', fontSize: '1.1rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <QuickActionCard
            href="/admin/enquiries"
            title="Contact Enquiries"
            description="View and manage all client enquiries"
            icon={<InboxIcon />}
          />
          <QuickActionCard
            href="/admin/meetings"
            title="Meetings"
            description="View and launch client consultation meetings"
            icon={<VideoIcon />}
          />
          <QuickActionCard
            href="/admin/users"
            title="Admin Governance"
            description="Manage administrator accounts and roles"
            icon={<ShieldIcon />}
          />
        </div>
      </div>
    </div>
  );
}

