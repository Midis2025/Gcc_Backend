'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('invitee_email');
  const startTime = searchParams.get('event_start_time');
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (email && startTime && !synced) {
      fetch('/api/enquiries/confirm-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, startTime, status: 'REVIEWED' }),
      })
        .then((res) => res.json())
        .then(() => {
          setSynced(true);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to sync scheduled meeting:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [email, startTime, synced]);

  const formattedDate = startTime ? new Date(startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;
  const formattedTime = startTime ? new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1118',
        color: '#F4F1E9',
        padding: '20px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          background: '#17222D',
          border: '1px solid #263541',
          borderRadius: '12px',
          padding: '40px 30px',
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🎉</div>
        <h1 style={{ color: '#C6A15B', margin: '0 0 10px 0', fontSize: '1.75rem', fontWeight: 700 }}>
          Consultation Meeting Confirmed!
        </h1>
        <p style={{ color: '#B5BEC7', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Thank you for scheduling your consultation with Gulf Connect Consultancy.
        </p>

        {email && (
          <div
            style={{
              background: '#101821',
              border: '1px solid #263541',
              padding: '18px',
              borderRadius: '8px',
              margin: '25px 0',
              textAlign: 'left',
              fontSize: '0.9rem',
              color: '#F4F1E9',
            }}
          >
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#788692', fontWeight: 600 }}>Client Email:</span>{' '}
              <strong style={{ color: '#C6A15B' }}>{email}</strong>
            </div>
            {formattedDate && (
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#788692', fontWeight: 600 }}>Scheduled Date:</span>{' '}
                <strong>{formattedDate}</strong>
              </div>
            )}
            {formattedTime && (
              <div>
                <span style={{ color: '#788692', fontWeight: 600 }}>Scheduled Time:</span>{' '}
                <strong>{formattedTime}</strong>
              </div>
            )}
          </div>
        )}

        <div style={{ background: 'rgba(198, 161, 91, 0.1)', border: '1px solid rgba(198, 161, 91, 0.3)', padding: '14px', borderRadius: '6px', fontSize: '0.85rem', color: '#D4B16B' }}>
          📧 A calendar invite with your <strong>Zoom Video Meeting link</strong> has been sent directly to your email by Calendly.
        </div>
      </div>
    </div>
  );
}

export default function MeetingSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#788692' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
