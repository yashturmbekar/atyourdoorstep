using Shared.Domain.Entities;

namespace ContentService.Domain.Entities;

/// <summary>
/// Delivery configuration settings
/// </summary>
public class DeliverySettings : BaseEntity
{
    public decimal FreeDeliveryThreshold { get; set; }
    public decimal StandardDeliveryCharge { get; set; }
    public decimal? ExpressDeliveryCharge { get; set; }
    public int EstimatedDeliveryDays { get; set; } = 3;
    public int? ExpressDeliveryDays { get; set; } = 1;
    public bool IsDeliveryEnabled { get; set; } = true;
    public string? DeliveryNote { get; set; }
    public bool IsActive { get; set; } = true;
}
