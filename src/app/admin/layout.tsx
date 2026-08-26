import React from 'react';
import { AdminShell } from '@/components/admin-shell';

export const metadata = {
  title: 'GCC CMS Admin Portal',
  description: 'Management Portal for Gulf Connect Consultancy',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
