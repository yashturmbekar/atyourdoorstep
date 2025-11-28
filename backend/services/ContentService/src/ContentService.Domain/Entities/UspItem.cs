using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Unique selling proposition item
/// </summary>
public class UspItem : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
