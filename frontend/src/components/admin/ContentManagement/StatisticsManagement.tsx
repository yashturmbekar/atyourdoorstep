/**
 * Statistics Management Component
 * Admin interface for managing homepage statistics display
 */

import React, { useState } from 'react';
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiTrendingUp,
  FiCheck,
  FiMove,
} from 'react-icons/fi';
import {
  useStatistics,
  useCreateStatistic,
  useUpdateStatistic,
  useDeleteStatistic,
} from '../../../hooks/useContent';
import type {
  StatisticResponseDto,
  CreateStatisticRequestDto,
  UpdateStatisticRequestDto,
} from '../../../types/content.types';
import { Breadcrumb, EmptyState } from '../ui';
import './ContentManagement.css';

// Breadcrumb items for navigation
const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Content', href: '/admin/content' },
  { label: 'Statistics', href: '/admin/content/statistics' },
];

interface StatisticFormData {
  label: string;
  value: string;
  suffix: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

const initialFormData: StatisticFormData = {
  label: '',
  value: '',
  suffix: '',
  icon: '',
  displayOrder: 0,
  isActive: true,
};

const StatisticsManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStatistic, setEditingStatistic] =
    useState<StatisticResponseDto | null>(null);
  const [formData, setFormData] = useState<StatisticFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // React Query hooks
  const { data: statisticsData, isLoading, error } = useStatistics();
  const createStatistic = useCreateStatistic();
  const updateStatistic = useUpdateStatistic();
  const deleteStatistic = useDeleteStatistic();

  const statistics = statisticsData?.data || [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'displayOrder' ? Number(value) : newValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingStatistic) {
        const updateData: UpdateStatisticRequestDto = {
          label: formData.label,
          value: formData.value,
          suffix: formData.suffix || undefined,
          icon: formData.icon || undefined,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        await updateStatistic.mutateAsync({
          id: editingStatistic.id,
          data: updateData,
        });
      } else {
        const createData: CreateStatisticRequestDto = {
          label: formData.label,
          value: formData.value,
          suffix: formData.suffix || undefined,
          icon: formData.icon || undefined,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
        };
        await createStatistic.mutateAsync(createData);
      }

      setShowForm(false);
      setEditingStatistic(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error saving statistic:', err);
    }
  };

  const handleEdit = (statistic: StatisticResponseDto) => {
    setEditingStatistic(statistic);
    setFormData({
      label: statistic.label,
      value: statistic.value,
      suffix: statistic.suffix || '',
      icon: statistic.icon || '',
      displayOrder: statistic.displayOrder,
      isActive: statistic.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStatistic.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting statistic:', err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStatistic(null);
    setFormData(initialFormData);
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="loading-container">
          <div className="loading-spinner" />
          <div className="loading-text">Loading statistics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Statistics Management</h1>
        </div>
        <EmptyState
          icon={<FiTrendingUp />}
          title="Error loading statistics"
          description="There was an error loading the statistics. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="page-header">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="page-title">Statistics Management</h1>
        <p className="page-subtitle">Configure homepage statistics display</p>
      </div>

      {showForm ? (
        <div className="content-form">
          <div className="form-section">
            <h3 className="form-section-title">
              {editingStatistic ? 'Edit Statistic' : 'Create New Statistic'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="value" className="form-label required">
                    Value
                  </label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    className="form-input"
                    value={formData.value}
                    onChange={handleInputChange}
                    placeholder="10,000"
                    required
                  />
                  <p className="form-hint">
                    The number or value to display (e.g., "10,000", "99%")
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="suffix" className="form-label">
                    Suffix
                  </label>
                  <input
                    type="text"
                    id="suffix"
                    name="suffix"
                    className="form-input"
                    value={formData.suffix}
                    onChange={handleInputChange}
                    placeholder="+ or %"
                  />
                  <p className="form-hint">
                    Optional suffix (e.g., "+", "%", "K")
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="label" className="form-label required">
                  Label
                </label>
                <input
                  type="text"
                  id="label"
                  name="label"
                  className="form-input"
                  value={formData.label}
                  onChange={handleInputChange}
                  placeholder="Happy Customers"
                  required
                />
                <p className="form-hint">
                  Description that appears below the value
                </p>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="icon" className="form-label">
                    Icon
                  </label>
                  <input
                    type="text"
                    id="icon"
                    name="icon"
                    className="form-input"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="🎉 or icon class"
                  />
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
                <div className="form-checkbox">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isActive">Active (visible on homepage)</label>
                </div>
              </div>

              {/* Preview */}
              <div className="form-group">
                <label className="form-label">Preview</label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'var(--color-bg)',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    {formData.icon && (
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {formData.icon}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                      }}
                    >
                      {formData.value || '0'}
                      {formData.suffix && (
                        <span style={{ fontSize: '1.5rem' }}>
                          {formData.suffix}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-light)',
                        marginTop: '0.25rem',
                      }}
                    >
                      {formData.label || 'Label'}
                    </div>
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
                    createStatistic.isPending || updateStatistic.isPending
                  }
                >
                  <FiCheck />
                  {editingStatistic ? 'Update Statistic' : 'Create Statistic'}
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
                {statistics.length} statistic
                {statistics.length !== 1 ? 's' : ''} configured
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <FiPlus />
                Add Statistic
              </button>
            </div>

            {statistics.length === 0 ? (
              <div className="empty-state">
                <FiTrendingUp className="empty-state-icon" />
                <h3 className="empty-state-title">No statistics found</h3>
                <p className="empty-state-description">
                  Add statistics to showcase your business achievements on the
                  homepage.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <FiPlus />
                  Add Your First Statistic
                </button>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Statistic</th>
                    <th>Value</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map(statistic => (
                      <tr key={statistic.id}>
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
                            {statistic.icon && (
                              <span style={{ fontSize: '1.5rem' }}>
                                {statistic.icon}
                              </span>
                            )}
                            <span style={{ fontWeight: 500 }}>
                              {statistic.label}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                            }}
                          >
                            {statistic.value}
                            {statistic.suffix && (
                              <span style={{ fontSize: '0.875rem' }}>
                                {statistic.suffix}
                              </span>
                            )}
                          </span>
                        </td>
                        <td>{statistic.displayOrder}</td>
                        <td>
                          <span
                            className={`status-badge ${statistic.isActive ? 'active' : 'inactive'}`}
                          >
                            {statistic.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(statistic)}
                              title="Edit"
                            >
                              <FiEdit3 />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => setDeleteConfirm(statistic.id)}
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
                <h3 className="confirm-title">Delete Statistic</h3>
                <p className="confirm-message">
                  Are you sure you want to delete this statistic? This action
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
                    disabled={deleteStatistic.isPending}
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

export default StatisticsManagement;
