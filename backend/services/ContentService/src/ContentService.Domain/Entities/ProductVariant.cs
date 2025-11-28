using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Product variant (size/price combinations)
/// </summary>
public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Size { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public int StockQuantity { get; set; } = 0;
    public string? Sku { get; set; }
    public bool IsAvailable { get; set; } = true;
    public bool IsInStock { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;

    // Navigation property
    public Product Product { get; set; } = null!;
}
