/**
 * Category Management Component
 * Admin interface for managing product categories
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiGrid,
  FiArrowLeft,
  FiCheck,
} from 'react-icons/fi';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../../../hooks/useContent';
import type {
  CategoryResponseDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '../../../types/content.types';
import {
  TableSkeleton,
  ToastProvider,
  useToast,
  Breadcrumb,
  EmptyState,
  Button,
} from '../ui';
import './ContentManagement.css';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
  parentId: string;
}

const initialFormData: CategoryFormData = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  imageUrl: '',
  displayOrder: 0,
  isActive: true,
  parentId: '',
};

// Breadcrumb items for navigation
const breadcrumbItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Content', href: '/admin/content' },
  { label: 'Categories', href: '/admin/content/categories' },
];

// Inner component that uses toast hook
const CategoryManagementContent: React.FC = () => {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponseDto | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // React Query hooks
  const { data: categoriesData, isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData?.data || [];

  const filteredCategories = categories.filter(
    category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

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

    // Auto-generate slug from name
    if (name === 'name' && !editingCategory) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required image
    if (!formData.imageUrl || formData.imageUrl.trim() === '') {
      toast.error(
        'Image Required',
        'Category image is required. Please provide an image URL.'
      );
      return;
    }

    try {
      if (editingCategory) {
        const updateData: UpdateCategoryRequestDto = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          icon: formData.icon || undefined,
          imageUrl: formData.imageUrl,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
          parentId: formData.parentId || undefined,
        };
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: updateData,
        });
        toast.success(
          'Category Updated',
          `Category "${formData.name}" updated successfully`
        );
      } else {
        const createData: CreateCategoryRequestDto = {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          icon: formData.icon || undefined,
          imageUrl: formData.imageUrl,
          displayOrder: formData.displayOrder,
          isActive: formData.isActive,
          parentId: formData.parentId || undefined,
        };
        await createCategory.mutateAsync(createData);
        toast.success(
          'Category Created',
          `Category "${formData.name}" created successfully`
        );
      }

      setShowForm(false);
      setEditingCategory(null);
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error saving category:', err);
      toast.error('Error', 'Error saving category. Please try again.');
    }
  };

  const handleEdit = (category: CategoryResponseDto) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '',
      imageUrl: category.imageUrl || '',
      displayOrder: category.displayOrder,
      isActive: category.isActive,
      parentId: '', // Note: parentId not in response, may need to add
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    try {
      await deleteCategory.mutateAsync(id);
      toast.success(
        'Category Deleted',
        `Category "${categoryToDelete?.name || ''}" deleted successfully`
      );
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Error', 'Error deleting category. Please try again.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData(initialFormData);
  };

  if (isLoading) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Category Management</h1>
          <p className="page-subtitle">Loading categories...</p>
        </div>
        <div className="data-table-container">
          <TableSkeleton rows={6} columns={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-management">
        <div className="page-header">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="page-title">Category Management</h1>
        </div>
        <EmptyState
          icon={<FiGrid />}
          title="Error loading categories"
          description="There was an error loading the categories. Please try again later."
          action={
            <Link to="/admin/content" className="btn btn-ghost">
              <FiArrowLeft />
              Back to Content
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="content-management">
      <div className="page-header">
        <Breadcrumb items={breadcrumbItems} />
        <div className="page-header-row">
          <Link to="/admin/content" className="btn btn-ghost">
            <FiArrowLeft />
            Back to Content
          </Link>
        </div>
        <h1 className="page-title">Category Management</h1>
        <p className="page-subtitle">
          Manage product categories and subcategories
        </p>
      </div>

      {showForm ? (
        <div className="content-form">
          <div className="form-section">
            <h3 className="form-section-title">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label required">
                  Category Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="slug" className="form-label required">
                  URL Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  className="form-input"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="category-url-slug"
                  required
                />
                <p className="form-hint">
                  Used in URLs: /products/{formData.slug || 'category-slug'}
                </p>
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
                  placeholder="Enter category description"
                  rows={3}
                />
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
                    placeholder="Icon class or emoji"
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
                <label htmlFor="imageUrl" className="form-label required">
                  Image URL
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  className="form-input"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                <p className="form-hint">
                  Category image is required. Use a high-quality image for
                  better presentation.
                </p>
                {formData.imageUrl && (
                  <div className="image-preview-container">
                    <img
                      src={formData.imageUrl}
                      alt="Category preview"
                      className="image-preview large"
                      onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
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
                  <label htmlFor="isActive">Active (visible on website)</label>
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
                    createCategory.isPending || updateCategory.isPending
                  }
                >
                  <FiCheck />
                  {editingCategory ? 'Update Category' : 'Create Category'}
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
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <FiPlus />
                Add Category
              </button>
            </div>

            {filteredCategories.length === 0 ? (
              <EmptyState
                icon={<FiGrid />}
                title="No categories found"
                description={
                  searchTerm
                    ? 'No categories match your search. Try a different search term.'
                    : 'Get started by creating your first category.'
                }
                action={
                  !searchTerm ? (
                    <Button
                      variant="primary"
                      onClick={() => setShowForm(true)}
                      icon={<FiPlus />}
                    >
                      Add Your First Category
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Slug</th>
                    <th>Products</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map(category => (
                    <tr key={category.id}>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                          }}
                        >
                          {category.imageUrl && (
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="image-preview"
                            />
                          )}
                          <div>
                            <div style={{ fontWeight: 500 }}>
                              {category.name}
                            </div>
                            {category.description && (
                              <div
                                style={{
                                  fontSize: '0.75rem',
                                  color: 'var(--color-text-light)',
                                }}
                              >
                                {category.description.substring(0, 50)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <code
                          style={{
                            fontSize: '0.75rem',
                            background: 'var(--color-bg)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                          }}
                        >
                          {category.slug}
                        </code>
                      </td>
                      <td>{category.productCount}</td>
                      <td>{category.displayOrder}</td>
                      <td>
                        <span
                          className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}
                        >
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn edit"
                            onClick={() => handleEdit(category)}
                            title="Edit"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => setDeleteConfirm(category.id)}
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
                <h3 className="confirm-title">Delete Category</h3>
                <p className="confirm-message">
                  Are you sure you want to delete this category? This action
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
                    disabled={deleteCategory.isPending}
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

// Wrapper component with ToastProvider
function CategoryManagement() {
  return (
    <ToastProvider>
      <CategoryManagementContent />
    </ToastProvider>
  );
}

export default CategoryManagement;
