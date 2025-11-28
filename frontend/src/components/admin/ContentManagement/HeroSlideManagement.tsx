/**
 * Hero Slide Management Component
 * Admin interface for managing homepage hero carousel slides
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiImage,
  FiArrowLeft,
  FiCheck,
  FiMove,
} from 'react-icons/fi';
import {
  useHeroSlides,
  useCreateHeroSlide,
  useUpdateHeroSlide,
  useDeleteHeroSlide,
} from '../../../hooks/useContent';
import type {
  HeroSlideResponseDto,
  CreateHeroSlideRequestDto,
  UpdateHeroSlideRequestDto,
} from '../../../types/content.types';
import './ContentManagement.css';

interface HeroSlideFormData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  gradientStart: string;
  gradientEnd: string;
  ctaText: string;
  ctaLink: string;
  displayOrder: number;
  isActive: boolean;
  features: string[];
}

const initialFormData: HeroSlideFormData = {
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  gradientStart: '#f97316',
  gradientEnd: '#ea580c',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  displayOrder: 0,
  isActive: true,
  features: [],
};

const HeroSlideManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideResponseDto | null>(
    null
  );
  const [formData, setFormData] = useState<HeroSlideFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  // React Query hooks
  const { data: slidesData, isLoading, error } = useHeroSlides();
  const createSlide = useCreateHeroSlide();
  const updateSlide = useUpdateHeroSlide();
  const deleteSlide = useDeleteHeroSlide();

  const slides = slidesData?.data || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSlide) {
        const updateData: UpdateHeroSlideRequestDto = {
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          gradientStart: formData.gradientStart || undefined,
          gradientEnd: formData.gradientEnd || undefined,
          ctaText: formData.ctaText || undefined,
          ctaLink: formData.ctaLink || undefined,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        await updateSlide.mutateAsync({
          id: editingSlide.id,
          data: updateData,
        });
      } else {
        const createData: CreateHeroSlideRequestDto = {
          title: formData.title,
          subtitle: formData.subtitle || undefined,
          description: formData.description || undefined,
          imageUrl: formData.imageUrl || undefined,
          gradientStart: formData.gradientStart || undefined,
          gradientEnd: formData.gradientEnd || undefined,
          ctaText: formData.ctaText || undefined,
          ctaLink: formData.ctaLink || undefined,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
          features:
            formData.features.length > 0 ? formData.features : undefined,
        };
        await createSlide.mutateAsync(createData);
      }

      setShowForm(false);
      setEditingSlide(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error saving hero slide:', err);
    }
  };

  const handleEdit = (slide: HeroSlideResponseDto) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      imageUrl: slide.imageUrl || '',
      gradientStart: slide.gradientStart || '#f97316',
      gradientEnd: slide.gradientEnd || '#ea580c',
      ctaText: slide.ctaText || 'Shop Now',
      ctaLink: slide.ctaLink || '/products',
      displayOrder: slide.displayOrder,
      isActive: slide.isActive,
      features: slide.features || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSlide.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting hero slide:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlide(null);
    setFormData(initialFormData);
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="loading-container">
          <div className="loading-spinner" />
          <div className="loading-text">Loading hero slides...</div>
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
          <h1 className="page-title">Hero Slide Management</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-title">Error loading hero slides</div>
          <p className="empty-state-description">
            There was an error loading the hero slides. Please try again later.
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
        <h1 className="page-title">Hero Slide Management</h1>
        <p className="page-subtitle">Configure homepage hero carousel slides</p>
      </div>

      {showForm ? (
        <div className="content-form">
          <div className="form-section">
            <h3 className="form-section-title">
              {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title" className="form-label required">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter slide title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subtitle" className="form-label">
                  Subtitle
                </label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  className="form-input"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Enter slide subtitle"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter slide description"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl" className="form-label">
                  Background Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gradientStart" className="form-label">
                    Gradient Start Color
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="color"
                      id="gradientStart"
                      name="gradientStart"
                      value={formData.gradientStart}
                      onChange={handleInputChange}
                      style={{
                        width: '50px',
                        height: '40px',
                        padding: 0,
                        border: 'none',
                      }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={formData.gradientStart}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          gradientStart: e.target.value,
                        }))
                      }
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="gradientEnd" className="form-label">
                    Gradient End Color
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="color"
                      id="gradientEnd"
                      name="gradientEnd"
                      value={formData.gradientEnd}
                      onChange={handleInputChange}
                      style={{
                        width: '50px',
                        height: '40px',
                        padding: 0,
                        border: 'none',
                      }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      value={formData.gradientEnd}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          gradientEnd: e.target.value,
                        }))
                      }
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ctaText" className="form-label">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    id="ctaText"
                    name="ctaText"
                    className="form-input"
                    value={formData.ctaText}
                    onChange={handleInputChange}
                    placeholder="Shop Now"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ctaLink" className="form-label">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    id="ctaLink"
                    name="ctaLink"
                    className="form-input"
                    value={formData.ctaLink}
                    onChange={handleInputChange}
                    placeholder="/products"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Features (Bullet Points)</label>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    value={featureInput}
                    onChange={e => setFeatureInput(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={e =>
                      e.key === 'Enter' &&
                      (e.preventDefault(), handleAddFeature())
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddFeature}
                  >
                    <FiPlus />
                  </button>
                </div>
                {formData.features.length > 0 && (
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
                  >
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.25rem 0.75rem',
                          background: 'var(--color-bg)',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                        }}
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            color: 'var(--color-text-light)',
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-row">
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

                <div
                  className="form-group"
                  style={{ display: 'flex', alignItems: 'flex-end' }}
                >
                  <div className="form-checkbox">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="isActive">
                      Active (visible on homepage)
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="form-group">
                <label className="form-label">Preview</label>
                <div
                  style={{
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    background: `linear-gradient(135deg, ${formData.gradientStart}, ${formData.gradientEnd})`,
                    color: 'white',
                    minHeight: '150px',
                  }}
                >
                  {formData.subtitle && (
                    <div
                      style={{
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem',
                        opacity: 0.9,
                      }}
                    >
                      {formData.subtitle}
                    </div>
                  )}
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      margin: '0 0 0.5rem 0',
                    }}
                  >
                    {formData.title || 'Slide Title'}
                  </h3>
                  {formData.description && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        opacity: 0.9,
                        margin: '0 0 1rem 0',
                      }}
                    >
                      {formData.description}
                    </p>
                  )}
                  {formData.ctaText && (
                    <button
                      type="button"
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'white',
                        color: formData.gradientStart,
                        border: 'none',
                        borderRadius: '0.25rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {formData.ctaText}
                    </button>
                  )}
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
                  disabled={createSlide.isPending || updateSlide.isPending}
                >
                  <FiCheck />
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-container">
            <div className="table-header-actions">
              <div style={{ fontWeight: 500, color: 'var(--color-text)' }}>
                {slides.length} slide{slides.length !== 1 ? 's' : ''} configured
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <FiPlus />
                Add Slide
              </button>
            </div>

            {slides.length === 0 ? (
              <div className="empty-state">
                <FiImage className="empty-state-icon" />
                <h3 className="empty-state-title">No hero slides found</h3>
                <p className="empty-state-description">
                  Create your first hero slide to display on the homepage
                  carousel.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <FiPlus />
                  Add Your First Slide
                </button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Slide</th>
                    <th>CTA</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slides
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(slide => (
                      <tr key={slide.id}>
                        <td>
                          <div className="drag-handle">
                            <FiMove />
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                            }}
                          >
                            <div
                              style={{
                                width: '80px',
                                height: '45px',
                                borderRadius: '0.25rem',
                                background: `linear-gradient(135deg, ${slide.gradientStart || '#f97316'}, ${slide.gradientEnd || '#ea580c'})`,
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 500 }}>
                                {slide.title}
                              </div>
                              {slide.subtitle && (
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-light)',
                                  }}
                                >
                                  {slide.subtitle}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.875rem' }}>
                            <div>{slide.ctaText || 'No CTA'}</div>
                            {slide.ctaLink && (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--color-text-light)',
                                }}
                              >
                                → {slide.ctaLink}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>{slide.displayOrder}</td>
                        <td>
                          <span
                            className={`status-badge ${slide.isActive ? 'active' : 'inactive'}`}
                          >
                            {slide.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(slide)}
                              title="Edit"
                            >
                              <FiEdit3 />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => setDeleteConfirm(slide.id)}
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
                <h3 className="confirm-title">Delete Hero Slide</h3>
                <p className="confirm-message">
                  Are you sure you want to delete this hero slide? This action
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
                    disabled={deleteSlide.isPending}
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

export default HeroSlideManagement;
