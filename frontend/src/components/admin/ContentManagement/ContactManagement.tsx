/**
 * Contact Management Component
 * Admin interface for managing contact form submissions
 * Following Clean Architecture and instruction file standards
 */

import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { useContacts, useContactById } from '../../../hooks/useContent';
import type { ContactQueryParams } from '../../../types/content.types';
import { Breadcrumb, EmptyState } from '../ui';
import './ContentManagement.css';

// Breadcrumb items for navigation
const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Content', href: '/admin/content' },
  { label: 'Contacts', href: '/admin/content/contacts' },
];

const statusColors: Record<string, string> = {
  pending: 'status-pending',
  'in-progress': 'status-warning',
  resolved: 'status-active',
  closed: 'status-inactive',
};

const ContactManagement: React.FC = () => {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [filters, setFilters] = useState<ContactQueryParams>({
    page: 1,
    pageSize: 20,
  });

  // React Query hooks
  const { data: contactsData, isLoading, error } = useContacts(filters);
  const { data: contactDetailData, isLoading: detailLoading } = useContactById(
    selectedContact || ''
  );

  const contacts = contactsData?.data || [];
  const meta = contactsData?.meta;
  const contactDetail = contactDetailData?.data;

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value || undefined,
      page: 1, // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleViewContact = (id: string) => {
    setSelectedContact(id);
  };

  const handleCloseDetail = () => {
    setSelectedContact(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Contact Submissions</h1>
          <p className="page-subtitle">Loading contact submissions...</p>
        </div>
        <div className="loading-state">Loading contact submissions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Contact Submissions</h1>
        </div>
        <EmptyState
          icon={<FiMail />}
          title="Failed to load contact submissions"
          description="There was an error loading the contact submissions. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="page-header">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="page-title">Contact Submissions</h1>
        <p className="page-subtitle">
          Manage and respond to customer inquiries
        </p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="inquiryType">Inquiry Type</label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={filters.inquiryType || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search by name or email..."
            onChange={e => {
              // Debounce search with closure over event value
              setTimeout(() => {
                handleFilterChange(e);
              }, 300);
            }}
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="content-table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Inquiry Type</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  No contact submissions found.
                </td>
              </tr>
            ) : (
              contacts.map(contact => (
                <tr key={contact.id}>
                  <td className="date-cell">{formatDate(contact.createdAt)}</td>
                  <td>{contact.name}</td>
                  <td>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </td>
                  <td>
                    <span className="type-badge">{contact.inquiryType}</span>
                  </td>
                  <td className="subject-cell">
                    {contact.subject.length > 40
                      ? `${contact.subject.substring(0, 40)}...`
                      : contact.subject}
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        statusColors[contact.status] || 'status-pending'
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleViewContact(contact.id)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() =>
                          (window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`)
                        }
                        title="Reply"
                      >
                        ✉️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.total > meta.pageSize && (
        <div className="pagination">
          <button
            className="btn-secondary"
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page <= 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {meta.page} of {Math.ceil(meta.total / meta.pageSize)}
          </span>
          <button
            className="btn-secondary"
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page >= Math.ceil(meta.total / meta.pageSize)}
          >
            Next
          </button>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div
            className="modal-content modal-large"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Contact Details</h2>
              <button className="modal-close" onClick={handleCloseDetail}>
                ×
              </button>
            </div>
            {detailLoading ? (
              <div className="loading-state">Loading...</div>
            ) : contactDetail ? (
              <div className="contact-detail">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{contactDetail.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>
                      <a href={`mailto:${contactDetail.email}`}>
                        {contactDetail.email}
                      </a>
                    </p>
                  </div>
                  {contactDetail.phone && (
                    <div className="detail-item">
                      <label>Phone</label>
                      <p>
                        <a href={`tel:${contactDetail.phone}`}>
                          {contactDetail.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Inquiry Type</label>
                    <p>{contactDetail.inquiryType}</p>
                  </div>
                  <div className="detail-item">
                    <label>Status</label>
                    <span
                      className={`status-badge ${
                        statusColors[contactDetail.status] || 'status-pending'
                      }`}
                    >
                      {contactDetail.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Submitted On</label>
                    <p>{formatDate(contactDetail.createdAt)}</p>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Subject</label>
                  <p>{contactDetail.subject}</p>
                </div>
                <div className="detail-item full-width">
                  <label>Message</label>
                  <div className="message-content">{contactDetail.message}</div>
                </div>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={handleCloseDetail}>
                    Close
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() =>
                      (window.location.href = `mailto:${contactDetail.email}?subject=Re: ${contactDetail.subject}`)
                    }
                  >
                    Reply via Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="error-state">Contact not found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
