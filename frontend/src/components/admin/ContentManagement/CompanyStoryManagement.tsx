/**
 * Company Story Management Component
 * Admin interface for managing company story/about sections
 * Following Clean Architecture and instruction file standards
 */

import React, { useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { useCompanyStory } from '../../../hooks/useContent';
import type { CompanyStorySectionResponseDto } from '../../../types/content.types';
import { getImageSrc, processImageForUpload } from '../../../utils';
import { Breadcrumb, EmptyState } from '../ui';
import './ContentManagement.css';

// Breadcrumb items for navigation
const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Content', href: '/admin/content' },
  { label: 'Company Story', href: '/admin/content/company-story' },
];

interface StorySectionFormData {
  sectionType: string;
  title: string;
  subtitle: string;
  content: string;
  imageBase64: string;
  imageContentType: string;
  displayOrder: number;
  isActive: boolean;
}

const initialFormData: StorySectionFormData = {
  sectionType: 'story',
  title: '',
  subtitle: '',
  content: '',
  imageBase64: '',
  imageContentType: '',
  displayOrder: 0,
  isActive: true,
};

const sectionTypes = [
  { value: 'story', label: 'Our Story' },
  { value: 'mission', label: 'Mission' },
  { value: 'vision', label: 'Vision' },
  { value: 'values', label: 'Values' },
  { value: 'history', label: 'History' },
  { value: 'team', label: 'Team' },
];

const CompanyStoryManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] =
    useState<CompanyStorySectionResponseDto | null>(null);
  const [formData, setFormData] =
    useState<StorySectionFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // React Query hooks - using basic query for now
  const { data: storyData, isLoading, error } = useCompanyStory();

  const storySections = storyData?.data || [];

  const handleOpenModal = (section?: CompanyStorySectionResponseDto) => {
    if (section) {
      setEditingSection(section);
      setFormData({
        sectionType: section.sectionType,
        title: section.title,
        subtitle: section.subtitle || '',
        content: section.content,
        imageBase64: section.imageBase64 || '',
        imageContentType: section.imageContentType || '',
        displayOrder: section.displayOrder,
        isActive: section.isActive,
      });
    } else {
      setEditingSection(null);
      setFormData({
        ...initialFormData,
        displayOrder: storySections.length + 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSection(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { base64, contentType } = await processImageForUpload(file);
      setFormData(prev => ({
        ...prev,
        imageBase64: base64,
        imageContentType: contentType,
      }));
    } catch (error) {
      console.error('Image upload error:', error);
    }
  };

  const clearImage = () => {
    setFormData(prev => ({
      ...prev,
      imageBase64: '',
      imageContentType: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: Create/Update mutations would be added when backend endpoints are available
    console.log('Submitting:', formData);
    handleCloseModal();
  };

  const handleDelete = async (id: string) => {
    // Note: Delete mutation would be added when backend endpoint is available
    console.log('Deleting:', id);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Company Story Management</h1>
          <p className="page-subtitle">Loading company story sections...</p>
        </div>
        <div className="loading-state">Loading company story sections...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Company Story Management</h1>
        </div>
        <EmptyState
          icon={<FiInfo />}
          title="Failed to load company story"
          description="There was an error loading the company story. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="page-header">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="page-title">Company Story Management</h1>
        <p className="page-subtitle">
          Manage your company's about/story sections
        </p>
      </div>
      <div className="content-header">
        <div></div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add Section
        </button>
      </div>

      <div className="content-grid">
        {storySections.length === 0 ? (
          <div className="empty-card">
            <p>
              No story sections found. Add your first section to get started.
            </p>
          </div>
        ) : (
          storySections.map(section => (
            <div key={section.id} className="content-card">
              <div className="card-header">
                <span
                  className={`section-type-badge type-${section.sectionType}`}
                >
                  {sectionTypes.find(t => t.value === section.sectionType)
                    ?.label || section.sectionType}
                </span>
                <span
                  className={`status-badge ${
                    section.isActive ? 'status-active' : 'status-inactive'
                  }`}
                >
                  {section.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {section.imageBase64 && (
                <div className="card-image">
                  <img
                    src={getImageSrc(
                      section.imageBase64,
                      section.imageContentType
                    )}
                    alt={section.title}
                  />
                </div>
              )}
              <div className="card-body">
                <h3>{section.title}</h3>
                {section.subtitle && (
                  <p className="card-subtitle">{section.subtitle}</p>
                )}
                <p className="card-content">
                  {section.content.length > 150
                    ? `${section.content.substring(0, 150)}...`
                    : section.content}
                </p>
              </div>
              <div className="card-footer">
                <span className="display-order">
                  Order: {section.displayOrder}
                </span>
                <div className="action-buttons">
                  <button
                    className="btn-icon"
                    onClick={() => handleOpenModal(section)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => setDeleteConfirm(section.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content modal-large"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{editingSection ? 'Edit Section' : 'Add Section'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sectionType">Section Type</label>
                  <select
                    id="sectionType"
                    name="sectionType"
                    value={formData.sectionType}
                    onChange={handleInputChange}
                    required
                  >
                    {sectionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="displayOrder">Display Order</label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min={0}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Section title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subtitle">Subtitle (optional)</label>
                <input
                  type="text"
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  placeholder="Section subtitle"
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Section content..."
                  rows={6}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="imageUpload">Image (optional)</label>
                <div className="image-upload-section">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label
                    htmlFor="imageUpload"
                    className="btn-secondary"
                    style={{
                      cursor: 'pointer',
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                    }}
                  >
                    Upload Image
                  </label>
                  {formData.imageBase64 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img
                        src={getImageSrc(
                          formData.imageBase64,
                          formData.imageContentType
                        )}
                        alt="Preview"
                        style={{
                          maxWidth: '200px',
                          maxHeight: '150px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                      <button
                        type="button"
                        className="btn-icon btn-danger"
                        onClick={clearImage}
                        style={{ marginLeft: '0.5rem' }}
                        title="Remove image"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleCheckboxChange}
                  />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingSection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="modal-content modal-small"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Confirm Delete</h2>
            </div>
            <p>
              Are you sure you want to delete this section? This action cannot
              be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyStoryManagement;
