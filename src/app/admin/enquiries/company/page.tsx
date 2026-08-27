'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/auth-utils';
import { CompanyEnquiry, EnquiryStatus } from '@/models/company.model';

interface FilterResult {
  items: CompanyEnquiry[];
  total: number;
  page: number;
  totalPages: number;
}

function formatAreaLabel(area: string): string {
  if (!area) return 'General';
  return area
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function CalendarIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '4px' }}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CompanyBadgeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7FC69A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function VideoCallIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function escapeCsvField(value: any): string {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

function EnquiryRow({
  item,
  onStatusChange,
  onSelect,
  onDelete,
}: {
  item: CompanyEnquiry;
  onStatusChange: (id: string, status: EnquiryStatus) => void;
  onSelect: (item: CompanyEnquiry) => void;
  onDelete: (id: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const [viewHover, setViewHover] = useState(false);
  const [deleteHover, setDeleteHover] = useState(false);

  const formattedDate = item.preferredDate ? item.preferredDate.toUpperCase() : 'N/A';
  const formattedTime = item.preferredTime ? item.preferredTime.toUpperCase() : 'FLEXIBLE TIME';
  const formattedArea = formatAreaLabel(item.area);

  return (
    <tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderBottom: '1px solid #24323F',
        backgroundColor: hover ? '#1A2633' : 'transparent',
        transition: 'background-color 150ms ease',
      }}
    >
      <td style={{ padding: '18px', fontWeight: 600, color: '#F4F1E9', fontSize: '0.92rem', verticalAlign: 'middle' }}>
        {item.name}
      </td>

      <td style={{ padding: '18px', verticalAlign: 'middle' }}>
        <div style={{ color: '#F4F1E9', fontWeight: 600, fontSize: '0.875rem' }}>{item.company}</div>
        <div style={{ color: '#788692', fontSize: '0.78rem', marginTop: '3px' }}>{item.email}</div>
      </td>

      <td style={{ padding: '18px', color: '#B5BEC7', fontSize: '0.85rem', verticalAlign: 'middle' }}>
        {formattedArea}
      </td>

      <td style={{ padding: '18px', verticalAlign: 'middle' }}>
        <div style={{ color: '#C6A15B', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CalendarIcon />
          <span>{formattedDate}</span>
        </div>
        <div style={{ color: '#F4F1E9', fontWeight: 500, fontSize: '0.78rem', marginTop: '2px', paddingLeft: '17px' }}>
          {formattedTime}
        </div>
      </td>

      <td style={{ padding: '18px', verticalAlign: 'middle' }}>
        <select
          value={item.status}
          onChange={(e) => onStatusChange(item.id, e.target.value as EnquiryStatus)}
          style={{
            background: '#0D141C',
            border: '1px solid #24323F',
            color:
              item.status === 'PENDING'
                ? '#C6A15B'
                : item.status === 'REVIEWED'
                ? '#7FC69A'
                : '#C87979',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="PENDING">PENDING</option>
          <option value="REVIEWED">REVIEWED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </td>

      <td style={{ padding: '18px', verticalAlign: 'middle', whiteSpace: 'nowrap', textAlign: 'right' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => onSelect(item)}
            onMouseEnter={() => setViewHover(true)}
            onMouseLeave={() => setViewHover(false)}
            style={{
              background: viewHover ? '#1A2633' : '#141D26',
              border: viewHover ? '1px solid #C6A15B' : '1px solid #24323F',
              color: viewHover ? '#F4F1E9' : '#B5BEC7',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 150ms ease',
            }}
          >
            <EyeIcon />
            <span>View</span>
          </button>

          <button
            onClick={() => onDelete(item.id)}
            onMouseEnter={() => setDeleteHover(true)}
            onMouseLeave={() => setDeleteHover(false)}
            style={{
              background: deleteHover ? 'rgba(200, 121, 121, 0.2)' : 'rgba(200, 121, 121, 0.08)',
              border: '1px solid rgba(200, 121, 121, 0.4)',
              color: '#C87979',
              padding: '6px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'all 150ms ease',
            }}
            title="Delete Enquiry"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminCompanyEnquiriesPage() {
  const [data, setData] = useState<FilterResult | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<CompanyEnquiry | null>(null);
  const [closeBtnHover, setCloseBtnHover] = useState(false);
  const [prevBtnHover, setPrevBtnHover] = useState(false);
  const [nextBtnHover, setNextBtnHover] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'empty' | 'error'>('idle');
  const [exportHover, setExportHover] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, [search, statusFilter, page]);

  const fetchEnquiries = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (statusFilter) queryParams.append('status', statusFilter);
    queryParams.append('page', page.toString());
    queryParams.append('limit', '10');

    const res = await apiFetch<FilterResult>(`/api/admin/enquiries/company?${queryParams.toString()}`);
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  const handleExportCsv = async () => {
    setExporting(true);
    setExportStatus('idle');
    setExportMessage('');

    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (statusFilter) queryParams.append('status', statusFilter);
      queryParams.append('limit', '1000');

      const res = await apiFetch<FilterResult>(`/api/admin/enquiries/company?${queryParams.toString()}`);

      if (res.success && res.data && res.data.items && res.data.items.length > 0) {
        const items = res.data.items;

        const headers = [
          'Client / Representative Name',
          'Email',
          'Phone',
          'Company Name',
          'Area',
          'Market',
          'Message Outline',
          'Requested Date',
          'Requested Time',
          'Status',
          'Meeting Link',
          'Created At',
        ];

        const csvRows = [headers.map(escapeCsvField).join(',')];

        items.forEach((item) => {
          const createdAtFormatted = item.createdAt
            ? new Date(item.createdAt).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'N/A';

          const meetingLink = `https://meet.jit.si/GCC-Consultation-${item.id}`;

          const row = [
            item.name || '',
            item.email || '',
            item.phone || '',
            item.company || '',
            formatAreaLabel(item.area),
            item.market ? item.market.toUpperCase() : '',
            item.message || '',
            item.preferredDate || '',
            item.preferredTime || '',
            item.status || '',
            meetingLink,
            createdAtFormatted,
          ];

          csvRows.push(row.map(escapeCsvField).join(','));
        });

        const csvString = '\uFEFF' + csvRows.join('\r\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const today = new Date().toISOString().split('T')[0];
        const filename = `gcc-company-enquiries-${today}.csv`;

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setExportStatus('success');
        setTimeout(() => {
          setExportStatus('idle');
        }, 3000);
      } else {
        setExportStatus('empty');
        setExportMessage(search || statusFilter ? 'No company enquiries match current filters.' : 'No company enquiries available.');
        setTimeout(() => {
          setExportStatus('idle');
          setExportMessage('');
        }, 4000);
      }
    } catch (err) {
      setExportStatus('error');
      setExportMessage('Unable to export company enquiries. Please try again.');
      setTimeout(() => {
        setExportStatus('idle');
        setExportMessage('');
      }, 4000);
    } finally {
      setExporting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    const res = await apiFetch(`/api/admin/enquiries/company/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.success) {
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this company enquiry record?')) return;

    const res = await apiFetch(`/api/admin/enquiries/company/${id}`, {
      method: 'DELETE',
    });

    if (res.success) {
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      fetchEnquiries();
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: 'rgba(127, 198, 154, 0.12)', border: '1px solid rgba(127, 198, 154, 0.3)', borderRadius: '4px', color: '#7FC69A', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
            <CompanyBadgeIcon />
            <span>COMPANY ENQUIRIES</span>
          </div>
          <h1 style={{ color: '#F4F1E9', margin: 0, fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Sell / Scale Company Form Submissions</h1>
          <p style={{ color: '#788692', margin: '6px 0 0 0', fontSize: '0.875rem' }}>Manage corporate communications, advisory, and scaling enquiries</p>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', marginBottom: '25px', background: '#141D26', padding: '16px', borderRadius: '6px', border: '1px solid #24323F' }}>
        <input
          type="text"
          placeholder="Search company name, representative, or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ flex: 1, minWidth: '240px', padding: '10px 14px', background: '#0D141C', border: '1px solid #24323F', color: '#F4F1E9', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{ padding: '10px 14px', background: '#0D141C', border: '1px solid #24323F', color: '#F4F1E9', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <button
          onClick={handleExportCsv}
          disabled={exporting}
          onMouseEnter={() => setExportHover(true)}
          onMouseLeave={() => setExportHover(false)}
          style={{
            background: exportStatus === 'success' ? '#7FC69A' : exportHover ? '#D4B16B' : '#C6A15B',
            color: '#0D141C',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.8125rem',
            cursor: exporting ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            opacity: exporting ? 0.7 : 1,
            transition: 'all 180ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          <DownloadIcon />
          <span>
            {exporting
              ? 'Preparing CSV...'
              : exportStatus === 'success'
              ? 'Exported'
              : 'Export Company CSV'}
          </span>
        </button>
      </div>

      {exportMessage && (
        <div
          style={{
            marginBottom: '20px',
            padding: '12px 16px',
            borderRadius: '4px',
            backgroundColor: exportStatus === 'error' ? 'rgba(200, 121, 121, 0.12)' : 'rgba(120, 134, 146, 0.12)',
            border: exportStatus === 'error' ? '1px solid #C87979' : '1px solid #24323F',
            color: exportStatus === 'error' ? '#C87979' : '#788692',
            fontSize: '0.85rem',
          }}
        >
          {exportMessage}
        </div>
      )}

      {/* Table Container */}
      <div style={{ background: '#141D26', border: '1px solid #24323F', borderRadius: '6px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#788692', fontSize: '0.875rem' }}>Loading company enquiries...</div>
        ) : data && data.items.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#0D141C', borderBottom: '1px solid #24323F' }}>
                  <th style={{ padding: '16px 18px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>REPRESENTATIVE</th>
                  <th style={{ padding: '16px 18px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>COMPANY & CONTACT</th>
                  <th style={{ padding: '16px 18px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>AREA</th>
                  <th style={{ padding: '16px 18px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>REQUESTED TIME</th>
                  <th style={{ padding: '16px 18px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>STATUS</th>
                  <th style={{ padding: '16px 18px', color: '#788692', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <EnquiryRow
                    key={item.id}
                    item={item}
                    onStatusChange={handleStatusChange}
                    onSelect={setSelectedEnquiry}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: '#788692', padding: '40px', textAlign: 'center', fontSize: '0.875rem' }}>No company enquiries found.</div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderTop: '1px solid #24323F', background: '#0D141C' }}>
            <span style={{ fontSize: '0.8125rem', color: '#788692' }}>
              Showing Page {data.page} of {data.totalPages} ({data.total} total)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                onMouseEnter={() => setPrevBtnHover(true)}
                onMouseLeave={() => setPrevBtnHover(false)}
                style={{
                  background: prevBtnHover && page > 1 ? '#1A2633' : '#141D26',
                  border: '1px solid #24323F',
                  color: '#B5BEC7',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  opacity: page <= 1 ? 0.5 : 1,
                  transition: 'background-color 150ms ease',
                }}
              >
                Previous
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                onMouseEnter={() => setNextBtnHover(true)}
                onMouseLeave={() => setNextBtnHover(false)}
                style={{
                  background: nextBtnHover && page < data.totalPages ? '#1A2633' : '#141D26',
                  border: '1px solid #24323F',
                  color: '#B5BEC7',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: page >= data.totalPages ? 'not-allowed' : 'pointer',
                  opacity: page >= data.totalPages ? 0.5 : 1,
                  transition: 'background-color 150ms ease',
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEnquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(11, 17, 24, 0.85)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#141D26', border: '1px solid #24323F', width: '100%', maxWidth: '560px', borderRadius: '6px', padding: '30px', boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #24323F', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, color: '#7FC69A', fontSize: '1.1rem', fontWeight: 700 }}>Company Enquiry Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'transparent', border: 'none', color: '#788692', fontSize: '1.2rem', cursor: 'pointer', padding: '4px' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#B5BEC7' }}>
              <div><strong style={{ color: '#788692' }}>Representative Name:</strong> <span style={{ color: '#F4F1E9', fontWeight: 600 }}>{selectedEnquiry.name}</span></div>
              <div><strong style={{ color: '#788692' }}>Company Name:</strong> <span style={{ color: '#F4F1E9', fontWeight: 600 }}>{selectedEnquiry.company}</span></div>
              <div><strong style={{ color: '#788692' }}>Work Email:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.email}</span></div>
              <div><strong style={{ color: '#788692' }}>Phone:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.phone || 'N/A'}</span></div>
              <div><strong style={{ color: '#788692' }}>Area of Interest:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.area}</span></div>
              <div><strong style={{ color: '#788692' }}>Market:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.market || 'N/A'}</span></div>
              <div><strong style={{ color: '#788692' }}>Requested Date & Time:</strong> <span style={{ color: '#F4F1E9' }}>{selectedEnquiry.preferredDate ? `${selectedEnquiry.preferredDate} ${selectedEnquiry.preferredTime || ''}` : 'N/A'}</span></div>
              <div>
                <strong style={{ color: '#788692' }}>Video Call Room:</strong>{' '}
                <a href={`https://meet.jit.si/GCC-Consultation-${selectedEnquiry.id}`} target="_blank" rel="noreferrer" style={{ color: '#C6A15B', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <VideoCallIcon />
                  <span>Join Video Room →</span>
                </a>
              </div>
              <hr style={{ borderColor: '#24323F', margin: '10px 0' }} />
              <div>
                <strong style={{ color: '#788692' }}>Message Outline:</strong>
                <p style={{ background: '#0D141C', border: '1px solid #24323F', padding: '14px', borderRadius: '4px', margin: '8px 0 0 0', lineHeight: '1.5', color: '#B5BEC7' }}>{selectedEnquiry.message}</p>
              </div>
            </div>

            <div style={{ marginTop: '25px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedEnquiry(null)}
                onMouseEnter={() => setCloseBtnHover(true)}
                onMouseLeave={() => setCloseBtnHover(false)}
                style={{
                  background: closeBtnHover ? '#D4B16B' : '#C6A15B',
                  color: '#0D141C',
                  border: 'none',
                  padding: '9px 20px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
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
