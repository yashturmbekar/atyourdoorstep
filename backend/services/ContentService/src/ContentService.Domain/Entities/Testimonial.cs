using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Customer testimonial
/// </summary>
public class Testimonial : BaseEntity
{
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerTitle { get; set; }
    public string? CustomerLocation { get; set; }
    public string? CustomerImageUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public string? ProductPurchased { get; set; }
    public bool IsApproved { get; set; } = false;
    public bool IsFeatured { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}
