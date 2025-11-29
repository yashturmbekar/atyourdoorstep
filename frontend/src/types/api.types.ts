/**
 * API Response Types - Matching Backend DTOs
 * Following Clean Architecture standards
 */

// ============================================
// Common Response Envelope Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  meta?: PaginationMeta;
  errors?: string[];
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ============================================
// Auth Service DTOs
// ============================================

export interface RegisterRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface RevokeTokenRequestDto {
  refreshToken: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  createdAt: string;
}

// ============================================
// Customer Service DTOs
// ============================================

export interface CreateCustomerRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  userId?: string;
}

export interface UpdateCustomerRequestDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface CustomerResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Product Service DTOs - Matching Backend ContentService
// ============================================

export interface ProductVariantResponseDto {
  id: string;
  size: string;
  unit: string;
  price: number;
  discountedPrice?: number;
  stockQuantity: number;
  sku?: string;
  isAvailable: boolean;
}

export interface ProductImageResponseDto {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface ProductResponseDto {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  categoryId: string;
  categoryName?: string;
  basePrice: number;
  discountedPrice?: number;
  isFeatured: boolean;
  isAvailable: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryImageUrl?: string;
  variants: ProductVariantResponseDto[];
  features: string[];
  images: ProductImageResponseDto[];
}

export interface CreateProductRequestDto {
  name: string;
  shortDescription: string;
  fullDescription?: string;
  categoryId: string;
  basePrice: number;
  discountedPrice?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  metaTitle?: string;
  metaDescription?: string;
  features?: string[];
  variants?: Omit<ProductVariantResponseDto, 'id'>[];
  images?: { url: string; altText?: string }[];
}

export interface UpdateProductRequestDto {
  name?: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId?: string;
  basePrice?: number;
  discountedPrice?: number;
  isFeatured?: boolean;
  isAvailable?: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  metaTitle?: string;
  metaDescription?: string;
  features?: string[];
}

// ============================================
// Order Service DTOs
// ============================================

export const OrderStatus = {
  Pending: 0,
  Confirmed: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 5,
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.Confirmed]: 'Confirmed',
  [OrderStatus.Processing]: 'Processing',
  [OrderStatus.Shipped]: 'Shipped',
  [OrderStatus.Delivered]: 'Delivered',
  [OrderStatus.Cancelled]: 'Cancelled',
};

export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequestDto {
  customerId: string;
  items: CreateOrderItemDto[];
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPostalCode?: string;
  deliveryCountry?: string;
  notes?: string;
}

export interface UpdateOrderStatusRequestDto {
  status: OrderStatus;
  trackingNumber?: string;
}

export interface OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subTotal: number;
  discountAmount?: number;
}

export interface OrderResponseDto {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  statusText: string;
  totalAmount: number;
  subTotal: number;
  taxAmount?: number;
  shippingAmount?: number;
  discountAmount?: number;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPostalCode?: string;
  deliveryCountry?: string;
  deliveredAt?: string;
  shippedAt?: string;
  notes?: string;
  trackingNumber?: string;
  items: OrderItemResponseDto[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Notification Service DTOs
// ============================================

export const NotificationType = {
  OrderUpdate: 0,
  Promotion: 1,
  System: 2,
  Reminder: 3,
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationStatus = {
  Pending: 0,
  Sent: 1,
  Read: 2,
  Failed: 3,
} as const;

export type NotificationStatus =
  (typeof NotificationStatus)[keyof typeof NotificationStatus];

export interface SubscribeRequestDto {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface SendNotificationRequestDto {
  userId: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: string;
  type: NotificationType;
}

export interface BroadcastNotificationRequestDto {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  type: NotificationType;
}

export interface MarkAsReadRequestDto {
  notificationId: string;
  userId: string;
}

export interface SubscriptionResponseDto {
  id: string;
  userId: string;
  endpoint: string;
  isActive: boolean;
  createdAt: string;
}

export interface NotificationResponseDto {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
  sentAt?: string;
  readAt?: string;
}

// ============================================
// Query Parameters
// ============================================

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  isAvailable?: boolean;
}

export interface CustomerQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface OrderQueryParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  customerId?: string;
}

export interface NotificationQueryParams {
  page?: number;
  pageSize?: number;
}
