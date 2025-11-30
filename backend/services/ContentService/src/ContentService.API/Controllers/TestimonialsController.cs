using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages customer testimonials
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly ITestimonialRepository _testimonialRepository;
    private readonly ILogger<TestimonialsController> _logger;

    public TestimonialsController(ITestimonialRepository testimonialRepository, ILogger<TestimonialsController> logger)
    {
        _testimonialRepository = testimonialRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all testimonials (admin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<TestimonialDto>>>> GetAllTestimonials(CancellationToken cancellationToken)
    {
        var testimonials = await _testimonialRepository.GetAllAsync(cancellationToken);
        var dtos = testimonials.OrderBy(t => t.DisplayOrder).Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<TestimonialDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get all active testimonials (public)
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TestimonialDto>>>> GetActiveTestimonials(CancellationToken cancellationToken)
    {
        var testimonials = await _testimonialRepository.GetActiveTestimonialsAsync(cancellationToken);
        var dtos = testimonials.Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<TestimonialDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get featured testimonials for homepage
    /// </summary>
    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<IEnumerable<TestimonialDto>>>> GetFeaturedTestimonials([FromQuery] int limit = 6, CancellationToken cancellationToken = default)
    {
        var testimonials = await _testimonialRepository.GetFeaturedTestimonialsAsync(cancellationToken);
        var dtos = testimonials.Take(limit).Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<TestimonialDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get testimonial by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> GetTestimonial(Guid id, CancellationToken cancellationToken)
    {
        var testimonial = await _testimonialRepository.GetByIdAsync(id, cancellationToken);
        if (testimonial == null)
            return NotFound(ApiResponse<TestimonialDto>.Fail("Testimonial not found"));

        return Ok(ApiResponse<TestimonialDto>.Ok(MapToDto(testimonial)));
    }

    /// <summary>
    /// Create a new testimonial (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> CreateTestimonial([FromBody] CreateTestimonialRequest request, CancellationToken cancellationToken)
    {
        var testimonial = new Testimonial
        {
            CustomerName = request.CustomerName,
            CustomerTitle = request.CustomerTitle,
            CustomerLocation = request.CustomerLocation,
            Content = request.Content,
            Rating = request.Rating,
            ProductPurchased = request.ProductPurchased,
            IsFeatured = request.IsFeatured,
            IsActive = request.IsActive,
            DisplayOrder = request.DisplayOrder
        };

        // Handle image byte data
        if (!string.IsNullOrEmpty(request.CustomerImageBase64))
        {
            testimonial.CustomerImageData = Convert.FromBase64String(request.CustomerImageBase64);
            testimonial.CustomerImageContentType = request.CustomerImageContentType;
        }

        await _testimonialRepository.AddAsync(testimonial, cancellationToken);
        await _testimonialRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created testimonial from: {CustomerName}", testimonial.CustomerName);

        return CreatedAtAction(nameof(GetTestimonial), new { id = testimonial.Id }, ApiResponse<TestimonialDto>.Ok(MapToDto(testimonial), "Testimonial created successfully"));
    }

    /// <summary>
    /// Update a testimonial (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<TestimonialDto>>> UpdateTestimonial(Guid id, [FromBody] UpdateTestimonialRequest request, CancellationToken cancellationToken)
    {
        var testimonial = await _testimonialRepository.GetByIdAsync(id, cancellationToken);
        if (testimonial == null)
            return NotFound(ApiResponse<TestimonialDto>.Fail("Testimonial not found"));

        testimonial.CustomerName = request.CustomerName;
        testimonial.CustomerTitle = request.CustomerTitle;
        testimonial.CustomerLocation = request.CustomerLocation;
        testimonial.Content = request.Content;
        testimonial.Rating = request.Rating;
        testimonial.ProductPurchased = request.ProductPurchased;
        testimonial.IsFeatured = request.IsFeatured;
        testimonial.IsActive = request.IsActive;
        testimonial.DisplayOrder = request.DisplayOrder;
        testimonial.UpdatedAt = DateTime.UtcNow;

        // Handle image byte data
        if (!string.IsNullOrEmpty(request.CustomerImageBase64))
        {
            testimonial.CustomerImageData = Convert.FromBase64String(request.CustomerImageBase64);
            testimonial.CustomerImageContentType = request.CustomerImageContentType;
        }
        else if (request.CustomerImageBase64 == string.Empty)
        {
            // Clear image if empty string is explicitly sent
            testimonial.CustomerImageData = null;
            testimonial.CustomerImageContentType = null;
        }

        await _testimonialRepository.UpdateAsync(testimonial, cancellationToken);
        await _testimonialRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated testimonial: {TestimonialId}", id);

        return Ok(ApiResponse<TestimonialDto>.Ok(MapToDto(testimonial), "Testimonial updated successfully"));
    }

    /// <summary>
    /// Delete a testimonial (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteTestimonial(Guid id, CancellationToken cancellationToken)
    {
        var testimonial = await _testimonialRepository.GetByIdAsync(id, cancellationToken);
        if (testimonial == null)
            return NotFound(ApiResponse<bool>.Fail("Testimonial not found"));

        await _testimonialRepository.DeleteAsync(testimonial, cancellationToken);
        await _testimonialRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted testimonial: {TestimonialId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Testimonial deleted successfully"));
    }

    private static TestimonialDto MapToDto(Testimonial testimonial)
    {
        return new TestimonialDto
        {
            Id = testimonial.Id,
            CustomerName = testimonial.CustomerName,
            CustomerTitle = testimonial.CustomerTitle,
            CustomerLocation = testimonial.CustomerLocation,
            CustomerImageBase64 = testimonial.CustomerImageData != null ? Convert.ToBase64String(testimonial.CustomerImageData) : null,
            CustomerImageContentType = testimonial.CustomerImageContentType,
            Content = testimonial.Content,
            Rating = testimonial.Rating,
            ProductPurchased = testimonial.ProductPurchased,
            IsFeatured = testimonial.IsFeatured,
            IsActive = testimonial.IsActive,
            DisplayOrder = testimonial.DisplayOrder
        };
    }
}
