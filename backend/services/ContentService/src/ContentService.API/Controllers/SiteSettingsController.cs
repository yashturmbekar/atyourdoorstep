using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages site settings (company info, contact, social media, etc.)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SiteSettingsController : ControllerBase
{
    private readonly ISiteSettingRepository _siteSettingRepository;
    private readonly ILogger<SiteSettingsController> _logger;

    public SiteSettingsController(ISiteSettingRepository siteSettingRepository, ILogger<SiteSettingsController> logger)
    {
        _siteSettingRepository = siteSettingRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all site settings
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<SiteSettingDto>>>> GetAllSettings(CancellationToken cancellationToken)
    {
        var settings = await _siteSettingRepository.GetAllAsync(cancellationToken);
        var dtos = settings.Select(s => new SiteSettingDto
        {
            Id = s.Id,
            Key = s.Key,
            Value = s.Value,
            Group = s.Group,
            Description = s.Description,
            IsPublic = s.IsPublic
        });
        return Ok(ApiResponse<IEnumerable<SiteSettingDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get settings by group (e.g., "company", "contact", "social")
    /// </summary>
    [HttpGet("group/{group}")]
    public async Task<ActionResult<ApiResponse<Dictionary<string, string>>>> GetSettingsByGroup(string group, CancellationToken cancellationToken)
    {
        var settings = await _siteSettingRepository.GetByGroupAsync(group, cancellationToken);
        var dict = settings.ToDictionary(s => s.Key, s => s.Value);
        return Ok(ApiResponse<Dictionary<string, string>>.Ok(dict));
    }

    /// <summary>
    /// Get a specific setting by key
    /// </summary>
    [HttpGet("key/{key}")]
    public async Task<ActionResult<ApiResponse<string>>> GetSettingByKey(string key, CancellationToken cancellationToken)
    {
        var setting = await _siteSettingRepository.GetByKeyAsync(key, cancellationToken);
        if (setting == null)
            return NotFound(ApiResponse<string>.Fail("Setting not found"));

        return Ok(ApiResponse<string>.Ok(setting.Value));
    }

    /// <summary>
    /// Get public settings (for frontend)
    /// </summary>
    [HttpGet("public")]
    public async Task<ActionResult<ApiResponse<Dictionary<string, string>>>> GetPublicSettings(CancellationToken cancellationToken)
    {
        var settings = await _siteSettingRepository.GetPublicSettingsAsync(cancellationToken);
        var dict = settings.ToDictionary(s => s.Key, s => s.Value);
        return Ok(ApiResponse<Dictionary<string, string>>.Ok(dict));
    }

    /// <summary>
    /// Get public site info (structured format for frontend)
    /// </summary>
    [HttpGet("public/info")]
    public async Task<ActionResult<ApiResponse<PublicSiteInfoResponse>>> GetPublicSiteInfo(CancellationToken cancellationToken)
    {
        var settings = await _siteSettingRepository.GetPublicSettingsAsync(cancellationToken);
        var dict = settings.ToDictionary(s => s.Key, s => s.Value);

        var socialLinks = new Dictionary<string, string>();
        var socialKeys = new[] { "facebook", "twitter", "instagram", "linkedin", "youtube", "tiktok", "whatsapp" };
        foreach (var key in socialKeys)
        {
            // Try both formats: "social.facebook" and "social_facebook"
            var socialKey1 = $"social.{key}";
            var socialKey2 = $"social_{key}";
            if (dict.TryGetValue(socialKey1, out var value1) && !string.IsNullOrEmpty(value1))
            {
                socialLinks[key] = value1;
            }
            else if (dict.TryGetValue(socialKey2, out var value2) && !string.IsNullOrEmpty(value2))
            {
                socialLinks[key] = value2;
            }
        }

        var dto = new PublicSiteInfoResponse
        {
            // Support both naming conventions
            CompanyName = dict.GetValueOrDefault("general.site_name", 
                          dict.GetValueOrDefault("company_name", "At Your Doorstep")),
            TagLine = dict.GetValueOrDefault("general.tagline", 
                      dict.GetValueOrDefault("tagline", "")),
            Logo = dict.GetValueOrDefault("general.logo", 
                   dict.GetValueOrDefault("logo", "")),
            Email = dict.GetValueOrDefault("contact.email", 
                    dict.GetValueOrDefault("contact_email", "")),
            Phone = dict.GetValueOrDefault("contact.phone", 
                    dict.GetValueOrDefault("contact_phone", "")),
            Address = dict.GetValueOrDefault("contact.address", 
                      dict.GetValueOrDefault("contact_address", "")),
            SocialLinks = socialLinks
        };

        return Ok(ApiResponse<PublicSiteInfoResponse>.Ok(dto));
    }

    /// <summary>
    /// Create or update a setting (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<SiteSettingDto>>> UpsertSetting([FromBody] CreateSiteSettingRequest request, CancellationToken cancellationToken)
    {
        var existing = await _siteSettingRepository.GetByKeyAsync(request.Key, cancellationToken);
        
        SiteSetting setting;
        if (existing != null)
        {
            existing.Value = request.Value;
            existing.Group = request.Group;
            existing.Description = request.Description;
            existing.IsPublic = request.IsPublic;
            existing.UpdatedAt = DateTime.UtcNow;
            await _siteSettingRepository.UpdateAsync(existing, cancellationToken);
            setting = existing;
            _logger.LogInformation("Updated setting: {Key}", request.Key);
        }
        else
        {
            setting = new SiteSetting
            {
                Key = request.Key,
                Value = request.Value,
                Group = request.Group,
                Description = request.Description,
                IsPublic = request.IsPublic
            };
            await _siteSettingRepository.AddAsync(setting, cancellationToken);
            _logger.LogInformation("Created setting: {Key}", request.Key);
        }

        await _siteSettingRepository.SaveChangesAsync(cancellationToken);

        return Ok(ApiResponse<SiteSettingDto>.Ok(new SiteSettingDto
        {
            Id = setting.Id,
            Key = setting.Key,
            Value = setting.Value,
            Group = setting.Group,
            Description = setting.Description,
            IsPublic = setting.IsPublic
        }, "Setting saved successfully"));
    }

    /// <summary>
    /// Bulk update settings (Admin only)
    /// </summary>
    [HttpPost("bulk")]
    public async Task<ActionResult<ApiResponse<bool>>> BulkUpdateSettings([FromBody] Dictionary<string, string> settings, CancellationToken cancellationToken)
    {
        foreach (var kvp in settings)
        {
            var existing = await _siteSettingRepository.GetByKeyAsync(kvp.Key, cancellationToken);
            if (existing != null)
            {
                existing.Value = kvp.Value;
                existing.UpdatedAt = DateTime.UtcNow;
                await _siteSettingRepository.UpdateAsync(existing, cancellationToken);
            }
            else
            {
                await _siteSettingRepository.AddAsync(new SiteSetting
                {
                    Key = kvp.Key,
                    Value = kvp.Value,
                    Group = "general",
                    IsPublic = true
                }, cancellationToken);
            }
        }

        await _siteSettingRepository.SaveChangesAsync(cancellationToken);
        _logger.LogInformation("Bulk updated {Count} settings", settings.Count);

        return Ok(ApiResponse<bool>.Ok(true, $"Updated {settings.Count} settings"));
    }

    /// <summary>
    /// Delete a setting (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSetting(Guid id, CancellationToken cancellationToken)
    {
        var setting = await _siteSettingRepository.GetByIdAsync(id, cancellationToken);
        if (setting == null)
            return NotFound(ApiResponse<bool>.Fail("Setting not found"));

        await _siteSettingRepository.DeleteAsync(setting, cancellationToken);
        await _siteSettingRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted setting: {SettingId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Setting deleted successfully"));
    }
}
