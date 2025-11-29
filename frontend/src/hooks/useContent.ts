/**
 * Content Hooks
 * React Query hooks for ContentService data fetching
 * Following Clean Architecture and instruction file standards
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
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
} from '../services/contentService';
import type {
  ContentQueryParams,
  ProductContentQueryParams,
  ContactQueryParams,
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
  CreateContentProductRequestDto,
  UpdateContentProductRequestDto,
  CreateTestimonialRequestDto,
  UpdateTestimonialRequestDto,
  CreateHeroSlideRequestDto,
  UpdateHeroSlideRequestDto,
  CreateStatisticRequestDto,
  UpdateStatisticRequestDto,
  CreateUspItemRequestDto,
  UpdateUspItemRequestDto,
  CreateContactSubmissionRequestDto,
} from '../types/content.types';

// Query Keys
export const contentQueryKeys = {
  // Categories
  categories: ['categories'] as const,
  categoriesActive: ['categories', 'active'] as const,
  categoryById: (id: string) => ['categories', id] as const,
  categoryBySlug: (slug: string) => ['categories', 'slug', slug] as const,

  // Products
  products: (params?: ProductContentQueryParams) =>
    ['products', params] as const,
  productsFeatured: ['products', 'featured'] as const,
  productById: (id: string) => ['products', id] as const,
  productBySlug: (slug: string) => ['products', 'slug', slug] as const,
  productsByCategory: (categoryId: string) =>
    ['products', 'category', categoryId] as const,

  // Testimonials
  testimonials: ['testimonials'] as const,
  testimonialsActive: ['testimonials', 'active'] as const,
  testimonialsFeatured: ['testimonials', 'featured'] as const,
  testimonialById: (id: string) => ['testimonials', id] as const,

  // Site Settings
  siteSettings: ['siteSettings'] as const,
  siteSettingByKey: (key: string) => ['siteSettings', key] as const,
  siteSettingsByGroup: (group: string) =>
    ['siteSettings', 'group', group] as const,
  siteInfo: ['siteSettings', 'publicInfo'] as const,

  // Hero Slides
  heroSlides: ['heroSlides'] as const,
  heroSlidesActive: ['heroSlides', 'active'] as const,
  heroSlideById: (id: string) => ['heroSlides', id] as const,

  // Statistics
  statistics: ['statistics'] as const,
  statisticsActive: ['statistics', 'active'] as const,
  statisticById: (id: string) => ['statistics', id] as const,

  // USP Items
  uspItems: ['uspItems'] as const,
  uspItemsActive: ['uspItems', 'active'] as const,
  uspItemById: (id: string) => ['uspItems', id] as const,

  // Company Story
  companyStory: ['companyStory'] as const,
  companyStoryActive: ['companyStory', 'active'] as const,
  companyStorySectionById: (id: string) => ['companyStory', id] as const,

  // Delivery Settings
  deliverySettings: ['deliverySettings'] as const,
  deliveryCharges: ['deliverySettings', 'charges'] as const,

  // Inquiry Types
  inquiryTypes: ['inquiryTypes'] as const,
  inquiryTypesActive: ['inquiryTypes', 'active'] as const,
  inquiryTypeById: (id: string) => ['inquiryTypes', id] as const,

  // Contact
  contacts: (params?: ContactQueryParams) => ['contacts', params] as const,
  contactById: (id: string) => ['contacts', id] as const,
};

// ============================================
// Category Hooks
// ============================================
export const useCategories = (params?: ContentQueryParams) => {
  return useQuery({
    queryKey: contentQueryKeys.categories,
    queryFn: () => categoryService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActiveCategories = () => {
  return useQuery({
    queryKey: contentQueryKeys.categoriesActive,
    queryFn: () => categoryService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryById = (id: string) => {
  return useQuery({
    queryKey: contentQueryKeys.categoryById(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
};

export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: contentQueryKeys.categoryBySlug(slug),
    queryFn: () => categoryService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryRequestDto) =>
      categoryService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.categories });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryRequestDto;
    }) => categoryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.categories });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.categories });
    },
  });
};

// Combined Category Mutations Hook
export const useCategoryMutations = () => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  return {
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

// ============================================
// Product Hooks (CMS)
// ============================================
export const useContentProducts = (params?: ProductContentQueryParams) => {
  return useQuery({
    queryKey: contentQueryKeys.products(params),
    queryFn: () => contentProductService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: contentQueryKeys.productsFeatured,
    queryFn: () => contentProductService.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: contentQueryKeys.productById(id),
    queryFn: () => contentProductService.getById(id),
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: contentQueryKeys.productBySlug(slug),
    queryFn: () => contentProductService.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: contentQueryKeys.productsByCategory(categoryId),
    queryFn: () => contentProductService.getByCategory(categoryId),
    enabled: !!categoryId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContentProductRequestDto) =>
      contentProductService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateContentProductRequestDto;
    }) => contentProductService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentProductService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

// ============================================
// Testimonial Hooks
// ============================================
export const useTestimonials = (params?: ContentQueryParams) => {
  return useQuery({
    queryKey: contentQueryKeys.testimonials,
    queryFn: () => testimonialService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveTestimonials = () => {
  return useQuery({
    queryKey: contentQueryKeys.testimonialsActive,
    queryFn: () => testimonialService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedTestimonials = () => {
  return useQuery({
    queryKey: contentQueryKeys.testimonialsFeatured,
    queryFn: () => testimonialService.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTestimonialById = (id: string) => {
  return useQuery({
    queryKey: contentQueryKeys.testimonialById(id),
    queryFn: () => testimonialService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTestimonialRequestDto) =>
      testimonialService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.testimonials,
      });
    },
  });
};

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateTestimonialRequestDto;
    }) => testimonialService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.testimonials,
      });
    },
  });
};

export const useDeleteTestimonial = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testimonialService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: contentQueryKeys.testimonials,
      });
    },
  });
};

// ============================================
// Site Settings Hooks
// ============================================
export const useSiteSettings = () => {
  return useQuery({
    queryKey: contentQueryKeys.siteSettings,
    queryFn: () => siteSettingsService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSiteInfo = () => {
  return useQuery({
    queryKey: contentQueryKeys.siteInfo,
    queryFn: () => siteSettingsService.getPublicInfo(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useSiteSettingsByGroup = (group: string) => {
  return useQuery({
    queryKey: contentQueryKeys.siteSettingsByGroup(group),
    queryFn: () => siteSettingsService.getByGroup(group),
    enabled: !!group,
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// Hero Slides Hooks
// ============================================
export const useHeroSlides = () => {
  return useQuery({
    queryKey: contentQueryKeys.heroSlides,
    queryFn: () => heroSlidesService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveHeroSlides = () => {
  return useQuery({
    queryKey: contentQueryKeys.heroSlidesActive,
    queryFn: () => heroSlidesService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useHeroSlideById = (id: string) => {
  return useQuery({
    queryKey: contentQueryKeys.heroSlideById(id),
    queryFn: () => heroSlidesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateHeroSlide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateHeroSlideRequestDto) =>
      heroSlidesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.heroSlides });
    },
  });
};

export const useUpdateHeroSlide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateHeroSlideRequestDto;
    }) => heroSlidesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.heroSlides });
    },
  });
};

export const useDeleteHeroSlide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => heroSlidesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.heroSlides });
    },
  });
};

// ============================================
// Statistics Hooks
// ============================================
export const useStatistics = () => {
  return useQuery({
    queryKey: contentQueryKeys.statistics,
    queryFn: () => statisticsService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveStatistics = () => {
  return useQuery({
    queryKey: contentQueryKeys.statisticsActive,
    queryFn: () => statisticsService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateStatistic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStatisticRequestDto) =>
      statisticsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.statistics });
    },
  });
};

export const useUpdateStatistic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStatisticRequestDto;
    }) => statisticsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.statistics });
    },
  });
};

export const useDeleteStatistic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => statisticsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.statistics });
    },
  });
};

// ============================================
// USP Items Hooks
// ============================================
export const useUspItems = () => {
  return useQuery({
    queryKey: contentQueryKeys.uspItems,
    queryFn: () => uspItemsService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveUspItems = () => {
  return useQuery({
    queryKey: contentQueryKeys.uspItemsActive,
    queryFn: () => uspItemsService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateUspItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateUspItemRequestDto) => uspItemsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.uspItems });
    },
  });
};

export const useUpdateUspItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUspItemRequestDto }) =>
      uspItemsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.uspItems });
    },
  });
};

export const useDeleteUspItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => uspItemsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.uspItems });
    },
  });
};

// ============================================
// Company Story Hooks
// ============================================
export const useCompanyStory = () => {
  return useQuery({
    queryKey: contentQueryKeys.companyStory,
    queryFn: () => companyStoryService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useActiveCompanyStory = () => {
  return useQuery({
    queryKey: contentQueryKeys.companyStoryActive,
    queryFn: () => companyStoryService.getActive(),
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// Delivery Settings Hooks
// ============================================
export const useDeliverySettings = () => {
  return useQuery({
    queryKey: contentQueryKeys.deliverySettings,
    queryFn: () => deliverySettingsService.get(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useDeliveryCharges = () => {
  return useQuery({
    queryKey: contentQueryKeys.deliveryCharges,
    queryFn: () => deliverySettingsService.getCharges(),
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// Inquiry Types Hooks
// ============================================
export const useInquiryTypes = () => {
  return useQuery({
    queryKey: contentQueryKeys.inquiryTypes,
    queryFn: () => inquiryTypesService.getAll(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useActiveInquiryTypes = () => {
  return useQuery({
    queryKey: contentQueryKeys.inquiryTypesActive,
    queryFn: () => inquiryTypesService.getActive(),
    staleTime: 10 * 60 * 1000,
  });
};

// ============================================
// Contact Hooks
// ============================================
export const useContacts = (params?: ContactQueryParams) => {
  return useQuery({
    queryKey: contentQueryKeys.contacts(params),
    queryFn: () => contactService.getAll(params),
    staleTime: 1 * 60 * 1000, // 1 minute - more frequent updates for admin
  });
};

export const useContactById = (id: string) => {
  return useQuery({
    queryKey: contentQueryKeys.contactById(id),
    queryFn: () => contactService.getById(id),
    enabled: !!id,
  });
};

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data: CreateContactSubmissionRequestDto) =>
      contactService.submit(data),
  });
};
