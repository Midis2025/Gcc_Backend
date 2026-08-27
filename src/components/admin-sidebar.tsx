'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { useUser, useClerk } from '@clerk/nextjs';

/* ---- Minimal SVG Icons ---- */
function DashboardIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function InvestorIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CompanyIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function InboxIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function VideoIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function ShieldIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function UserIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogOutIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

interface NavItemProps {
  href: string;
  active: boolean;
  label: string;
  icon: (color: string) => React.ReactNode;
  onClick?: () => void;
}

function SidebarNavItem({ href, active, label, icon, onClick }: NavItemProps) {
  const [hover, setHover] = useState(false);

  const iconColor = active ? '#C6A15B' : hover ? '#D4B16B' : '#788692';
  const textColor = active ? '#D4B16B' : hover ? '#F4F1E9' : '#B5BEC7';
  const bgColor = active ? '#17222D' : hover ? '#17222D' : 'transparent';
  const borderLeft = active ? '3px solid #C6A15B' : '3px solid transparent';

  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 18px 12px 22px',
        backgroundColor: bgColor,
        color: textColor,
        borderLeft,
        textDecoration: 'none',
        fontSize: 'var(--text-sm)',
        fontWeight: active ? 700 : 500,
        transition: 'all 180ms cubic-bezier(0.22, 0.61, 0.36, 1)',
        cursor: 'pointer',
      }}
    >
      {icon(iconColor)}
      <span>{label}</span>
    </Link>
  );
}

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const role = (user?.publicMetadata as Record<string, unknown>)?.role as string | undefined;

  const [logoutHover, setLogoutHover] = useState(false);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 17, 24, 0.8)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '260px',
          height: '100vh',
          backgroundColor: '#0B1118',
          borderRight: '1px solid #263541',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 100,
          transition: 'transform 250ms ease-in-out',
        }}
        className={`gcc-admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
      >
        <div>
          {/* Brand Logo Header */}
          <div
            style={{
              padding: '26px 24px',
              borderBottom: '1px solid #263541',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link href="/admin/dashboard" aria-label="GCC CMS Dashboard" style={{ textDecoration: 'none' }}>
              <Logo height="2rem" />
            </Link>
            {mobileOpen && (
              <button
                onClick={onMobileClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#788692',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Primary Navigation Items */}
          <nav style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SidebarNavItem
              href="/admin/dashboard"
              active={pathname === '/admin/dashboard'}
              label="Dashboard"
              icon={(color) => <DashboardIcon color={color} />}
              onClick={onMobileClose}
            />

            <SidebarNavItem
              href="/admin/enquiries/investor"
              active={pathname === '/admin/enquiries/investor'}
              label="Investor Enquiries"
              icon={(color) => <InvestorIcon color={color} />}
              onClick={onMobileClose}
            />

            <SidebarNavItem
              href="/admin/enquiries/company"
              active={pathname === '/admin/enquiries/company'}
              label="Company Enquiries"
              icon={(color) => <CompanyIcon color={color} />}
              onClick={onMobileClose}
            />

            <SidebarNavItem
              href="/admin/meetings"
              active={pathname.startsWith('/admin/meetings')}
              label="Meetings"
              icon={(color) => <VideoIcon color={color} />}
              onClick={onMobileClose}
            />

            {role === 'SUPER_ADMIN' && (
              <SidebarNavItem
                href="/admin/users"
                active={pathname.startsWith('/admin/users')}
                label="Admin Governance"
                icon={(color) => <ShieldIcon color={color} />}
                onClick={onMobileClose}
              />
            )}
          </nav>
        </div>

        {/* Sidebar Footer — Admin Account Area */}
        <div style={{ backgroundColor: '#101821', borderTop: '1px solid #263541', padding: '20px 20px 26px 20px' }}>
          <div style={{ marginBottom: '14px', paddingLeft: '4px' }}>
            <div style={{ color: '#788692', fontSize: '12px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
              ADMIN ACCOUNT
            </div>
            {user && (
              <div>
                <div style={{ color: '#F4F1E9', fontSize: '0.85rem', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.3 }}>
                  {user.fullName || user.primaryEmailAddress?.emailAddress}
                </div>
                {role && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '6px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#17222D',
                      color: '#C6A15B',
                      border: '1px solid #6F5A36',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {role}
                  </span>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <SidebarNavItem
              href="/admin/users"
              active={false}
              label="Profile"
              icon={(color) => <UserIcon color={color} />}
              onClick={onMobileClose}
            />

            <button
              onClick={() => signOut({ redirectUrl: '/admin/login' })}
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                width: '100%',
                padding: '12px 18px 12px 22px',
                backgroundColor: logoutHover ? '#17222D' : 'transparent',
                color: logoutHover ? '#F4F1E9' : '#B5BEC7',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 180ms ease',
              }}
            >
              <LogOutIcon color={logoutHover ? '#D4B16B' : '#788692'} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
