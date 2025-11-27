import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiDownload,
  FiUpload,
  FiMoreVertical,
  FiPackage,
} from 'react-icons/fi';
import { productApi } from '../../../services/adminApi';
import type { Product, PaginatedResponse } from '../../../types';
import './ProductManagement.css';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    sortBy: 'name',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response: PaginatedResponse<Product> =
          await productApi.getProducts(
            pagination.page,
            pagination.limit,
            filters.search,
            filters.category,
            filters.status as 'active' | 'inactive'
          );

        setProducts(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        }));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters, pagination.page, pagination.limit]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response: PaginatedResponse<Product> = await productApi.getProducts(
        pagination.page,
        pagination.limit,
        filters.search,
        filters.category,
        filters.status as 'active' | 'inactive'
      );

      setProducts(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages,
      }));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedProducts.size} selected product(s)? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        // Delete each selected product
        const deletePromises = Array.from(selectedProducts).map(id =>
          productApi.deleteProduct(id)
        );
        await Promise.all(deletePromises);

        setSelectedProducts(new Set());
        loadProducts();
      } catch (error) {
        console.error('Error deleting products:', error);
        alert('Error deleting products. Please try again.');
      }
    }
  };

  const handleBulkStatusUpdate = async (status: 'active' | 'inactive') => {
    if (selectedProducts.size === 0) return;

    try {
      const updates = Array.from(selectedProducts).map(id => ({
        id,
        data: { isActive: status === 'active' },
      }));

      await productApi.bulkUpdateProducts(updates);
      setSelectedProducts(new Set());
      loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      alert('Error updating product status. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone.'
    );

    if (confirmed) {
      try {
        await productApi.deleteProduct(productId);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const getStockStatus = (product: Product) => {
    const totalStock = product.variants.reduce(
      (sum, variant) => sum + (variant.stockQuantity || 0),
      0
    );

    if (totalStock === 0)
      return { status: 'out-of-stock', label: 'Out of Stock' };
    if (totalStock < 10) return { status: 'low-stock', label: 'Low Stock' };
    return { status: 'in-stock', label: 'In Stock' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPages = Math.min(pagination.totalPages, 5);
    const startPage = Math.max(1, pagination.page - 2);
    const endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${i === pagination.page ? 'active' : ''}`}
          onClick={() => setPagination(prev => ({ ...prev, page: i }))}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <div className="pagination-info">
          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
          {pagination.total} products
        </div>
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() =>
              setPagination(prev => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          {pages}
          <button
            className="pagination-button"
            onClick={() =>
              setPagination(prev => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="product-management">
        <div className="page-header">
          <h1 className="page-title">Product Management</h1>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}
        >
          <div
            style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}
          >
            Loading products...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h1 className="page-title">Product Management</h1>
        <p className="page-subtitle">Manage your product catalog</p>
      </div>

      {/* Header Actions */}
      <div className="products-header">
        <div className="products-actions">
          <Link to="/admin/products/new" className="primary-button">
            <FiPlus />
            Add Product
          </Link>
          <button className="secondary-button">
            <FiUpload />
            Import Products
          </button>
          <button className="secondary-button">
            <FiDownload />
            Export Products
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="products-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Search Products</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="filter-input"
                placeholder="Search by name, description, or SKU..."
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <FiSearch
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-light)',
                }}
              />
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Category</label>
            <select
              className="filter-select"
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="alphonso">Alphonso Mangoes</option>
              <option value="jaggery">Jaggery Products</option>
              <option value="oil">Cold Pressed Oils</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select
              className="filter-select"
              value={filters.status}
              onChange={e => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Sort By</label>
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
              <option value="created">Date Created</option>
            </select>
          </div>

          <div className="filter-group">
            <button className="secondary-button">
              <FiFilter />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        {selectedProducts.size > 0 && (
          <div className="bulk-actions">
            <div className="bulk-actions-text">
              {selectedProducts.size} product(s) selected
            </div>
            <div className="bulk-actions-buttons">
              <button
                className="bulk-button secondary"
                onClick={() => handleBulkStatusUpdate('active')}
              >
                Activate
              </button>
              <button
                className="bulk-button secondary"
                onClick={() => handleBulkStatusUpdate('inactive')}
              >
                Deactivate
              </button>
              <button className="bulk-button danger" onClick={handleBulkDelete}>
                Delete
              </button>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="empty-state">
            <FiPackage className="empty-state-icon" />
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-description">
              Get started by adding your first product to the catalog.
            </p>
            <Link to="/admin/products/new" className="primary-button">
              <FiPlus />
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            <table className="products-table">
              <thead className="table-header">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.size === products.length &&
                        products.length > 0
                      }
                      onChange={handleSelectAll}
                      style={{ margin: 0 }}
                    />
                  </th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price Range</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const stockInfo = getStockStatus(product);
                  const priceRange =
                    product.variants.length > 0
                      ? `${formatCurrency(Math.min(...product.variants.map(v => v.price)))} - ${formatCurrency(Math.max(...product.variants.map(v => v.price)))}`
                      : 'N/A';
                  const totalStock = product.variants.reduce(
                    (sum, variant) => sum + (variant.stockQuantity || 0),
                    0
                  );

                  return (
                    <tr key={product.id} className="table-row">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          style={{ margin: 0 }}
                        />
                      </td>
                      <td>
                        <div className="product-info">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                            onError={e => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-product.png';
                            }}
                          />
                          <div className="product-details">
                            <div className="product-name">{product.name}</div>
                            <div className="product-category">
                              {product.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>
                        {product.category}
                      </td>
                      <td>{priceRange}</td>
                      <td>
                        <div className="stock-info">
                          <div className="stock-count">{totalStock} units</div>
                          <div className={`stock-status ${stockInfo.status}`}>
                            {stockInfo.label}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`product-status ${product.isActive ? 'active' : 'inactive'}`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="actions-menu">
                          <Link
                            to={`/admin/products/${product.id}`}
                            className="action-button view"
                            title="View Product"
                          >
                            <FiEye />
                          </Link>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="action-button edit"
                            title="Edit Product"
                          >
                            <FiEdit3 />
                          </Link>
                          <button
                            className="action-button delete"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete Product"
                          >
                            <FiTrash2 />
                          </button>
                          <button
                            className="action-button"
                            title="More Actions"
                          >
                            <FiMoreVertical />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
