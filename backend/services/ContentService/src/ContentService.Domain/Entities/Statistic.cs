using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Homepage/about page statistics
/// </summary>
public class Statistic : BaseEntity
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Suffix { get; set; }
    public string? Icon { get; set; }
    public string Section { get; set; } = "home";
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
