import React, { useState } from 'react';
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiCalendar,
  FiBarChart,
  FiPieChart,
  FiDownload,
  FiRefreshCw,
  FiAlertCircle,
} from 'react-icons/fi';
import { useAnalyticsData } from '../../../hooks/admin';
import './Analytics.css';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter' | 'year'
  >('month');
  const [refreshing, setRefreshing] = useState(false);

  // Use React Query hooks for data fetching
  const {
    stats,
    topProducts,
    orderTrends,
    revenueTrend,
    customerGrowth,
    isLoading,
    isError,
    refetchAll,
  } = useAnalyticsData(selectedPeriod);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchAll();
    setTimeout(() => setRefreshing(false), 500);
  };

  const exportReport = () => {
    if (!stats) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      summary: stats,
      analytics: {
        revenueChart: {
          labels: revenueTrend.map(d => d.label),
          data: revenueTrend.map(d => d.value),
        },
        topProducts,
        customerGrowth,
        orderTrends,
      },
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="analytics-error">
        <FiAlertCircle className="error-icon" />
        <p>Failed to load analytics data</p>
        <button className="btn btn-primary" onClick={handleRefresh}>
          Retry
        </button>
      </div>
    );
  }

  // Safely get max values for charts
  const maxRevenue =
    revenueTrend.length > 0 ? Math.max(...revenueTrend.map(d => d.value)) : 1;
  const maxProductRevenue =
    topProducts.length > 0 ? Math.max(...topProducts.map(p => p.revenue)) : 1;
  const maxNewCustomers =
    customerGrowth.length > 0
      ? Math.max(...customerGrowth.map(g => g.newCustomers))
      : 1;
  const maxOrders =
    orderTrends.length > 0 ? Math.max(...orderTrends.map(t => t.orders)) : 1;

  return (
    <div className="analytics">
      <div className="analytics-header">
        <div className="header-left">
          <h1>Analytics & Reports</h1>
          <p className="subtitle">Track your business performance and growth</p>
        </div>
        <div className="header-actions">
          <div className="period-selector">
            <select
              value={selectedPeriod}
              onChange={e =>
                setSelectedPeriod(e.target.value as typeof selectedPeriod)
              }
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? 'spinning' : ''} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={exportReport}>
            <FiDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">
            <FiDollarSign />
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <div className="metric-value">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="metric-trend positive">
              <FiTrendingUp />
              +12.5% from last month
            </div>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">
            <FiShoppingCart />
          </div>
          <div className="metric-content">
            <h3>Total Orders</h3>
            <div className="metric-value">
              {stats.totalOrders.toLocaleString()}
            </div>
            <div className="metric-trend positive">
              <FiTrendingUp />
              +8.2% from last month
            </div>
          </div>
        </div>

        <div className="metric-card customers">
          <div className="metric-icon">
            <FiUsers />
          </div>
          <div className="metric-content">
            <h3>Total Customers</h3>
            <div className="metric-value">
              {stats.totalCustomers.toLocaleString()}
            </div>
            <div className="metric-trend positive">
              <FiTrendingUp />
              +15.7% from last month
            </div>
          </div>
        </div>

        <div className="metric-card products">
          <div className="metric-icon">
            <FiPackage />
          </div>
          <div className="metric-content">
            <h3>Active Products</h3>
            <div className="metric-value">{stats.totalProducts}</div>
            <div className="metric-trend neutral">No change</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <FiBarChart className="chart-icon" />
          </div>
          <div className="chart-content">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {revenueTrend.map(item => (
                  <div
                    key={item.label}
                    className="chart-bar"
                    style={{
                      height: `${(item.value / maxRevenue) * 100}%`,
                    }}
                  >
                    <div className="bar-label">{item.label}</div>
                    <div className="bar-value">
                      {formatCurrency(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Top Selling Products</h3>
            <FiPieChart className="chart-icon" />
          </div>
          <div className="chart-content">
            <div className="products-list">
              {topProducts.map((product, index) => (
                <div key={product.id || product.name} className="product-item">
                  <div className="product-rank">#{index + 1}</div>
                  <div className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-stats">
                      {product.sales} sales • {formatCurrency(product.revenue)}
                    </div>
                  </div>
                  <div className="product-bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(product.revenue / maxProductRevenue) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Growth */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Customer Growth</h3>
            <FiUsers className="chart-icon" />
          </div>
          <div className="chart-content">
            <div className="growth-chart">
              {customerGrowth.map(item => (
                <div key={item.month} className="growth-item">
                  <div className="growth-month">{item.month}</div>
                  <div className="growth-bars">
                    <div className="growth-bar new">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${(item.newCustomers / maxNewCustomers) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="growth-value">+{item.newCustomers}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Trends */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Order Trends</h3>
            <FiCalendar className="chart-icon" />
          </div>
          <div className="chart-content">
            <div className="trends-chart">
              {orderTrends.map(trend => (
                <div key={trend.day} className="trend-item">
                  <div className="trend-day">{trend.day}</div>
                  <div className="trend-bar">
                    <div
                      className="bar-fill"
                      style={{
                        height: `${(trend.orders / maxOrders) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className="trend-stats">
                    <div className="trend-orders">{trend.orders} orders</div>
                    <div className="trend-revenue">
                      {formatCurrency(trend.revenue)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>Order Status Distribution</h3>
          <div className="status-list">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="status-item">
                <div className={`status-indicator ${status}`}></div>
                <span className="status-name">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
                <span className="status-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-card">
          <h3>Monthly Revenue Trend</h3>
          <div className="monthly-trend">
            {stats.monthlyRevenue.map((revenue, index) => (
              <div key={index} className="month-item">
                <div className="month-bar">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${(revenue / Math.max(...stats.monthlyRevenue)) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="month-value">{formatCurrency(revenue)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-card">
          <h3>Key Performance Indicators</h3>
          <div className="kpi-list">
            <div className="kpi-item">
              <span className="kpi-label">Average Order Value</span>
              <span className="kpi-value">
                {formatCurrency(stats.totalRevenue / stats.totalOrders)}
              </span>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Customer Lifetime Value</span>
              <span className="kpi-value">
                {formatCurrency(stats.totalRevenue / stats.totalCustomers)}
              </span>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Orders per Customer</span>
              <span className="kpi-value">
                {(stats.totalOrders / stats.totalCustomers).toFixed(1)}
              </span>
            </div>
            <div className="kpi-item">
              <span className="kpi-label">Low Stock Alerts</span>
              <span className="kpi-value danger">{stats.lowStockProducts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
