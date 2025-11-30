// Common type definitions for the application

// Re-export API types
export * from './api.types';

// Re-export Content types (excluding those that conflict with api.types)
export type {
  // Categories
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  CategoryResponseDto,
  PublicCategoryResponseDto,
  // Content Products (renamed to avoid conflict)
  CreateContentProductRequestDto,
  UpdateContentProductRequestDto,
  ContentProductResponseDto,
  ProductListResponseDto,
  PublicProductResponseDto,
  CreateVariantRequestDto,
  UpdateVariantRequestDto,
  ProductVariantDto,
  CreateProductImageRequestDto,
  ProductImageDto,
  // Testimonials
  CreateTestimonialRequestDto,
  UpdateTestimonialRequestDto,
  TestimonialResponseDto,
  PublicTestimonialResponseDto,
  // Site Settings
  CreateSiteSettingRequestDto,
  UpdateSiteSettingRequestDto,
  SiteSettingResponseDto,
  SiteSettingsGroupResponseDto,
  PublicSiteInfoResponseDto,
  // Hero Slides
  CreateHeroSlideRequestDto,
  UpdateHeroSlideRequestDto,
  HeroSlideResponseDto,
  PublicHeroSlideResponseDto,
  // Statistics
  CreateStatisticRequestDto,
  UpdateStatisticRequestDto,
  StatisticResponseDto,
  // USP Items
  CreateUspItemRequestDto,
  UpdateUspItemRequestDto,
  UspItemResponseDto,
  // Company Story
  CreateCompanyStorySectionRequestDto,
  UpdateCompanyStorySectionRequestDto,
  CreateCompanyStoryItemRequestDto,
  CompanyStoryItemDto,
  CompanyStorySectionResponseDto,
  // Inquiry Types
  CreateInquiryTypeRequestDto,
  UpdateInquiryTypeRequestDto,
  InquiryTypeResponseDto,
  // Delivery Settings
  CreateDeliverySettingsRequestDto,
  UpdateDeliverySettingsRequestDto,
  DeliverySettingsResponseDto,
  DeliveryChargeResponseDto,
  PublicDeliveryChargesResponseDto,
  // Contact Submissions
  CreateContactSubmissionRequestDto,
  UpdateContactSubmissionRequestDto,
  ContactSubmissionResponseDto,
  // Content Blocks
  CreateContentBlockRequestDto,
  UpdateContentBlockRequestDto,
  ContentBlockResponseDto,
  // Query Params
  ContentQueryParams,
  ProductContentQueryParams,
  ContactQueryParams,
} from './content.types';

export interface User {
  id: string;
  name: string;
  email: string;
}

// Address Type
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Customer Types
export interface Customer extends User {
  phone?: string;
  address?: Address;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalSpent: number;
}

// Admin Types
export interface AdminUser extends User {
  role: 'admin' | 'super_admin' | 'manager' | 'user';
  permissions: AdminPermission[];
  lastLogin?: Date;
  isActive: boolean;
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string;
  module:
    | 'products'
    | 'orders'
    | 'users'
    | 'analytics'
    | 'settings'
    | 'content';
}

export interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
  ordersToday: number;
  monthlyRevenue: number[];
  ordersByStatus: { [status: string]: number };
}

// Component Props
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

// Product Types
export interface ProductVariant {
  id: string;
  size: string;
  price: number;
  unit: string;
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  costPrice?: number;
  discountPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string; // Changed from union type to string for more flexibility
  description: string;
  image: string;
  // Base64 image data support
  primaryImageBase64?: string;
  primaryImageContentType?: string;
  variants: ProductVariant[];
  features?: string[];
  isActive?: boolean;
  tags?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

// Extended Product Types for Admin
export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
  isActive: boolean;
  tags: string[];
  weight?: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle: string;
  seoDescription: string;
  variants: ProductVariantFormData[];
}

export interface ProductVariantFormData {
  size: string;
  price: number;
  unit: string;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  costPrice: number;
  discountPrice?: number;
}

// Order Types
export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  variantSize: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  pincode: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingNumber?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'online' | 'card' | 'upi';
  notes?: string;
  adminNotes?: string;
  assignedTo?: string;
  shippingAddress?: CustomerInfo;
  billingAddress?: CustomerInfo;
}

// Extended Order Types for Admin
export interface OrderFormData {
  customerInfo: CustomerInfo;
  items: OrderItem[];
  status: Order['status'];
  paymentStatus: Order['paymentStatus'];
  paymentMethod: Order['paymentMethod'];
  estimatedDelivery?: Date;
  trackingNumber?: string;
  notes?: string;
  adminNotes?: string;
  assignedTo?: string;
  shippingAddress?: CustomerInfo;
  billingAddress?: CustomerInfo;
}

export interface OrderFilters {
  status?: Order['status'][];
  paymentStatus?: Order['paymentStatus'][];
  dateRange?: {
    from: Date;
    to: Date;
  };
  customerId?: string;
  assignedTo?: string;
  search?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
