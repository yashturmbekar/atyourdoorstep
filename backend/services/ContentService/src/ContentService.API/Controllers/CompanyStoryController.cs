using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages company story sections for About page
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CompanyStoryController : ControllerBase
{
    private readonly ICompanyStorySectionRepository _companyStoryRepository;
    private readonly ILogger<CompanyStoryController> _logger;

    public CompanyStoryController(ICompanyStorySectionRepository companyStoryRepository, ILogger<CompanyStoryController> logger)
    {
        _companyStoryRepository = companyStoryRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all company story sections with items (admin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<CompanyStorySectionDto>>>> GetAllCompanyStory(CancellationToken cancellationToken)
    {
        var sections = await _companyStoryRepository.GetAllAsync(cancellationToken);
        var dtos = sections.OrderBy(s => s.DisplayOrder).Select(s => new CompanyStorySectionDto
        {
            Id = s.Id,
            Title = s.Title,
            Subtitle = s.Subtitle,
            ImageUrl = s.ImageUrl,
            DisplayOrder = s.DisplayOrder,
            IsActive = s.IsActive,
            Items = s.Items?.OrderBy(i => i.DisplayOrder).Select(i => new CompanyStoryItemDto
            {
                Id = i.Id,
                Title = i.Title,
                Description = i.Description,
                Icon = i.Icon,
                DisplayOrder = i.DisplayOrder
            }).ToList() ?? new List<CompanyStoryItemDto>()
        });
        return Ok(ApiResponse<IEnumerable<CompanyStorySectionDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get all active company story sections with items (public)
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<CompanyStorySectionDto>>>> GetActiveCompanyStory(CancellationToken cancellationToken)
    {
        var sections = await _companyStoryRepository.GetActiveSectionsWithItemsAsync(cancellationToken);
        var dtos = sections.Select(s => new CompanyStorySectionDto
        {
            Id = s.Id,
            Title = s.Title,
            Subtitle = s.Subtitle,
            ImageUrl = s.ImageUrl,
            DisplayOrder = s.DisplayOrder,
            IsActive = s.IsActive,
            Items = s.Items?.OrderBy(i => i.DisplayOrder).Select(i => new CompanyStoryItemDto
            {
                Id = i.Id,
                Title = i.Title,
                Description = i.Description,
                Icon = i.Icon,
                DisplayOrder = i.DisplayOrder
            }).ToList() ?? new List<CompanyStoryItemDto>()
        });
        return Ok(ApiResponse<IEnumerable<CompanyStorySectionDto>>.Ok(dtos));
    }

    /// <summary>
    /// Create a company story section (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<CompanyStorySectionDto>>> CreateSection([FromBody] CreateCompanyStorySectionRequest request, CancellationToken cancellationToken)
    {
        var section = new CompanyStorySection
        {
            Title = request.Title,
            Subtitle = request.Subtitle,
            ImageUrl = request.ImageUrl,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            Items = request.Items?.Select((item, i) => new CompanyStoryItem
            {
                Title = item.Title,
                Description = item.Description,
                Icon = item.Icon,
                DisplayOrder = i
            }).ToList() ?? new List<CompanyStoryItem>()
        };

        await _companyStoryRepository.AddAsync(section, cancellationToken);
        await _companyStoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created company story section: {Title}", section.Title);

        return Ok(ApiResponse<CompanyStorySectionDto>.Ok(new CompanyStorySectionDto
        {
            Id = section.Id,
            Title = section.Title,
            Subtitle = section.Subtitle,
            ImageUrl = section.ImageUrl,
            DisplayOrder = section.DisplayOrder,
            IsActive = section.IsActive,
            Items = section.Items?.Select(i => new CompanyStoryItemDto
            {
                Id = i.Id,
                Title = i.Title,
                Description = i.Description,
                Icon = i.Icon,
                DisplayOrder = i.DisplayOrder
            }).ToList() ?? new List<CompanyStoryItemDto>()
        }, "Section created successfully"));
    }

    /// <summary>
    /// Update a company story section (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<CompanyStorySectionDto>>> UpdateSection(Guid id, [FromBody] UpdateCompanyStorySectionRequest request, CancellationToken cancellationToken)
    {
        var section = await _companyStoryRepository.GetByIdAsync(id, cancellationToken);
        if (section == null)
            return NotFound(ApiResponse<CompanyStorySectionDto>.Fail("Section not found"));

        section.Title = request.Title;
        section.Subtitle = request.Subtitle;
        section.ImageUrl = request.ImageUrl;
        section.DisplayOrder = request.DisplayOrder;
        section.IsActive = request.IsActive;
        section.UpdatedAt = DateTime.UtcNow;

        await _companyStoryRepository.UpdateAsync(section, cancellationToken);
        await _companyStoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated company story section: {SectionId}", id);

        return Ok(ApiResponse<CompanyStorySectionDto>.Ok(new CompanyStorySectionDto
        {
            Id = section.Id,
            Title = section.Title,
            Subtitle = section.Subtitle,
            ImageUrl = section.ImageUrl,
            DisplayOrder = section.DisplayOrder,
            IsActive = section.IsActive
        }, "Section updated successfully"));
    }

    /// <summary>
    /// Delete a company story section (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSection(Guid id, CancellationToken cancellationToken)
    {
        var section = await _companyStoryRepository.GetByIdAsync(id, cancellationToken);
        if (section == null)
            return NotFound(ApiResponse<bool>.Fail("Section not found"));

        await _companyStoryRepository.DeleteAsync(section, cancellationToken);
        await _companyStoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted company story section: {SectionId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Section deleted successfully"));
    }
}
