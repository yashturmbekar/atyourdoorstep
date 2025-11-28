using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages USP (Why Choose Us) items
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UspItemsController : ControllerBase
{
    private readonly IUspItemRepository _uspItemRepository;
    private readonly ILogger<UspItemsController> _logger;

    public UspItemsController(IUspItemRepository uspItemRepository, ILogger<UspItemsController> logger)
    {
        _uspItemRepository = uspItemRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all active USP items
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UspItemDto>>>> GetUspItems(CancellationToken cancellationToken)
    {
        var items = await _uspItemRepository.GetActiveAsync(cancellationToken);
        var dtos = items.Select(i => new UspItemDto
        {
            Id = i.Id,
            Title = i.Title,
            Description = i.Description,
            Icon = i.Icon,
            DisplayOrder = i.DisplayOrder,
            IsActive = i.IsActive
        });
        return Ok(ApiResponse<IEnumerable<UspItemDto>>.Ok(dtos));
    }

    /// <summary>
    /// Create a new USP item (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<UspItemDto>>> CreateUspItem([FromBody] CreateUspItemRequest request, CancellationToken cancellationToken)
    {
        var item = new UspItem
        {
            Title = request.Title,
            Description = request.Description,
            Icon = request.Icon,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };

        await _uspItemRepository.AddAsync(item, cancellationToken);
        await _uspItemRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created USP item: {Title}", item.Title);

        return Ok(ApiResponse<UspItemDto>.Ok(new UspItemDto
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            Icon = item.Icon,
            DisplayOrder = item.DisplayOrder,
            IsActive = item.IsActive
        }, "USP item created successfully"));
    }

    /// <summary>
    /// Update a USP item (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<UspItemDto>>> UpdateUspItem(Guid id, [FromBody] UpdateUspItemRequest request, CancellationToken cancellationToken)
    {
        var item = await _uspItemRepository.GetByIdAsync(id, cancellationToken);
        if (item == null)
            return NotFound(ApiResponse<UspItemDto>.Fail("USP item not found"));

        item.Title = request.Title;
        item.Description = request.Description;
        item.Icon = request.Icon;
        item.DisplayOrder = request.DisplayOrder;
        item.IsActive = request.IsActive;
        item.UpdatedAt = DateTime.UtcNow;

        await _uspItemRepository.UpdateAsync(item, cancellationToken);
        await _uspItemRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated USP item: {ItemId}", id);

        return Ok(ApiResponse<UspItemDto>.Ok(new UspItemDto
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            Icon = item.Icon,
            DisplayOrder = item.DisplayOrder,
            IsActive = item.IsActive
        }, "USP item updated successfully"));
    }

    /// <summary>
    /// Delete a USP item (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteUspItem(Guid id, CancellationToken cancellationToken)
    {
        var item = await _uspItemRepository.GetByIdAsync(id, cancellationToken);
        if (item == null)
            return NotFound(ApiResponse<bool>.Fail("USP item not found"));

        await _uspItemRepository.DeleteAsync(item, cancellationToken);
        await _uspItemRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted USP item: {ItemId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "USP item deleted successfully"));
    }
}
