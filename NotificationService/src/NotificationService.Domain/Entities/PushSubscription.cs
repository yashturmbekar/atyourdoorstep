using Shared.Domain.Entities;

namespace NotificationService.Domain.Entities;

public class PushSubscription : BaseEntity
{
    public Guid UserId { get; set; }
    public string Endpoint { get; set; } = string.Empty;
    public string P256dh { get; set; } = string.Empty;
    public string Auth { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime? LastUsedAt { get; set; }
}
