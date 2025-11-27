using Shared.Domain.Entities;

namespace OrderService.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? Sku { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int? DiscountPercentage { get; set; }

    // Navigation properties
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
