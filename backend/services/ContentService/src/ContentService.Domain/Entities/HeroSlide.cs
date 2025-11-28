using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Hero section slide
/// </summary>
public class HeroSlide : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? HighlightText { get; set; }
    public string? ImageUrl { get; set; }
    public string? GradientStart { get; set; }
    public string? GradientMiddle { get; set; }
    public string? GradientEnd { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public Guid? ProductId { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public Product? Product { get; set; }
    public ICollection<HeroSlideFeature> Features { get; set; } = new List<HeroSlideFeature>();
}
