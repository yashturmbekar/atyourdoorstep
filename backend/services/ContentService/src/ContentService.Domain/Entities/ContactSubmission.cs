using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Contact form submission
/// </summary>
public class ContactSubmission : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string InquiryType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "new";
    public string? AdminNotes { get; set; }
    public bool IsRead { get; set; } = false;
}
