using Microsoft.EntityFrameworkCore;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using ContentService.Infrastructure.Persistence;
using Shared.Infrastructure.Persistence;

namespace ContentService.Infrastructure.Repositories;

#region ProductCategory Repository

public class ProductCategoryRepository : RepositoryBase<ProductCategory>, IProductCategoryRepository
{
    public ProductCategoryRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<ProductCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Slug == slug, cancellationToken);
    }

    public async Task<IEnumerable<ProductCategory>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ProductCategory>> GetWithProductCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(c => c.Products.Where(p => !p.IsDeleted && p.IsAvailable))
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(c => c.Slug == slug);
        if (excludeId.HasValue)
            query = query.Where(c => c.Id != excludeId.Value);
        return await query.AnyAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

// Legacy alias for backward compatibility
public class CategoryRepository : ProductCategoryRepository, ICategoryRepository
{
    public CategoryRepository(ContentDbContext context) : base(context)
    {
    }
}

#endregion

#region Product Repository

public class ProductRepository : RepositoryBase<Product>, IProductRepository
{
    public ProductRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<Product?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.ProductCategory)
            .Include(p => p.Variants.OrderBy(v => v.DisplayOrder))
            .Include(p => p.Features.OrderBy(f => f.DisplayOrder))
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(p => p.Slug == slug, cancellationToken);
    }

    public async Task<Product?> GetWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.ProductCategory)
            .Include(p => p.Variants.OrderBy(v => v.DisplayOrder))
            .Include(p => p.Features.OrderBy(f => f.DisplayOrder))
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<Product?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await GetWithDetailsAsync(id, cancellationToken);
    }

    public async Task<(IEnumerable<Product> Products, int Total)> GetPagedWithDetailsAsync(
        int page, 
        int pageSize, 
        string? categorySlug = null, 
        bool? isFeatured = null, 
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet
            .Include(p => p.ProductCategory)
            .Include(p => p.Variants.OrderBy(v => v.DisplayOrder))
            .Include(p => p.Features.OrderBy(f => f.DisplayOrder))
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .Where(p => !p.IsDeleted)
            .AsQueryable();

        if (!string.IsNullOrEmpty(categorySlug))
            query = query.Where(p => p.ProductCategory.Slug == categorySlug);

        if (isFeatured.HasValue)
            query = query.Where(p => p.IsFeatured == isFeatured.Value);

        var total = await query.CountAsync(cancellationToken);
        var products = await query
            .OrderBy(p => p.DisplayOrder)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (products, total);
    }

    public async Task<IEnumerable<Product>> GetFeaturedProductsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.ProductCategory)
            .Include(p => p.Variants.OrderBy(v => v.DisplayOrder))
            .Include(p => p.Images.OrderBy(i => i.DisplayOrder))
            .Where(p => p.IsFeatured && p.IsAvailable && !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetByProductCategoryAsync(Guid productCategoryId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.ProductCategory)
            .Include(p => p.Variants.OrderBy(v => v.DisplayOrder))
            .Include(p => p.Features.OrderBy(f => f.DisplayOrder))
            .Where(p => p.ProductCategoryId == productCategoryId && !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetByProductCategorySlugAsync(string productCategorySlug, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.ProductCategory)
            .Include(p => p.Variants.OrderBy(v => v.DisplayOrder))
            .Include(p => p.Features.OrderBy(f => f.DisplayOrder))
            .Where(p => p.ProductCategory.Slug == productCategorySlug && !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetFeaturedAsync(CancellationToken cancellationToken = default)
    {
        return await GetFeaturedProductsAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetAvailableAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(p => p.ProductCategory)
            .Include(p => p.Variants.OrderBy(v => v.DisplayOrder))
            .Include(p => p.Features.OrderBy(f => f.DisplayOrder))
            .Where(p => p.IsAvailable && !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> SlugExistsAsync(string slug, Guid? excludeId = null, CancellationToken cancellationToken = default)
    {
        var query = _dbSet.Where(p => p.Slug == slug);
        if (excludeId.HasValue)
            query = query.Where(p => p.Id != excludeId.Value);
        return await query.AnyAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region ProductVariant Repository

public class ProductVariantRepository : RepositoryBase<ProductVariant>, IProductVariantRepository
{
    public ProductVariantRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(v => v.ProductId == productId)
            .OrderBy(v => v.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<ProductVariant?> GetBySkuAsync(string sku, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(v => v.Sku == sku, cancellationToken);
    }

    public async Task DeleteByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        var variants = await _dbSet.Where(v => v.ProductId == productId).ToListAsync(cancellationToken);
        _dbSet.RemoveRange(variants);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region ProductFeature Repository

public class ProductFeatureRepository : RepositoryBase<ProductFeature>, IProductFeatureRepository
{
    public ProductFeatureRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ProductFeature>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(f => f.ProductId == productId)
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        var features = await _dbSet.Where(f => f.ProductId == productId).ToListAsync(cancellationToken);
        _dbSet.RemoveRange(features);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region ProductImage Repository

public class ProductImageRepository : RepositoryBase<ProductImage>, IProductImageRepository
{
    public ProductImageRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(i => i.ProductId == productId)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteByProductIdAsync(Guid productId, CancellationToken cancellationToken = default)
    {
        var images = await _dbSet.Where(i => i.ProductId == productId).ToListAsync(cancellationToken);
        _dbSet.RemoveRange(images);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region Testimonial Repository

public class TestimonialRepository : RepositoryBase<Testimonial>, ITestimonialRepository
{
    public TestimonialRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Testimonial>> GetApprovedAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.IsApproved)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Testimonial>> GetFeaturedAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.IsApproved && t.IsFeatured)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Testimonial>> GetActiveTestimonialsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(t => t.IsActive && t.IsApproved)
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Testimonial>> GetFeaturedTestimonialsAsync(CancellationToken cancellationToken = default)
    {
        return await GetFeaturedAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region SiteSetting Repository

public class SiteSettingRepository : RepositoryBase<SiteSetting>, ISiteSettingRepository
{
    public SiteSettingRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<SiteSetting?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.Key == key, cancellationToken);
    }

    public async Task<IEnumerable<SiteSetting>> GetByCategoryAsync(string category, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.Group == category)
            .OrderBy(s => s.Key)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<SiteSetting>> GetByGroupAsync(string group, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.Group == group)
            .OrderBy(s => s.Key)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<SiteSetting>> GetPublicSettingsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.IsPublic)
            .OrderBy(s => s.Group)
            .ThenBy(s => s.Key)
            .ToListAsync(cancellationToken);
    }

    public async Task<Dictionary<string, string>> GetAllAsDictionaryAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.ToDictionaryAsync(s => s.Key, s => s.Value, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region ContentBlock Repository

public class ContentBlockRepository : RepositoryBase<ContentBlock>, IContentBlockRepository
{
    public ContentBlockRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<ContentBlock?> GetByKeyAsync(string blockKey, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(c => c.BlockKey == blockKey, cancellationToken);
    }

    public async Task<IEnumerable<ContentBlock>> GetByPageAsync(string page, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.Page == page && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ContentBlock>> GetBySectionAsync(string page, string section, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.Page == page && c.Section == section && c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<ContentBlock>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.IsActive)
            .OrderBy(c => c.Page)
            .ThenBy(c => c.Section)
            .ThenBy(c => c.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region HeroSlide Repository

public class HeroSlideRepository : RepositoryBase<HeroSlide>, IHeroSlideRepository
{
    public HeroSlideRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<HeroSlide>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(h => h.Product)
            .Include(h => h.Features.OrderBy(f => f.DisplayOrder))
            .Where(h => h.IsActive)
            .OrderBy(h => h.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<HeroSlide>> GetActiveSlidesAsync(CancellationToken cancellationToken = default)
    {
        return await GetActiveAsync(cancellationToken);
    }

    public async Task<HeroSlide?> GetWithFeaturesAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(h => h.Product)
            .Include(h => h.Features.OrderBy(f => f.DisplayOrder))
            .FirstOrDefaultAsync(h => h.Id == id, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region HeroSlideFeature Repository

public class HeroSlideFeatureRepository : RepositoryBase<HeroSlideFeature>, IHeroSlideFeatureRepository
{
    public HeroSlideFeatureRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<HeroSlideFeature>> GetBySlideIdAsync(Guid slideId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(f => f.HeroSlideId == slideId)
            .OrderBy(f => f.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteBySlideIdAsync(Guid slideId, CancellationToken cancellationToken = default)
    {
        var features = await _dbSet.Where(f => f.HeroSlideId == slideId).ToListAsync(cancellationToken);
        _dbSet.RemoveRange(features);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region Statistic Repository

public class StatisticRepository : RepositoryBase<Statistic>, IStatisticRepository
{
    public StatisticRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Statistic>> GetBySectionAsync(string section, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.Section == section && s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Statistic>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(s => s.IsActive)
            .OrderBy(s => s.Section)
            .ThenBy(s => s.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Statistic>> GetActiveStatisticsAsync(CancellationToken cancellationToken = default)
    {
        return await GetActiveAsync(cancellationToken);
    }

    public async Task<Statistic?> GetByLabelAsync(string label, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(s => s.Label == label, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region UspItem Repository

public class UspItemRepository : RepositoryBase<UspItem>, IUspItemRepository
{
    public UspItemRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<UspItem>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(u => u.IsActive)
            .OrderBy(u => u.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region CompanyStorySection Repository

public class CompanyStorySectionRepository : RepositoryBase<CompanyStorySection>, ICompanyStorySectionRepository
{
    public CompanyStorySectionRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CompanyStorySection>> GetActiveWithItemsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Items.OrderBy(i => i.DisplayOrder))
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<CompanyStorySection>> GetActiveSectionsWithItemsAsync(CancellationToken cancellationToken = default)
    {
        return await GetActiveWithItemsAsync(cancellationToken);
    }

    public async Task<CompanyStorySection?> GetByKeyAsync(string sectionKey, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Items.OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(s => s.SectionKey == sectionKey, cancellationToken);
    }

    public async Task<CompanyStorySection?> GetWithItemsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Include(s => s.Items.OrderBy(i => i.DisplayOrder))
            .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region CompanyStoryItem Repository

public class CompanyStoryItemRepository : RepositoryBase<CompanyStoryItem>, ICompanyStoryItemRepository
{
    public CompanyStoryItemRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<CompanyStoryItem>> GetBySectionIdAsync(Guid sectionId, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(i => i.SectionId == sectionId)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task DeleteBySectionIdAsync(Guid sectionId, CancellationToken cancellationToken = default)
    {
        var items = await _dbSet.Where(i => i.SectionId == sectionId).ToListAsync(cancellationToken);
        _dbSet.RemoveRange(items);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region InquiryType Repository

public class InquiryTypeRepository : RepositoryBase<InquiryType>, IInquiryTypeRepository
{
    public InquiryTypeRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<InquiryType>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(i => i.IsActive)
            .OrderBy(i => i.DisplayOrder)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<InquiryType>> GetActiveTypesAsync(CancellationToken cancellationToken = default)
    {
        return await GetActiveAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region DeliverySettings Repository

public class DeliverySettingsRepository : RepositoryBase<DeliverySettings>, IDeliverySettingsRepository
{
    public DeliverySettingsRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<DeliverySettings?> GetCurrentAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<DeliverySettings?> GetActiveSettingsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(d => d.IsActive, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion

#region ContactSubmission Repository

public class ContactSubmissionRepository : RepositoryBase<ContactSubmission>, IContactSubmissionRepository
{
    public ContactSubmissionRepository(ContentDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<ContactSubmission>> GetUnreadAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => !c.IsRead)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<int> GetUnreadCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(c => !c.IsRead, cancellationToken);
    }

    public async Task<(IEnumerable<ContactSubmission> Submissions, int Total)> GetPagedAsync(
        int page,
        int pageSize,
        string? status = null,
        CancellationToken cancellationToken = default)
    {
        var query = _dbSet.AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(c => c.Status == status);

        var total = await query.CountAsync(cancellationToken);
        var submissions = await query
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return (submissions, total);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}

#endregion
