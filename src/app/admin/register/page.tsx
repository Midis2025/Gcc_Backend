'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/utils/auth-utils';
import { Logo } from '@/components/logo';

export default function AdminRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleRegister = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setError('');
    setSuccessMessage('');

    let inputName = name.trim();
    let inputEmail = email.trim();
    let inputPassword = password.trim();

    if (typeof document !== 'undefined') {
      const nameEl = document.querySelector<HTMLInputElement>('input[name="name"]');
      const emailEl = document.querySelector<HTMLInputElement>('input[name="email"]');
      const passEl = document.querySelector<HTMLInputElement>('input[name="password"]');
      if (nameEl?.value) inputName = nameEl.value.trim();
      if (emailEl?.value) inputEmail = emailEl.value.trim();
      if (passEl?.value) inputPassword = passEl.value.trim();
    }

    if (!inputName || !inputEmail || !inputPassword) {
      setError('Please fill in all fields (Name, Email, and Password).');
      return;
    }

    if (inputPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch<{ isSuperAdmin: boolean }>(
        '/api/auth/register',
        {
          method: 'POST',
          body: JSON.stringify({ name: inputName, email: inputEmail, password: inputPassword }),
        }
      );

      if (res.success && res.data) {
        setIsSuperAdmin(res.data.isSuperAdmin);
        setSuccessMessage(
          res.message ||
            (res.data.isSuperAdmin
              ? 'Congratulations! You are the first registered user and have been granted Super Admin status.'
              : 'Registration successful! Your account is pending approval by a Super Admin.')
        );
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister(e);
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
          maxWidth: '460px',
          background: 'linear-gradient(152deg, #16202cf2 0%, #0c141de6 52%, #0a1017f2 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border)',
          borderTop: '2px solid var(--color-accent)',
          padding: '48px 40px',
          boxShadow: '0 40px 90px -40px #05090ee6',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: 'var(--color-foreground)' }}>
            <Logo variant="mark" height="3.375rem" />
          </div>
          <h1 style={{ color: 'var(--color-foreground)', margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700, letterSpacing: 'var(--text-h2-ls)' }}>
            Admin Registration
          </h1>
          <p style={{ color: 'var(--color-foreground-subtle)', fontSize: 'var(--text-sm)', marginTop: '8px' }}>
            1st registrant is automatically assigned Super Admin
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

        {successMessage && (
          <div
            style={{
              background: isSuperAdmin ? 'var(--color-success-soft)' : 'var(--color-warning-soft)',
              borderLeft: `3px solid ${isSuperAdmin ? 'var(--color-success)' : 'var(--color-warning)'}`,
              color: isSuperAdmin ? 'var(--color-success)' : 'var(--color-warning)',
              padding: '16px',
              fontSize: 'var(--text-sm)',
              marginBottom: '24px',
              lineHeight: '1.5',
            }}
          >
            <strong style={{ display: 'block', fontSize: 'var(--text-body)', marginBottom: '4px' }}>
              {isSuperAdmin ? '🌟 Super Admin Created!' : '⏳ Account Pending Approval'}
            </strong>
            {successMessage}
          </div>
        )}

        <div onKeyDown={handleKeyDown} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="gcc-label" style={{ display: 'block', marginBottom: '8px' }}>
              Full Name <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
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
              Work Email <span style={{ color: 'var(--color-accent)' }}>*</span>
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
              placeholder="Minimum 6 characters"
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
            onClick={() => handleRegister()}
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
            {loading ? 'Submitting...' : 'Register Admin Account ➔'}
          </button>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-foreground-subtle)' }}>
          Already registered?{' '}
          <Link href="/admin/login" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
