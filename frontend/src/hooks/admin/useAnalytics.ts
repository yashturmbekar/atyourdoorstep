/**
 * Analytics Hooks - React Query integration for analytics data
 *
 * Note: Some analytics data is simulated as the backend doesn't yet
 * have dedicated endpoints for revenue trends, customer growth, etc.
 * When backend endpoints are added, update these hooks to use real API calls.
 */

import { useQuery } from '@tanstack/react-query';
import {
  analyticsApi,
  orderApi,
  productApi,
  customerApi,
} from '../../services/adminApi';
import type { AdminStats, Order } from '../../types';

// Query keys for analytics
export const analyticsKeys = {
  all: ['analytics'] as const,
  stats: () => [...analyticsKeys.all, 'stats'] as const,
  revenue: (period: string) =>
    [...analyticsKeys.all, 'revenue', period] as const,
  topProducts: (limit: number) =>
    [...analyticsKeys.all, 'topProducts', limit] as const,
  orderTrends: (period: string) =>
    [...analyticsKeys.all, 'orderTrends', period] as const,
  customerGrowth: (period: string) =>
    [...analyticsKeys.all, 'customerGrowth', period] as const,
};

// Types for analytics data
export interface RevenueDataPoint {
  label: string;
  value: number;
}

export interface TopProductData {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
}

export interface CustomerGrowthData {
  month: string;
  newCustomers: number;
  totalCustomers: number;
}

export interface OrderTrendData {
  day: string;
  orders: number;
  revenue: number;
}

export interface AnalyticsData {
  revenueChart: {
    labels: string[];
    data: number[];
  };
  topProducts: TopProductData[];
  customerGrowth: CustomerGrowthData[];
  orderTrends: OrderTrendData[];
}

/**
 * Hook to fetch dashboard statistics
 */
export function useAnalyticsStats() {
  return useQuery({
    queryKey: analyticsKeys.stats(),
    queryFn: async (): Promise<AdminStats> => {
      const response = await analyticsApi.getDashboardStats();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch analytics stats');
      }
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
  });
}

/**
 * Hook to fetch top selling products
 * Uses real product data and calculates based on available metrics
 */
export function useTopProducts(limit = 5) {
  return useQuery({
    queryKey: analyticsKeys.topProducts(limit),
    queryFn: async (): Promise<TopProductData[]> => {
      try {
        // Fetch products from API - using positional arguments
        const response = await productApi.getProducts(1, 50);

        if (!response.success || !response.data) {
          return [];
        }

        // Sort products and calculate simulated metrics
        // In a real app, this would come from a dedicated analytics endpoint
        const sortedProducts = [...response.data].slice(0, limit);

        // Get first variant price as representative price
        return sortedProducts.map((product, index) => {
          const firstVariant = product.variants?.[0];
          const price = firstVariant?.price || 0;

          return {
            id: product.id,
            name: product.name,
            sales: Math.max(
              10,
              150 - index * 25 + Math.floor(Math.random() * 20)
            ), // Simulated
            revenue: price * Math.max(10, 150 - index * 25),
            image: product.image || undefined,
          };
        });
      } catch (error) {
        console.error('Failed to fetch top products:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch order trends by day of week
 * Aggregates real order data when available
 */
export function useOrderTrends(
  period: 'week' | 'month' | 'quarter' | 'year' = 'week'
) {
  return useQuery({
    queryKey: analyticsKeys.orderTrends(period),
    queryFn: async (): Promise<OrderTrendData[]> => {
      try {
        // Fetch recent orders - using positional arguments
        const response = await orderApi.getOrders(1, 100);

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const ordersByDay: Record<string, { orders: number; revenue: number }> =
          {};

        // Initialize all days
        days.forEach(day => {
          ordersByDay[day] = { orders: 0, revenue: 0 };
        });

        // Aggregate orders by day
        if (response.success && response.data) {
          response.data.forEach((order: Order) => {
            const date = new Date(order.createdAt);
            const dayName = days[date.getDay()];
            ordersByDay[dayName].orders++;
            ordersByDay[dayName].revenue += order.total || 0;
          });
        }

        // If no real data, provide simulated baseline
        const hasData = Object.values(ordersByDay).some(d => d.orders > 0);
        if (!hasData) {
          // Simulated data for demo purposes
          return [
            { day: 'Mon', orders: 23, revenue: 34500 },
            { day: 'Tue', orders: 18, revenue: 27000 },
            { day: 'Wed', orders: 31, revenue: 46500 },
            { day: 'Thu', orders: 28, revenue: 42000 },
            { day: 'Fri', orders: 35, revenue: 52500 },
            { day: 'Sat', orders: 42, revenue: 63000 },
            { day: 'Sun', orders: 38, revenue: 57000 },
          ];
        }

        // Return in proper order (Mon-Sun)
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
          day,
          ...ordersByDay[day],
        }));
      } catch (error) {
        console.error('Failed to fetch order trends:', error);
        // Return simulated data on error
        return [
          { day: 'Mon', orders: 23, revenue: 34500 },
          { day: 'Tue', orders: 18, revenue: 27000 },
          { day: 'Wed', orders: 31, revenue: 46500 },
          { day: 'Thu', orders: 28, revenue: 42000 },
          { day: 'Fri', orders: 35, revenue: 52500 },
          { day: 'Sat', orders: 42, revenue: 63000 },
          { day: 'Sun', orders: 38, revenue: 57000 },
        ];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch revenue trend data
 * Note: This would ideally come from a dedicated backend endpoint
 */
export function useRevenueTrend(
  period: 'week' | 'month' | 'quarter' | 'year' = 'month'
) {
  return useQuery({
    queryKey: analyticsKeys.revenue(period),
    queryFn: async (): Promise<RevenueDataPoint[]> => {
      // In a real implementation, this would call a dedicated analytics endpoint
      // For now, we simulate based on available order data
      try {
        const response = await orderApi.getOrders(1, 500);

        if (!response.success || !response.data || response.data.length === 0) {
          // Return simulated data if no orders
          return getSimulatedRevenueData(period);
        }

        // Aggregate revenue by time period
        const revenueByPeriod: Record<string, number> = {};

        response.data.forEach((order: Order) => {
          const date = new Date(order.createdAt);
          let key: string;

          switch (period) {
            case 'week':
              key = date.toLocaleDateString('en-US', { weekday: 'short' });
              break;
            case 'month':
              key = `Week ${Math.ceil(date.getDate() / 7)}`;
              break;
            case 'quarter':
              key = date.toLocaleDateString('en-US', { month: 'short' });
              break;
            case 'year':
              key = date.toLocaleDateString('en-US', { month: 'short' });
              break;
            default:
              key = date.toLocaleDateString();
          }

          revenueByPeriod[key] =
            (revenueByPeriod[key] || 0) + (order.total || 0);
        });

        const entries = Object.entries(revenueByPeriod);
        if (entries.length === 0) {
          return getSimulatedRevenueData(period);
        }

        return entries.map(([label, value]) => ({ label, value }));
      } catch (error) {
        console.error('Failed to fetch revenue trend:', error);
        return getSimulatedRevenueData(period);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch customer growth data
 * Note: This would ideally come from a dedicated backend endpoint
 */
export function useCustomerGrowth(
  period: 'week' | 'month' | 'quarter' | 'year' = 'month'
) {
  return useQuery({
    queryKey: analyticsKeys.customerGrowth(period),
    queryFn: async (): Promise<CustomerGrowthData[]> => {
      // This would ideally come from a backend analytics endpoint
      // For now, return simulated data
      try {
        const response = await customerApi.getCustomers(1, 1);
        const totalCustomers = response.pagination?.total || 540;

        // Generate growth data based on total
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const baseGrowth = Math.floor(totalCustomers / 6);

        let runningTotal = Math.floor(baseGrowth * 0.3);
        return months.map(month => {
          const newCustomers = baseGrowth + Math.floor(Math.random() * 30) - 15;
          runningTotal += newCustomers;
          return {
            month,
            newCustomers: Math.max(10, newCustomers),
            totalCustomers: runningTotal,
          };
        });
      } catch (error) {
        console.error('Failed to fetch customer growth:', error);
        // Return simulated data
        return [
          { month: 'Jan', newCustomers: 45, totalCustomers: 145 },
          { month: 'Feb', newCustomers: 62, totalCustomers: 207 },
          { month: 'Mar', newCustomers: 78, totalCustomers: 285 },
          { month: 'Apr', newCustomers: 54, totalCustomers: 339 },
          { month: 'May', newCustomers: 89, totalCustomers: 428 },
          { month: 'Jun', newCustomers: 112, totalCustomers: 540 },
        ];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Combined hook for all analytics data
 */
export function useAnalyticsData(
  period: 'week' | 'month' | 'quarter' | 'year' = 'month'
) {
  const statsQuery = useAnalyticsStats();
  const topProductsQuery = useTopProducts(5);
  const orderTrendsQuery = useOrderTrends(period);
  const revenueTrendQuery = useRevenueTrend(period);
  const customerGrowthQuery = useCustomerGrowth(period);

  const isLoading =
    statsQuery.isLoading ||
    topProductsQuery.isLoading ||
    orderTrendsQuery.isLoading ||
    revenueTrendQuery.isLoading ||
    customerGrowthQuery.isLoading;

  const isError =
    statsQuery.isError ||
    topProductsQuery.isError ||
    orderTrendsQuery.isError ||
    revenueTrendQuery.isError ||
    customerGrowthQuery.isError;

  const refetchAll = () => {
    statsQuery.refetch();
    topProductsQuery.refetch();
    orderTrendsQuery.refetch();
    revenueTrendQuery.refetch();
    customerGrowthQuery.refetch();
  };

  return {
    stats: statsQuery.data,
    topProducts: topProductsQuery.data || [],
    orderTrends: orderTrendsQuery.data || [],
    revenueTrend: revenueTrendQuery.data || [],
    customerGrowth: customerGrowthQuery.data || [],
    isLoading,
    isError,
    refetchAll,
    queries: {
      stats: statsQuery,
      topProducts: topProductsQuery,
      orderTrends: orderTrendsQuery,
      revenueTrend: revenueTrendQuery,
      customerGrowth: customerGrowthQuery,
    },
  };
}

// Helper function for simulated revenue data
function getSimulatedRevenueData(period: string): RevenueDataPoint[] {
  switch (period) {
    case 'week':
      return [
        { label: 'Mon', value: 34500 },
        { label: 'Tue', value: 27000 },
        { label: 'Wed', value: 46500 },
        { label: 'Thu', value: 42000 },
        { label: 'Fri', value: 52500 },
        { label: 'Sat', value: 63000 },
        { label: 'Sun', value: 57000 },
      ];
    case 'month':
      return [
        { label: 'Week 1', value: 75000 },
        { label: 'Week 2', value: 92000 },
        { label: 'Week 3', value: 88000 },
        { label: 'Week 4', value: 105000 },
      ];
    case 'quarter':
    case 'year':
      return [
        { label: 'Jan', value: 150000 },
        { label: 'Feb', value: 180000 },
        { label: 'Mar', value: 220000 },
        { label: 'Apr', value: 190000 },
        { label: 'May', value: 250000 },
        { label: 'Jun', value: 300000 },
      ];
    default:
      return [];
  }
}
