import React, { useState, useEffect } from 'react';
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
} from 'react-icons/fi';
import { adminApi } from '../../../services/adminApi';
import type { AdminStats } from '../../../types';
import './Analytics.css';

interface AnalyticsData {
  revenueChart: {
    labels: string[];
    data: number[];
  };
  topProducts: {
    name: string;
    sales: number;
    revenue: number;
  }[];
  customerGrowth: {
    month: string;
    newCustomers: number;
    totalCustomers: number;
  }[];
  orderTrends: {
    day: string;
    orders: number;
    revenue: number;
  }[];
}

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter' | 'year'
  >('month');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [statsResponse] = await Promise.all([
        adminApi.analytics.getDashboardStats(),
      ]);

      setStats(statsResponse.data);

      // Mock analytics data - in real app, this would come from API
      setAnalyticsData({
        revenueChart: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [15000, 18000, 22000, 19000, 25000, 30000],
        },
        topProducts: [
          { name: 'Premium Alphonso Mangoes', sales: 145, revenue: 232000 },
          { name: 'Organic Jaggery Powder', sales: 98, revenue: 147000 },
          { name: 'Cold Pressed Coconut Oil', sales: 76, revenue: 114000 },
          { name: 'Pure Honey', sales: 65, revenue: 97500 },
          { name: 'Organic Turmeric', sales: 54, revenue: 81000 },
        ],
        customerGrowth: [
          { month: 'Jan', newCustomers: 45, totalCustomers: 145 },
          { month: 'Feb', newCustomers: 62, totalCustomers: 207 },
          { month: 'Mar', newCustomers: 78, totalCustomers: 285 },
          { month: 'Apr', newCustomers: 54, totalCustomers: 339 },
          { month: 'May', newCustomers: 89, totalCustomers: 428 },
          { month: 'Jun', newCustomers: 112, totalCustomers: 540 },
        ],
        orderTrends: [
          { day: 'Mon', orders: 23, revenue: 34500 },
          { day: 'Tue', orders: 18, revenue: 27000 },
          { day: 'Wed', orders: 31, revenue: 46500 },
          { day: 'Thu', orders: 28, revenue: 42000 },
          { day: 'Fri', orders: 35, revenue: 52500 },
          { day: 'Sat', orders: 42, revenue: 63000 },
          { day: 'Sun', orders: 38, revenue: 57000 },
        ],
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
  };

  const exportReport = () => {
    if (!stats || !analyticsData) return;

    const reportData = {
      generatedAt: new Date().toISOString(),
      period: selectedPeriod,
      summary: stats,
      analytics: analyticsData,
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

  if (!stats || !analyticsData) {
    return (
      <div className="analytics-error">
        <p>Failed to load analytics data</p>
        <button className="btn btn-primary" onClick={fetchAnalyticsData}>
          Retry
        </button>
      </div>
    );
  }

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
                {analyticsData.revenueChart.data.map((value, index) => (
                  <div
                    key={analyticsData.revenueChart.labels[index]}
                    className="chart-bar"
                    style={{
                      height: `${(value / Math.max(...analyticsData.revenueChart.data)) * 100}%`,
                    }}
                  >
                    <div className="bar-label">
                      {analyticsData.revenueChart.labels[index]}
                    </div>
                    <div className="bar-value">{formatCurrency(value)}</div>
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
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="product-item">
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
                        width: `${(product.revenue / Math.max(...analyticsData.topProducts.map(p => p.revenue))) * 100}%`,
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
              {analyticsData.customerGrowth.map(item => (
                <div key={item.month} className="growth-item">
                  <div className="growth-month">{item.month}</div>
                  <div className="growth-bars">
                    <div className="growth-bar new">
                      <div
                        className="bar-fill"
                        style={{
                          height: `${(item.newCustomers / Math.max(...analyticsData.customerGrowth.map(g => g.newCustomers))) * 100}%`,
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
              {analyticsData.orderTrends.map(trend => (
                <div key={trend.day} className="trend-item">
                  <div className="trend-day">{trend.day}</div>
                  <div className="trend-bar">
                    <div
                      className="bar-fill"
                      style={{
                        height: `${(trend.orders / Math.max(...analyticsData.orderTrends.map(t => t.orders))) * 100}%`,
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
