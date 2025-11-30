using ContentService.Domain.Entities;
using Shared.Application.Interfaces;

namespace ContentService.Application.Interfaces;

/// <summary>
/// Repository interface for ProductCategory entity
/// </summary>
public interface IProductCategoryRepository : IRepository<ProductCategory>
{
    Task<ProductCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<IEnumerable<ProductCategory>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<ProductCategory>> GetWithProductCountAsync(CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

// Legacy alias for backward compatibility
public interface ICategoryRepository : IProductCategoryRepository { }

/// <summary>
/// Repository interface for Product entity
/// </summary>
public interface IProductRepository : IRepository<Product>
{
    Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<Product?> GetWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Product> Products, int Total)> GetPagedWithDetailsAsync(int page, int pageSize, string? categorySlug = null, bool? isFeatured = null, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetByProductCategoryAsync(Guid productCategoryId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetByProductCategorySlugAsync(string productCategorySlug, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetFeaturedAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetFeaturedProductsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetAvailableAsync(CancellationToken cancellationToken = default);
    Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for ProductVariant entity
/// </summary>
public interface IProductVariantRepository : IRepository<ProductVariant>
{
    Task<IEnumerable<ProductVariant>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task<ProductVariant?> GetBySkuAsync(string sku, CancellationToken cancellationToken = default);
    Task DeleteByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for ProductFeature entity
/// </summary>
public interface IProductFeatureRepository : IRepository<ProductFeature>
{
    Task<IEnumerable<ProductFeature>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task DeleteByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for ProductImage entity
/// </summary>
public interface IProductImageRepository : IRepository<ProductImage>
{
    Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task DeleteByProductIdAsync(Guid productId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for Testimonial entity
/// </summary>
public interface ITestimonialRepository : IRepository<Testimonial>
{
    Task<IEnumerable<Testimonial>> GetApprovedAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Testimonial>> GetFeaturedAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Testimonial>> GetActiveTestimonialsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Testimonial>> GetFeaturedTestimonialsAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for SiteSetting entity
/// </summary>
public interface ISiteSettingRepository : IRepository<SiteSetting>
{
    Task<SiteSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<IEnumerable<SiteSetting>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default);
    Task<IEnumerable<SiteSetting>> GetByGroupAsync(string group, CancellationToken cancellationToken = default);
    Task<IEnumerable<SiteSetting>> GetPublicSettingsAsync(CancellationToken cancellationToken = default);
    Task<Dictionary<string, string>> GetAllAsDictionaryAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for ContentBlock entity
/// </summary>
public interface IContentBlockRepository : IRepository<ContentBlock>
{
    Task<ContentBlock?> GetByKeyAsync(string blockKey, CancellationToken cancellationToken = default);
    Task<IEnumerable<ContentBlock>> GetByPageAsync(string page, CancellationToken cancellationToken = default);
    Task<IEnumerable<ContentBlock>> GetBySectionAsync(string page, string section, CancellationToken cancellationToken = default);
    Task<IEnumerable<ContentBlock>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for HeroSlide entity
/// </summary>
public interface IHeroSlideRepository : IRepository<HeroSlide>
{
    Task<IEnumerable<HeroSlide>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<HeroSlide>> GetActiveSlidesAsync(CancellationToken cancellationToken = default);
    Task<HeroSlide?> GetWithFeaturesAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for HeroSlideFeature entity
/// </summary>
public interface IHeroSlideFeatureRepository : IRepository<HeroSlideFeature>
{
    Task<IEnumerable<HeroSlideFeature>> GetBySlideIdAsync(Guid slideId, CancellationToken cancellationToken = default);
    Task DeleteBySlideIdAsync(Guid slideId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for Statistic entity
/// </summary>
public interface IStatisticRepository : IRepository<Statistic>
{
    Task<IEnumerable<Statistic>> GetBySectionAsync(string section, CancellationToken cancellationToken = default);
    Task<IEnumerable<Statistic>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Statistic>> GetActiveStatisticsAsync(CancellationToken cancellationToken = default);
    Task<Statistic?> GetByLabelAsync(string label, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for UspItem entity
/// </summary>
public interface IUspItemRepository : IRepository<UspItem>
{
    Task<IEnumerable<UspItem>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for CompanyStorySection entity
/// </summary>
public interface ICompanyStorySectionRepository : IRepository<CompanyStorySection>
{
    Task<IEnumerable<CompanyStorySection>> GetActiveWithItemsAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<CompanyStorySection>> GetActiveSectionsWithItemsAsync(CancellationToken cancellationToken = default);
    Task<CompanyStorySection?> GetByKeyAsync(string sectionKey, CancellationToken cancellationToken = default);
    Task<CompanyStorySection?> GetWithItemsAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for CompanyStoryItem entity
/// </summary>
public interface ICompanyStoryItemRepository : IRepository<CompanyStoryItem>
{
    Task<IEnumerable<CompanyStoryItem>> GetBySectionIdAsync(Guid sectionId, CancellationToken cancellationToken = default);
    Task DeleteBySectionIdAsync(Guid sectionId, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for InquiryType entity
/// </summary>
public interface IInquiryTypeRepository : IRepository<InquiryType>
{
    Task<IEnumerable<InquiryType>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<InquiryType>> GetActiveTypesAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for DeliverySettings entity
/// </summary>
public interface IDeliverySettingsRepository : IRepository<DeliverySettings>
{
    Task<DeliverySettings?> GetCurrentAsync(CancellationToken cancellationToken = default);
    Task<DeliverySettings?> GetActiveSettingsAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Repository interface for ContactSubmission entity
/// </summary>
public interface IContactSubmissionRepository : IRepository<ContactSubmission>
{
    Task<IEnumerable<ContactSubmission>> GetUnreadAsync(CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(CancellationToken cancellationToken = default);
    Task<(IEnumerable<ContactSubmission> Submissions, int Total)> GetPagedAsync(int page, int pageSize, string? status = null, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
