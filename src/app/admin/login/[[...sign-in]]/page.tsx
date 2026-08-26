import React from 'react';
import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

/*
// ==================== OLD CUSTOM JWT LOGIN FORM (COMMENTED OUT) ====================
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { apiFetch, setStoredUser, setToken } from '@/utils/auth-utils';
// import { Logo } from '@/components/logo';
//
// export function OldJwtLoginForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//
//   const handleLogin = async () => { ... };
// }
// ====================================================================================
*/

export default async function AdminLoginPage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/admin/dashboard');
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: '#101821',
      }}
    >
      <SignIn routing="hash" signUpUrl="/sign-up" forceRedirectUrl="/admin/dashboard" />
    </div>
  );
}
