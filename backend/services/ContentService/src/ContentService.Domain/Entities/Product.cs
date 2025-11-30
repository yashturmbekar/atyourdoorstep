using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Product entity with full details
/// </summary>
public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? FullDescription { get; set; }
    public string? Unit { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public byte[]? ImageData { get; set; }
    public string? ImageContentType { get; set; }
    public Guid ProductCategoryId { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public bool IsDeleted { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;
    public int StockQuantity { get; set; } = 0;
    public string? SeasonStart { get; set; }
    public string? SeasonEnd { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }

    // Navigation properties
    public ProductCategory ProductCategory { get; set; } = null!;
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
    public ICollection<ProductFeature> Features { get; set; } = new List<ProductFeature>();
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
}
