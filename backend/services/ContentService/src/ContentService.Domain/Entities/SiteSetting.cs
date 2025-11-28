using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Site configuration settings
/// </summary>
public class SiteSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string SettingType { get; set; } = "string";
    public string Group { get; set; } = "general";
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
}
