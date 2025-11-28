using ContentService.Application.DTOs;

namespace ContentService.Application.Interfaces;

/// <summary>
/// Service interface for managing products
/// </summary>
public interface IProductService
{
    Task<ProductResponse> CreateProductAsync(CreateProductRequest request, CancellationToken cancellationToken = default);
    Task<ProductResponse> UpdateProductAsync(Guid id, UpdateProductRequest request, CancellationToken cancellationToken = default);
    Task DeleteProductAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductResponse?> GetProductByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductResponse?> GetProductBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProductListResponse>> GetAllProductsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ProductListResponse>> GetProductsByCategoryAsync(string categorySlug, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProductListResponse>> GetFeaturedProductsAsync(CancellationToken cancellationToken = default);
    
    // Public API methods (for frontend)
    Task<IEnumerable<PublicProductResponse>> GetPublicProductsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<PublicProductResponse>> GetPublicProductsByCategoryAsync(string categorySlug, CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing categories
/// </summary>
public interface ICategoryService
{
    Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest request, CancellationToken cancellationToken = default);
    Task<CategoryResponse> UpdateCategoryAsync(Guid id, UpdateCategoryRequest request, CancellationToken cancellationToken = default);
    Task DeleteCategoryAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CategoryResponse?> GetCategoryByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CategoryResponse?> GetCategoryBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<CategoryResponse>> GetActiveCategoriesAsync(CancellationToken cancellationToken = default);
    
    // Public API methods (for frontend)
    Task<IEnumerable<PublicCategoryResponse>> GetPublicCategoriesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing testimonials
/// </summary>
public interface ITestimonialService
{
    Task<TestimonialResponse> CreateTestimonialAsync(CreateTestimonialRequest request, CancellationToken cancellationToken = default);
    Task<TestimonialResponse> UpdateTestimonialAsync(Guid id, UpdateTestimonialRequest request, CancellationToken cancellationToken = default);
    Task DeleteTestimonialAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TestimonialResponse?> GetTestimonialByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<TestimonialResponse>> GetAllTestimonialsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<TestimonialResponse>> GetApprovedTestimonialsAsync(CancellationToken cancellationToken = default);
    
    // Public API methods (for frontend)
    Task<IEnumerable<PublicTestimonialResponse>> GetPublicTestimonialsAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing site settings
/// </summary>
public interface ISiteSettingService
{
    Task<SiteSettingResponse> CreateSettingAsync(CreateSiteSettingRequest request, CancellationToken cancellationToken = default);
    Task<SiteSettingResponse> UpdateSettingAsync(string key, UpdateSiteSettingRequest request, CancellationToken cancellationToken = default);
    Task DeleteSettingAsync(string key, CancellationToken cancellationToken = default);
    Task<SiteSettingResponse?> GetSettingByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<IEnumerable<SiteSettingResponse>> GetAllSettingsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<SiteSettingsGroupResponse>> GetSettingsGroupedAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<string, string>> GetSettingsAsDictionaryAsync(CancellationToken cancellationToken = default);
    
    // Public API methods (for frontend)
    Task<PublicSiteInfoResponse> GetPublicSiteInfoAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing content blocks
/// </summary>
public interface IContentBlockService
{
    Task<ContentBlockResponse> CreateContentBlockAsync(CreateContentBlockRequest request, CancellationToken cancellationToken = default);
    Task<ContentBlockResponse> UpdateContentBlockAsync(Guid id, UpdateContentBlockRequest request, CancellationToken cancellationToken = default);
    Task DeleteContentBlockAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ContentBlockResponse?> GetContentBlockByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ContentBlockResponse?> GetContentBlockByKeyAsync(string blockKey, CancellationToken cancellationToken = default);
    Task<IEnumerable<ContentBlockResponse>> GetAllContentBlocksAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ContentBlockResponse>> GetContentBlocksByPageAsync(string page, CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing hero slides
/// </summary>
public interface IHeroSlideService
{
    Task<HeroSlideResponse> CreateHeroSlideAsync(CreateHeroSlideRequest request, CancellationToken cancellationToken = default);
    Task<HeroSlideResponse> UpdateHeroSlideAsync(Guid id, UpdateHeroSlideRequest request, CancellationToken cancellationToken = default);
    Task DeleteHeroSlideAsync(Guid id, CancellationToken cancellationToken = default);
    Task<HeroSlideResponse?> GetHeroSlideByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<HeroSlideResponse>> GetAllHeroSlidesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<HeroSlideResponse>> GetActiveHeroSlidesAsync(CancellationToken cancellationToken = default);
    
    // Public API methods (for frontend)
    Task<IEnumerable<PublicHeroSlideResponse>> GetPublicHeroSlidesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing statistics
/// </summary>
public interface IStatisticService
{
    Task<StatisticResponse> CreateStatisticAsync(CreateStatisticRequest request, CancellationToken cancellationToken = default);
    Task<StatisticResponse> UpdateStatisticAsync(Guid id, UpdateStatisticRequest request, CancellationToken cancellationToken = default);
    Task DeleteStatisticAsync(Guid id, CancellationToken cancellationToken = default);
    Task<StatisticResponse?> GetStatisticByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<StatisticResponse>> GetAllStatisticsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<StatisticResponse>> GetStatisticsBySectionAsync(string section, CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing USP items
/// </summary>
public interface IUspItemService
{
    Task<UspItemResponse> CreateUspItemAsync(CreateUspItemRequest request, CancellationToken cancellationToken = default);
    Task<UspItemResponse> UpdateUspItemAsync(Guid id, UpdateUspItemRequest request, CancellationToken cancellationToken = default);
    Task DeleteUspItemAsync(Guid id, CancellationToken cancellationToken = default);
    Task<UspItemResponse?> GetUspItemByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<UspItemResponse>> GetAllUspItemsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<UspItemResponse>> GetActiveUspItemsAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing company story sections
/// </summary>
public interface ICompanyStoryService
{
    Task<CompanyStorySectionResponse> CreateSectionAsync(CreateCompanyStorySectionRequest request, CancellationToken cancellationToken = default);
    Task<CompanyStorySectionResponse> UpdateSectionAsync(Guid id, UpdateCompanyStorySectionRequest request, CancellationToken cancellationToken = default);
    Task DeleteSectionAsync(Guid id, CancellationToken cancellationToken = default);
    Task<CompanyStorySectionResponse?> GetSectionByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<CompanyStorySectionResponse>> GetAllSectionsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<CompanyStorySectionResponse>> GetActiveSectionsAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing inquiry types
/// </summary>
public interface IInquiryTypeService
{
    Task<InquiryTypeResponse> CreateInquiryTypeAsync(CreateInquiryTypeRequest request, CancellationToken cancellationToken = default);
    Task<InquiryTypeResponse> UpdateInquiryTypeAsync(Guid id, UpdateInquiryTypeRequest request, CancellationToken cancellationToken = default);
    Task DeleteInquiryTypeAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<InquiryTypeResponse>> GetAllInquiryTypesAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<InquiryTypeResponse>> GetActiveInquiryTypesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing delivery settings
/// </summary>
public interface IDeliverySettingsService
{
    Task<DeliverySettingsResponse> UpdateDeliverySettingsAsync(UpdateDeliverySettingsRequest request, CancellationToken cancellationToken = default);
    Task<DeliverySettingsResponse> GetDeliverySettingsAsync(CancellationToken cancellationToken = default);
    
    // Public API methods (for frontend)
    Task<PublicDeliveryChargesResponse> GetPublicDeliveryChargesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Service interface for managing contact submissions
/// </summary>
public interface IContactSubmissionService
{
    Task<ContactSubmissionResponse> CreateSubmissionAsync(CreateContactSubmissionRequest request, CancellationToken cancellationToken = default);
    Task<ContactSubmissionResponse> UpdateSubmissionAsync(Guid id, UpdateContactSubmissionRequest request, CancellationToken cancellationToken = default);
    Task DeleteSubmissionAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ContactSubmissionResponse?> GetSubmissionByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<ContactSubmissionResponse>> GetAllSubmissionsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ContactSubmissionResponse>> GetUnreadSubmissionsAsync(CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(CancellationToken cancellationToken = default);
}
