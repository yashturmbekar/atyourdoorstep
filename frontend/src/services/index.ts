/**
 * Services Index
 * Central export point for all API services
 */

// Auth Service
export { authService } from './authService';
export type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
} from './authService';

// Product Service
export { productService } from './productService';

// Order Service
export { orderService } from './orderService';

// Customer Service
export { customerService } from './customerService';

// Notification Service
export { notificationService } from './notificationService';

// Content Service (CMS)
export {
  categoryService,
  contentProductService,
  testimonialService,
  siteSettingsService,
  heroSlidesService,
  statisticsService,
  uspItemsService,
  companyStoryService,
  deliverySettingsService,
  inquiryTypesService,
  contactService,
} from './contentService';
export { default as contentService } from './contentService';

// Legacy Admin API (uses real API now)
export {
  adminApi,
  productApi,
  orderApi,
  customerApi,
  analyticsApi,
} from './adminApi';

// Re-export API types
export type * from '../types/api.types';

// Re-export content types (excluding those that conflict with api.types)
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
} from '../types/content.types';
