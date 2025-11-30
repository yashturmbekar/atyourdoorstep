using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Product category entity
/// </summary>
public class ProductCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public byte[]? ImageData { get; set; }
    public string? ImageContentType { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public Guid? ParentId { get; set; }
    public int ProductCount { get; set; } = 0;

    // Navigation properties
    public ProductCategory? Parent { get; set; }
    public ICollection<ProductCategory> Children { get; set; } = new List<ProductCategory>();
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
