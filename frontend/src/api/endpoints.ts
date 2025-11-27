// API Endpoints configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
    revoke: '/api/auth/revoke',
  },

  // Product endpoints
  products: {
    base: '/api/products',
    byId: (id: string) => `/api/products/${id}`,
    byCategory: (category: string) => `/api/products/category/${category}`,
  },

  // Order endpoints
  orders: {
    base: '/api/orders',
    byId: (id: string) => `/api/orders/${id}`,
    myOrders: '/api/orders/my-orders',
    updateStatus: (id: string) => `/api/orders/${id}/status`,
  },

  // Customer endpoints
  customers: {
    base: '/api/customers',
    byId: (id: string) => `/api/customers/${id}`,
  },

  // Notification endpoints
  notifications: {
    subscribe: '/api/notifications/subscribe',
    send: '/api/notifications/send',
  },
} as const;
