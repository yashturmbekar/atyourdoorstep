/**
 * Admin Dashboard Hooks
 * React Query hooks for dashboard data fetching
 * Following Clean Architecture principles
 */

import { useQuery } from '@tanstack/react-query';
import { orderApi, productApi, analyticsApi } from '../../services/adminApi';
import type { Order, Product, AdminStats } from '../../types';

// Query keys for cache management
export const adminQueryKeys = {
  dashboardStats: ['admin', 'dashboard', 'stats'] as const,
  recentOrders: (limit: number) =>
    ['admin', 'orders', 'recent', limit] as const,
  lowStockProducts: (threshold: number) =>
    ['admin', 'products', 'lowStock', threshold] as const,
  pendingOrdersCount: ['admin', 'orders', 'pending', 'count'] as const,
  badgeCounts: ['admin', 'badges'] as const,
};

/**
 * Enhanced Dashboard Stats Hook
 * Fetches comprehensive statistics for the admin dashboard
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: adminQueryKeys.dashboardStats,
    queryFn: async (): Promise<AdminStats> => {
      const response = await analyticsApi.getDashboardStats();
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refresh every minute
  });
};

/**
 * Recent Orders Hook
 * Fetches the most recent orders for dashboard display
 */
export const useRecentOrders = (limit: number = 5) => {
  return useQuery({
    queryKey: adminQueryKeys.recentOrders(limit),
    queryFn: async (): Promise<Order[]> => {
      // Fetch orders from multiple statuses to get diverse recent orders
      const [pendingRes, confirmedRes, shippedRes, deliveredRes] =
        await Promise.all([
          orderApi.getOrders(1, limit, { status: ['pending'] }),
          orderApi.getOrders(1, limit, { status: ['confirmed'] }),
          orderApi.getOrders(1, limit, { status: ['shipped'] }),
          orderApi.getOrders(1, limit, { status: ['delivered'] }),
        ]);

      // Combine and sort by date
      const allOrders = [
        ...pendingRes.data,
        ...confirmedRes.data,
        ...shippedRes.data,
        ...deliveredRes.data,
      ];

      // Sort by most recent and take the limit
      const sortedOrders = allOrders
        .sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        )
        .slice(0, limit);

      return sortedOrders;
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

/**
 * Low Stock Products Hook
 * Fetches products with stock below threshold
 */
export const useLowStockProducts = (threshold: number = 10) => {
  return useQuery({
    queryKey: adminQueryKeys.lowStockProducts(threshold),
    queryFn: async (): Promise<Product[]> => {
      // Fetch all products and filter by stock
      const response = await productApi.getProducts(1, 100);

      // Filter products where any variant has low stock
      const lowStockProducts = response.data.filter(product => {
        return product.variants.some(
          variant =>
            variant.stockQuantity !== undefined &&
            variant.stockQuantity < threshold
        );
      });

      // Sort by lowest stock first
      return lowStockProducts
        .sort((a, b) => {
          const aMinStock = Math.min(
            ...a.variants.map(v => v.stockQuantity || Infinity)
          );
          const bMinStock = Math.min(
            ...b.variants.map(v => v.stockQuantity || Infinity)
          );
          return aMinStock - bMinStock;
        })
        .slice(0, 5);
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });
};

/**
 * Admin Badge Counts Hook
 * Fetches counts for navigation badges (pending orders, low stock, etc.)
 */
export const useAdminBadgeCounts = () => {
  return useQuery({
    queryKey: adminQueryKeys.badgeCounts,
    queryFn: async () => {
      // Only fetch products - orders API is not working properly
      const productsRes = await productApi.getProducts(1, 100);

      // Count low stock products
      const lowStockCount = productsRes.data.filter(product =>
        product.variants.some(
          variant =>
            variant.stockQuantity !== undefined && variant.stockQuantity < 10
        )
      ).length;

      return {
        pendingOrders: 0, // Orders API not available
        lowStockProducts: lowStockCount,
        totalProducts: productsRes.pagination.total,
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

/**
 * Orders by Status Hook
 * Fetches order counts grouped by status
 */
export const useOrdersByStatus = () => {
  return useQuery({
    queryKey: ['admin', 'orders', 'byStatus'],
    queryFn: async () => {
      const statuses: Order['status'][] = [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ];

      const results = await Promise.all(
        statuses.map(async status => {
          const res = await orderApi.getOrders(1, 1, { status: [status] });
          return { status, count: res.pagination.total };
        })
      );

      return results.reduce(
        (acc, { status, count }) => {
          acc[status] = count;
          return acc;
        },
        {} as Record<string, number>
      );
    },
    staleTime: 60000,
    refetchInterval: 120000,
  });
};

/**
 * Today's Orders Hook
 * Fetches orders placed today
 */
export const useTodaysOrders = () => {
  return useQuery({
    queryKey: ['admin', 'orders', 'today'],
    queryFn: async () => {
      // Fetch recent orders and filter by today
      const response = await orderApi.getOrders(1, 50);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaysOrders = response.data.filter(order => {
        const orderDate = new Date(order.orderDate);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
      });

      return {
        count: todaysOrders.length,
        orders: todaysOrders,
        totalValue: todaysOrders.reduce((sum, order) => sum + order.total, 0),
      };
    },
    staleTime: 60000,
    refetchInterval: 120000,
  });
};

/**
 * Revenue Statistics Hook
 * Fetches revenue data for charts
 */
export const useRevenueStats = () => {
  return useQuery({
    queryKey: ['admin', 'revenue', 'stats'],
    queryFn: async () => {
      // Fetch orders for revenue calculation
      const response = await orderApi.getOrders(1, 100);

      // Group by month for the last 6 months
      const now = new Date();
      const monthlyRevenue: {
        month: string;
        revenue: number;
        orders: number;
      }[] = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleString('default', { month: 'short' });

        const monthOrders = response.data.filter(order => {
          const orderDate = new Date(order.orderDate);
          return (
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear() &&
            order.status !== 'cancelled'
          );
        });

        monthlyRevenue.push({
          month: monthName,
          revenue: monthOrders.reduce((sum, order) => sum + order.total, 0),
          orders: monthOrders.length,
        });
      }

      return {
        monthlyData: monthlyRevenue,
        totalRevenue: response.data
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, order) => sum + order.total, 0),
        totalOrders: response.data.filter(o => o.status !== 'cancelled').length,
      };
    },
    staleTime: 300000, // 5 minutes
    refetchInterval: 600000, // 10 minutes
  });
};
