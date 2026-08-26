'use client';

import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/logo';

export default function PendingApprovalPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: 'radial-gradient(130% 115% at 78% 46%, #16202c 0%, #0c141d 38%, #080f16 72%, #05090e 100%)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'linear-gradient(152deg, #16202cf2 0%, #0c141de6 52%, #0a1017f2 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border)',
          borderTop: '2px solid var(--color-warning)',
          padding: '48px 40px',
          boxShadow: '0 40px 90px -40px #05090ee6',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Logo variant="mark" height="3.5rem" />
        </div>

        <div
          style={{
            fontSize: '2.5rem',
            marginBottom: '16px',
          }}
        >
          ⏳
        </div>

        <h1
          style={{
            color: 'var(--color-foreground)',
            margin: '0 0 12px 0',
            fontSize: 'var(--text-h2)',
            fontWeight: 700,
          }}
        >
          Pending Admin Approval
        </h1>

        <p
          style={{
            color: 'var(--color-foreground-subtle)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}
        >
          Your registration has been received successfully. Your account is currently pending authorization by a <strong style={{ color: 'var(--color-accent)' }}>Super Admin</strong>.
        </p>

        <div
          style={{
            background: 'var(--color-warning-soft)',
            border: '1px solid var(--color-border)',
            padding: '16px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-warning)',
            fontSize: 'var(--text-sm)',
            marginBottom: '32px',
          }}
        >
          Once approved, refresh this page or re-login to access the Admin CMS Dashboard.
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--color-surface-sunken)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-foreground)',
              padding: '10px 20px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
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
