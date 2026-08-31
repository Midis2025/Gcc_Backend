'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/auth-utils';
import { ContactEnquiry, EnquiryStatus } from '@/models/contact.model';

interface FilterResult {
  items: ContactEnquiry[];
  total: number;
  page: number;
  totalPages: number;
}

function getInitials(name: string): string {
  if (!name) return 'GC';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function CalendarIcon({ color = '#C6A15B' }: { color?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function MetadataChip({ label }: { label: string }) {
  const [chipHover, setChipHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setChipHover(true)}
      onMouseLeave={() => setChipHover(false)}
      style={{
        background: '#101821',
        border: chipHover ? '1px solid #C6A15B' : '1px solid #263541',
        color: chipHover ? '#D4B16B' : '#B5BEC7',
        fontSize: '0.72rem',
        padding: '3px 9px',
        borderRadius: '4px',
        fontWeight: 600,
        transition: 'all 150ms ease',
        letterSpacing: '0.01em',
      }}
    >
      {label}
    </span>
  );
}

function MeetingCard({
  item,
  onStatusChange,
  onSelect,
}: {
  item: ContactEnquiry;
  onStatusChange: (id: string, status: EnquiryStatus) => void;
  onSelect: (item: ContactEnquiry) => void;
}) {
  const [hover, setHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [viewHover, setViewHover] = useState(false);

  const formattedDate = item.preferredDate ? item.preferredDate.toUpperCase() : 'DATE NOT SPECIFIED';
  const formattedTime = item.preferredTime ? item.preferredTime.toUpperCase() : 'FLEXIBLE TIME';
  const initials = getInitials(item.name);

  // Status Rail Color
  const railColor =
    item.status === 'PENDING'
      ? '#C6A15B'
      : item.status === 'REVIEWED'
      ? '#7FC69A'
      : '#C87979';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        background: hover ? '#1D2A36' : '#17222D',
        border: hover ? '1px solid #C6A15B' : '1px solid #263541',
        borderRadius: 'var(--radius-md)',
        padding: '22px 22px 20px 26px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: hover
          ? '0 14px 35px rgba(198, 161, 91, 0.10)'
          : '0 4px 12px rgba(0, 0, 0, 0.12)',
        transform: hover ? 'translateY(-4px)' : 'none',
        transition: 'all 220ms cubic-bezier(0.2, 0, 0, 1)',
        overflow: 'hidden',
      }}
    >
      {/* 3.5px Status Rail along left edge */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: railColor,
        }}
      />

      {/* Meeting Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{
            color: '#788692',
            fontSize: '0.6875rem',
            letterSpacing: '0.12em',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          CLIENT MEETING
        </div>
        <span style={{ color: railColor, fontSize: '0.65rem' }}>●</span>
      </div>

      {/* Date & Time Hierarchy Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon color="#C6A15B" />
          <span style={{ color: '#C6A15B', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em' }}>
            {formattedDate}
          </span>
        </div>
        <div style={{ paddingLeft: '23px', fontSize: '0.875rem' }}>
          <span style={{ color: '#F4F1E9', fontWeight: 600 }}>{formattedTime}</span>
          <span style={{ color: '#788692', margin: '0 6px' }}>·</span>
          <span style={{ color: '#788692', fontWeight: 500 }}>30 MIN</span>
        </div>
      </div>

      {/* Client Identity Section (Avatar Initials + Details) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginTop: '2px' }}>
        {/* Circular Avatar */}
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#101821',
            border: '1px solid #263541',
            color: '#D4B16B',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            letterSpacing: '0.02em',
          }}
        >
          {initials}
        </div>

        {/* Client Text Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: '#F4F1E9', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.name}
          </div>
          <div style={{ color: '#B5BEC7', fontSize: '0.875rem', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {item.company}
          </div>
          <div style={{ color: '#788692', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <EmailIcon />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.email}</span>
          </div>
        </div>
      </div>

      {/* Metadata Chips Section */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
        <MetadataChip label={item.area.replace(/-/g, ' ')} />
        {item.market && <MetadataChip label={item.market.toUpperCase()} />}
      </div>

      {/* Subtle Divider */}
      <hr style={{ borderColor: '#263541', margin: '4px 0 2px 0', borderTopWidth: '1px' }} />



      {/* Action Controls Row */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => onSelect(item)}
            onMouseEnter={() => setViewHover(true)}
            onMouseLeave={() => setViewHover(false)}
            style={{
              background: viewHover ? '#1D2A36' : '#17222D',
              border: viewHover ? '1px solid #C6A15B' : '1px solid #263541',
              color: viewHover ? '#F4F1E9' : '#B5BEC7',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              transition: 'all 150ms ease',
            }}
          >
            Details
          </button>

          <a
            href={`/meeting/${item.id}`}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              background: btnHover ? '#D4B16B' : '#C6A15B',
              color: '#101821',
              padding: '7px 14px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 150ms ease',
            }}
          >
            <CameraIcon />
            <span>Join Meeting</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminMeetingsPage() {
  const [data, setData] = useState<FilterResult | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [closeBtnHover, setCloseBtnHover] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchMeetings();
  }, [search, statusFilter]);

  const fetchMeetings = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (statusFilter) queryParams.append('status', statusFilter);
    queryParams.append('limit', '50');

    const res = await apiFetch<FilterResult>(`/api/admin/enquiries?${queryParams.toString()}`);
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    const res = await apiFetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.success) {
      fetchMeetings();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    }
  };

  // Compute Stats
  const totalMeetings = data?.items.length || 0;
  const pendingMeetings = data?.items.filter((i) => i.status === 'PENDING').length || 0;
  const confirmedMeetings = data?.items.filter((i) => i.status === 'REVIEWED').length || 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      {/* Header Title */}
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ color: '#F4F1E9', margin: 0 }}>Scheduled Client Consultations</h1>
        <p style={{ color: '#788692', margin: '6px 0 0 0', fontSize: 'var(--text-body)' }}>
          Overview of client meeting requests, requested dates, and live video consultation rooms
        </p>
      </div>

      {/* Summary Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#17222D', border: '1px solid #263541', padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <div className="gcc-label" style={{ color: '#788692' }}>TOTAL SCHEDULED</div>
          <div className="gcc-numeral" style={{ color: '#C6A15B', marginTop: '10px' }}>{totalMeetings}</div>
        </div>

        <div style={{ background: '#17222D', border: '1px solid #263541', padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <div className="gcc-label" style={{ color: '#788692' }}>PENDING CONFIRMATION</div>
          <div className="gcc-numeral" style={{ color: '#C6A15B', marginTop: '10px' }}>{pendingMeetings}</div>
        </div>

        <div style={{ background: '#17222D', border: '1px solid #263541', padding: '20px', borderRadius: 'var(--radius-md)' }}>
          <div className="gcc-label" style={{ color: '#788692' }}>CONFIRMED MEETINGS</div>
          <div className="gcc-numeral" style={{ color: '#7FC69A', marginTop: '10px' }}>{confirmedMeetings}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', background: '#17222D', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid #263541' }}>
        <input
          type="text"
          placeholder="Search client name, company, date, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '240px', padding: '10px 14px', background: '#101821', border: '1px solid #263541', color: '#F4F1E9', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}
        />


      </div>

      {/* Scheduled Meetings Grid with Natural Spacing */}
      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#788692' }}>Loading scheduled meetings...</div>
      ) : data && data.items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 440px))', gap: '24px', justifyContent: 'start' }}>
          {data.items.map((item) => (
            <MeetingCard key={item.id} item={item} onStatusChange={handleStatusChange} onSelect={setSelectedEnquiry} />
          ))}
        </div>
      ) : (
        <div style={{ background: '#17222D', border: '1px solid #263541', borderRadius: 'var(--radius-md)', padding: '50px 20px', textAlign: 'center', color: '#788692' }}>
          No scheduled consultation meetings found matching your criteria.
        </div>
      )}

      {/* View Detail Modal */}
      {selectedEnquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 17, 24, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#17222D', border: '1px solid #263541', width: '100%', maxWidth: '560px', borderRadius: 'var(--radius-md)', padding: '30px', boxShadow: '0 20px 40px -10px rgba(11, 17, 24, 0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #263541', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#C6A15B' }}>Consultation Meeting Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'transparent', border: 'none', color: '#788692', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-body)', color: '#B5BEC7' }}>
              <div><strong style={{ color: '#788692' }}>Client Name:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.name}</span></div>
              <div><strong style={{ color: '#788692' }}>Company:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.company}</span></div>
              <div><strong style={{ color: '#788692' }}>Work Email:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.email}</span></div>
              <div><strong style={{ color: '#788692' }}>Phone:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.phone || 'N/A'}</span></div>
              <div><strong style={{ color: '#788692' }}>Requested Date & Time:</strong> <span style={{ color: '#C6A15B', fontWeight: 700 }}>{selectedEnquiry.preferredDate ? `${selectedEnquiry.preferredDate} ${selectedEnquiry.preferredTime || ''}` : 'N/A'}</span></div>
              <div><strong style={{ color: '#788692' }}>Area of Interest:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.area}</span></div>
              <div><strong style={{ color: '#788692' }}>Target Market:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.market || 'N/A'}</span></div>
              <div>
                <strong style={{ color: '#788692' }}>Live Video Room:</strong>{' '}
                <a href={`/meeting/${selectedEnquiry.id}`} target="_blank" rel="noreferrer" style={{ color: '#C6A15B', fontWeight: 700 }}>
                  Launch Video Room ➔
                </a>
              </div>
              <hr style={{ borderColor: '#263541', margin: '10px 0' }} />
              <div>
                <strong style={{ color: '#788692' }}>Client Outline Message:</strong>
                <p style={{ background: '#101821', border: '1px solid #263541', padding: '14px', borderRadius: 'var(--radius-sm)', margin: '8px 0 0 0', lineHeight: '1.5', color: '#B5BEC7' }}>{selectedEnquiry.message}</p>
              </div>
            </div>

            <div style={{ marginTop: '25px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedEnquiry(null)}
                onMouseEnter={() => setCloseBtnHover(true)}
                onMouseLeave={() => setCloseBtnHover(false)}
                style={{
                  background: closeBtnHover ? '#D4B16B' : '#C6A15B',
                  color: '#101821',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
