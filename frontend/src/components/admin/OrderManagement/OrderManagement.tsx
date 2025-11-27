import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit3,
  FiPrinter,
  FiDownload,
  FiShoppingCart,
  FiMoreVertical,
} from 'react-icons/fi';
import { orderApi } from '../../../services/adminApi';
import type { Order, PaginatedResponse, OrderFilters } from '../../../types';
import './OrderManagement.css';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: [],
    paymentStatus: [],
    dateRange: undefined,
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
        const response: PaginatedResponse<Order> = await orderApi.getOrders(
          pagination.page,
          pagination.limit,
          filters
        );

        setOrders(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        }));
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order['status']
  ) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      // Reload orders to reflect changes
      const response: PaginatedResponse<Order> = await orderApi.getOrders(
        pagination.page,
        pagination.limit,
        filters
      );
      setOrders(response.data);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    }
  };

  const handleBulkStatusUpdate = async (status: Order['status']) => {
    if (selectedOrders.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to update ${selectedOrders.size} selected order(s) to ${status}?`
    );

    if (confirmed) {
      try {
        await orderApi.bulkUpdateOrderStatus(
          Array.from(selectedOrders),
          status
        );
        setSelectedOrders(new Set());
        // Reload orders
        const response: PaginatedResponse<Order> = await orderApi.getOrders(
          pagination.page,
          pagination.limit,
          filters
        );
        setOrders(response.data);
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Error updating order status. Please try again.');
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPaymentStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      pending: 'pending',
      paid: 'paid',
      failed: 'failed',
      refunded: 'refunded',
    };
    return statusClasses[status] || 'pending';
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
          {pagination.total} orders
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
      <div className="order-management">
        <div className="page-header">
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">
            Manage customer orders and track deliveries
          </p>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}
        >
          <div
            style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}
          >
            Loading orders...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1 className="page-title">Order Management</h1>
        <p className="page-subtitle">
          Manage customer orders and track deliveries
        </p>
      </div>

      {/* Header Actions */}
      <div className="orders-header">
        <div className="orders-actions">
          <button className="secondary-button">
            <FiDownload />
            Export Orders
          </button>
          <button className="secondary-button">
            <FiPrinter />
            Print Orders
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="orders-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Search Orders</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="filter-input"
                placeholder="Search by order ID, customer name, or phone..."
                value={filters.search || ''}
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
            <label className="filter-label">Order Status</label>
            <select
              className="filter-select"
              onChange={e => {
                const status = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  status: status ? [status as Order['status']] : [],
                }));
              }}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Payment Status</label>
            <select
              className="filter-select"
              onChange={e => {
                const paymentStatus = e.target.value;
                setFilters(prev => ({
                  ...prev,
                  paymentStatus: paymentStatus
                    ? [paymentStatus as Order['paymentStatus']]
                    : [],
                }));
              }}
            >
              <option value="">All Payment Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <input
              type="date"
              className="filter-input"
              onChange={e => {
                // Simple date filter - you can enhance this with a date range picker
                const date = new Date(e.target.value);
                setFilters(prev => ({
                  ...prev,
                  dateRange: {
                    from: date,
                    to: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Next day
                  },
                }));
              }}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Per Page</label>
            <select
              className="filter-select"
              value={pagination.limit}
              onChange={e =>
                setPagination(prev => ({
                  ...prev,
                  limit: Number(e.target.value),
                  page: 1,
                }))
              }
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
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

      {/* Orders Table */}
      <div className="orders-table-container">
        {selectedOrders.size > 0 && (
          <div className="bulk-actions">
            <div className="bulk-actions-text">
              {selectedOrders.size} order(s) selected
            </div>
            <div className="bulk-actions-buttons">
              <button
                className="bulk-button primary"
                onClick={() => handleBulkStatusUpdate('confirmed')}
              >
                Confirm Orders
              </button>
              <button
                className="bulk-button success"
                onClick={() => handleBulkStatusUpdate('processing')}
              >
                Mark Processing
              </button>
              <button
                className="bulk-button secondary"
                onClick={() => handleBulkStatusUpdate('shipped')}
              >
                Mark Shipped
              </button>
              <button
                className="bulk-button secondary"
                onClick={() => handleBulkStatusUpdate('delivered')}
              >
                Mark Delivered
              </button>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <FiShoppingCart className="empty-state-icon" />
            <h3 className="empty-state-title">No orders found</h3>
            <p className="empty-state-description">
              No orders match your current filters. Try adjusting your search
              criteria.
            </p>
          </div>
        ) : (
          <>
            <table className="orders-table">
              <thead className="table-header">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedOrders.size === orders.length &&
                        orders.length > 0
                      }
                      onChange={handleSelectAll}
                      style={{ margin: 0 }}
                    />
                  </th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="table-row">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        style={{ margin: 0 }}
                      />
                    </td>
                    <td>
                      <div className="order-info">
                        <div className="order-id">#{order.id}</div>
                        <div className="order-date">
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">
                          {order.customerInfo.name}
                        </div>
                        <div className="customer-contact">
                          {order.customerInfo.phone}
                        </div>
                        {order.customerInfo.email && (
                          <div className="customer-contact">
                            {order.customerInfo.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="order-items">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="order-item">
                            <span className="item-name">
                              {item.productName}
                            </span>
                            <span className="item-quantity">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="order-item">
                            <span className="item-name">
                              +{order.items.length - 2} more items
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="order-total">
                        {formatCurrency(order.total)}
                      </div>
                    </td>
                    <td>
                      <select
                        className="status-select"
                        value={order.status}
                        onChange={e =>
                          handleStatusUpdate(
                            order.id,
                            e.target.value as Order['status']
                          )
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div>
                        <span
                          className={`payment-status ${getPaymentStatusClass(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                        <div className="payment-method">
                          {order.paymentMethod}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="actions-menu">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="action-button view"
                          title="View Order Details"
                        >
                          <FiEye />
                        </Link>
                        <Link
                          to={`/admin/orders/${order.id}/edit`}
                          className="action-button edit"
                          title="Edit Order"
                        >
                          <FiEdit3 />
                        </Link>
                        <button
                          className="action-button print"
                          title="Print Order"
                          onClick={() => window.print()}
                        >
                          <FiPrinter />
                        </button>
                        <button className="action-button" title="More Actions">
                          <FiMoreVertical />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
