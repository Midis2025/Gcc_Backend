'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin-sidebar';
import { TopUtilityBar } from '@/components/top-utility-bar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide sidebar and top bar on auth pages
  const isAuthPage =
    pathname === '/admin/login' ||
    pathname === '/admin/register' ||
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/sign-up');

  if (isAuthPage) {
    return <main>{children}</main>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#101821', color: '#B5BEC7' }}>
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="gcc-admin-main-wrapper">
        <TopUtilityBar onMobileToggle={() => setMobileOpen((prev) => !prev)} />
        <main style={{ padding: '0 0 40px 0' }}>{children}</main>
      </div>
    </div>
  );
}
