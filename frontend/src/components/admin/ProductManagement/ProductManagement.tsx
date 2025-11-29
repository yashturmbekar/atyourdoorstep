import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiDownload,
  FiUpload,
  FiPackage,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiCopy,
} from 'react-icons/fi';
import { productApi } from '../../../services/adminApi';
import { useCategories } from '../../../hooks/useContent';
import type { Product, PaginatedResponse } from '../../../types';
import {
  TableSkeleton,
  ToastProvider,
  useToast,
  ConfirmModal,
  EmptyState,
} from '../ui';
import './ProductManagement.css';

// Inner component that uses toast hook
const ProductManagementContent: React.FC = () => {
  const toast = useToast();
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
    stockStatus: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'single' | 'bulk';
    productId?: string;
    productName?: string;
  } | null>(null);

  // Fetch categories from database
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

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

    // Open confirmation modal instead of window.confirm
    setDeleteConfirm({
      type: 'bulk',
    });
  };

  const confirmBulkDelete = async () => {
    try {
      // Delete each selected product
      const deletePromises = Array.from(selectedProducts).map(id =>
        productApi.deleteProduct(id)
      );
      await Promise.all(deletePromises);

      toast.success(
        'Products Deleted',
        `Successfully deleted ${selectedProducts.size} product(s)`
      );
      setSelectedProducts(new Set());
      setDeleteConfirm(null);
      loadProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Error', 'Error deleting products. Please try again.');
      setDeleteConfirm(null);
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
      toast.success(
        'Status Updated',
        `${selectedProducts.size} product(s) ${status === 'active' ? 'activated' : 'deactivated'} successfully`
      );
      setSelectedProducts(new Set());
      loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Error', 'Error updating product status. Please try again.');
    }
  };

  const handleDeleteProduct = async (
    productId: string,
    productName: string
  ) => {
    setDeleteConfirm({
      type: 'single',
      productId,
      productName,
    });
  };

  const confirmSingleDelete = async () => {
    if (!deleteConfirm?.productId) return;

    try {
      await productApi.deleteProduct(deleteConfirm.productId);
      toast.success(
        'Product Deleted',
        `"${deleteConfirm.productName}" deleted successfully`
      );
      setDeleteConfirm(null);
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error', 'Error deleting product. Please try again.');
      setDeleteConfirm(null);
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    try {
      const duplicateData = {
        name: `${product.name} (Copy)`,
        category: product.category,
        description: product.description,
        image: product.image,
        features: product.features || [],
        isActive: false, // Start as inactive
        tags: product.tags || [],
        variants: product.variants.map(v => ({
          size: v.size,
          price: v.price,
          unit: v.unit,
          inStock: v.inStock,
          stockQuantity: v.stockQuantity || 0,
          sku: `${v.sku}-COPY`,
          costPrice: v.costPrice || 0,
          discountPrice: v.discountPrice,
        })),
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
        weight: product.weight || 0,
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
      };
      await productApi.createProduct(duplicateData);
      toast.success(
        'Product Duplicated',
        `"${product.name}" duplicated successfully`
      );
      loadProducts();
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast.error('Error', 'Error duplicating product. Please try again.');
    }
  };

  const handleQuickStatusToggle = async (product: Product) => {
    try {
      await productApi.updateProduct(product.id, {
        isActive: !product.isActive,
      });
      toast.success(
        'Status Updated',
        `"${product.name}" ${!product.isActive ? 'activated' : 'deactivated'} successfully`
      );
      loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Error', 'Error updating product status');
    }
  };

  const handleExportProducts = () => {
    // Export products as CSV
    const headers = [
      'ID',
      'Name',
      'Category',
      'Price Range',
      'Stock',
      'Status',
    ];
    const csvData = products.map(p => {
      const priceRange =
        p.variants.length > 0
          ? `${Math.min(...p.variants.map(v => v.price))} - ${Math.max(...p.variants.map(v => v.price))}`
          : 'N/A';
      const totalStock = p.variants.reduce(
        (sum, v) => sum + (v.stockQuantity || 0),
        0
      );
      return [
        p.id,
        p.name,
        p.category,
        priceRange,
        totalStock,
        p.isActive ? 'Active' : 'Inactive',
      ];
    });

    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(
      'Export Complete',
      `Exported ${products.length} products to CSV`
    );
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
          <div className="page-header-content">
            <h1 className="page-title">Product Management</h1>
            <p className="page-subtitle">Manage your product catalog</p>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="products-table-container">
          <TableSkeleton rows={8} columns={7} />
        </div>
      </div>
    );
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Product Management</h1>
          <p className="page-subtitle">
            Manage your product catalog • {pagination.total} total products
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="icon-button"
            onClick={loadProducts}
            title="Refresh"
          >
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="product-stats">
        <div className="stat-card">
          <div className="stat-icon products">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">{pagination.total}</div>
            <div className="stat-label">Total Products</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon active">
            <FiCheck />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {products.filter(p => p.isActive).length}
            </div>
            <div className="stat-label">Active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon low-stock">
            <FiPackage />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {
                products.filter(p => {
                  const stock = p.variants.reduce(
                    (s, v) => s + (v.stockQuantity || 0),
                    0
                  );
                  return stock > 0 && stock < 10;
                }).length
              }
            </div>
            <div className="stat-label">Low Stock</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon out-of-stock">
            <FiX />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {
                products.filter(p => {
                  const stock = p.variants.reduce(
                    (s, v) => s + (v.stockQuantity || 0),
                    0
                  );
                  return stock === 0;
                }).length
              }
            </div>
            <div className="stat-label">Out of Stock</div>
          </div>
        </div>
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
            Import
          </button>
          <button className="secondary-button" onClick={handleExportProducts}>
            <FiDownload />
            Export
          </button>
        </div>

        {selectedProducts.size > 0 && (
          <div className="bulk-actions-inline">
            <span className="selected-count">
              {selectedProducts.size} selected
            </span>
            <button
              className="bulk-btn success"
              onClick={() => handleBulkStatusUpdate('active')}
            >
              <FiCheck /> Activate
            </button>
            <button
              className="bulk-btn warning"
              onClick={() => handleBulkStatusUpdate('inactive')}
            >
              <FiX /> Deactivate
            </button>
            <button className="bulk-btn danger" onClick={handleBulkDelete}>
              <FiTrash2 /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="products-filters">
        <div className="filters-row">
          <div className="filter-group search-group">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="filter-input search-input"
                placeholder="Search by name, description, or SKU..."
                value={filters.search}
                onChange={e => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
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
            <select
              className="filter-select"
              value={filters.stockStatus}
              onChange={e => handleFilterChange('stockStatus', e.target.value)}
            >
              <option value="">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={e => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Sort by Stock</option>
              <option value="created">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        {selectedProducts.size > 0 && (
          <div className="bulk-actions">
            <div className="bulk-actions-text">
              <FiCheck className="bulk-check-icon" />
              {selectedProducts.size} product(s) selected
            </div>
            <div className="bulk-actions-buttons">
              <button
                className="bulk-button success"
                onClick={() => handleBulkStatusUpdate('active')}
              >
                <FiCheck /> Activate
              </button>
              <button
                className="bulk-button warning"
                onClick={() => handleBulkStatusUpdate('inactive')}
              >
                <FiX /> Deactivate
              </button>
              <button className="bulk-button danger" onClick={handleBulkDelete}>
                <FiTrash2 /> Delete Selected
              </button>
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <EmptyState
            icon={<FiPackage />}
            title="No products found"
            description={
              filters.search || filters.category || filters.status
                ? 'No products match your search criteria. Try adjusting your filters.'
                : 'Get started by adding your first product to the catalog.'
            }
            action={
              !filters.search && !filters.category && !filters.status ? (
                <Link to="/admin/products/new" className="primary-button">
                  <FiPlus />
                  Add Your First Product
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <table className="products-table">
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.size === products.length &&
                        products.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="col-product">Product</th>
                  <th className="col-category">Category</th>
                  <th className="col-price">Price</th>
                  <th className="col-stock">Stock</th>
                  <th className="col-status">Status</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => {
                  const name = product.name || 'Unnamed Product';
                  const categorySlug = product.category || '';
                  const categoryObj = categories.find(
                    c => c.slug === categorySlug || c.name === categorySlug
                  );
                  const categoryName =
                    categoryObj?.name || categorySlug || 'Uncategorized';
                  const categoryImage = categoryObj?.imageUrl || '';
                  const productImage =
                    product.image && product.image !== '/images/placeholder.png'
                      ? product.image
                      : categoryImage || '/images/products/default.jpg';
                  const variants = product.variants || [];
                  const tags = product.tags || [];

                  const minPrice =
                    variants.length > 0
                      ? Math.min(...variants.map(v => v.price))
                      : 0;
                  const maxPrice =
                    variants.length > 0
                      ? Math.max(...variants.map(v => v.price))
                      : 0;
                  const priceText =
                    variants.length > 0
                      ? minPrice === maxPrice
                        ? formatCurrency(minPrice)
                        : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
                      : 'N/A';

                  const totalStock = variants.reduce(
                    (sum, v) => sum + (v.stockQuantity || 0),
                    0
                  );
                  const stockStatus = getStockStatus(product);

                  return (
                    <tr
                      key={product.id}
                      className={
                        selectedProducts.has(product.id) ? 'row-selected' : ''
                      }
                    >
                      <td className="col-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="col-product">
                        <div className="product-cell">
                          <img
                            src={productImage}
                            alt={name}
                            className="product-thumb"
                            onError={e => {
                              (e.target as HTMLImageElement).src =
                                '/images/products/default.jpg';
                            }}
                          />
                          <div className="product-info">
                            <span className="product-name">{name}</span>
                            <span className="product-meta">
                              {variants.length} variant
                              {variants.length !== 1 ? 's' : ''} • {tags.length}{' '}
                              tag{tags.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="col-category">
                        <span className="category-pill">{categoryName}</span>
                      </td>
                      <td className="col-price">
                        <span className="price-text">{priceText}</span>
                      </td>
                      <td className="col-stock">
                        <div className="stock-cell">
                          <span className="stock-count">
                            {totalStock} units
                          </span>
                          <span className={`stock-pill ${stockStatus.status}`}>
                            {stockStatus.label}
                          </span>
                        </div>
                      </td>
                      <td className="col-status">
                        <button
                          className={`status-btn ${product.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleQuickStatusToggle(product)}
                        >
                          {product.isActive ? (
                            <>
                              <FiCheck size={14} /> Active
                            </>
                          ) : (
                            <>
                              <FiX size={14} /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="col-actions">
                        <div className="action-buttons">
                          <Link
                            to={`/admin/products/${product.id}`}
                            className="action-btn view"
                            title="View"
                          >
                            <FiEye size={16} />
                          </Link>
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="action-btn edit"
                            title="Edit"
                          >
                            <FiEdit3 size={16} />
                          </Link>
                          <button
                            className="action-btn duplicate"
                            onClick={() => handleDuplicateProduct(product)}
                            title="Duplicate"
                          >
                            <FiCopy size={16} />
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() =>
                              handleDeleteProduct(product.id, name)
                            }
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={
          deleteConfirm?.type === 'bulk'
            ? confirmBulkDelete
            : confirmSingleDelete
        }
        title={
          deleteConfirm?.type === 'bulk'
            ? 'Delete Selected Products'
            : 'Delete Product'
        }
        message={
          deleteConfirm?.type === 'bulk'
            ? `Are you sure you want to delete ${selectedProducts.size} selected product(s)? This action cannot be undone.`
            : `Are you sure you want to delete "${deleteConfirm?.productName}"? This action cannot be undone.`
        }
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
};

// Wrapper component with ToastProvider
const ProductManagement: React.FC = () => {
  return (
    <ToastProvider>
      <ProductManagementContent />
    </ToastProvider>
  );
};

export default ProductManagement;
