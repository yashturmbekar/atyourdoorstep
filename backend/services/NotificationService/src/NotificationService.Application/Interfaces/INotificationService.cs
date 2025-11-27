using NotificationService.Application.DTOs;

namespace NotificationService.Application.Interfaces;

public interface INotificationService
{
    Task<SubscriptionResponseDto> SubscribeAsync(SubscribeRequestDto request, CancellationToken cancellationToken = default);
    Task<bool> UnsubscribeAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<NotificationResponseDto> SendNotificationAsync(SendNotificationRequestDto request, CancellationToken cancellationToken = default);
    Task<int> BroadcastNotificationAsync(BroadcastNotificationRequestDto request, CancellationToken cancellationToken = default);
    Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(GetNotificationsRequestDto request, CancellationToken cancellationToken = default);
    Task<bool> MarkAsReadAsync(MarkAsReadRequestDto request, CancellationToken cancellationToken = default);
    Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default);
}

public interface IWebPushService
{
    Task<bool> SendNotificationAsync(string endpoint, string p256dh, string auth, object payload, CancellationToken cancellationToken = default);
}
