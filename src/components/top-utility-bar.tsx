'use client';

import React from 'react';
import { Show, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

interface TopUtilityBarProps {
  onMobileToggle: () => void;
}

export function TopUtilityBar({ onMobileToggle }: TopUtilityBarProps) {
  const { user } = useUser();
  const role = (user?.publicMetadata as Record<string, unknown>)?.role as string | undefined;

  return (
    <header
      style={{
        height: '60px',
        backgroundColor: '#0B1118',
        borderBottom: '1px solid #263541',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      {/* Left side: Mobile Menu Trigger (hidden on desktop via CSS) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onMobileToggle}
          aria-label="Open Navigation Drawer"
          className="gcc-mobile-menu-btn"
          style={{
            background: 'transparent',
            border: '1px solid #263541',
            color: '#B5BEC7',
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            display: 'none', // Shown via media query in theme.css
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MenuIcon />
        </button>
      </div>

      {/* Right side: Top Utility Area (Account info, Role Badge, Avatar) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button
              style={{
                background: '#C6A15B',
                color: '#101821',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
              }}
            >
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              style={{
                background: '#17222D',
                border: '1px solid #263541',
                color: '#B5BEC7',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
              }}
            >
              Sign Up
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          {user && (
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ color: '#F4F1E9', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '-0.01em' }}>
                  {user.fullName || user.primaryEmailAddress?.emailAddress}
                </div>
                {role && (
                  <span
                    className="gcc-label"
                    style={{
                      display: 'inline-block',
                      fontSize: '0.625rem',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: role === 'SUPER_ADMIN' ? 'rgba(198, 161, 91, 0.15)' : 'rgba(181, 190, 199, 0.1)',
                      color: role === 'SUPER_ADMIN' ? '#C6A15B' : '#788692',
                      border: role === 'SUPER_ADMIN' ? '1px solid rgba(198, 161, 91, 0.35)' : '1px solid #263541',
                    }}
                  >
                    {role}
                  </span>
                )}
              </div>
            </div>
          )}
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
