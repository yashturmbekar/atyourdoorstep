/**
 * USP Items Management Component
 * Admin interface for managing Unique Selling Points
 * Following Clean Architecture and instruction file standards
 */

import React, { useState } from 'react';
import {
  useUspItems,
  useCreateUspItem,
  useUpdateUspItem,
  useDeleteUspItem,
} from '../../../hooks/useContent';
import type {
  UspItemResponseDto,
  CreateUspItemRequestDto,
  UpdateUspItemRequestDto,
} from '../../../types/content.types';
import './ContentManagement.css';

interface UspFormData {
  icon: string;
  title: string;
  description: string;
  displayOrder: number;
  isActive: boolean;
}

const initialFormData: UspFormData = {
  icon: '',
  title: '',
  description: '',
  displayOrder: 0,
  isActive: true,
};

const UspItemsManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<UspItemResponseDto | null>(
    null
  );
  const [formData, setFormData] = useState<UspFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // React Query hooks
  const { data: uspItemsData, isLoading, error } = useUspItems();
  const createMutation = useCreateUspItem();
  const updateMutation = useUpdateUspItem();
  const deleteMutation = useDeleteUspItem();

  const uspItems = uspItemsData?.data || [];

  const handleOpenModal = (item?: UspItemResponseDto) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        icon: item.icon || '',
        title: item.title,
        description: item.description,
        displayOrder: item.displayOrder,
        isActive: item.isActive,
      });
    } else {
      setEditingItem(null);
      setFormData({
        ...initialFormData,
        displayOrder: uspItems.length + 1,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem) {
        const updateData: UpdateUspItemRequestDto = { ...formData };
        await updateMutation.mutateAsync({
          id: editingItem.id,
          data: updateData,
        });
      } else {
        const createData: CreateUspItemRequestDto = { ...formData };
        await createMutation.mutateAsync(createData);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save USP item:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete USP item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="loading-state">Loading USP items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="error-state">
          Failed to load USP items. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="content-header">
        <div>
          <h1>USP Items Management</h1>
          <p>Manage your Unique Selling Points displayed on the homepage</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          Add USP Item
        </button>
      </div>

      <div className="content-table-container">
        <table className="content-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Icon</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uspItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No USP items found. Add your first item to get started.
                </td>
              </tr>
            ) : (
              uspItems.map(item => (
                <tr key={item.id}>
                  <td>{item.displayOrder}</td>
                  <td>
                    <span className="icon-preview">{item.icon}</span>
                  </td>
                  <td>{item.title}</td>
                  <td className="description-cell">{item.description}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        item.isActive ? 'status-active' : 'status-inactive'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenModal(item)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => setDeleteConfirm(item.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit USP Item' : 'Add USP Item'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="icon">Icon (emoji or icon class)</label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="e.g., 🚚 or fa-truck"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Fast Delivery"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of this USP"
                  rows={3}
                  required
                />
              </div>
              <div className="form-row">
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
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingItem
                      ? 'Update'
                      : 'Create'}
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
              Are you sure you want to delete this USP item? This action cannot
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
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UspItemsManagement;
