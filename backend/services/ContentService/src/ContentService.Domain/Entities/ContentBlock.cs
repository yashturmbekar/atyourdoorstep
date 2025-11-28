using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Reusable content block for CMS
/// </summary>
public class ContentBlock : BaseEntity
{
    public string BlockKey { get; set; } = string.Empty;
    public string Page { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Content { get; set; }
    public string? ContentType { get; set; } = "text";
    public string? Metadata { get; set; }
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
