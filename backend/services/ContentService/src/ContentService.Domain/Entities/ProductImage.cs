using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Product image
/// </summary>
public class ProductImage : BaseEntity
{
    public Guid ProductId { get; set; }
    public byte[]? ImageData { get; set; }
    public string? ImageContentType { get; set; }
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; } = false;
    public int DisplayOrder { get; set; } = 0;

    // Navigation property
    public Product Product { get; set; } = null!;
}
