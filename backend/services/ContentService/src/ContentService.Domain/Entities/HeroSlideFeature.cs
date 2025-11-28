using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Hero slide feature bullet point
/// </summary>
public class HeroSlideFeature : BaseEntity
{
    public Guid HeroSlideId { get; set; }
    public string Feature { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;

    // Navigation property
    public HeroSlide HeroSlide { get; set; } = null!;
}
