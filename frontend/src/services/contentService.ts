/**
 * Content Service
 * Handles all content-related API calls to ContentService
 * Following Clean Architecture and instruction file standards
 */

import apiClient, {
  type ApiResponse,
  type PaginatedResponse,
} from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  // Categories
  CategoryResponseDto,
  PublicCategoryResponseDto,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  // Products (Content Service - renamed to avoid conflict with ProductService)
  ContentProductResponseDto,
  ProductListResponseDto,
  PublicProductResponseDto,
  CreateContentProductRequestDto,
  UpdateContentProductRequestDto,
  CreateVariantRequestDto,
  UpdateVariantRequestDto,
  ProductVariantDto,
  CreateProductImageRequestDto,
  ProductImageDto,
  // Testimonials
  TestimonialResponseDto,
  PublicTestimonialResponseDto,
  CreateTestimonialRequestDto,
  UpdateTestimonialRequestDto,
  // Site Settings
  SiteSettingResponseDto,
  SiteSettingsGroupResponseDto,
  PublicSiteInfoResponseDto,
  CreateSiteSettingRequestDto,
  UpdateSiteSettingRequestDto,
  // Hero Slides
  HeroSlideResponseDto,
  PublicHeroSlideResponseDto,
  CreateHeroSlideRequestDto,
  UpdateHeroSlideRequestDto,
  // Statistics
  StatisticResponseDto,
  CreateStatisticRequestDto,
  UpdateStatisticRequestDto,
  // USP Items
  UspItemResponseDto,
  CreateUspItemRequestDto,
  UpdateUspItemRequestDto,
  // Company Story
  CompanyStorySectionResponseDto,
  CreateCompanyStorySectionRequestDto,
  UpdateCompanyStorySectionRequestDto,
  CreateCompanyStoryItemRequestDto,
  CompanyStoryItemDto,
  // Delivery Settings
  DeliverySettingsResponseDto,
  PublicDeliveryChargesResponseDto,
  CreateDeliverySettingsRequestDto,
  UpdateDeliverySettingsRequestDto,
  // Inquiry Types
  InquiryTypeResponseDto,
  CreateInquiryTypeRequestDto,
  UpdateInquiryTypeRequestDto,
  // Contact Submissions
  ContactSubmissionResponseDto,
  CreateContactSubmissionRequestDto,
  UpdateContactSubmissionRequestDto,
  // Query Params
  ContentQueryParams,
  ProductContentQueryParams,
  ContactQueryParams,
} from '../types/content.types';

// ============================================
// Category Service
// ============================================
export const categoryService = {
  async getAll(
    params?: ContentQueryParams
  ): Promise<PaginatedResponse<CategoryResponseDto>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.content.categories.list}?${queryParams.toString()}`
      : API_ENDPOINTS.content.categories.list;

    const response =
      await apiClient.get<PaginatedResponse<CategoryResponseDto>>(url);
    return response.data;
  },

  async getActive(): Promise<ApiResponse<PublicCategoryResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<PublicCategoryResponseDto[]>
    >(API_ENDPOINTS.content.categories.active);
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<CategoryResponseDto>> {
    const response = await apiClient.get<ApiResponse<CategoryResponseDto>>(
      API_ENDPOINTS.content.categories.byId(id)
    );
    return response.data;
  },

  async getBySlug(
    slug: string
  ): Promise<ApiResponse<PublicCategoryResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<PublicCategoryResponseDto>
    >(API_ENDPOINTS.content.categories.bySlug(slug));
    return response.data;
  },

  async create(
    data: CreateCategoryRequestDto
  ): Promise<ApiResponse<CategoryResponseDto>> {
    const response = await apiClient.post<ApiResponse<CategoryResponseDto>>(
      API_ENDPOINTS.content.categories.create,
      data
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateCategoryRequestDto
  ): Promise<ApiResponse<CategoryResponseDto>> {
    const response = await apiClient.put<ApiResponse<CategoryResponseDto>>(
      API_ENDPOINTS.content.categories.update(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.categories.delete(id)
    );
    return response.data;
  },
};

// ============================================
// Content Product Service (CMS Products)
// ============================================
export const contentProductService = {
  async getAll(
    params?: ProductContentQueryParams
  ): Promise<PaginatedResponse<ProductListResponseDto>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.productCategoryId)
      queryParams.append('categoryId', params.productCategoryId);
    if (params?.productCategorySlug)
      queryParams.append('categorySlug', params.productCategorySlug);
    if (params?.isFeatured !== undefined)
      queryParams.append('isFeatured', params.isFeatured.toString());
    if (params?.isAvailable !== undefined)
      queryParams.append('isAvailable', params.isAvailable.toString());

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.content.products.list}?${queryParams.toString()}`
      : API_ENDPOINTS.content.products.list;

    const response =
      await apiClient.get<PaginatedResponse<ProductListResponseDto>>(url);
    return response.data;
  },

  async getFeatured(): Promise<ApiResponse<PublicProductResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<PublicProductResponseDto[]>
    >(API_ENDPOINTS.content.products.featured);
    return response.data;
  },

  async getByCategory(
    categoryId: string
  ): Promise<ApiResponse<PublicProductResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<PublicProductResponseDto[]>
    >(API_ENDPOINTS.content.products.byCategory(categoryId));
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<ContentProductResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<ContentProductResponseDto>
    >(API_ENDPOINTS.content.products.byId(id));
    return response.data;
  },

  async getBySlug(
    slug: string
  ): Promise<ApiResponse<PublicProductResponseDto>> {
    const response = await apiClient.get<ApiResponse<PublicProductResponseDto>>(
      API_ENDPOINTS.content.products.bySlug(slug)
    );
    return response.data;
  },

  async create(
    data: CreateContentProductRequestDto
  ): Promise<ApiResponse<ContentProductResponseDto>> {
    const response = await apiClient.post<
      ApiResponse<ContentProductResponseDto>
    >(API_ENDPOINTS.content.products.create, data);
    return response.data;
  },

  async update(
    id: string,
    data: UpdateContentProductRequestDto
  ): Promise<ApiResponse<ContentProductResponseDto>> {
    const response = await apiClient.put<
      ApiResponse<ContentProductResponseDto>
    >(API_ENDPOINTS.content.products.update(id), data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.products.delete(id)
    );
    return response.data;
  },

  // Variants
  async addVariant(
    productId: string,
    data: CreateVariantRequestDto
  ): Promise<ApiResponse<ProductVariantDto>> {
    const response = await apiClient.post<ApiResponse<ProductVariantDto>>(
      API_ENDPOINTS.content.products.variants(productId),
      data
    );
    return response.data;
  },

  async updateVariant(
    productId: string,
    variantId: string,
    data: UpdateVariantRequestDto
  ): Promise<ApiResponse<ProductVariantDto>> {
    const response = await apiClient.put<ApiResponse<ProductVariantDto>>(
      API_ENDPOINTS.content.products.variantById(productId, variantId),
      data
    );
    return response.data;
  },

  async deleteVariant(
    productId: string,
    variantId: string
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.products.variantById(productId, variantId)
    );
    return response.data;
  },

  // Images
  async addImage(
    productId: string,
    data: CreateProductImageRequestDto
  ): Promise<ApiResponse<ProductImageDto>> {
    const response = await apiClient.post<ApiResponse<ProductImageDto>>(
      API_ENDPOINTS.content.products.images(productId),
      data
    );
    return response.data;
  },

  async deleteImage(
    productId: string,
    imageId: string
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.products.imageById(productId, imageId)
    );
    return response.data;
  },

  // Features
  async updateFeatures(
    productId: string,
    features: string[]
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      API_ENDPOINTS.content.products.features(productId),
      features
    );
    return response.data;
  },
};

// ============================================
// Testimonial Service
// ============================================
export const testimonialService = {
  async getAll(
    params?: ContentQueryParams
  ): Promise<PaginatedResponse<TestimonialResponseDto>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.content.testimonials.list}?${queryParams.toString()}`
      : API_ENDPOINTS.content.testimonials.list;

    const response =
      await apiClient.get<PaginatedResponse<TestimonialResponseDto>>(url);
    return response.data;
  },

  async getActive(): Promise<ApiResponse<PublicTestimonialResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<PublicTestimonialResponseDto[]>
    >(API_ENDPOINTS.content.testimonials.active);
    return response.data;
  },

  async getFeatured(): Promise<ApiResponse<PublicTestimonialResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<PublicTestimonialResponseDto[]>
    >(API_ENDPOINTS.content.testimonials.featured);
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<TestimonialResponseDto>> {
    const response = await apiClient.get<ApiResponse<TestimonialResponseDto>>(
      API_ENDPOINTS.content.testimonials.byId(id)
    );
    return response.data;
  },

  async create(
    data: CreateTestimonialRequestDto
  ): Promise<ApiResponse<TestimonialResponseDto>> {
    const response = await apiClient.post<ApiResponse<TestimonialResponseDto>>(
      API_ENDPOINTS.content.testimonials.create,
      data
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateTestimonialRequestDto
  ): Promise<ApiResponse<TestimonialResponseDto>> {
    const response = await apiClient.put<ApiResponse<TestimonialResponseDto>>(
      API_ENDPOINTS.content.testimonials.update(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.testimonials.delete(id)
    );
    return response.data;
  },
};

// ============================================
// Site Settings Service
// ============================================
export const siteSettingsService = {
  async getAll(): Promise<ApiResponse<SiteSettingResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<SiteSettingResponseDto[]>>(
      API_ENDPOINTS.content.siteSettings.list
    );
    return response.data;
  },

  async getByKey(key: string): Promise<ApiResponse<SiteSettingResponseDto>> {
    const response = await apiClient.get<ApiResponse<SiteSettingResponseDto>>(
      API_ENDPOINTS.content.siteSettings.byKey(key)
    );
    return response.data;
  },

  async getByGroup(
    group: string
  ): Promise<ApiResponse<SiteSettingsGroupResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<SiteSettingsGroupResponseDto>
    >(API_ENDPOINTS.content.siteSettings.byGroup(group));
    return response.data;
  },

  async getPublicInfo(): Promise<ApiResponse<PublicSiteInfoResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<PublicSiteInfoResponseDto>
    >(API_ENDPOINTS.content.siteSettings.publicInfo);
    return response.data;
  },

  async create(
    data: CreateSiteSettingRequestDto
  ): Promise<ApiResponse<SiteSettingResponseDto>> {
    const response = await apiClient.post<ApiResponse<SiteSettingResponseDto>>(
      API_ENDPOINTS.content.siteSettings.create,
      data
    );
    return response.data;
  },

  async update(
    key: string,
    data: UpdateSiteSettingRequestDto
  ): Promise<ApiResponse<SiteSettingResponseDto>> {
    const response = await apiClient.put<ApiResponse<SiteSettingResponseDto>>(
      API_ENDPOINTS.content.siteSettings.update(key),
      data
    );
    return response.data;
  },

  async delete(key: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.siteSettings.delete(key)
    );
    return response.data;
  },
};

// ============================================
// Hero Slides Service
// ============================================
export const heroSlidesService = {
  async getAll(): Promise<ApiResponse<HeroSlideResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<HeroSlideResponseDto[]>>(
      API_ENDPOINTS.content.heroSlides.list
    );
    return response.data;
  },

  async getActive(): Promise<ApiResponse<PublicHeroSlideResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<PublicHeroSlideResponseDto[]>
    >(API_ENDPOINTS.content.heroSlides.active);
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<HeroSlideResponseDto>> {
    const response = await apiClient.get<ApiResponse<HeroSlideResponseDto>>(
      API_ENDPOINTS.content.heroSlides.byId(id)
    );
    return response.data;
  },

  async create(
    data: CreateHeroSlideRequestDto
  ): Promise<ApiResponse<HeroSlideResponseDto>> {
    const response = await apiClient.post<ApiResponse<HeroSlideResponseDto>>(
      API_ENDPOINTS.content.heroSlides.create,
      data
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateHeroSlideRequestDto
  ): Promise<ApiResponse<HeroSlideResponseDto>> {
    const response = await apiClient.put<ApiResponse<HeroSlideResponseDto>>(
      API_ENDPOINTS.content.heroSlides.update(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.heroSlides.delete(id)
    );
    return response.data;
  },

  async updateFeatures(
    slideId: string,
    features: string[]
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.put<ApiResponse<void>>(
      API_ENDPOINTS.content.heroSlides.features(slideId),
      features
    );
    return response.data;
  },
};

// ============================================
// Statistics Service
// ============================================
export const statisticsService = {
  async getAll(): Promise<ApiResponse<StatisticResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<StatisticResponseDto[]>>(
      API_ENDPOINTS.content.statistics.list
    );
    return response.data;
  },

  async getActive(): Promise<ApiResponse<StatisticResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<StatisticResponseDto[]>>(
      API_ENDPOINTS.content.statistics.active
    );
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<StatisticResponseDto>> {
    const response = await apiClient.get<ApiResponse<StatisticResponseDto>>(
      API_ENDPOINTS.content.statistics.byId(id)
    );
    return response.data;
  },

  async create(
    data: CreateStatisticRequestDto
  ): Promise<ApiResponse<StatisticResponseDto>> {
    const response = await apiClient.post<ApiResponse<StatisticResponseDto>>(
      API_ENDPOINTS.content.statistics.create,
      data
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateStatisticRequestDto
  ): Promise<ApiResponse<StatisticResponseDto>> {
    const response = await apiClient.put<ApiResponse<StatisticResponseDto>>(
      API_ENDPOINTS.content.statistics.update(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.statistics.delete(id)
    );
    return response.data;
  },
};

// ============================================
// USP Items Service
// ============================================
export const uspItemsService = {
  async getAll(): Promise<ApiResponse<UspItemResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<UspItemResponseDto[]>>(
      API_ENDPOINTS.content.uspItems.list
    );
    return response.data;
  },

  async getActive(): Promise<ApiResponse<UspItemResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<UspItemResponseDto[]>>(
      API_ENDPOINTS.content.uspItems.active
    );
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<UspItemResponseDto>> {
    const response = await apiClient.get<ApiResponse<UspItemResponseDto>>(
      API_ENDPOINTS.content.uspItems.byId(id)
    );
    return response.data;
  },

  async create(
    data: CreateUspItemRequestDto
  ): Promise<ApiResponse<UspItemResponseDto>> {
    const response = await apiClient.post<ApiResponse<UspItemResponseDto>>(
      API_ENDPOINTS.content.uspItems.create,
      data
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateUspItemRequestDto
  ): Promise<ApiResponse<UspItemResponseDto>> {
    const response = await apiClient.put<ApiResponse<UspItemResponseDto>>(
      API_ENDPOINTS.content.uspItems.update(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.uspItems.delete(id)
    );
    return response.data;
  },
};

// ============================================
// Company Story Service
// ============================================
export const companyStoryService = {
  async getAll(): Promise<ApiResponse<CompanyStorySectionResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<CompanyStorySectionResponseDto[]>
    >(API_ENDPOINTS.content.companyStory.list);
    return response.data;
  },

  async getActive(): Promise<ApiResponse<CompanyStorySectionResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<CompanyStorySectionResponseDto[]>
    >(API_ENDPOINTS.content.companyStory.active);
    return response.data;
  },

  async getById(
    id: string
  ): Promise<ApiResponse<CompanyStorySectionResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<CompanyStorySectionResponseDto>
    >(API_ENDPOINTS.content.companyStory.byId(id));
    return response.data;
  },

  async create(
    data: CreateCompanyStorySectionRequestDto
  ): Promise<ApiResponse<CompanyStorySectionResponseDto>> {
    const response = await apiClient.post<
      ApiResponse<CompanyStorySectionResponseDto>
    >(API_ENDPOINTS.content.companyStory.create, data);
    return response.data;
  },

  async update(
    id: string,
    data: UpdateCompanyStorySectionRequestDto
  ): Promise<ApiResponse<CompanyStorySectionResponseDto>> {
    const response = await apiClient.put<
      ApiResponse<CompanyStorySectionResponseDto>
    >(API_ENDPOINTS.content.companyStory.update(id), data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.companyStory.delete(id)
    );
    return response.data;
  },

  async addItem(
    sectionId: string,
    data: CreateCompanyStoryItemRequestDto
  ): Promise<ApiResponse<CompanyStoryItemDto>> {
    const response = await apiClient.post<ApiResponse<CompanyStoryItemDto>>(
      API_ENDPOINTS.content.companyStory.items(sectionId),
      data
    );
    return response.data;
  },

  async deleteItem(
    sectionId: string,
    itemId: string
  ): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.companyStory.itemById(sectionId, itemId)
    );
    return response.data;
  },
};

// ============================================
// Delivery Settings Service
// ============================================
export const deliverySettingsService = {
  async get(): Promise<ApiResponse<DeliverySettingsResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<DeliverySettingsResponseDto>
    >(API_ENDPOINTS.content.deliverySettings.get);
    return response.data;
  },

  async getCharges(): Promise<ApiResponse<PublicDeliveryChargesResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<PublicDeliveryChargesResponseDto>
    >(API_ENDPOINTS.content.deliverySettings.charges);
    return response.data;
  },

  async create(
    data: CreateDeliverySettingsRequestDto
  ): Promise<ApiResponse<DeliverySettingsResponseDto>> {
    const response = await apiClient.post<
      ApiResponse<DeliverySettingsResponseDto>
    >(API_ENDPOINTS.content.deliverySettings.get, data);
    return response.data;
  },

  async update(
    data: UpdateDeliverySettingsRequestDto
  ): Promise<ApiResponse<DeliverySettingsResponseDto>> {
    const response = await apiClient.put<
      ApiResponse<DeliverySettingsResponseDto>
    >(API_ENDPOINTS.content.deliverySettings.update, data);
    return response.data;
  },
};

// ============================================
// Inquiry Types Service
// ============================================
export const inquiryTypesService = {
  async getAll(): Promise<ApiResponse<InquiryTypeResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<InquiryTypeResponseDto[]>>(
      API_ENDPOINTS.content.inquiryTypes.list
    );
    return response.data;
  },

  async getActive(): Promise<ApiResponse<InquiryTypeResponseDto[]>> {
    const response = await apiClient.get<ApiResponse<InquiryTypeResponseDto[]>>(
      API_ENDPOINTS.content.inquiryTypes.active
    );
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<InquiryTypeResponseDto>> {
    const response = await apiClient.get<ApiResponse<InquiryTypeResponseDto>>(
      API_ENDPOINTS.content.inquiryTypes.byId(id)
    );
    return response.data;
  },

  async create(
    data: CreateInquiryTypeRequestDto
  ): Promise<ApiResponse<InquiryTypeResponseDto>> {
    const response = await apiClient.post<ApiResponse<InquiryTypeResponseDto>>(
      API_ENDPOINTS.content.inquiryTypes.create,
      data
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateInquiryTypeRequestDto
  ): Promise<ApiResponse<InquiryTypeResponseDto>> {
    const response = await apiClient.put<ApiResponse<InquiryTypeResponseDto>>(
      API_ENDPOINTS.content.inquiryTypes.update(id),
      data
    );
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.inquiryTypes.delete(id)
    );
    return response.data;
  },
};

// ============================================
// Contact Submissions Service
// ============================================
export const contactService = {
  async getAll(
    params?: ContactQueryParams
  ): Promise<PaginatedResponse<ContactSubmissionResponseDto>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize)
      queryParams.append('pageSize', params.pageSize.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = queryParams.toString()
      ? `${API_ENDPOINTS.content.contact.list}?${queryParams.toString()}`
      : API_ENDPOINTS.content.contact.list;

    const response =
      await apiClient.get<PaginatedResponse<ContactSubmissionResponseDto>>(url);
    return response.data;
  },

  async getById(
    id: string
  ): Promise<ApiResponse<ContactSubmissionResponseDto>> {
    const response = await apiClient.get<
      ApiResponse<ContactSubmissionResponseDto>
    >(API_ENDPOINTS.content.contact.byId(id));
    return response.data;
  },

  async getByStatus(
    status: string
  ): Promise<ApiResponse<ContactSubmissionResponseDto[]>> {
    const response = await apiClient.get<
      ApiResponse<ContactSubmissionResponseDto[]>
    >(API_ENDPOINTS.content.contact.byStatus(status));
    return response.data;
  },

  async submit(
    data: CreateContactSubmissionRequestDto
  ): Promise<ApiResponse<ContactSubmissionResponseDto>> {
    const response = await apiClient.post<
      ApiResponse<ContactSubmissionResponseDto>
    >(API_ENDPOINTS.content.contact.submit, data);
    return response.data;
  },

  async updateStatus(
    id: string,
    data: UpdateContactSubmissionRequestDto
  ): Promise<ApiResponse<ContactSubmissionResponseDto>> {
    const response = await apiClient.put<
      ApiResponse<ContactSubmissionResponseDto>
    >(API_ENDPOINTS.content.contact.updateStatus(id), data);
    return response.data;
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.content.contact.delete(id)
    );
    return response.data;
  },
};

// Export all services
export default {
  categories: categoryService,
  products: contentProductService,
  testimonials: testimonialService,
  siteSettings: siteSettingsService,
  heroSlides: heroSlidesService,
  statistics: statisticsService,
  uspItems: uspItemsService,
  companyStory: companyStoryService,
  deliverySettings: deliverySettingsService,
  inquiryTypes: inquiryTypesService,
  contact: contactService,
};
