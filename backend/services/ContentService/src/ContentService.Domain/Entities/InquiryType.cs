using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Contact form inquiry type
/// </summary>
public class InquiryType : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
}
