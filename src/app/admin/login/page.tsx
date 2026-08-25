'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch, setStoredUser, setToken } from '@/utils/auth-utils';
import { Logo } from '@/components/logo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Strip away any query string parameters (?email=...) if present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleLogin = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError('');

    // Fallback: Read directly from DOM input elements if state is empty due to browser autofill
    let inputEmail = email.trim();
    let inputPassword = password.trim();

    if (typeof document !== 'undefined') {
      const emailEl = document.querySelector<HTMLInputElement>('input[name="email"]');
      const passEl = document.querySelector<HTMLInputElement>('input[name="password"]');
      if (emailEl?.value) inputEmail = emailEl.value.trim();
      if (passEl?.value) inputPassword = passEl.value.trim();
    }

    if (!inputEmail || !inputPassword) {
      setError('Please fill in both Email Address and Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch<{ admin: { id: string; name: string; email: string; role: 'SUPER_ADMIN' | 'ADMIN' }; token: string }>(
        '/api/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email: inputEmail, password: inputPassword }),
        }
      );

      if (res.success && res.data) {
        setToken(res.data.token);
        setStoredUser(res.data.admin);
        router.push('/admin/dashboard');
      } else {
        setError(res.message || 'Authentication failed. Invalid email or password.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin(e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: 'radial-gradient(130% 115% at 78% 46%, #16202c 0%, #0c141d 38%, #080f16 72%, #05090e 100%)',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(152deg, #16202cf2 0%, #0c141de6 52%, #0a1017f2 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border)',
          borderTop: '2px solid var(--color-accent)',
          padding: '48px 40px',
          boxShadow: '0 40px 90px -40px #05090ee6',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--color-foreground)' }}>
            <Logo variant="mark" height="3.375rem" />
          </div>
          <h1 style={{ color: 'var(--color-foreground)', margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, letterSpacing: 'var(--text-h2-ls)' }}>
            GCC Admin Portal
          </h1>
          <p style={{ color: 'var(--color-foreground-subtle)', fontSize: 'var(--text-sm)', marginTop: '8px' }}>
            Sign in to access management dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'var(--color-danger-soft)',
              borderLeft: '3px solid var(--color-danger-line)',
              color: 'var(--color-danger)',
              padding: '14px 16px',
              fontSize: 'var(--text-sm)',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        <div onKeyDown={handleKeyDown} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div>
            <label className="gcc-label" style={{ display: 'block', marginBottom: '8px' }}>
              Email Address <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gcc.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'var(--color-surface-sunken)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
                fontSize: 'var(--text-body)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="gcc-label" style={{ display: 'block', marginBottom: '8px' }}>
              Password <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'var(--color-surface-sunken)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-foreground)',
                fontSize: 'var(--text-body)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => handleLogin()}
            disabled={loading}
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-foreground-on-solid)',
              border: 'none',
              padding: '16px',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px #b8945f40',
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In ➔'}
          </button>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-foreground-subtle)' }}>
          Don&apos;t have an admin account?{' '}
          <Link href="/admin/register" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
