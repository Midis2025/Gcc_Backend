'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser, removeToken, AuthUser } from '@/utils/auth-utils';
import { Logo } from '@/components/logo';

function navLinkStyle(active: boolean): React.CSSProperties {
  return {
    color: active ? 'var(--color-accent)' : 'var(--color-foreground-subtle)',
    backgroundColor: active ? 'var(--color-accent-soft)' : 'transparent',
    border: active ? '1px solid var(--color-accent-line)' : '1px solid transparent',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    transition: 'all 0.3s var(--ease-out-soft)',
  };
}

export function AdminNavbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return null;
  }

  const handleLogout = () => {
    removeToken();
    router.push('/admin/login');
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#0c141dd9',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 10px 30px -12px #05090e8c',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          <Link
            href="/admin/dashboard"
            aria-label="Gulf Connect Consultancy - dashboard"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--color-foreground)',
              flexShrink: 0,
            }}
          >
            <Logo height="2rem" />
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <Link href="/admin/dashboard" style={navLinkStyle(pathname === '/admin/dashboard')}>
              Dashboard
            </Link>
            <Link href="/admin/enquiries" style={navLinkStyle(pathname.startsWith('/admin/enquiries'))}>
              Contact Enquiries
            </Link>
            {user?.role === 'SUPER_ADMIN' && (
              <Link href="/admin/users" style={navLinkStyle(pathname.startsWith('/admin/users'))}>
                Admin Governance
              </Link>
            )}
          </nav>
        </div>

        {/* User Badge & Actions */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: 'var(--color-foreground)', fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                {user.name}
              </div>
              <span
                className="gcc-label"
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: user.role === 'SUPER_ADMIN' ? 'var(--color-accent-soft)' : 'var(--color-neutral-soft)',
                  color: user.role === 'SUPER_ADMIN' ? 'var(--color-accent)' : 'var(--color-foreground-subtle)',
                  border: user.role === 'SUPER_ADMIN' ? '1px solid var(--color-accent-line)' : '1px solid var(--color-border)',
                }}
              >
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                transition: 'all 0.3s var(--ease-out-soft)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-foreground)';
              }}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
