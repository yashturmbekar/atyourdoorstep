namespace NotificationService.Domain.Enums;

public enum NotificationType
{
    OrderPlaced = 1,
    OrderConfirmed = 2,
    OrderShipped = 3,
    OrderDelivered = 4,
    OrderCancelled = 5,
    PaymentReceived = 6,
    PaymentFailed = 7,
    General = 8
}
