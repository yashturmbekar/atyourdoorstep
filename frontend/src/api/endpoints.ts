/**
 * API Endpoints Configuration
 * Centralized endpoint definitions for all backend services
 * All requests go through Gateway at port 5000
 */
export const API_ENDPOINTS = {
  // ============================================
  // Auth Service Endpoints
  // ============================================
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
    revoke: '/api/auth/revoke',
  },

  // ============================================
  // Product Endpoints (OrderService)
  // ============================================
  products: {
    base: '/api/products',
    list: '/api/products',
    byId: (id: string) => `/api/products/${id}`,
    categories: '/api/products/categories',
    create: '/api/products',
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
  },

  // ============================================
  // Order Endpoints (OrderService)
  // ============================================
  orders: {
    base: '/api/orders',
    create: '/api/orders',
    byId: (id: string) => `/api/orders/${id}`,
    byOrderNumber: (orderNumber: string) => `/api/orders/number/${orderNumber}`,
    byCustomer: (customerId: string) => `/api/orders/customer/${customerId}`,
    byStatus: (status: number) => `/api/orders/status/${status}`,
    updateStatus: (id: string) => `/api/orders/${id}/status`,
    cancel: (id: string) => `/api/orders/${id}/cancel`,
  },

  // ============================================
  // Customer Endpoints (OrderService)
  // ============================================
  customers: {
    base: '/api/customers',
    list: '/api/customers',
    byId: (id: string) => `/api/customers/${id}`,
    byUserId: (userId: string) => `/api/customers/user/${userId}`,
    create: '/api/customers',
    update: (id: string) => `/api/customers/${id}`,
    delete: (id: string) => `/api/customers/${id}`,
  },

  // ============================================
  // Notification Endpoints (NotificationService)
  // ============================================
  notifications: {
    subscribe: '/api/notifications/subscribe',
    unsubscribe: (id: string) => `/api/notifications/unsubscribe/${id}`,
    send: '/api/notifications/send',
    broadcast: '/api/notifications/broadcast',
    list: (userId: string) => `/api/notifications/${userId}`,
    markRead: '/api/notifications/mark-read',
    unreadCount: (userId: string) =>
      `/api/notifications/${userId}/unread-count`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
