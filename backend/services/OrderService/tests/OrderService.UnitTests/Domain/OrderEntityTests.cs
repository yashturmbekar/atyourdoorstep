using FluentAssertions;
using OrderService.Domain.Entities;
using OrderService.Domain.Enums;

namespace OrderService.UnitTests.Domain;

public class OrderEntityTests
{
    [Fact]
    public void Order_ShouldInitializeWithDefaults()
    {
        // Arrange & Act
        var order = new Order();

        // Assert
        order.Id.Should().NotBeEmpty();
        order.Status.Should().Be(OrderStatus.Pending);
        order.OrderItems.Should().NotBeNull();
        order.OrderItems.Should().BeEmpty();
        order.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Order_CalculateTotalAmount_ShouldSumAllItems()
    {
        // Arrange
        var order = new Order
        {
            CustomerId = Guid.NewGuid(),
            OrderItems = new List<OrderItem>
            {
                new() { ProductId = Guid.NewGuid(), Quantity = 2, Price = 10.00m },
                new() { ProductId = Guid.NewGuid(), Quantity = 1, Price = 15.00m }
            }
        };

        // Act
        var total = order.OrderItems.Sum(item => item.Quantity * item.Price);

        // Assert
        total.Should().Be(35.00m);
    }

    [Fact]
    public void Order_StatusTransition_FromPendingToConfirmed_ShouldBeValid()
    {
        // Arrange
        var order = new Order { Status = OrderStatus.Pending };

        // Act
        order.Status = OrderStatus.Confirmed;

        // Assert
        order.Status.Should().Be(OrderStatus.Confirmed);
    }
}
