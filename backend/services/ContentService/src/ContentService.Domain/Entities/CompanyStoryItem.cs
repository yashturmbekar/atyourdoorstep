using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Company story section item (bullet points)
/// </summary>
public class CompanyStoryItem : BaseEntity
{
    public Guid SectionId { get; set; }
    public string? Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; } = 0;

    // Navigation property
    public CompanyStorySection Section { get; set; } = null!;
}
