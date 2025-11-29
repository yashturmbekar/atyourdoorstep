using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages delivery settings
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DeliverySettingsController : ControllerBase
{
    private readonly IDeliverySettingsRepository _deliverySettingsRepository;
    private readonly ILogger<DeliverySettingsController> _logger;

    public DeliverySettingsController(IDeliverySettingsRepository deliverySettingsRepository, ILogger<DeliverySettingsController> logger)
    {
        _deliverySettingsRepository = deliverySettingsRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get active delivery settings
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<DeliverySettingsDto>>> GetDeliverySettings(CancellationToken cancellationToken)
    {
        var settings = await _deliverySettingsRepository.GetActiveSettingsAsync(cancellationToken);
        if (settings == null)
            return NotFound(ApiResponse<DeliverySettingsDto>.Fail("Delivery settings not found"));

        return Ok(ApiResponse<DeliverySettingsDto>.Ok(new DeliverySettingsDto
        {
            Id = settings.Id,
            FreeDeliveryThreshold = settings.FreeDeliveryThreshold,
            StandardDeliveryCharge = settings.StandardDeliveryCharge,
            ExpressDeliveryCharge = settings.ExpressDeliveryCharge,
            EstimatedDeliveryDays = settings.EstimatedDeliveryDays,
            ExpressDeliveryDays = settings.ExpressDeliveryDays,
            IsActive = settings.IsActive
        }));
    }

    /// <summary>
    /// Get delivery charges only (for checkout)
    /// </summary>
    [HttpGet("charges")]
    public async Task<ActionResult<ApiResponse<PublicDeliveryChargesResponse>>> GetDeliveryCharges(CancellationToken cancellationToken)
    {
        var settings = await _deliverySettingsRepository.GetActiveSettingsAsync(cancellationToken);
        if (settings == null)
        {
            // Return default values if no settings found
            return Ok(ApiResponse<PublicDeliveryChargesResponse>.Ok(new PublicDeliveryChargesResponse
            {
                FreeDeliveryThreshold = 500,
                StandardDeliveryCharge = 50,
                ExpressDeliveryCharge = 100,
                EstimatedDeliveryDays = 3,
                ExpressDeliveryDays = 1
            }));
        }

        return Ok(ApiResponse<PublicDeliveryChargesResponse>.Ok(new PublicDeliveryChargesResponse
        {
            FreeDeliveryThreshold = settings.FreeDeliveryThreshold,
            StandardDeliveryCharge = settings.StandardDeliveryCharge,
            ExpressDeliveryCharge = settings.ExpressDeliveryCharge,
            EstimatedDeliveryDays = settings.EstimatedDeliveryDays,
            ExpressDeliveryDays = settings.ExpressDeliveryDays
        }));
    }

    /// <summary>
    /// Create or update delivery settings (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<DeliverySettingsDto>>> UpsertDeliverySettings([FromBody] CreateDeliverySettingsRequest request, CancellationToken cancellationToken)
    {
        var existing = await _deliverySettingsRepository.GetActiveSettingsAsync(cancellationToken);

        DeliverySettings settings;
        if (existing != null)
        {
            existing.FreeDeliveryThreshold = request.FreeDeliveryThreshold;
            existing.StandardDeliveryCharge = request.StandardDeliveryCharge;
            existing.ExpressDeliveryCharge = request.ExpressDeliveryCharge;
            existing.EstimatedDeliveryDays = request.EstimatedDeliveryDays;
            existing.ExpressDeliveryDays = request.ExpressDeliveryDays;
            existing.UpdatedAt = DateTime.UtcNow;
            await _deliverySettingsRepository.UpdateAsync(existing, cancellationToken);
            settings = existing;
            _logger.LogInformation("Updated delivery settings");
        }
        else
        {
            settings = new DeliverySettings
            {
                FreeDeliveryThreshold = request.FreeDeliveryThreshold,
                StandardDeliveryCharge = request.StandardDeliveryCharge,
                ExpressDeliveryCharge = request.ExpressDeliveryCharge,
                EstimatedDeliveryDays = request.EstimatedDeliveryDays,
                ExpressDeliveryDays = request.ExpressDeliveryDays,
                IsActive = true
            };
            await _deliverySettingsRepository.AddAsync(settings, cancellationToken);
            _logger.LogInformation("Created delivery settings");
        }

        await _deliverySettingsRepository.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<DeliverySettingsDto>.Ok(new DeliverySettingsDto
        {
            Id = settings.Id,
            FreeDeliveryThreshold = settings.FreeDeliveryThreshold,
            StandardDeliveryCharge = settings.StandardDeliveryCharge,
            ExpressDeliveryCharge = settings.ExpressDeliveryCharge,
            EstimatedDeliveryDays = settings.EstimatedDeliveryDays,
            ExpressDeliveryDays = settings.ExpressDeliveryDays,
            IsActive = settings.IsActive
        }, "Delivery settings saved successfully"));
    }
}
