/**
 * Testimonial Management Component
 * Admin interface for managing customer testimonials
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiMessageSquare,
  FiArrowLeft,
  FiCheck,
  FiStar,
} from 'react-icons/fi';
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from '../../../hooks/useContent';
import type {
  TestimonialResponseDto,
  CreateTestimonialRequestDto,
  UpdateTestimonialRequestDto,
} from '../../../types/content.types';
import './ContentManagement.css';

interface TestimonialFormData {
  customerName: string;
  customerTitle: string;
  customerLocation: string;
  customerImageUrl: string;
  content: string;
  rating: number;
  productPurchased: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

const initialFormData: TestimonialFormData = {
  customerName: '',
  customerTitle: '',
  customerLocation: '',
  customerImageUrl: '',
  content: '',
  rating: 5,
  productPurchased: '',
  isFeatured: false,
  isActive: true,
  displayOrder: 0,
};

const TestimonialManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialResponseDto | null>(null);
  const [formData, setFormData] =
    useState<TestimonialFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // React Query hooks
  const { data: testimonialsData, isLoading, error } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const testimonials = testimonialsData?.data || [];

  const filteredTestimonials = testimonials.filter(
    testimonial =>
      testimonial.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'rating' || name === 'displayOrder' ? Number(value) : newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTestimonial) {
        const updateData: UpdateTestimonialRequestDto = {
          customerName: formData.customerName,
          customerTitle: formData.customerTitle || undefined,
          customerLocation: formData.customerLocation || undefined,
          customerImageUrl: formData.customerImageUrl || undefined,
          content: formData.content,
          rating: formData.rating,
          productPurchased: formData.productPurchased || undefined,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
          displayOrder: formData.displayOrder,
        };
        await updateTestimonial.mutateAsync({
          id: editingTestimonial.id,
          data: updateData,
        });
      } else {
        const createData: CreateTestimonialRequestDto = {
          customerName: formData.customerName,
          customerTitle: formData.customerTitle || undefined,
          customerLocation: formData.customerLocation || undefined,
          customerImageUrl: formData.customerImageUrl || undefined,
          content: formData.content,
          rating: formData.rating,
          productPurchased: formData.productPurchased || undefined,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
          displayOrder: formData.displayOrder,
        };
        await createTestimonial.mutateAsync(createData);
      }

      setShowForm(false);
      setEditingTestimonial(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error saving testimonial:', err);
    }
  };

  const handleEdit = (testimonial: TestimonialResponseDto) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customerName: testimonial.customerName,
      customerTitle: testimonial.customerTitle || '',
      customerLocation: testimonial.customerLocation || '',
      customerImageUrl: testimonial.customerImageUrl || '',
      content: testimonial.content,
      rating: testimonial.rating,
      productPurchased: testimonial.productPurchased || '',
      isFeatured: testimonial.isFeatured,
      isActive: testimonial.isActive,
      displayOrder: testimonial.displayOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTestimonial(null);
    setFormData(initialFormData);
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '0.125rem' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <FiStar
            key={star}
            style={{
              fill: star <= rating ? '#fbbf24' : 'none',
              color: star <= rating ? '#fbbf24' : 'var(--color-text-light)',
            }}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="loading-container">
          <div className="loading-spinner" />
          <div className="loading-text">Loading testimonials...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Link to="/admin/content" className="btn btn-ghost">
            <FiArrowLeft />
            Back to Content
          </Link>
          <h1 className="page-title">Testimonial Management</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-title">Error loading testimonials</div>
          <p className="empty-state-description">
            There was an error loading the testimonials. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="page-header">
        <Link to="/admin/content" className="btn btn-ghost">
          <FiArrowLeft />
          Back to Content
        </Link>
        <h1 className="page-title">Testimonial Management</h1>
        <p className="page-subtitle">
          Manage customer testimonials and reviews
        </p>
      </div>

      {showForm ? (
        <div className="content-form">
          <div className="form-section">
            <h3 className="form-section-title">
              {editingTestimonial
                ? 'Edit Testimonial'
                : 'Create New Testimonial'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerName" className="form-label required">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    className="form-input"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerTitle" className="form-label">
                    Title/Role
                  </label>
                  <input
                    type="text"
                    id="customerTitle"
                    name="customerTitle"
                    className="form-input"
                    value={formData.customerTitle}
                    onChange={handleInputChange}
                    placeholder="Loyal Customer"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerLocation" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    id="customerLocation"
                    name="customerLocation"
                    className="form-input"
                    value={formData.customerLocation}
                    onChange={handleInputChange}
                    placeholder="Mumbai, India"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productPurchased" className="form-label">
                    Product Purchased
                  </label>
                  <input
                    type="text"
                    id="productPurchased"
                    name="productPurchased"
                    className="form-input"
                    value={formData.productPurchased}
                    onChange={handleInputChange}
                    placeholder="Alphonso Mangoes"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="customerImageUrl" className="form-label">
                  Customer Photo URL
                </label>
                <input
                  type="url"
                  id="customerImageUrl"
                  name="customerImageUrl"
                  className="form-input"
                  value={formData.customerImageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content" className="form-label required">
                  Testimonial Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  className="form-textarea"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Enter the customer's testimonial..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="rating" className="form-label">
                    Rating
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <input
                      type="range"
                      id="rating"
                      name="rating"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={handleInputChange}
                      style={{ flex: 1 }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      {renderStars(formData.rating)}
                      <span style={{ marginLeft: '0.5rem', fontWeight: 500 }}>
                        {formData.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="displayOrder" className="form-label">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    className="form-input"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="isActive">
                      Active (visible on website)
                    </label>
                  </div>
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="isFeatured">
                      Featured (show on homepage)
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    createTestimonial.isPending || updateTestimonial.isPending
                  }
                >
                  <FiCheck />
                  {editingTestimonial
                    ? 'Update Testimonial'
                    : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-container">
            <div className="table-header-actions">
              <div className="table-search">
                <FiSearch className="table-search-icon" />
                <input
                  type="text"
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <FiPlus />
                Add Testimonial
              </button>
            </div>

            {filteredTestimonials.length === 0 ? (
              <div className="empty-state">
                <FiMessageSquare className="empty-state-icon" />
                <h3 className="empty-state-title">No testimonials found</h3>
                <p className="empty-state-description">
                  {searchTerm
                    ? 'No testimonials match your search. Try a different search term.'
                    : 'Start collecting customer testimonials to display on your website.'}
                </p>
                {!searchTerm && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    <FiPlus />
                    Add Your First Testimonial
                  </button>
                )}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Content</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTestimonials.map(testimonial => (
                    <tr key={testimonial.id}>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                          }}
                        >
                          {testimonial.customerImageUrl ? (
                            <img
                              src={testimonial.customerImageUrl}
                              alt={testimonial.customerName}
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--color-primary-light)',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 600,
                              }}
                            >
                              {testimonial.customerName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {testimonial.customerName}
                            </div>
                            {testimonial.customerLocation && (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--color-text-light)',
                                }}
                              >
                                {testimonial.customerLocation}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ maxWidth: '300px' }}>
                          <div
                            style={{
                              fontSize: '0.875rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            "{testimonial.content}"
                          </div>
                          {testimonial.productPurchased && (
                            <div
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--color-text-light)',
                                marginTop: '0.25rem',
                              }}
                            >
                              Purchased: {testimonial.productPurchased}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{renderStars(testimonial.rating)}</td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                          }}
                        >
                          <span
                            className={`status-badge ${testimonial.isActive ? 'active' : 'inactive'}`}
                          >
                            {testimonial.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {testimonial.isFeatured && (
                            <span className="status-badge featured">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(testimonial)}
                            title="Edit"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => setDeleteConfirm(testimonial.id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-body">
              <div className="confirm-dialog">
                <div className="confirm-icon">
                  <FiTrash2 />
                </div>
                <h3 className="confirm-title">Delete Testimonial</h3>
                <p className="confirm-message">
                  Are you sure you want to delete this testimonial? This action
                  cannot be undone.
                </p>
                <div className="confirm-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={deleteTestimonial.isPending}
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;
