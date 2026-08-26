'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/logo';

export default function PendingApprovalPage() {
  const [btnHover, setBtnHover] = React.useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: '#101821',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#17222D',
          border: '1px solid #263541',
          borderTop: '2px solid #C6A15B',
          borderRadius: 'var(--radius-md)',
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Logo variant="mark" height="3.5rem" />
        </div>

        <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⏳</div>

        <h1
          style={{
            color: '#F4F1E9',
            margin: '0 0 12px 0',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
          }}
        >
          Pending Admin Approval
        </h1>

        <p
          style={{
            color: '#B5BEC7',
            fontSize: 'var(--text-body)',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          Your registration has been received successfully. Your account is currently pending authorization by a <strong style={{ color: '#C6A15B' }}>Super Admin</strong>.
        </p>

        <div
          style={{
            background: 'rgba(198, 161, 91, 0.15)',
            border: '1px solid rgba(198, 161, 91, 0.3)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            color: '#C6A15B',
            fontSize: 'var(--text-sm)',
            marginBottom: '32px',
          }}
        >
          Once approved, refresh this page or re-login to access the Admin CMS Dashboard.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => window.location.reload()}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              background: btnHover ? '#1D2A36' : '#17222D',
              border: '1px solid #263541',
              color: '#B5BEC7',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              transition: 'background-color 0.2s ease',
            }}
          >
            🔄 Check Approval Status
          </button>
          <UserButton />
        </div>
      </div>
    </div>
  );
}
