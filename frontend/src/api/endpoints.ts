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

  // ============================================
  // Content Endpoints (ContentService)
  // ============================================
  content: {
    // Categories
    categories: {
      list: '/api/categories',
      byId: (id: string) => `/api/categories/${id}`,
      bySlug: (slug: string) => `/api/categories/slug/${slug}`,
      active: '/api/categories/active',
      create: '/api/categories',
      update: (id: string) => `/api/categories/${id}`,
      delete: (id: string) => `/api/categories/${id}`,
    },

    // Products (CMS)
    products: {
      list: '/api/products',
      byId: (id: string) => `/api/products/${id}`,
      bySlug: (slug: string) => `/api/products/slug/${slug}`,
      byCategory: (categoryId: string) =>
        `/api/products/category/${categoryId}`,
      featured: '/api/products/featured',
      create: '/api/products',
      update: (id: string) => `/api/products/${id}`,
      delete: (id: string) => `/api/products/${id}`,
      variants: (productId: string) => `/api/products/${productId}/variants`,
      variantById: (productId: string, variantId: string) =>
        `/api/products/${productId}/variants/${variantId}`,
      images: (productId: string) => `/api/products/${productId}/images`,
      imageById: (productId: string, imageId: string) =>
        `/api/products/${productId}/images/${imageId}`,
      features: (productId: string) => `/api/products/${productId}/features`,
    },

    // Testimonials
    testimonials: {
      list: '/api/testimonials',
      byId: (id: string) => `/api/testimonials/${id}`,
      featured: '/api/testimonials/featured',
      active: '/api/testimonials/active',
      create: '/api/testimonials',
      update: (id: string) => `/api/testimonials/${id}`,
      delete: (id: string) => `/api/testimonials/${id}`,
    },

    // Site Settings
    siteSettings: {
      list: '/api/sitesettings',
      byKey: (key: string) => `/api/sitesettings/${key}`,
      byGroup: (group: string) => `/api/sitesettings/group/${group}`,
      publicInfo: '/api/sitesettings/public/info',
      create: '/api/sitesettings',
      update: (key: string) => `/api/sitesettings/${key}`,
      delete: (key: string) => `/api/sitesettings/${key}`,
    },

    // Hero Slides
    heroSlides: {
      list: '/api/heroslides',
      byId: (id: string) => `/api/heroslides/${id}`,
      active: '/api/heroslides/active',
      create: '/api/heroslides',
      update: (id: string) => `/api/heroslides/${id}`,
      delete: (id: string) => `/api/heroslides/${id}`,
      features: (slideId: string) => `/api/heroslides/${slideId}/features`,
    },

    // Statistics
    statistics: {
      list: '/api/statistics',
      byId: (id: string) => `/api/statistics/${id}`,
      active: '/api/statistics/active',
      create: '/api/statistics',
      update: (id: string) => `/api/statistics/${id}`,
      delete: (id: string) => `/api/statistics/${id}`,
    },

    // USP Items
    uspItems: {
      list: '/api/uspitems',
      byId: (id: string) => `/api/uspitems/${id}`,
      active: '/api/uspitems/active',
      create: '/api/uspitems',
      update: (id: string) => `/api/uspitems/${id}`,
      delete: (id: string) => `/api/uspitems/${id}`,
    },

    // Company Story
    companyStory: {
      list: '/api/companystory',
      byId: (id: string) => `/api/companystory/${id}`,
      active: '/api/companystory/active',
      create: '/api/companystory',
      update: (id: string) => `/api/companystory/${id}`,
      delete: (id: string) => `/api/companystory/${id}`,
      items: (sectionId: string) => `/api/companystory/${sectionId}/items`,
      itemById: (sectionId: string, itemId: string) =>
        `/api/companystory/${sectionId}/items/${itemId}`,
    },

    // Delivery Settings
    deliverySettings: {
      get: '/api/deliverysettings',
      charges: '/api/deliverysettings/charges',
      update: '/api/deliverysettings',
    },

    // Inquiry Types
    inquiryTypes: {
      list: '/api/inquirytypes',
      byId: (id: string) => `/api/inquirytypes/${id}`,
      active: '/api/inquirytypes/active',
      create: '/api/inquirytypes',
      update: (id: string) => `/api/inquirytypes/${id}`,
      delete: (id: string) => `/api/inquirytypes/${id}`,
    },

    // Contact Submissions
    contact: {
      list: '/api/contact',
      byId: (id: string) => `/api/contact/${id}`,
      byStatus: (status: string) => `/api/contact/status/${status}`,
      submit: '/api/contact',
      updateStatus: (id: string) => `/api/contact/${id}/status`,
      delete: (id: string) => `/api/contact/${id}`,
    },
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
