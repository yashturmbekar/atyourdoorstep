using OrderService.Domain.Enums;
using Shared.Domain.Entities;

namespace OrderService.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public decimal TotalAmount { get; set; }
    public decimal SubTotal { get; set; }
    public decimal? TaxAmount { get; set; }
    public decimal? ShippingAmount { get; set; }
    public decimal? DiscountAmount { get; set; }
    public string? DeliveryAddress { get; set; }
    public string? DeliveryCity { get; set; }
    public string? DeliveryState { get; set; }
    public string? DeliveryPostalCode { get; set; }
    public string? DeliveryCountry { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public string? Notes { get; set; }
    public string? TrackingNumber { get; set; }

    // Navigation properties
    public Customer Customer { get; set; } = null!;
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
