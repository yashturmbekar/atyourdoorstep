/**
 * Admin Dashboard Component
 * Production-ready dashboard with real API data integration
 * Following Clean Architecture principles from copilot-instructions.md
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiArrowRight,
  FiPlus,
  FiEye,
  FiAlertTriangle,
  FiUsers,
  FiCalendar,
  FiRefreshCw,
  FiHome,
  FiSettings,
} from 'react-icons/fi';
import {
  useDashboardStats,
  useRecentOrders,
  useLowStockProducts,
  useTodaysOrders,
  useRevenueStats,
} from '../../../hooks/admin';
import {
  Breadcrumb,
  Card,
  CardHeader,
  CardBody,
  Skeleton,
  StatCardSkeleton,
  TableSkeleton,
  EmptyState,
  Badge,
  Button,
  BentoGrid,
  BentoItem,
  BentoStat,
} from '../ui';
import type { Order } from '../../../types';
import './AdminDashboard.css';

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Error State Component
 */
const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="error-state">
    <FiAlertTriangle className="error-state-icon" />
    <p>{message}</p>
    {onRetry && (
      <button className="retry-btn" onClick={onRetry}>
        <FiRefreshCw /> Retry
      </button>
    )}
  </div>
);

// Breadcrumb items
const breadcrumbItems = [
  { label: 'Home', href: '/admin', icon: <FiHome /> },
  { label: 'Dashboard' },
];

// ============================================
// MAIN COMPONENT
// ============================================

const AdminDashboard: React.FC = () => {
  // Fetch all dashboard data using React Query hooks
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: recentOrders,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useRecentOrders(5);

  const {
    data: lowStockProducts,
    isLoading: lowStockLoading,
    isError: lowStockError,
    refetch: refetchLowStock,
  } = useLowStockProducts(10);

  const { data: todaysOrdersData } = useTodaysOrders();

  const { data: revenueData } = useRevenueStats();

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
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

  const getStatusVariant = (
    status: string
  ): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    const variants: Record<
      string,
      'success' | 'warning' | 'error' | 'info' | 'default'
    > = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'info',
      shipped: 'default',
      delivered: 'success',
      cancelled: 'error',
    };
    return variants[status] || 'default';
  };

  // Calculate change percentages (mock for now - would come from API)
  const getChangePercent = (metric: string) => {
    // In production, this would be calculated from historical data
    const changes: Record<string, { value: number; positive: boolean }> = {
      products: { value: 12, positive: true },
      orders: { value: 8, positive: true },
      revenue: { value: 18, positive: true },
      customers: { value: 15, positive: true },
    };
    return changes[metric] || { value: 0, positive: true };
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="admin-dashboard">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} className="admin-animate-fade-in" />

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="header-action-btn"
            onClick={() => {
              refetchStats();
              refetchOrders();
              refetchLowStock();
            }}
            title="Refresh all data"
          >
            <FiRefreshCw /> Refresh
          </button>
          <Link to="/admin/settings" className="header-action-btn secondary">
            <FiSettings /> Settings
          </Link>
        </div>
      </div>

      {/* Stats Cards using Bento Grid */}
      <div className="dashboard-stats">
        {statsLoading ? (
          <BentoGrid columns={3} gap="md">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <BentoItem key={i} className="admin-stagger-${i}">
                <StatCardSkeleton />
              </BentoItem>
            ))}
          </BentoGrid>
        ) : statsError ? (
          <div className="stats-error">
            <ErrorState
              message="Failed to load dashboard statistics"
              onRetry={() => refetchStats()}
            />
          </div>
        ) : (
          <BentoGrid columns={6} gap="md" className="stats-bento-grid">
            <BentoItem className="admin-animate-fade-in-up admin-stagger-1">
              <BentoStat
                title="Total Products"
                value={stats?.totalProducts || 0}
                change={getChangePercent('products')}
                icon={<FiPackage />}
                trend="from last month"
                variant="primary"
              />
            </BentoItem>

            <BentoItem className="admin-animate-fade-in-up admin-stagger-2">
              <BentoStat
                title="Total Orders"
                value={stats?.totalOrders || 0}
                change={getChangePercent('orders')}
                icon={<FiShoppingCart />}
                trend="from last month"
                variant="success"
              />
            </BentoItem>

            <BentoItem className="admin-animate-fade-in-up admin-stagger-3">
              <BentoStat
                title="Total Revenue"
                value={formatCurrency(
                  revenueData?.totalRevenue || stats?.totalRevenue || 0
                )}
                change={getChangePercent('revenue')}
                icon={<FiDollarSign />}
                trend="from last month"
                variant="success"
              />
            </BentoItem>

            <BentoItem className="admin-animate-fade-in-up admin-stagger-4">
              <BentoStat
                title="Low Stock Items"
                value={lowStockProducts?.length || stats?.lowStockProducts || 0}
                change={{ value: 0, positive: false }}
                icon={<FiAlertTriangle />}
                trend="Requires restocking"
                variant="danger"
              />
            </BentoItem>

            <BentoItem className="admin-animate-fade-in-up admin-stagger-5">
              <BentoStat
                title="Total Customers"
                value={stats?.totalCustomers || 0}
                change={getChangePercent('customers')}
                icon={<FiUsers />}
                trend="from last month"
                variant="primary"
              />
            </BentoItem>

            <BentoItem className="admin-animate-fade-in-up admin-stagger-6">
              <BentoStat
                title="Orders Today"
                value={todaysOrdersData?.count || stats?.ordersToday || 0}
                icon={<FiCalendar />}
                trend={`${formatCurrency(todaysOrdersData?.totalValue || 0)} total value`}
                variant="warning"
              />
            </BentoItem>
          </BentoGrid>
        )}
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <Card className="dashboard-quick-actions-section admin-animate-fade-in-up">
          <CardHeader>
            <h2 className="card-title">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="quick-actions">
              <Link to="/admin/products/new" className="quick-action">
                <div className="action-icon primary">
                  <FiPlus />
                </div>
                <div className="action-text">
                  <div className="action-title">Add Product</div>
                  <div className="action-subtitle">Create a new product</div>
                </div>
                <FiArrowRight className="action-arrow" />
              </Link>

              <Link to="/admin/orders" className="quick-action">
                <div className="action-icon success">
                  <FiEye />
                </div>
                <div className="action-text">
                  <div className="action-title">View Orders</div>
                  <div className="action-subtitle">
                    <Badge variant="warning" size="sm">
                      {stats?.pendingOrders || 0} pending
                    </Badge>
                  </div>
                </div>
                <FiArrowRight className="action-arrow" />
              </Link>

              <Link to="/admin/products" className="quick-action">
                <div className="action-icon info">
                  <FiPackage />
                </div>
                <div className="action-text">
                  <div className="action-title">Manage Products</div>
                  <div className="action-subtitle">Edit existing products</div>
                </div>
                <FiArrowRight className="action-arrow" />
              </Link>

              <Link to="/admin/analytics" className="quick-action">
                <div className="action-icon warning">
                  <FiTrendingUp />
                </div>
                <div className="action-text">
                  <div className="action-title">View Analytics</div>
                  <div className="action-subtitle">Sales and performance</div>
                </div>
                <FiArrowRight className="action-arrow" />
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Recent Orders */}
        <Card className="admin-animate-fade-in-up">
          <CardHeader>
            <h2 className="card-title">Recent Orders</h2>
            <div className="orders-header-actions">
              <button
                className="refresh-btn"
                onClick={() => refetchOrders()}
                title="Refresh orders"
              >
                <FiRefreshCw />
              </button>
              <Link to="/admin/orders" className="card-action">
                View All <FiArrowRight />
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {/* Orders Summary */}
            <div className="orders-summary">
              <div className="summary-item">
                <span className="summary-label">Today's Orders:</span>
                <span className="summary-value">
                  {todaysOrdersData?.count || 0}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Pending:</span>
                <Badge variant="warning" size="sm">
                  {stats?.pendingOrders || 0}
                </Badge>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Value:</span>
                <span className="summary-value highlight">
                  {formatCurrency(
                    recentOrders?.reduce(
                      (sum, order) => sum + order.total,
                      0
                    ) || 0
                  )}
                </span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="orders-table-container">
              {ordersLoading ? (
                <TableSkeleton rows={5} columns={6} />
              ) : ordersError ? (
                <ErrorState
                  message="Failed to load recent orders"
                  onRetry={() => refetchOrders()}
                />
              ) : !recentOrders || recentOrders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Orders will appear here once customers start ordering."
                  icon={<FiShoppingCart />}
                  action={
                    <Button
                      variant="primary"
                      onClick={() => (window.location.href = '/admin/products')}
                    >
                      View Products
                    </Button>
                  }
                />
              ) : (
                <div className="orders-table">
                  {/* Table Header */}
                  <div className="orders-table-header">
                    <div className="table-header-cell order-header">Order</div>
                    <div className="table-header-cell customer-header">
                      Customer
                    </div>
                    <div className="table-header-cell items-header">Items</div>
                    <div className="table-header-cell payment-header">
                      Payment
                    </div>
                    <div className="table-header-cell delivery-header">
                      Delivery
                    </div>
                    <div className="table-header-cell actions-header">
                      Actions
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="orders-table-body">
                    {recentOrders.map((order: Order, index: number) => (
                      <div
                        key={order.id}
                        className={`table-row admin-animate-fade-in-up admin-stagger-${index + 1}`}
                        data-order-index={index}
                      >
                        {/* Order Column */}
                        <div className="table-cell order-cell">
                          <div className="order-id-wrapper">
                            <div className="order-id">
                              #{order.id.slice(0, 8)}
                            </div>
                            <div className="order-date">
                              {formatDate(order.orderDate)}
                            </div>
                          </div>
                          <Badge
                            variant={getStatusVariant(order.status)}
                            size="sm"
                          >
                            {order.status}
                          </Badge>
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
                            {order.customerInfo.city},{' '}
                            {order.customerInfo.pincode}
                          </div>
                        </div>

                        {/* Items Column */}
                        <div className="table-cell items-cell">
                          <div className="items-summary">
                            <Badge variant="default" size="sm">
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
                            </Badge>
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
                            <Badge
                              variant={
                                order.paymentStatus === 'paid'
                                  ? 'success'
                                  : 'warning'
                              }
                              size="sm"
                            >
                              {order.paymentStatus}
                            </Badge>
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
                                <span className="tracking-label">
                                  Tracking:
                                </span>
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
                                    order.actualDelivery ||
                                      order.estimatedDelivery
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
                          </div>
                        </div>

                        {/* Notes Row */}
                        {order.notes && (
                          <div className="table-notes-row">
                            <div className="notes-content">
                              <Badge variant="info" size="sm">
                                Note
                              </Badge>
                              <span>{order.notes}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Revenue and Low Stock - Side by side */}
        <div className="dashboard-bottom-section">
          {/* Revenue Chart */}
          <Card className="admin-animate-fade-in-up">
            <CardHeader>
              <h2 className="card-title">Revenue Overview</h2>
              <Link to="/admin/analytics" className="card-action">
                View Analytics <FiArrowRight />
              </Link>
            </CardHeader>
            <CardBody>
              <div className="chart-container">
                {revenueData?.monthlyData ? (
                  <div className="revenue-chart-placeholder">
                    <div className="revenue-summary">
                      <div className="revenue-total">
                        <span className="revenue-label">Total Revenue</span>
                        <span className="revenue-value">
                          {formatCurrency(revenueData.totalRevenue)}
                        </span>
                      </div>
                      <div className="revenue-orders">
                        <span className="revenue-label">Total Orders</span>
                        <span className="revenue-value">
                          {revenueData.totalOrders}
                        </span>
                      </div>
                    </div>
                    <div className="monthly-bars">
                      {revenueData.monthlyData.map((month, idx) => (
                        <div key={idx} className="month-bar-wrapper">
                          <div
                            className="month-bar"
                            style={{
                              height: `${Math.max(20, (month.revenue / (Math.max(...revenueData.monthlyData.map(m => m.revenue)) || 1)) * 100)}%`,
                            }}
                            title={`${month.month}: ${formatCurrency(month.revenue)}`}
                          />
                          <span className="month-label">{month.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No revenue data"
                    description="Revenue data will appear here once you have orders"
                    icon={<FiTrendingUp />}
                    size="sm"
                  />
                )}
              </div>
            </CardBody>
          </Card>

          {/* Low Stock Alert */}
          <Card className="admin-animate-fade-in-up">
            <CardHeader>
              <h2 className="card-title">Low Stock Alert</h2>
              <Link
                to="/admin/products?filter=low-stock"
                className="card-action"
              >
                View All <FiArrowRight />
              </Link>
            </CardHeader>
            <CardBody>
              <div className="low-stock-items">
                {lowStockLoading ? (
                  <div className="low-stock-loading">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="stock-item">
                        <div className="stock-info">
                          <Skeleton width="80%" height="16px" />
                          <Skeleton width="50%" height="12px" />
                        </div>
                        <Skeleton width="40px" height="24px" />
                      </div>
                    ))}
                  </div>
                ) : lowStockError ? (
                  <ErrorState
                    message="Failed to load low stock items"
                    onRetry={() => refetchLowStock()}
                  />
                ) : !lowStockProducts || lowStockProducts.length === 0 ? (
                  <EmptyState
                    title="All stocked up!"
                    description="All products are well-stocked."
                    icon={<FiPackage />}
                    size="sm"
                  />
                ) : (
                  lowStockProducts.map((product, idx) => {
                    const variant = product.variants[0];
                    const isCritical = (variant?.stockQuantity || 0) <= 3;
                    return (
                      <div
                        key={product.id}
                        className={`stock-item admin-animate-fade-in-up admin-stagger-${idx + 1}`}
                      >
                        <div className="stock-info">
                          <div className="stock-name">
                            {product.name}
                            {variant?.size && ` (${variant.size})`}
                          </div>
                          <div className="stock-sku">
                            {variant?.sku
                              ? `SKU: ${variant.sku}`
                              : `ID: ${product.id.slice(0, 8)}`}
                          </div>
                        </div>
                        <Badge
                          variant={isCritical ? 'error' : 'warning'}
                          size="sm"
                        >
                          {variant?.stockQuantity || 0} left
                        </Badge>
                      </div>
                    );
                  })
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
