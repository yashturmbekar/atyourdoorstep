using NotificationService.Domain.Enums;

namespace NotificationService.Application.DTOs;

// Subscription DTOs
public record SubscribeRequestDto(
    Guid UserId,
    string Endpoint,
    string P256dh,
    string Auth
);

public record SubscriptionResponseDto(
    Guid Id,
    Guid UserId,
    string Endpoint,
    bool IsActive,
    DateTime CreatedAt
);

// Notification DTOs
public record SendNotificationRequestDto(
    Guid UserId,
    string Title,
    string Body,
    string? Icon,
    string? Badge,
    string? Tag,
    string? Data,
    NotificationType Type
);

public record NotificationResponseDto(
    Guid Id,
    Guid UserId,
    string Title,
    string Body,
    NotificationType Type,
    NotificationStatus Status,
    DateTime CreatedAt,
    DateTime? SentAt,
    DateTime? ReadAt
);

public record BroadcastNotificationRequestDto(
    string Title,
    string Body,
    string? Icon,
    string? Badge,
    NotificationType Type
);

public record MarkAsReadRequestDto(
    Guid NotificationId,
    Guid UserId
);

public record GetNotificationsRequestDto(
    Guid UserId,
    int Page = 1,
    int PageSize = 20
);
