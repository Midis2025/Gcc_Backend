import React from 'react';
import { AdminNavbar } from '@/components/admin-navbar';

export const metadata = {
  title: 'GCC CMS Admin Portal',
  description: 'Management Portal for Gulf Connect Consultancy',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-canvas)', color: 'var(--color-foreground)' }}>
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
