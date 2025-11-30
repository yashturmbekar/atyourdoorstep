/**
 * Content Service Types - Matching ContentService Backend DTOs
 * Following Clean Architecture standards
 *
 * UPDATED: 2025-11-30
 * - Renamed Category → ProductCategory
 * - Removed all imageUrl fields (upload only via imageBase64)
 */

// ============================================
// Product Category DTOs (renamed from Category)
// ============================================

export interface CreateProductCategoryRequestDto {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageBase64?: string;
  imageContentType?: string;
  displayOrder?: number;
  isActive?: boolean;
  parentId?: string;
}

export interface UpdateProductCategoryRequestDto {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageBase64?: string;
  imageContentType?: string;
  displayOrder: number;
  isActive: boolean;
  parentId?: string;
}

export interface ProductCategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageBase64?: string;
  imageContentType?: string;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
}

export interface PublicProductCategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  imageBase64?: string;
  imageContentType?: string;
  productCount: number;
}

// Legacy aliases for backward compatibility
/** @deprecated Use ProductCategoryResponseDto instead */
export type CategoryResponseDto = ProductCategoryResponseDto;
/** @deprecated Use CreateProductCategoryRequestDto instead */
export type CreateCategoryRequestDto = CreateProductCategoryRequestDto;
/** @deprecated Use UpdateProductCategoryRequestDto instead */
export type UpdateCategoryRequestDto = UpdateProductCategoryRequestDto;
/** @deprecated Use PublicProductCategoryResponseDto instead */
export type PublicCategoryResponseDto = PublicProductCategoryResponseDto;

// ============================================
// Content Product DTOs (ContentService - different from ProductService)
// ============================================

export interface CreateContentProductRequestDto {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  productCategoryId: string;
  basePrice: number;
  discountedPrice?: number;
  isFeatured: boolean;
  isAvailable?: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  metaTitle?: string;
  metaDescription?: string;
  variants?: CreateVariantRequestDto[];
  features?: string[];
  images?: CreateProductImageRequestDto[];
}

export interface UpdateContentProductRequestDto {
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  productCategoryId: string;
  basePrice: number;
  discountedPrice?: number;
  isFeatured: boolean;
  isAvailable: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface CreateVariantRequestDto {
  size: string;
  unit: string;
  price: number;
  discountedPrice?: number;
  stockQuantity?: number;
  sku?: string;
  isAvailable?: boolean;
}

export interface UpdateVariantRequestDto {
  size: string;
  unit: string;
  price: number;
  discountedPrice?: number;
  stockQuantity: number;
  sku?: string;
  isAvailable: boolean;
}

export interface CreateProductImageRequestDto {
  imageBase64?: string;
  imageContentType?: string;
  altText?: string;
}

export interface ProductVariantDto {
  id: string;
  size: string;
  unit: string;
  price: number;
  discountedPrice?: number;
  stockQuantity: number;
  sku?: string;
  isAvailable: boolean;
}

export interface ProductImageDto {
  id: string;
  imageBase64?: string;
  imageContentType?: string;
  altText?: string;
  isPrimary: boolean;
}

export interface ContentProductResponseDto {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  productCategoryId: string;
  productCategoryName?: string;
  basePrice: number;
  discountedPrice?: number;
  isFeatured: boolean;
  isAvailable: boolean;
  seasonStart?: string;
  seasonEnd?: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryImageBase64?: string;
  primaryImageContentType?: string;
  variants: ProductVariantDto[];
  features: string[];
  images: ProductImageDto[];
}

export interface ProductListResponseDto {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  productCategoryName?: string;
  basePrice: number;
  discountedPrice?: number;
  isFeatured: boolean;
  isAvailable: boolean;
  primaryImageBase64?: string;
  primaryImageContentType?: string;
}

export interface PublicProductResponseDto {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  productCategoryName?: string;
  productCategorySlug?: string;
  basePrice: number;
  discountedPrice?: number;
  seasonStart?: string;
  seasonEnd?: string;
  primaryImageBase64?: string;
  primaryImageContentType?: string;
  variants: ProductVariantDto[];
  features: string[];
  images: ProductImageDto[];
}

// ============================================
// Testimonial DTOs
// ============================================

export interface CreateTestimonialRequestDto {
  customerName: string;
  customerTitle?: string;
  customerLocation?: string;
  customerImageBase64?: string;
  customerImageContentType?: string;
  content: string;
  rating?: number;
  productPurchased?: string;
  isFeatured: boolean;
  isActive?: boolean;
  displayOrder: number;
}

export interface UpdateTestimonialRequestDto {
  customerName: string;
  customerTitle?: string;
  customerLocation?: string;
  customerImageBase64?: string;
  customerImageContentType?: string;
  content: string;
  rating: number;
  productPurchased?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface TestimonialResponseDto {
  id: string;
  customerName: string;
  customerTitle?: string;
  customerLocation?: string;
  customerImageBase64?: string;
  customerImageContentType?: string;
  content: string;
  rating: number;
  productPurchased?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
}

export interface PublicTestimonialResponseDto {
  id: string;
  customerName: string;
  customerTitle?: string;
  customerLocation?: string;
  customerImageBase64?: string;
  customerImageContentType?: string;
  content: string;
  rating: number;
  productPurchased?: string;
}

// ============================================
// Site Settings DTOs
// ============================================

export interface CreateSiteSettingRequestDto {
  key: string;
  value: string;
  group?: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateSiteSettingRequestDto {
  value: string;
  description?: string;
  isPublic?: boolean;
}

export interface SiteSettingResponseDto {
  id: string;
  key: string;
  value: string;
  group: string;
  description?: string;
  isPublic: boolean;
}

export interface SiteSettingsGroupResponseDto {
  group: string;
  settings: SiteSettingResponseDto[];
}

export interface PublicSiteInfoResponseDto {
  companyName: string;
  tagLine?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks: Record<string, string>;
}

// ============================================
// Hero Slide DTOs
// ============================================

export interface CreateHeroSlideRequestDto {
  title: string;
  subtitle?: string;
  description?: string;
  imageBase64?: string;
  imageContentType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  ctaText?: string;
  ctaLink?: string;
  displayOrder: number;
  isActive?: boolean;
  features?: string[];
}

export interface UpdateHeroSlideRequestDto {
  title: string;
  subtitle?: string;
  description?: string;
  imageBase64?: string;
  imageContentType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  ctaText?: string;
  ctaLink?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface HeroSlideResponseDto {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageBase64?: string;
  imageContentType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  ctaText?: string;
  ctaLink?: string;
  displayOrder: number;
  isActive: boolean;
  features: string[];
}

export interface PublicHeroSlideResponseDto {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageBase64?: string;
  imageContentType?: string;
  gradientStart?: string;
  gradientEnd?: string;
  ctaText?: string;
  ctaLink?: string;
  features: string[];
}

// ============================================
// Statistic DTOs
// ============================================

export interface CreateStatisticRequestDto {
  label: string;
  value: string;
  suffix?: string;
  icon?: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateStatisticRequestDto {
  label: string;
  value: string;
  suffix?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface StatisticResponseDto {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

// ============================================
// USP Item DTOs
// ============================================

export interface CreateUspItemRequestDto {
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateUspItemRequestDto {
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface UspItemResponseDto {
  id: string;
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

// ============================================
// Company Story DTOs
// ============================================

export interface CreateCompanyStorySectionRequestDto {
  sectionType: string;
  title: string;
  subtitle?: string;
  content: string;
  imageBase64?: string;
  imageContentType?: string;
  displayOrder: number;
  isActive?: boolean;
  items?: CreateCompanyStoryItemRequestDto[];
}

export interface UpdateCompanyStorySectionRequestDto {
  sectionType: string;
  title: string;
  subtitle?: string;
  content: string;
  imageBase64?: string;
  imageContentType?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface CreateCompanyStoryItemRequestDto {
  title: string;
  description: string;
  icon?: string;
}

export interface CompanyStoryItemDto {
  id: string;
  title: string;
  description: string;
  icon?: string;
  displayOrder: number;
}

export interface CompanyStorySectionResponseDto {
  id: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  content: string;
  imageBase64?: string;
  imageContentType?: string;
  displayOrder: number;
  isActive: boolean;
  items: CompanyStoryItemDto[];
}

// ============================================
// Inquiry Type DTOs
// ============================================

export interface CreateInquiryTypeRequestDto {
  name: string;
  value: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateInquiryTypeRequestDto {
  name: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

export interface InquiryTypeResponseDto {
  id: string;
  name: string;
  value: string;
  displayOrder: number;
  isActive: boolean;
}

// ============================================
// Delivery Settings DTOs
// ============================================

export interface CreateDeliverySettingsRequestDto {
  freeDeliveryThreshold: number;
  standardDeliveryCharge: number;
  expressDeliveryCharge?: number;
  estimatedDeliveryDays?: number;
  expressDeliveryDays?: number;
}

export interface UpdateDeliverySettingsRequestDto {
  freeDeliveryThreshold: number;
  standardDeliveryCharge: number;
  expressDeliveryCharge?: number;
  estimatedDeliveryDays: number;
  expressDeliveryDays?: number;
}

export interface DeliverySettingsResponseDto {
  id: string;
  freeDeliveryThreshold?: number;
  defaultDeliveryCharge: number;
  minOrderAmount: number;
  isDeliveryEnabled: boolean;
  estimatedDeliveryDays?: number;
  expressDeliveryDays?: number;
  isActive: boolean;
}

export interface DeliveryChargeResponseDto {
  id: string;
  zoneName: string;
  minOrderAmount: number;
  chargeAmount: number;
  freeDeliveryThreshold: number | null;
  estimatedMinDays: number;
  estimatedMaxDays: number;
  isActive: boolean;
}

export interface PublicDeliveryChargesResponseDto {
  freeDeliveryThreshold: number;
  standardDeliveryCharge: number;
  expressDeliveryCharge?: number;
  estimatedDeliveryDays: number;
  expressDeliveryDays?: number;
}

// ============================================
// Contact Submission DTOs
// ============================================

export interface CreateContactSubmissionRequestDto {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
}

export interface UpdateContactSubmissionRequestDto {
  status: string;
  adminNotes?: string;
}

export interface ContactSubmissionResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  subject: string;
  message: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Content Block DTOs
// ============================================

export interface CreateContentBlockRequestDto {
  blockKey: string;
  page: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
  linkUrl?: string;
  linkText?: string;
  displayOrder: number;
  isActive?: boolean;
}

export interface UpdateContentBlockRequestDto {
  title?: string;
  subtitle?: string;
  content?: string;
  linkUrl?: string;
  linkText?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ContentBlockResponseDto {
  id: string;
  blockKey: string;
  page: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
  linkUrl?: string;
  linkText?: string;
  displayOrder: number;
  isActive: boolean;
}

// ============================================
// Query Parameters
// ============================================

export interface ContentQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface ProductContentQueryParams extends ContentQueryParams {
  productCategoryId?: string;
  productCategorySlug?: string;
  isFeatured?: boolean;
  isAvailable?: boolean;
}

export interface ContactQueryParams extends ContentQueryParams {
  status?: string;
  inquiryType?: string;
  startDate?: string;
  endDate?: string;
}
