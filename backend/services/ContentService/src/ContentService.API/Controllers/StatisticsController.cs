using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages statistics display (30+ Years, 50000+ Customers, etc.)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly IStatisticRepository _statisticRepository;
    private readonly ILogger<StatisticsController> _logger;

    public StatisticsController(IStatisticRepository statisticRepository, ILogger<StatisticsController> logger)
    {
        _statisticRepository = statisticRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all statistics (admin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<StatisticDto>>>> GetAllStatistics(CancellationToken cancellationToken)
    {
        var stats = await _statisticRepository.GetAllAsync(cancellationToken);
        var dtos = stats.OrderBy(s => s.DisplayOrder).Select(s => new StatisticDto
        {
            Id = s.Id,
            Label = s.Label,
            Value = s.Value,
            Suffix = s.Suffix,
            Icon = s.Icon,
            DisplayOrder = s.DisplayOrder,
            IsActive = s.IsActive
        });
        return Ok(ApiResponse<IEnumerable<StatisticDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get all active statistics (public)
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<StatisticDto>>>> GetActiveStatistics(CancellationToken cancellationToken)
    {
        var stats = await _statisticRepository.GetActiveStatisticsAsync(cancellationToken);
        var dtos = stats.Select(s => new StatisticDto
        {
            Id = s.Id,
            Label = s.Label,
            Value = s.Value,
            Suffix = s.Suffix,
            Icon = s.Icon,
            DisplayOrder = s.DisplayOrder,
            IsActive = s.IsActive
        });
        return Ok(ApiResponse<IEnumerable<StatisticDto>>.Ok(dtos));
    }

    /// <summary>
    /// Create a new statistic (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<StatisticDto>>> CreateStatistic([FromBody] CreateStatisticRequest request, CancellationToken cancellationToken)
    {
        var stat = new Statistic
        {
            Label = request.Label,
            Value = request.Value,
            Suffix = request.Suffix,
            Icon = request.Icon,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };

        await _statisticRepository.AddAsync(stat, cancellationToken);
        await _statisticRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created statistic: {Label}", stat.Label);

        return Ok(ApiResponse<StatisticDto>.Ok(new StatisticDto
        {
            Id = stat.Id,
            Label = stat.Label,
            Value = stat.Value,
            Suffix = stat.Suffix,
            Icon = stat.Icon,
            DisplayOrder = stat.DisplayOrder,
            IsActive = stat.IsActive
        }, "Statistic created successfully"));
    }

    /// <summary>
    /// Update a statistic (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<StatisticDto>>> UpdateStatistic(Guid id, [FromBody] UpdateStatisticRequest request, CancellationToken cancellationToken)
    {
        var stat = await _statisticRepository.GetByIdAsync(id, cancellationToken);
        if (stat == null)
            return NotFound(ApiResponse<StatisticDto>.Fail("Statistic not found"));

        stat.Label = request.Label;
        stat.Value = request.Value;
        stat.Suffix = request.Suffix;
        stat.Icon = request.Icon;
        stat.DisplayOrder = request.DisplayOrder;
        stat.IsActive = request.IsActive;
        stat.UpdatedAt = DateTime.UtcNow;

        await _statisticRepository.UpdateAsync(stat, cancellationToken);
        await _statisticRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated statistic: {StatisticId}", id);

        return Ok(ApiResponse<StatisticDto>.Ok(new StatisticDto
        {
            Id = stat.Id,
            Label = stat.Label,
            Value = stat.Value,
            Suffix = stat.Suffix,
            Icon = stat.Icon,
            DisplayOrder = stat.DisplayOrder,
            IsActive = stat.IsActive
        }, "Statistic updated successfully"));
    }

    /// <summary>
    /// Delete a statistic (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteStatistic(Guid id, CancellationToken cancellationToken)
    {
        var stat = await _statisticRepository.GetByIdAsync(id, cancellationToken);
        if (stat == null)
            return NotFound(ApiResponse<bool>.Fail("Statistic not found"));

        await _statisticRepository.DeleteAsync(stat, cancellationToken);
        await _statisticRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted statistic: {StatisticId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Statistic deleted successfully"));
    }
}
