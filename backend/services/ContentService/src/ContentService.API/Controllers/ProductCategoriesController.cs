using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages product categories
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductCategoriesController : ControllerBase
{
    private readonly IProductCategoryRepository _categoryRepository;
    private readonly ILogger<ProductCategoriesController> _logger;

    public ProductCategoriesController(IProductCategoryRepository categoryRepository, ILogger<ProductCategoriesController> logger)
    {
        _categoryRepository = categoryRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all product categories (admin)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductCategoryDto>>>> GetAllCategories(CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetWithProductCountAsync(cancellationToken);
        var dtos = categories.OrderBy(c => c.DisplayOrder).Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<ProductCategoryDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get all active product categories (public)
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductCategoryDto>>>> GetActiveCategories(CancellationToken cancellationToken)
    {
        var categories = await _categoryRepository.GetActiveAsync(cancellationToken);
        var dtos = categories.Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<ProductCategoryDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get product category by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ProductCategoryDto>>> GetCategory(Guid id, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return NotFound(ApiResponse<ProductCategoryDto>.Fail("Product category not found"));

        return Ok(ApiResponse<ProductCategoryDto>.Ok(MapToDto(category)));
    }

    /// <summary>
    /// Get product category by slug
    /// </summary>
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ApiResponse<ProductCategoryDto>>> GetCategoryBySlug(string slug, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetBySlugAsync(slug, cancellationToken);
        if (category == null)
            return NotFound(ApiResponse<ProductCategoryDto>.Fail("Product category not found"));

        return Ok(ApiResponse<ProductCategoryDto>.Ok(MapToDto(category)));
    }

    /// <summary>
    /// Create a new product category (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductCategoryDto>>> CreateCategory([FromBody] CreateProductCategoryRequest request, CancellationToken cancellationToken)
    {
        var category = new ProductCategory
        {
            Name = request.Name,
            Slug = request.Slug,
            Description = request.Description,
            Icon = request.Icon,
            DisplayOrder = request.DisplayOrder,
            IsActive = request.IsActive
        };

        // Handle image byte data
        if (!string.IsNullOrEmpty(request.ImageBase64))
        {
            category.ImageData = Convert.FromBase64String(request.ImageBase64);
            category.ImageContentType = request.ImageContentType;
        }

        await _categoryRepository.AddAsync(category, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created product category: {CategoryName}", category.Name);

        return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, ApiResponse<ProductCategoryDto>.Ok(MapToDto(category), "Product category created successfully"));
    }

    /// <summary>
    /// Update a product category (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ProductCategoryDto>>> UpdateCategory(Guid id, [FromBody] UpdateProductCategoryRequest request, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return NotFound(ApiResponse<ProductCategoryDto>.Fail("Product category not found"));

        category.Name = request.Name;
        category.Slug = request.Slug;
        category.Description = request.Description;
        category.Icon = request.Icon;
        category.DisplayOrder = request.DisplayOrder;
        category.IsActive = request.IsActive;
        category.UpdatedAt = DateTime.UtcNow;

        // Handle image byte data
        if (!string.IsNullOrEmpty(request.ImageBase64))
        {
            category.ImageData = Convert.FromBase64String(request.ImageBase64);
            category.ImageContentType = request.ImageContentType;
        }
        else if (request.ImageBase64 == string.Empty)
        {
            // Clear image if empty string is explicitly sent
            category.ImageData = null;
            category.ImageContentType = null;
        }

        await _categoryRepository.UpdateAsync(category, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated product category: {CategoryId}", id);

        return Ok(ApiResponse<ProductCategoryDto>.Ok(MapToDto(category), "Product category updated successfully"));
    }

    /// <summary>
    /// Delete a product category (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(Guid id, CancellationToken cancellationToken)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return NotFound(ApiResponse<bool>.Fail("Product category not found"));

        await _categoryRepository.DeleteAsync(category, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted product category: {CategoryId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Product category deleted successfully"));
    }

    private static ProductCategoryDto MapToDto(ProductCategory category)
    {
        return new ProductCategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            Icon = category.Icon,
            ImageBase64 = category.ImageData != null ? Convert.ToBase64String(category.ImageData) : null,
            ImageContentType = category.ImageContentType,
            DisplayOrder = category.DisplayOrder,
            IsActive = category.IsActive,
            ProductCount = category.Products?.Count ?? 0
        };
    }
}
