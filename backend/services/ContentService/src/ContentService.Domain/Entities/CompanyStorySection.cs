using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Company story section (about page)
/// </summary>
public class CompanyStorySection : BaseEntity
{
    public string SectionKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    // Navigation property
    public ICollection<CompanyStoryItem> Items { get; set; } = new List<CompanyStoryItem>();
}
