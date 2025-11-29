using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages inquiry types for contact form
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class InquiryTypesController : ControllerBase
{
    private readonly IInquiryTypeRepository _inquiryTypeRepository;
    private readonly ILogger<InquiryTypesController> _logger;

    public InquiryTypesController(IInquiryTypeRepository inquiryTypeRepository, ILogger<InquiryTypesController> logger)
    {
        _inquiryTypeRepository = inquiryTypeRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all inquiry types (admin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<InquiryTypeDto>>>> GetAllInquiryTypes(CancellationToken cancellationToken)
    {
        var types = await _inquiryTypeRepository.GetAllAsync(cancellationToken);
        var dtos = types.OrderBy(t => t.DisplayOrder).Select(t => new InquiryTypeDto
        {
            Id = t.Id,
            Name = t.Name,
            Value = t.Value,
            DisplayOrder = t.DisplayOrder,
            IsActive = t.IsActive
        });
        return Ok(ApiResponse<IEnumerable<InquiryTypeDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get all active inquiry types (public)
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<InquiryTypeDto>>>> GetActiveInquiryTypes(CancellationToken cancellationToken)
    {
        var types = await _inquiryTypeRepository.GetActiveTypesAsync(cancellationToken);
        var dtos = types.Select(t => new InquiryTypeDto
        {
            Id = t.Id,
            Name = t.Name,
            Value = t.Value,
            DisplayOrder = t.DisplayOrder,
            IsActive = t.IsActive
        });
        return Ok(ApiResponse<IEnumerable<InquiryTypeDto>>.Ok(dtos));
    }

    /// <summary>
    /// Create a new inquiry type (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<InquiryTypeDto>>> CreateInquiryType([FromBody] CreateInquiryTypeRequest request, CancellationToken cancellationToken)
    {
        var type = new InquiryType
        {
            Name = request.Name,
            Value = request.Value,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };

        await _inquiryTypeRepository.AddAsync(type, cancellationToken);
        await _inquiryTypeRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created inquiry type: {Name}", type.Name);

        return Ok(ApiResponse<InquiryTypeDto>.Ok(new InquiryTypeDto
        {
            Id = type.Id,
            Name = type.Name,
            Value = type.Value,
            DisplayOrder = type.DisplayOrder,
            IsActive = type.IsActive
        }, "Inquiry type created successfully"));
    }

    /// <summary>
    /// Update an inquiry type (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<InquiryTypeDto>>> UpdateInquiryType(Guid id, [FromBody] UpdateInquiryTypeRequest request, CancellationToken cancellationToken)
    {
        var type = await _inquiryTypeRepository.GetByIdAsync(id, cancellationToken);
        if (type == null)
            return NotFound(ApiResponse<InquiryTypeDto>.Fail("Inquiry type not found"));

        type.Name = request.Name;
        type.Value = request.Value;
        type.DisplayOrder = request.DisplayOrder;
        type.IsActive = request.IsActive;
        type.UpdatedAt = DateTime.UtcNow;

        await _inquiryTypeRepository.UpdateAsync(type, cancellationToken);
        await _inquiryTypeRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated inquiry type: {TypeId}", id);

        return Ok(ApiResponse<InquiryTypeDto>.Ok(new InquiryTypeDto
        {
            Id = type.Id,
            Name = type.Name,
            Value = type.Value,
            DisplayOrder = type.DisplayOrder,
            IsActive = type.IsActive
        }, "Inquiry type updated successfully"));
    }

    /// <summary>
    /// Delete an inquiry type (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteInquiryType(Guid id, CancellationToken cancellationToken)
    {
        var type = await _inquiryTypeRepository.GetByIdAsync(id, cancellationToken);
        if (type == null)
            return NotFound(ApiResponse<bool>.Fail("Inquiry type not found"));

        await _inquiryTypeRepository.DeleteAsync(type, cancellationToken);
        await _inquiryTypeRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted inquiry type: {TypeId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Inquiry type deleted successfully"));
    }
}
