using FluentAssertions;
using NotificationService.Domain.Entities;
using NotificationService.Domain.Enums;

namespace NotificationService.UnitTests.Domain;

public class NotificationEntityTests
{
    [Fact]
    public void Notification_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var notification = new Notification();

        // Assert
        notification.Id.Should().NotBeEmpty();
        notification.Status.Should().Be(NotificationStatus.Pending);
        notification.Type.Should().Be(NotificationType.General);
        notification.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Notification_WithOrderPlacedType_ShouldBeValid()
    {
        // Arrange
        var notification = new Notification
        {
            UserId = Guid.NewGuid(),
            Title = "Order Placed",
            Body = "Your order has been placed successfully",
            Type = NotificationType.OrderPlaced
        };

        // Assert
        notification.Type.Should().Be(NotificationType.OrderPlaced);
        notification.Title.Should().Be("Order Placed");
    }

    [Fact]
    public void Notification_MarkAsSent_ShouldUpdateStatusAndSentAt()
    {
        // Arrange
        var notification = new Notification
        {
            UserId = Guid.NewGuid(),
            Title = "Test",
            Body = "Test notification",
            Status = NotificationStatus.Pending
        };

        // Act
        notification.Status = NotificationStatus.Sent;
        notification.SentAt = DateTime.UtcNow;

        // Assert
        notification.Status.Should().Be(NotificationStatus.Sent);
        notification.SentAt.Should().NotBeNull();
        notification.SentAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}
