'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, getToken } from '@/utils/auth-utils';
import { ContactEnquiry, EnquiryStatus } from '@/models/contact.model';

interface FilterResult {
  items: ContactEnquiry[];
  total: number;
  page: number;
  totalPages: number;
}

export default function AdminEnquiriesPage() {
  const [data, setData] = useState<FilterResult | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const router = useRouter();

  useEffect(() => {
    /*
    // OLD JWT TOKEN CHECK (COMMENTED OUT) - Route protection handled by Clerk Middleware
    // const token = getToken();
    // if (!token) {
    //   router.push('/admin/login');
    //   return;
    // }
    */
    fetchEnquiries();
  }, [search, statusFilter, page]);

  const fetchEnquiries = async () => {
    setLoading(true);
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (statusFilter) queryParams.append('status', statusFilter);
    queryParams.append('page', page.toString());
    queryParams.append('limit', '10');

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
      fetchEnquiries();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this enquiry record?')) return;

    const res = await apiFetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
    });

    if (res.success) {
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      fetchEnquiries();
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ color: 'var(--color-foreground)', margin: 0 }}>Contact Form Submissions</h1>
        <p style={{ color: 'var(--color-foreground-subtle)', margin: '6px 0 0 0', fontSize: 'var(--text-body)' }}>Manage client enquiries, requested dates, and video meeting rooms</p>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', background: 'var(--color-surface)', padding: '15px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
        <input
          type="text"
          placeholder="Search client name, company, or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ flex: 1, minWidth: '240px', padding: '10px 14px', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{ padding: '10px 14px', background: 'var(--color-surface-sunken)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)' }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {/* Table Container */}
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-foreground-subtle)' }}>Loading enquiries...</div>
        ) : data && data.items.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-foreground-subtle)', background: 'var(--color-surface-sunken)' }}>
                  <th style={{ padding: '14px' }}>Client</th>
                  <th style={{ padding: '14px' }}>Company & Contact</th>
                  <th style={{ padding: '14px' }}>Area</th>
                  <th style={{ padding: '14px' }}>Requested Time</th>
                  <th style={{ padding: '14px' }}>Status</th>
                  <th style={{ padding: '14px' }}>Meeting Room</th>
                  <th style={{ padding: '14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '14px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: '14px' }}>
                      <div>{item.company}</div>
                      <div style={{ color: 'var(--color-foreground-subtle)', fontSize: 'var(--text-xs)' }}>{item.email}</div>
                    </td>
                    <td style={{ padding: '14px' }}>{item.area}</td>
                    <td style={{ padding: '14px' }}>
                      {item.preferredDate ? `${item.preferredDate} ${item.preferredTime || ''}` : 'N/A'}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value as EnquiryStatus)}
                        style={{
                          background: 'var(--color-surface-sunken)',
                          border: '1px solid var(--color-border)',
                          color:
                            item.status === 'PENDING'
                              ? 'var(--color-warning)'
                              : item.status === 'REVIEWED'
                              ? 'var(--color-success)'
                              : 'var(--color-foreground-subtle)',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="REVIEWED">REVIEWED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <a
                        href={`https://meet.jit.si/GCC-Consultation-${item.id}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'var(--color-accent)',
                          color: 'var(--color-accent-foreground)',
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-sm)',
                          textDecoration: 'none',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        🎥 Join Meeting
                      </a>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedEnquiry(item)}
                        style={{
                          background: 'var(--color-surface-raised)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-foreground)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          marginRight: '6px',
                          cursor: 'pointer',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          background: 'var(--color-danger-soft)',
                          border: '1px solid var(--color-danger-line)',
                          color: 'var(--color-danger)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ color: 'var(--color-foreground-subtle)', padding: '40px', textAlign: 'center' }}>No enquiries found matching your query.</div>
        )}

        {/* Pagination Controls */}
        {data && data.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface-sunken)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-foreground-subtle)' }}>
              Showing Page {data.page} of {data.totalPages} ({data.total} total)
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                Previous
              </button>
              <button
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-foreground)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: page >= data.totalPages ? 'not-allowed' : 'pointer' }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {selectedEnquiry && (
        <div style={{ position: 'fixed', inset: 0, background: '#0c141dd9', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', width: '100%', maxWidth: '560px', borderRadius: 'var(--radius-md)', padding: '30px', boxShadow: 'var(--shadow-float)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: 'var(--color-accent)' }}>Client Enquiry Details</h3>
              <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'transparent', border: 'none', color: 'var(--color-foreground-subtle)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: 'var(--text-body)' }}>
              <div><strong>Name:</strong> {selectedEnquiry.name}</div>
              <div><strong>Company:</strong> {selectedEnquiry.company}</div>
              <div><strong>Work Email:</strong> {selectedEnquiry.email}</div>
              <div><strong>Phone:</strong> {selectedEnquiry.phone || 'N/A'}</div>
              <div><strong>Area of Interest:</strong> {selectedEnquiry.area}</div>
              <div><strong>Market:</strong> {selectedEnquiry.market || 'N/A'}</div>
              <div><strong>Requested Date & Time:</strong> {selectedEnquiry.preferredDate ? `${selectedEnquiry.preferredDate} ${selectedEnquiry.preferredTime || ''}` : 'N/A'}</div>
              <div>
                <strong>Video Call Room:</strong>{' '}
                <a href={`https://meet.jit.si/GCC-Consultation-${selectedEnquiry.id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-accent)' }}>
                  Join Video Room ➔
                </a>
              </div>
              <hr style={{ borderColor: 'var(--color-border)', margin: '10px 0' }} />
              <div>
                <strong>Client Message:</strong>
                <p style={{ background: 'var(--color-surface-sunken)', padding: '14px', borderRadius: 'var(--radius-sm)', margin: '8px 0 0 0', lineHeight: '1.5', color: 'var(--color-foreground-muted)' }}>{selectedEnquiry.message}</p>
              </div>
            </div>

            <div style={{ marginTop: '25px', textAlign: 'right' }}>
              <button onClick={() => setSelectedEnquiry(null)} style={{ background: 'var(--color-accent)', color: 'var(--color-accent-foreground)', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
