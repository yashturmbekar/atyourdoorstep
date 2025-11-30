using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages hero carousel slides
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HeroSlidesController : ControllerBase
{
    private readonly IHeroSlideRepository _heroSlideRepository;
    private readonly ILogger<HeroSlidesController> _logger;

    public HeroSlidesController(IHeroSlideRepository heroSlideRepository, ILogger<HeroSlidesController> logger)
    {
        _heroSlideRepository = heroSlideRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all hero slides (admin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<HeroSlideDto>>>> GetAllHeroSlides(CancellationToken cancellationToken)
    {
        var slides = await _heroSlideRepository.GetAllAsync(cancellationToken);
        var dtos = slides.OrderBy(s => s.DisplayOrder).Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<HeroSlideDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get all active hero slides (public)
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<HeroSlideDto>>>> GetActiveHeroSlides(CancellationToken cancellationToken)
    {
        var slides = await _heroSlideRepository.GetActiveSlidesAsync(cancellationToken);
        var dtos = slides.Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<HeroSlideDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get hero slide by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<HeroSlideDto>>> GetHeroSlide(Guid id, CancellationToken cancellationToken)
    {
        var slide = await _heroSlideRepository.GetByIdAsync(id, cancellationToken);
        if (slide == null)
            return NotFound(ApiResponse<HeroSlideDto>.Fail("Hero slide not found"));

        return Ok(ApiResponse<HeroSlideDto>.Ok(MapToDto(slide)));
    }

    /// <summary>
    /// Create a new hero slide (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<HeroSlideDto>>> CreateHeroSlide([FromBody] CreateHeroSlideRequest request, CancellationToken cancellationToken)
    {
        var slide = new HeroSlide
        {
            Title = request.Title,
            Subtitle = request.Subtitle,
            Description = request.Description,
            GradientStart = request.GradientStart,
            GradientEnd = request.GradientEnd,
            CtaText = request.CtaText,
            CtaLink = request.CtaLink,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive,
            Features = request.Features?.Select((f, i) => new HeroSlideFeature
            {
                Feature = f,
                DisplayOrder = i
            }).ToList() ?? new List<HeroSlideFeature>()
        };

        // Handle image byte data
        if (!string.IsNullOrEmpty(request.ImageBase64))
        {
            slide.ImageData = Convert.FromBase64String(request.ImageBase64);
            slide.ImageContentType = request.ImageContentType;
        }

        await _heroSlideRepository.AddAsync(slide, cancellationToken);
        await _heroSlideRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created hero slide: {Title}", slide.Title);

        return CreatedAtAction(nameof(GetHeroSlide), new { id = slide.Id }, ApiResponse<HeroSlideDto>.Ok(MapToDto(slide), "Hero slide created successfully"));
    }

    /// <summary>
    /// Update a hero slide (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<HeroSlideDto>>> UpdateHeroSlide(Guid id, [FromBody] UpdateHeroSlideRequest request, CancellationToken cancellationToken)
    {
        var slide = await _heroSlideRepository.GetByIdAsync(id, cancellationToken);
        if (slide == null)
            return NotFound(ApiResponse<HeroSlideDto>.Fail("Hero slide not found"));

        slide.Title = request.Title;
        slide.Subtitle = request.Subtitle;
        slide.Description = request.Description;
        slide.GradientStart = request.GradientStart;
        slide.GradientEnd = request.GradientEnd;
        slide.CtaText = request.CtaText;
        slide.CtaLink = request.CtaLink;
        slide.DisplayOrder = request.DisplayOrder;
        slide.IsActive = request.IsActive;
        slide.UpdatedAt = DateTime.UtcNow;

        // Handle image byte data
        if (!string.IsNullOrEmpty(request.ImageBase64))
        {
            slide.ImageData = Convert.FromBase64String(request.ImageBase64);
            slide.ImageContentType = request.ImageContentType;
        }
        else if (request.ImageBase64 == string.Empty)
        {
            // Clear image if empty string is explicitly sent
            slide.ImageData = null;
            slide.ImageContentType = null;
        }

        await _heroSlideRepository.UpdateAsync(slide, cancellationToken);
        await _heroSlideRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated hero slide: {SlideId}", id);

        return Ok(ApiResponse<HeroSlideDto>.Ok(MapToDto(slide), "Hero slide updated successfully"));
    }

    /// <summary>
    /// Delete a hero slide (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteHeroSlide(Guid id, CancellationToken cancellationToken)
    {
        var slide = await _heroSlideRepository.GetByIdAsync(id, cancellationToken);
        if (slide == null)
            return NotFound(ApiResponse<bool>.Fail("Hero slide not found"));

        await _heroSlideRepository.DeleteAsync(slide, cancellationToken);
        await _heroSlideRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted hero slide: {SlideId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Hero slide deleted successfully"));
    }

    private static HeroSlideDto MapToDto(HeroSlide slide)
    {
        return new HeroSlideDto
        {
            Id = slide.Id,
            Title = slide.Title,
            Subtitle = slide.Subtitle,
            Description = slide.Description,
            ImageBase64 = slide.ImageData != null ? Convert.ToBase64String(slide.ImageData) : null,
            ImageContentType = slide.ImageContentType,
            GradientStart = slide.GradientStart,
            GradientEnd = slide.GradientEnd,
            CtaText = slide.CtaText,
            CtaLink = slide.CtaLink,
            DisplayOrder = slide.DisplayOrder,
            IsActive = slide.IsActive,
            Features = slide.Features?.OrderBy(f => f.DisplayOrder).Select(f => f.Feature).ToList() ?? new List<string>()
        };
    }
}
