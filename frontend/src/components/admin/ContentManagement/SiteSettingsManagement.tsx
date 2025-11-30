/**
 * Site Settings Management Component
 * Admin interface for managing general site settings and information
 */

import React, { useState } from 'react';
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSettings,
  FiCheck,
  FiSearch,
} from 'react-icons/fi';
import { useSiteSettings } from '../../../hooks/useContent';
import { siteSettingsService } from '../../../services/contentService';
import type {
  SiteSettingResponseDto,
  CreateSiteSettingRequestDto,
  UpdateSiteSettingRequestDto,
} from '../../../types/content.types';
import { Breadcrumb, EmptyState } from '../ui';
import './ContentManagement.css';

// Breadcrumb items for navigation
const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Content', href: '/admin/content' },
  { label: 'Site Settings', href: '/admin/content/site-settings' },
];

interface SettingFormData {
  key: string;
  value: string;
  group: string;
  description: string;
  isPublic: boolean;
}

const initialFormData: SettingFormData = {
  key: '',
  value: '',
  group: 'general',
  description: '',
  isPublic: false,
};

const settingGroups = [
  { value: 'general', label: 'General' },
  { value: 'contact', label: 'Contact Information' },
  { value: 'social', label: 'Social Media' },
  { value: 'seo', label: 'SEO Settings' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'other', label: 'Other' },
];

const SiteSettingsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSetting, setEditingSetting] =
    useState<SiteSettingResponseDto | null>(null);
  const [formData, setFormData] = useState<SettingFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Query hooks
  const { data: settingsData, isLoading, error, refetch } = useSiteSettings();

  const settings = settingsData?.data || [];

  const filteredSettings = settings.filter(setting => {
    const matchesSearch =
      setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      setting.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (setting.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    const matchesGroup =
      selectedGroup === 'all' || setting.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Group settings by their group field
  const groupedSettings = filteredSettings.reduce(
    (acc, setting) => {
      const group = setting.group || 'other';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(setting);
      return acc;
    },
    {} as Record<string, SiteSettingResponseDto[]>
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingSetting) {
        const updateData: UpdateSiteSettingRequestDto = {
          value: formData.value,
          description: formData.description || undefined,
          isPublic: formData.isPublic,
        };
        await siteSettingsService.update(editingSetting.key, updateData);
      } else {
        const createData: CreateSiteSettingRequestDto = {
          key: formData.key,
          value: formData.value,
          group: formData.group || undefined,
          description: formData.description || undefined,
          isPublic: formData.isPublic,
        };
        await siteSettingsService.create(createData);
      }

      setShowForm(false);
      setEditingSetting(null);
      setFormData(initialFormData);
      refetch();
    } catch (err) {
      console.error('Error saving setting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (setting: SiteSettingResponseDto) => {
    setEditingSetting(setting);
    setFormData({
      key: setting.key,
      value: setting.value,
      group: setting.group,
      description: setting.description || '',
      isPublic: setting.isPublic,
    });
    setShowForm(true);
  };

  const handleDelete = async (key: string) => {
    try {
      await siteSettingsService.delete(key);
      setDeleteConfirm(null);
      refetch();
    } catch (err) {
      console.error('Error deleting setting:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSetting(null);
    setFormData(initialFormData);
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="loading-container">
          <div className="loading-spinner" />
          <div className="loading-text">Loading site settings...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Site Settings</h1>
        </div>
        <EmptyState
          icon={<FiSettings />}
          title="Error loading settings"
          description="There was an error loading the site settings. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="page-header">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="page-title">Site Settings</h1>
        <p className="page-subtitle">
          Configure general site settings and information
        </p>
      </div>

      {showForm ? (
        <div className="content-form">
          <div className="form-section">
            <h3 className="form-section-title">
              {editingSetting ? 'Edit Setting' : 'Create New Setting'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="key" className="form-label required">
                    Setting Key
                  </label>
                  <input
                    type="text"
                    id="key"
                    name="key"
                    className="form-input"
                    value={formData.key}
                    onChange={handleInputChange}
                    placeholder="company_name"
                    required
                    disabled={!!editingSetting}
                    style={editingSetting ? { opacity: 0.6 } : undefined}
                  />
                  <p className="form-hint">
                    Unique identifier (use snake_case)
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="group" className="form-label">
                    Group
                  </label>
                  <select
                    id="group"
                    name="group"
                    className="form-select"
                    value={formData.group}
                    onChange={handleInputChange}
                  >
                    {settingGroups.map(group => (
                      <option key={group.value} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="value" className="form-label required">
                  Value
                </label>
                <textarea
                  id="value"
                  name="value"
                  className="form-textarea"
                  value={formData.value}
                  onChange={handleInputChange}
                  placeholder="Setting value..."
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of this setting"
                />
              </div>

              <div className="form-group">
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isPublic">
                    Public (accessible without authentication)
                  </label>
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
                  disabled={isSubmitting}
                >
                  <FiCheck />
                  {editingSetting ? 'Update Setting' : 'Create Setting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div className="data-table-container">
            <div className="table-header-actions">
              <div
                style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
              >
                <div className="table-search">
                  <FiSearch className="table-search-icon" />
                  <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="form-select"
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value)}
                  style={{ width: 'auto', minWidth: '150px' }}
                >
                  <option value="all">All Groups</option>
                  {settingGroups.map(group => (
                    <option key={group.value} value={group.value}>
                      {group.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <FiPlus />
                Add Setting
              </button>
            </div>

            {filteredSettings.length === 0 ? (
              <div className="empty-state">
                <FiSettings className="empty-state-icon" />
                <h3 className="empty-state-title">No settings found</h3>
                <p className="empty-state-description">
                  {searchTerm || selectedGroup !== 'all'
                    ? 'No settings match your filter. Try adjusting your search.'
                    : 'Add your first site setting to get started.'}
                </p>
                {!searchTerm && selectedGroup === 'all' && (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    <FiPlus />
                    Add Your First Setting
                  </button>
                )}
              </div>
            ) : (
              <div style={{ padding: '1rem' }}>
                {Object.entries(groupedSettings).map(
                  ([group, groupSettings]) => (
                    <div key={group} style={{ marginBottom: '2rem' }}>
                      <h4
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--color-text-light)',
                          marginBottom: '0.75rem',
                          paddingBottom: '0.5rem',
                          borderBottom: '1px solid var(--color-border)',
                        }}
                      >
                        {settingGroups.find(g => g.value === group)?.label ||
                          group}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        {groupSettings.map(setting => (
                          <div
                            key={setting.id}
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              padding: '0.75rem 1rem',
                              background: 'var(--color-bg)',
                              borderRadius: '0.5rem',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                }}
                              >
                                <code
                                  style={{
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: 'var(--color-primary)',
                                  }}
                                >
                                  {setting.key}
                                </code>
                                {setting.isPublic && (
                                  <span
                                    className="status-badge active"
                                    style={{ fontSize: '0.625rem' }}
                                  >
                                    Public
                                  </span>
                                )}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.875rem',
                                  color: 'var(--color-text)',
                                  marginTop: '0.25rem',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {setting.value.length > 100
                                  ? `${setting.value.substring(0, 100)}...`
                                  : setting.value}
                              </div>
                              {setting.description && (
                                <div
                                  style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--color-text-light)',
                                    marginTop: '0.25rem',
                                  }}
                                >
                                  {setting.description}
                                </div>
                              )}
                            </div>
                            <div className="action-buttons">
                              <button
                                className="action-btn edit"
                                onClick={() => handleEdit(setting)}
                                title="Edit"
                              >
                                <FiEdit3 />
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => setDeleteConfirm(setting.key)}
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
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
                <h3 className="confirm-title">Delete Setting</h3>
                <p className="confirm-message">
                  Are you sure you want to delete the setting "{deleteConfirm}"?
                  This action cannot be undone.
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

export default SiteSettingsManagement;
