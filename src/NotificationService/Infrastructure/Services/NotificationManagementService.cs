using NotificationService.Application.DTOs;
using NotificationService.Application.Interfaces;
using NotificationService.Domain.Entities;
using NotificationService.Domain.Enums;

namespace NotificationService.Infrastructure.Services;

public class NotificationManagementService : INotificationService
{
    private readonly IPushSubscriptionRepository _subscriptionRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IWebPushService _webPushService;

    public NotificationManagementService(
        IPushSubscriptionRepository subscriptionRepository,
        INotificationRepository notificationRepository,
        IWebPushService webPushService)
    {
        _subscriptionRepository = subscriptionRepository;
        _notificationRepository = notificationRepository;
        _webPushService = webPushService;
    }

    public async Task<SubscriptionResponseDto> SubscribeAsync(SubscribeRequestDto request, CancellationToken cancellationToken = default)
    {
        // Check if subscription already exists
        var existing = await _subscriptionRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (existing != null)
        {
            // Update existing subscription
            existing.Endpoint = request.Endpoint;
            existing.P256dh = request.P256dh;
            existing.Auth = request.Auth;
            existing.IsActive = true;
            existing.LastUsedAt = DateTime.UtcNow;
            await _subscriptionRepository.UpdateAsync(existing, cancellationToken);
            
            return new SubscriptionResponseDto(
                existing.Id,
                existing.UserId,
                existing.Endpoint,
                existing.IsActive,
                existing.CreatedAt
            );
        }

        // Create new subscription
        var subscription = new PushSubscription
        {
            UserId = request.UserId,
            Endpoint = request.Endpoint,
            P256dh = request.P256dh,
            Auth = request.Auth,
            IsActive = true,
            LastUsedAt = DateTime.UtcNow
        };

        var result = await _subscriptionRepository.AddAsync(subscription, cancellationToken);
        
        return new SubscriptionResponseDto(
            result.Id,
            result.UserId,
            result.Endpoint,
            result.IsActive,
            result.CreatedAt
        );
    }

    public async Task<bool> UnsubscribeAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var subscription = await _subscriptionRepository.GetByUserIdAsync(userId, cancellationToken);
        if (subscription == null)
            return false;

        subscription.IsActive = false;
        await _subscriptionRepository.UpdateAsync(subscription, cancellationToken);
        return true;
    }

    public async Task<NotificationResponseDto> SendNotificationAsync(SendNotificationRequestDto request, CancellationToken cancellationToken = default)
    {
        // Create notification record
        var notification = new Notification
        {
            UserId = request.UserId,
            Title = request.Title,
            Body = request.Body,
            Icon = request.Icon,
            Badge = request.Badge,
            Tag = request.Tag,
            Data = request.Data,
            Type = request.Type,
            Status = NotificationStatus.Pending
        };

        await _notificationRepository.AddAsync(notification, cancellationToken);

        // Get user subscription
        var subscription = await _subscriptionRepository.GetByUserIdAsync(request.UserId, cancellationToken);
        if (subscription != null)
        {
            var payload = new
            {
                title = request.Title,
                body = request.Body,
                icon = request.Icon,
                badge = request.Badge,
                tag = request.Tag,
                data = request.Data
            };

            var sent = await _webPushService.SendNotificationAsync(
                subscription.Endpoint,
                subscription.P256dh,
                subscription.Auth,
                payload,
                cancellationToken
            );

            notification.Status = sent ? NotificationStatus.Sent : NotificationStatus.Failed;
            notification.SentAt = sent ? DateTime.UtcNow : null;
            notification.ErrorMessage = sent ? null : "Failed to send push notification";
            
            subscription.LastUsedAt = DateTime.UtcNow;
            await _subscriptionRepository.UpdateAsync(subscription, cancellationToken);
        }
        else
        {
            notification.Status = NotificationStatus.Failed;
            notification.ErrorMessage = "No active subscription found for user";
        }

        await _notificationRepository.UpdateAsync(notification, cancellationToken);

        return new NotificationResponseDto(
            notification.Id,
            notification.UserId,
            notification.Title,
            notification.Body,
            notification.Type,
            notification.Status,
            notification.CreatedAt,
            notification.SentAt,
            notification.ReadAt
        );
    }

    public async Task<int> BroadcastNotificationAsync(BroadcastNotificationRequestDto request, CancellationToken cancellationToken = default)
    {
        var subscriptions = await _subscriptionRepository.GetActiveSubscriptionsAsync(cancellationToken);
        var successCount = 0;

        foreach (var subscription in subscriptions)
        {
            var sendRequest = new SendNotificationRequestDto(
                subscription.UserId,
                request.Title,
                request.Body,
                request.Icon,
                request.Badge,
                null,
                null,
                request.Type
            );

            var result = await SendNotificationAsync(sendRequest, cancellationToken);
            if (result.Status == NotificationStatus.Sent)
                successCount++;
        }

        return successCount;
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(GetNotificationsRequestDto request, CancellationToken cancellationToken = default)
    {
        var notifications = await _notificationRepository.GetByUserIdAsync(
            request.UserId, 
            request.Page, 
            request.PageSize, 
            cancellationToken
        );

        return notifications.Select(n => new NotificationResponseDto(
            n.Id,
            n.UserId,
            n.Title,
            n.Body,
            n.Type,
            n.Status,
            n.CreatedAt,
            n.SentAt,
            n.ReadAt
        ));
    }

    public async Task<bool> MarkAsReadAsync(MarkAsReadRequestDto request, CancellationToken cancellationToken = default)
    {
        var notification = await _notificationRepository.GetByIdAsync(request.NotificationId, cancellationToken);
        if (notification == null || notification.UserId != request.UserId)
            return false;

        notification.ReadAt = DateTime.UtcNow;
        notification.Status = NotificationStatus.Read;
        await _notificationRepository.UpdateAsync(notification, cancellationToken);
        return true;
    }

    public async Task<int> GetUnreadCountAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _notificationRepository.GetUnreadCountAsync(userId, cancellationToken);
    }
}
