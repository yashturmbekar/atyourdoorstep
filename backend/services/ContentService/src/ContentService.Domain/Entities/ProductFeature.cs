using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Product feature text
/// </summary>
public class ProductFeature : BaseEntity
{
    public Guid ProductId { get; set; }
    public string Feature { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;

    // Navigation property
    public Product Product { get; set; } = null!;
}
