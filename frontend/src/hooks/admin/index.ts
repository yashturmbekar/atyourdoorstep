/**
 * Admin Hooks Index
 * Export all admin-specific hooks for easy import
 */

// Dashboard Hooks
export {
  useDashboardStats,
  useRecentOrders,
  useLowStockProducts,
  useAdminBadgeCounts,
  useOrdersByStatus,
  useTodaysOrders,
  useRevenueStats,
  adminQueryKeys,
} from './useDashboard';

// Analytics Hooks
export {
  useAnalyticsStats,
  useTopProducts,
  useOrderTrends,
  useRevenueTrend,
  useCustomerGrowth,
  useAnalyticsData,
  analyticsKeys,
} from './useAnalytics';

// Re-export types
export type {
  RevenueDataPoint,
  TopProductData,
  CustomerGrowthData,
  OrderTrendData,
  AnalyticsData,
} from './useAnalytics';
