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
  const [btnHover, setBtnHover] = useState(false);

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
        background: '#101821',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#17222D',
          border: '1px solid #263541',
          borderTop: '2px solid #C6A15B',
          borderRadius: 'var(--radius-md)',
          padding: '48px 40px',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', color: '#F4F1E9' }}>
            <Logo variant="mark" height="3.375rem" />
          </div>
          <h1 style={{ color: '#F4F1E9', margin: 0, fontSize: 'var(--text-h2)', fontWeight: 700 }}>
            Admin Registration
          </h1>
          <p style={{ color: '#788692', fontSize: 'var(--text-sm)', marginTop: '8px' }}>
            1st registrant is automatically assigned Super Admin
          </p>
        </div>

        {error && (
          <div
            style={{
              background: 'rgba(200, 121, 121, 0.15)',
              borderLeft: '3px solid #C87979',
              color: '#C87979',
              padding: '14px 16px',
              fontSize: 'var(--text-sm)',
              marginBottom: '24px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {error}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: isSuperAdmin ? 'rgba(127, 198, 154, 0.15)' : 'rgba(198, 161, 91, 0.15)',
              borderLeft: `3px solid ${isSuperAdmin ? '#7FC69A' : '#C6A15B'}`,
              color: isSuperAdmin ? '#7FC69A' : '#C6A15B',
              padding: '16px',
              fontSize: 'var(--text-sm)',
              marginBottom: '24px',
              lineHeight: '1.5',
              borderRadius: 'var(--radius-sm)',
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
            <label className="gcc-label" style={{ display: 'block', marginBottom: '8px', color: '#788692' }}>
              Full Name <span style={{ color: '#C6A15B' }}>*</span>
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
                background: '#101821',
                border: '1px solid #263541',
                color: '#F4F1E9',
                fontSize: 'var(--text-body)',
                borderRadius: 'var(--radius-sm)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="gcc-label" style={{ display: 'block', marginBottom: '8px', color: '#788692' }}>
              Work Email <span style={{ color: '#C6A15B' }}>*</span>
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
                background: '#101821',
                border: '1px solid #263541',
                color: '#F4F1E9',
                fontSize: 'var(--text-body)',
                borderRadius: 'var(--radius-sm)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label className="gcc-label" style={{ display: 'block', marginBottom: '8px', color: '#788692' }}>
              Password <span style={{ color: '#C6A15B' }}>*</span>
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
                background: '#101821',
                border: '1px solid #263541',
                color: '#F4F1E9',
                fontSize: 'var(--text-body)',
                borderRadius: 'var(--radius-sm)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => handleRegister()}
            disabled={loading}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              background: loading ? '#788692' : btnHover ? '#D4B16B' : '#C6A15B',
              color: '#101821',
              border: 'none',
              padding: '16px',
              fontWeight: 700,
              fontSize: 'var(--text-sm)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderRadius: 'var(--radius-sm)',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              transition: 'background-color 0.2s ease',
            }}
          >
            {loading ? 'Submitting...' : 'Register Admin Account ➔'}
          </button>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center', fontSize: 'var(--text-sm)', color: '#788692' }}>
          Already registered?{' '}
          <Link href="/admin/login" style={{ color: '#C6A15B', textDecoration: 'none', fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
