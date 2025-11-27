import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiPlus,
  FiEye,
  FiAlertTriangle,
  FiUsers,
  FiCalendar,
} from 'react-icons/fi';
import { analyticsApi } from '../../../services/adminApi';
import type { AdminStats, Order } from '../../../types';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerInfo: {
        name: 'John Doe',
        phone: '9876543210',
        email: 'john@example.com',
        address: '123 Main St, Andheri',
        city: 'Mumbai',
        pincode: '400001',
      },
      items: [
        {
          productId: 'PROD-001',
          productName: 'Alphonso Mangoes',
          variantId: 'VAR-001',
          variantSize: '2 dozen',
          price: 800,
          quantity: 2,
          total: 1600,
        },
      ],
      subtotal: 1600,
      deliveryCharge: 50,
      total: 1650,
      status: 'pending',
      orderDate: new Date('2024-12-28'),
      createdAt: new Date('2024-12-28'),
      updatedAt: new Date('2024-12-28'),
      estimatedDelivery: new Date('2024-12-30'),
      paymentStatus: 'pending',
      paymentMethod: 'cod',
      assignedTo: 'Delivery Agent #1',
    },
    {
      id: 'ORD-002',
      customerInfo: {
        name: 'Jane Smith',
        phone: '9876543211',
        email: 'jane@example.com',
        address: '456 Oak Ave, CP',
        city: 'Delhi',
        pincode: '110001',
      },
      items: [
        {
          productId: 'PROD-002',
          productName: 'Cold Pressed Sunflower Oil',
          variantId: 'VAR-002',
          variantSize: '1L',
          price: 1200,
          quantity: 2,
          total: 2400,
        },
      ],
      subtotal: 2400,
      deliveryCharge: 50,
      total: 2450,
      status: 'confirmed',
      orderDate: new Date('2024-12-27'),
      createdAt: new Date('2024-12-27'),
      updatedAt: new Date('2024-12-27'),
      estimatedDelivery: new Date('2024-12-29'),
      trackingNumber: 'TRK123456789',
      paymentStatus: 'paid',
      paymentMethod: 'online',
      assignedTo: 'Delivery Agent #2',
    },
    {
      id: 'ORD-003',
      customerInfo: {
        name: 'Raj Patel',
        phone: '9876543212',
        email: 'raj@example.com',
        address: '789 MG Road, Koramangala',
        city: 'Bangalore',
        pincode: '560034',
      },
      items: [
        {
          productId: 'PROD-003',
          productName: 'Organic Jaggery Powder',
          variantId: 'VAR-003',
          variantSize: '500g',
          price: 300,
          quantity: 2,
          total: 600,
        },
        {
          productId: 'PROD-004',
          productName: 'Cold Pressed Coconut Oil',
          variantId: 'VAR-004',
          variantSize: '500ml',
          price: 450,
          quantity: 1,
          total: 450,
        },
      ],
      subtotal: 1050,
      deliveryCharge: 75,
      total: 1125,
      status: 'shipped',
      orderDate: new Date('2024-12-26'),
      createdAt: new Date('2024-12-26'),
      updatedAt: new Date('2024-12-27'),
      estimatedDelivery: new Date('2024-12-28'),
      trackingNumber: 'TRK987654321',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      assignedTo: 'Delivery Agent #3',
    },
    {
      id: 'ORD-004',
      customerInfo: {
        name: 'Priya Sharma',
        phone: '9876543213',
        email: 'priya@example.com',
        address: '321 Park Street, Salt Lake',
        city: 'Kolkata',
        pincode: '700064',
      },
      items: [
        {
          productId: 'PROD-005',
          productName: 'Kesar Mangoes',
          variantId: 'VAR-005',
          variantSize: '1 dozen',
          price: 600,
          quantity: 1,
          total: 600,
        },
      ],
      subtotal: 600,
      deliveryCharge: 60,
      total: 660,
      status: 'delivered',
      orderDate: new Date('2024-12-25'),
      createdAt: new Date('2024-12-25'),
      updatedAt: new Date('2024-12-26'),
      estimatedDelivery: new Date('2024-12-27'),
      actualDelivery: new Date('2024-12-26'),
      trackingNumber: 'TRK456789123',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      assignedTo: 'Delivery Agent #1',
    },
    {
      id: 'ORD-005',
      customerInfo: {
        name: 'Amit Kumar',
        phone: '9876543214',
        email: 'amit@example.com',
        address: '654 Civil Lines, Model Town',
        city: 'Pune',
        pincode: '411001',
      },
      items: [
        {
          productId: 'PROD-006',
          productName: 'Traditional Ghee',
          variantId: 'VAR-006',
          variantSize: '1kg',
          price: 800,
          quantity: 1,
          total: 800,
        },
        {
          productId: 'PROD-007',
          productName: 'Organic Honey',
          variantId: 'VAR-007',
          variantSize: '500g',
          price: 400,
          quantity: 1,
          total: 400,
        },
      ],
      subtotal: 1200,
      deliveryCharge: 50,
      total: 1250,
      status: 'cancelled',
      orderDate: new Date('2024-12-24'),
      createdAt: new Date('2024-12-24'),
      updatedAt: new Date('2024-12-25'),
      paymentStatus: 'refunded',
      paymentMethod: 'online',
      notes: 'Customer requested cancellation due to address change',
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await analyticsApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
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
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cod':
        return '💵';
      case 'online':
        return '🌐';
      case 'card':
        return '💳';
      case 'upi':
        return '📱';
      default:
        return '💰';
    }
  };

  const getStatusClass = (status: string) => {
    const statusClasses: Record<string, string> = {
      pending: 'pending',
      confirmed: 'confirmed',
      processing: 'processing',
      shipped: 'shipped',
      delivered: 'delivered',
      cancelled: 'cancelled',
    };
    return statusClasses[status] || 'pending';
  };

  if (isLoading) {
    return (
      <div className="admin-dashboard">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div
          style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}
        >
          <div
            style={{ fontSize: '1.125rem', color: 'var(--color-text-light)' }}
          >
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>
      {/* Stats Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Products</div>
            <div className="stat-icon primary">
              <FiPackage />
            </div>
          </div>
          <div className="stat-value">{stats?.totalProducts || 0}</div>
          <div className="stat-change positive">
            <FiTrendingUp />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Orders</div>
            <div className="stat-icon success">
              <FiShoppingCart />
            </div>
          </div>
          <div className="stat-value">{stats?.totalOrders || 0}</div>
          <div className="stat-change positive">
            <FiTrendingUp />
            <span>+8% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-icon success">
              <FiDollarSign />
            </div>
          </div>
          <div className="stat-value">
            {formatCurrency(stats?.totalRevenue || 0)}
          </div>
          <div className="stat-change positive">
            <FiTrendingUp />
            <span>+18% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Low Stock Items</div>
            <div className="stat-icon danger">
              <FiAlertTriangle />
            </div>
          </div>
          <div className="stat-value">{stats?.lowStockProducts || 0}</div>
          <div className="stat-change negative">
            <FiTrendingDown />
            <span>Requires restocking</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Customers</div>
            <div className="stat-icon info">
              <FiUsers />
            </div>
          </div>
          <div className="stat-value">{stats?.totalCustomers || 247}</div>
          <div className="stat-change positive">
            <FiTrendingUp />
            <span>+15% from last month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Orders Today</div>
            <div className="stat-icon warning">
              <FiCalendar />
            </div>
          </div>
          <div className="stat-value">{stats?.ordersToday || 12}</div>
          <div className="stat-change positive">
            <FiTrendingUp />
            <span>+3 from yesterday</span>
          </div>
        </div>
      </div>{' '}
      {/* Main Content */}
      <div className="dashboard-content">
        {/* Quick Actions - Moved above Recent Orders */}
        <div className="dashboard-quick-actions-section">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <Link to="/admin/products/new" className="quick-action">
                <div className="action-icon">
                  <FiPlus />
                </div>
                <div className="action-text">
                  <div className="action-title">Add Product</div>
                  <div className="action-subtitle">Create a new product</div>
                </div>
              </Link>

              <Link to="/admin/orders" className="quick-action">
                <div className="action-icon">
                  <FiEye />
                </div>
                <div className="action-text">
                  <div className="action-title">View Orders</div>
                  <div className="action-subtitle">Manage customer orders</div>
                </div>
              </Link>

              <Link to="/admin/products" className="quick-action">
                <div className="action-icon">
                  <FiPackage />
                </div>
                <div className="action-text">
                  <div className="action-title">Manage Products</div>
                  <div className="action-subtitle">Edit existing products</div>
                </div>
              </Link>

              <Link to="/admin/analytics" className="quick-action">
                <div className="action-icon">
                  <FiTrendingUp />
                </div>
                <div className="action-text">
                  <div className="action-title">View Analytics</div>
                  <div className="action-subtitle">Sales and performance</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Orders</h2>
            <div className="orders-header-actions">
              <select className="orders-filter">
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <Link to="/admin/orders" className="card-action">
                View All <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="orders-summary">
            <div className="summary-item">
              <span className="summary-label">Today's Orders:</span>
              <span className="summary-value">
                {
                  recentOrders.filter(
                    order =>
                      new Date(order.orderDate).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </span>
            </div>
            {/* Removed Pending Orders summary item */}
            <div className="summary-item">
              <span className="summary-label">Processing:</span>
              <span className="summary-value processing">
                {
                  recentOrders.filter(order =>
                    ['confirmed', 'processing', 'shipped'].includes(
                      order.status
                    )
                  ).length
                }
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Value:</span>
              <span className="summary-value">
                {formatCurrency(
                  recentOrders.reduce((sum, order) => sum + order.total, 0)
                )}
              </span>
            </div>
          </div>

          <div className="orders-table-container">
            {/* Enhanced Table Structure */}
            <div className="orders-table">
              {/* Table Header */}
              <div className="orders-table-header">
                <div className="table-header-cell order-header">Order</div>
                <div className="table-header-cell customer-header">
                  Customer
                </div>
                <div className="table-header-cell items-header">Items</div>
                <div className="table-header-cell payment-header">Payment</div>
                <div className="table-header-cell delivery-header">
                  Delivery
                </div>
                <div className="table-header-cell actions-header">Actions</div>
              </div>

              {/* Table Body */}
              <div className="orders-table-body">
                {recentOrders.slice(0, 5).map((order, index) => (
                  <div
                    key={order.id}
                    className="table-row"
                    data-order-index={index}
                  >
                    {/* Order Column */}
                    <div className="table-cell order-cell">
                      <div className="order-id-wrapper">
                        <div className="order-id">#{order.id}</div>
                        <div className="order-date">
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                      <div className="status-wrapper">
                        <span
                          className={`order-status status-${getStatusClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Customer Column */}
                    <div className="table-cell customer-cell">
                      <div className="customer-main">
                        <div className="customer-name">
                          {order.customerInfo.name}
                        </div>
                        <div className="customer-contact">
                          {order.customerInfo.phone}
                        </div>
                      </div>
                      <div className="customer-location">
                        {order.customerInfo.city}, {order.customerInfo.pincode}
                      </div>
                    </div>

                    {/* Items Column */}
                    <div className="table-cell items-cell">
                      <div className="items-summary">
                        <div className="items-count">
                          {order.items.reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}{' '}
                          item
                          {order.items.reduce(
                            (total, item) => total + item.quantity,
                            0
                          ) !== 1
                            ? 's'
                            : ''}
                        </div>
                        <div className="items-details">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="item-line">
                              {item.quantity}× {item.productName}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="items-more">
                              +{order.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Column */}
                    <div className="table-cell payment-cell">
                      <div className="payment-info">
                        <div className="payment-method">
                          <span className="payment-icon">
                            {getPaymentMethodIcon(order.paymentMethod)}
                          </span>
                          <span className="payment-type">
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                        <div className="payment-status-wrapper">
                          <span
                            className={`payment-status status-${order.paymentStatus}`}
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="order-amount">
                          {formatCurrency(order.total)}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Column */}
                    <div className="table-cell delivery-cell">
                      <div className="delivery-info">
                        {order.trackingNumber && (
                          <div className="tracking-info">
                            <span className="tracking-label">Tracking:</span>
                            <span className="tracking-number">
                              {order.trackingNumber}
                            </span>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div className="delivery-date">
                            <span className="delivery-label">
                              {order.status === 'delivered'
                                ? 'Delivered:'
                                : 'Expected:'}
                            </span>
                            <span className="delivery-date-value">
                              {formatDate(
                                order.actualDelivery || order.estimatedDelivery
                              )}
                            </span>
                          </div>
                        )}
                        {order.assignedTo && (
                          <div className="assigned-agent">
                            {order.assignedTo}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="table-cell actions-cell">
                      <div className="action-buttons">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="action-btn view-btn"
                          title="View Order Details"
                        >
                          <FiEye />
                        </Link>
                        {order.status === 'pending' && (
                          <button
                            className="action-btn confirm-btn"
                            title="Confirm Order"
                          >
                            ✓
                          </button>
                        )}
                        {(order.status === 'confirmed' ||
                          order.status === 'processing') && (
                          <button
                            className="action-btn ship-btn"
                            title="Mark as Shipped"
                          >
                            📦
                          </button>
                        )}
                        {order.trackingNumber && (
                          <button
                            className="action-btn track-btn"
                            title="Track Package"
                          >
                            📍
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notes Row (if exists) */}
                    {order.notes && (
                      <div className="table-notes-row">
                        <div className="notes-content">
                          <strong>Note:</strong> {order.notes}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue and Low Stock - Side by side */}
        <div className="dashboard-bottom-section">
          {/* Revenue Chart */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Revenue Overview</h2>
              <Link to="/admin/analytics" className="card-action">
                View Analytics <FiArrowRight />
              </Link>
            </div>
            <div className="chart-container">
              <div>
                Revenue chart will be displayed here (implement with chart
                library)
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Low Stock Alert</h2>
              <Link
                to="/admin/products?filter=low-stock"
                className="card-action"
              >
                View All <FiArrowRight />
              </Link>
            </div>
            <div className="low-stock-items">
              <div className="stock-item">
                <div className="stock-info">
                  <div className="stock-name">Alphonso Mangoes (2 dozen)</div>
                  <div className="stock-sku">SKU: MAN-ALF-2DOZ</div>
                </div>
                <div className="stock-quantity">8 left</div>
              </div>
              <div className="stock-item">
                <div className="stock-info">
                  <div className="stock-name">
                    Cold Pressed Sunflower Oil (1L)
                  </div>
                  <div className="stock-sku">SKU: OIL-SUN-1L</div>
                </div>
                <div className="stock-quantity">5 left</div>
              </div>
              <div className="stock-item">
                <div className="stock-info">
                  <div className="stock-name">
                    Organic Jaggery Powder (500g)
                  </div>
                  <div className="stock-sku">SKU: JAG-POW-500G</div>
                </div>
                <div className="stock-quantity">3 left</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
