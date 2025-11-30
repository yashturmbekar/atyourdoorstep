using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Application.DTOs;
using OrderService.Application.Interfaces;
using Shared.Application.DTOs;

namespace OrderService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _productRepository;

    public ProductsController(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    /// <summary>
    /// Get all products with pagination
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PaginatedResponse<ProductResponseDto>>>> GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? category = null,
        [FromQuery] bool? availableOnly = null,
        CancellationToken cancellationToken = default)
    {
        var query = await _productRepository.GetAllAsync(cancellationToken);
        
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category.Equals(category, StringComparison.OrdinalIgnoreCase)).ToList();
        }
        
        if (availableOnly == true)
        {
            query = query.Where(p => p.IsAvailable && p.Stock > 0).ToList();
        }

        var total = query.Count;
        var items = query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Category = p.Category,
                Stock = p.Stock,
                ImageBase64 = p.ImageData != null ? Convert.ToBase64String(p.ImageData) : null,
                ImageContentType = p.ImageContentType,
                IsAvailable = p.IsAvailable,
                Sku = p.Sku,
                DiscountPrice = p.DiscountPrice,
                DiscountPercentage = p.DiscountPercentage,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt
            })
            .ToList();

        var paginatedResponse = new PaginatedResponse<ProductResponseDto>
        {
            Data = items,
            Meta = new PaginationMeta
            {
                Page = page,
                PageSize = pageSize,
                Total = total,
                TotalPages = (int)Math.Ceiling(total / (double)pageSize)
            }
        };

        return Ok(ApiResponse<PaginatedResponse<ProductResponseDto>>.SuccessResponse(paginatedResponse));
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> GetProduct(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product == null)
        {
            return NotFound(ApiResponse<ProductResponseDto>.ErrorResponse("Product not found"));
        }

        var response = new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Category = product.Category,
            Stock = product.Stock,
            ImageBase64 = product.ImageData != null ? Convert.ToBase64String(product.ImageData) : null,
            ImageContentType = product.ImageContentType,
            IsAvailable = product.IsAvailable,
            Sku = product.Sku,
            DiscountPrice = product.DiscountPrice,
            DiscountPercentage = product.DiscountPercentage,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return Ok(ApiResponse<ProductResponseDto>.SuccessResponse(response));
    }

    /// <summary>
    /// Create new product (Admin only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> CreateProduct(
        [FromBody] CreateProductRequestDto request,
        CancellationToken cancellationToken = default)
    {
        // Check if SKU already exists
        if (!string.IsNullOrEmpty(request.Sku))
        {
            var skuExists = await _productRepository.SkuExistsAsync(request.Sku, cancellationToken);
            if (skuExists)
            {
                return BadRequest(ApiResponse<ProductResponseDto>.ErrorResponse("Product with this SKU already exists"));
            }
        }

        var product = new Domain.Entities.Product
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            Category = request.Category,
            Stock = request.Stock,
            ImageData = !string.IsNullOrEmpty(request.ImageBase64) ? Convert.FromBase64String(request.ImageBase64) : null,
            ImageContentType = request.ImageContentType,
            IsAvailable = request.IsAvailable,
            Sku = request.Sku,
            DiscountPrice = request.DiscountPrice,
            DiscountPercentage = request.DiscountPercentage
        };

        await _productRepository.AddAsync(product, cancellationToken);

        var response = new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Category = product.Category,
            Stock = product.Stock,
            ImageBase64 = product.ImageData != null ? Convert.ToBase64String(product.ImageData) : null,
            ImageContentType = product.ImageContentType,
            IsAvailable = product.IsAvailable,
            Sku = product.Sku,
            DiscountPrice = product.DiscountPrice,
            DiscountPercentage = product.DiscountPercentage,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, 
            ApiResponse<ProductResponseDto>.SuccessResponse(response, "Product created successfully"));
    }

    /// <summary>
    /// Update product (Admin only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<ProductResponseDto>>> UpdateProduct(
        Guid id,
        [FromBody] UpdateProductRequestDto request,
        CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product == null)
        {
            return NotFound(ApiResponse<ProductResponseDto>.ErrorResponse("Product not found"));
        }

        // Update only provided fields
        if (!string.IsNullOrEmpty(request.Name)) product.Name = request.Name;
        if (!string.IsNullOrEmpty(request.Description)) product.Description = request.Description;
        if (request.Price.HasValue) product.Price = request.Price.Value;
        if (!string.IsNullOrEmpty(request.Category)) product.Category = request.Category;
        if (request.Stock.HasValue) product.Stock = request.Stock.Value;
        if (!string.IsNullOrEmpty(request.ImageBase64))
        {
            product.ImageData = Convert.FromBase64String(request.ImageBase64);
            product.ImageContentType = request.ImageContentType;
        }
        if (request.IsAvailable.HasValue) product.IsAvailable = request.IsAvailable.Value;
        if (request.Sku != null) product.Sku = request.Sku;
        if (request.DiscountPrice.HasValue) product.DiscountPrice = request.DiscountPrice;
        if (request.DiscountPercentage.HasValue) product.DiscountPercentage = request.DiscountPercentage;

        await _productRepository.UpdateAsync(product, cancellationToken);

        var response = new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Category = product.Category,
            Stock = product.Stock,
            ImageBase64 = product.ImageData != null ? Convert.ToBase64String(product.ImageData) : null,
            ImageContentType = product.ImageContentType,
            IsAvailable = product.IsAvailable,
            Sku = product.Sku,
            DiscountPrice = product.DiscountPrice,
            DiscountPercentage = product.DiscountPercentage,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return Ok(ApiResponse<ProductResponseDto>.SuccessResponse(response, "Product updated successfully"));
    }

    /// <summary>
    /// Delete product (Admin only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteProduct(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse("Product not found"));
        }

        await _productRepository.DeleteAsync(product, cancellationToken);
        return Ok(ApiResponse<object>.SuccessResponse(null!, "Product deleted successfully"));
    }

    /// <summary>
    /// Get product categories
    /// </summary>
    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetCategories(CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        var categories = products
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        return Ok(ApiResponse<List<string>>.SuccessResponse(categories));
    }
}
