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
    investor?: { total: number; pending: number; reviewed: number; archived: number };
    company?: { total: number; pending: number; reviewed: number; archived: number };
  };
  admins: {
    total: number;
    pendingApproval: number;
  };
  recentSubmissions: ContactEnquiry[];
}

/* ---- Minimal SVG Icons ---- */
function RefreshIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6" />
      <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.19" />
    </svg>
  );
}

function InvestorIcon({ color = '#C6A15B' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CompanyIcon({ color = '#7FC69A' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 9h1" />
      <path d="M9 13h1" />
      <path d="M9 17h1" />
      <path d="M14 9h1" />
      <path d="M14 13h1" />
      <path d="M14 17h1" />
    </svg>
  );
}

function VideoIcon({ color = '#C6A15B' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function ShieldIcon({ color = '#C6A15B' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ArrowRightIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function StatCard({
  label,
  count,
  color,
  accentBorder,
  subtitle,
}: {
  label: string;
  count: number;
  color: string;
  accentBorder?: string;
  subtitle?: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: hover ? '#1A2633' : '#141D26',
        border: hover ? '1px solid rgba(198, 161, 91, 0.4)' : '1px solid #24323F',
        borderTop: accentBorder ? `2px solid ${accentBorder}` : hover ? '1px solid rgba(198, 161, 91, 0.4)' : '1px solid #24323F',
        padding: '22px 24px',
        borderRadius: '6px',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hover ? '0 12px 28px -6px rgba(0, 0, 0, 0.35)' : 'none',
      }}
    >
      <div style={{ color: '#788692', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ color, fontSize: '2.1rem', fontWeight: 700, marginTop: '10px', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {count}
      </div>
      {subtitle}
    </div>
  );
}

function LightweightTableRow({ item }: { item: ContactEnquiry }) {
  const [hover, setHover] = useState(false);
  const isInvestor = item.formType === 'investor' || item.area?.includes('investor');

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: '1px solid #24323F',
        backgroundColor: hover ? '#1A2633' : 'transparent',
        transition: 'background-color 150ms ease',
      }}
    >
      <td style={{ padding: '16px 14px', verticalAlign: 'middle' }}>
        <span
          style={{
            fontSize: '0.63rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '4px',
            letterSpacing: '0.05em',
            marginRight: '10px',
            backgroundColor: isInvestor ? 'rgba(198, 161, 91, 0.12)' : 'rgba(127, 198, 154, 0.12)',
            color: isInvestor ? '#C6A15B' : '#7FC69A',
            border: isInvestor ? '1px solid rgba(198, 161, 91, 0.3)' : '1px solid rgba(127, 198, 154, 0.3)',
          }}
        >
          {isInvestor ? 'INVESTOR' : 'COMPANY'}
        </span>
        <span style={{ fontWeight: 600, color: '#F4F1E9' }}>{item.name}</span>
      </td>
      <td style={{ padding: '16px 14px', color: '#B5BEC7', verticalAlign: 'middle' }}>{item.company}</td>
      <td style={{ padding: '16px 14px', color: '#788692', fontSize: '0.8rem', verticalAlign: 'middle' }}>
        {item.preferredDate ? item.preferredDate : 'N/A'}
      </td>
      <td style={{ padding: '16px 14px', verticalAlign: 'middle' }}>
        <span
          style={{
            padding: '3px 10px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            backgroundColor:
              item.status === 'PENDING'
                ? 'rgba(198, 161, 91, 0.12)'
                : item.status === 'REVIEWED'
                ? 'rgba(127, 198, 154, 0.12)'
                : 'rgba(181, 190, 199, 0.1)',
            color:
              item.status === 'PENDING'
                ? '#C6A15B'
                : item.status === 'REVIEWED'
                ? '#7FC69A'
                : '#788692',
            border:
              item.status === 'PENDING'
                ? '1px solid rgba(198, 161, 91, 0.25)'
                : item.status === 'REVIEWED'
                ? '1px solid rgba(127, 198, 154, 0.25)'
                : '1px solid #24323F',
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
        alignItems: 'center',
        justifyContent: 'space-between',
        background: hover ? '#1A2633' : '#141D26',
        border: hover ? '1px solid rgba(198, 161, 91, 0.4)' : '1px solid #24323F',
        padding: '20px',
        borderRadius: '6px',
        textDecoration: 'none',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: hover ? '0 10px 24px -4px rgba(0, 0, 0, 0.3)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '10px', background: '#0D141C', borderRadius: '6px', border: '1px solid #24323F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <div style={{ color: '#F4F1E9', fontWeight: 600, fontSize: '0.9rem' }}>{title}</div>
          <div style={{ color: '#788692', fontSize: '0.78rem', marginTop: '3px' }}>{description}</div>
        </div>
      </div>
      <div style={{ color: hover ? '#C6A15B' : '#788692', transition: 'all 180ms ease', transform: hover ? 'translateX(3px)' : 'none' }}>
        <ArrowRightIcon />
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
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#788692', fontSize: '0.9rem' }}>
        Loading dashboard metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ background: 'rgba(200, 121, 121, 0.12)', border: '1px solid #C87979', color: '#C87979', padding: '20px', borderRadius: '6px', fontSize: '0.9rem' }}>
          {error}
        </div>
      </div>
    );
  }

  const recentItems = stats?.recentSubmissions ? stats.recentSubmissions.slice(0, 5) : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ color: '#F4F1E9', margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' }}>CMS Overview Dashboard</h1>
          <p style={{ color: '#788692', margin: '6px 0 0 0', fontSize: '0.875rem' }}>Real-time summary of Investor & Company form submissions</p>
        </div>

        <button
          onClick={fetchStats}
          onMouseEnter={() => setRefreshHover(true)}
          onMouseLeave={() => setRefreshHover(false)}
          style={{
            background: refreshHover ? '#1A2633' : '#141D26',
            border: refreshHover ? '1px solid #C6A15B' : '1px solid #24323F',
            color: refreshHover ? '#F4F1E9' : '#B5BEC7',
            padding: '9px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8125rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <RefreshIcon color={refreshHover ? '#C6A15B' : '#788692'} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Analytics Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
        <StatCard
          label="Investor Submissions"
          count={stats?.enquiries.investor?.total || 0}
          color="#C6A15B"
          accentBorder="#C6A15B"
          subtitle={
            <div style={{ color: '#788692', fontSize: '0.78rem', marginTop: '10px' }}>
              Pending: <strong style={{ color: '#C6A15B' }}>{stats?.enquiries.investor?.pending || 0}</strong> | Reviewed: <strong style={{ color: '#7FC69A' }}>{stats?.enquiries.investor?.reviewed || 0}</strong>
            </div>
          }
        />
        <StatCard
          label="Company Submissions"
          count={stats?.enquiries.company?.total || 0}
          color="#7FC69A"
          accentBorder="#7FC69A"
          subtitle={
            <div style={{ color: '#788692', fontSize: '0.78rem', marginTop: '10px' }}>
              Pending: <strong style={{ color: '#C6A15B' }}>{stats?.enquiries.company?.pending || 0}</strong> | Reviewed: <strong style={{ color: '#7FC69A' }}>{stats?.enquiries.company?.reviewed || 0}</strong>
            </div>
          }
        />
        <StatCard label="Total Submissions" count={stats?.enquiries.total || 0} color="#F4F1E9" />
        <StatCard
          label="Admin Users"
          count={stats?.admins.total || 0}
          color="#B5BEC7"
          subtitle={
            stats?.admins.pendingApproval ? (
              <div style={{ color: '#C6A15B', fontSize: '0.78rem', marginTop: '10px', fontWeight: 600 }}>
                {stats.admins.pendingApproval} pending approval
              </div>
            ) : null
          }
        />
      </div>

      {/* Recent Activity Table Section */}
      <div style={{ background: '#141D26', border: '1px solid #24323F', borderRadius: '6px', padding: '25px', marginBottom: '35px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#F4F1E9', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Recent Contact Submissions</h2>
          <Link
            href="/admin/enquiries/investor"
            onMouseEnter={() => setViewLinkHover(true)}
            onMouseLeave={() => setViewLinkHover(false)}
            style={{
              color: viewLinkHover ? '#D4B16B' : '#C6A15B',
              textDecoration: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 180ms ease',
            }}
          >
            <span>View Investor Submissions</span>
            <ArrowRightIcon color={viewLinkHover ? '#D4B16B' : '#C6A15B'} />
          </Link>
        </div>

        {recentItems.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#0D141C', borderBottom: '1px solid #24323F' }}>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>FORM / CLIENT</th>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>COMPANY</th>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>REQUESTED DATE</th>
                  <th style={{ padding: '14px 12px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>STATUS</th>
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
          <div style={{ color: '#788692', padding: '24px 0', textAlign: 'center', fontSize: '0.875rem' }}>No contact submissions recorded yet.</div>
        )}
      </div>

      {/* Quick Navigation Actions Section */}
      <div>
        <h2 style={{ color: '#F4F1E9', margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <QuickActionCard
            href="/admin/enquiries/investor"
            title="Investor Enquiries"
            description="Manage investor relations & roadshow requests"
            icon={<InvestorIcon />}
          />
          <QuickActionCard
            href="/admin/enquiries/company"
            title="Company Enquiries"
            description="Manage company scaling & advisory requests"
            icon={<CompanyIcon />}
          />
          <QuickActionCard
            href="/admin/meetings"
            title="Meetings"
            description="Launch video consultation meetings"
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
