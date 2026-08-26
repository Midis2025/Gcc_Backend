'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

/*
// ==================== OLD JWT NAVBAR STATE (COMMENTED OUT) ====================
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { getStoredUser, removeToken, AuthUser } from '@/utils/auth-utils';
//
// const [user, setUser] = useState<AuthUser | null>(null);
// useEffect(() => {
//   setUser(getStoredUser());
// }, [pathname]);
//
// const handleLogout = () => {
//   removeToken();
//   router.push('/admin/login');
// };
// ==============================================================================
*/

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
  const pathname = usePathname();
  const { user } = useUser();
  const role = (user?.publicMetadata as Record<string, unknown>)?.role as string | undefined;

  if (pathname === '/admin/login' || pathname === '/admin/register' || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up')) {
    return null;
  }

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
            {role === 'SUPER_ADMIN' && (
              <Link href="/admin/users" style={navLinkStyle(pathname.startsWith('/admin/users'))}>
                Admin Governance
              </Link>
            )}
          </nav>
        </div>

        {/* User Controls with Clerk */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                style={{
                  background: 'var(--color-accent)',
                  color: 'var(--color-foreground-on-solid)',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                }}
              >
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-foreground)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)',
                }}
              >
                Sign Up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            {user && (
              <div style={{ textAlign: 'right', marginRight: '8px' }}>
                <div style={{ color: 'var(--color-foreground)', fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                  {user.fullName || user.primaryEmailAddress?.emailAddress}
                </div>
                {role && (
                  <span
                    className="gcc-label"
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: role === 'SUPER_ADMIN' ? 'var(--color-accent-soft)' : 'var(--color-neutral-soft)',
                      color: role === 'SUPER_ADMIN' ? 'var(--color-accent)' : 'var(--color-foreground-subtle)',
                      border: role === 'SUPER_ADMIN' ? '1px solid var(--color-accent-line)' : '1px solid var(--color-border)',
                    }}
                  >
                    {role}
                  </span>
                )}
              </div>
            )}
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
