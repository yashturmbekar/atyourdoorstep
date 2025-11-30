using ContentService.API.Models;
using ContentService.Application.DTOs;
using ContentService.Application.Interfaces;
using ContentService.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ContentService.API.Controllers;

/// <summary>
/// Manages products and variants
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _productRepository;
    private readonly IProductCategoryRepository _productCategoryRepository;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IProductRepository productRepository,
        IProductCategoryRepository productCategoryRepository,
        ILogger<ProductsController> logger)
    {
        _productRepository = productRepository;
        _productCategoryRepository = productCategoryRepository;
        _logger = logger;
    }

    /// <summary>
    /// Get all products with pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedApiResponse<ProductDto>>> GetProducts(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? category = null,
        [FromQuery] bool? featured = null,
        CancellationToken cancellationToken = default)
    {
        var (products, total) = await _productRepository.GetPagedWithDetailsAsync(page, pageSize, category, featured, cancellationToken);
        var dtos = products.Select(MapToDto);
        return Ok(PagedApiResponse<ProductDto>.Ok(dtos, page, pageSize, total));
    }

    /// <summary>
    /// Get product by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetProduct(Guid id, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(id, cancellationToken);
        if (product == null)
            return NotFound(ApiResponse<ProductDto>.Fail("Product not found"));

        return Ok(ApiResponse<ProductDto>.Ok(MapToDto(product)));
    }

    /// <summary>
    /// Get product by slug
    /// </summary>
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> GetProductBySlug(string slug, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetBySlugAsync(slug, cancellationToken);
        if (product == null)
            return NotFound(ApiResponse<ProductDto>.Fail("Product not found"));

        return Ok(ApiResponse<ProductDto>.Ok(MapToDto(product)));
    }

    /// <summary>
    /// Get products by category
    /// </summary>
    [HttpGet("category/{categorySlug}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDto>>>> GetProductsByCategory(string categorySlug, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetByProductCategorySlugAsync(categorySlug, cancellationToken);
        var dtos = products.Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<ProductDto>>.Ok(dtos));
    }

    /// <summary>
    /// Get featured products
    /// </summary>
    [HttpGet("featured")]
    public async Task<ActionResult<ApiResponse<IEnumerable<ProductDto>>>> GetFeaturedProducts([FromQuery] int limit = 6, CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetFeaturedProductsAsync(cancellationToken);
        var dtos = products.Take(limit).Select(MapToDto);
        return Ok(ApiResponse<IEnumerable<ProductDto>>.Ok(dtos));
    }

    /// <summary>
    /// Create a new product (Admin only)
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<ProductDto>>> CreateProduct([FromBody] CreateProductRequest request, CancellationToken cancellationToken)
    {
        var product = new Product
        {
            Name = request.Name,
            Slug = request.Slug,
            ShortDescription = request.ShortDescription,
            FullDescription = request.FullDescription,
            ProductCategoryId = request.ProductCategoryId,
            BasePrice = request.BasePrice,
            DiscountedPrice = request.DiscountedPrice,
            IsFeatured = request.IsFeatured,
            IsAvailable = request.IsAvailable,
            SeasonStart = request.SeasonStart,
            SeasonEnd = request.SeasonEnd,
            MetaTitle = request.MetaTitle,
            MetaDescription = request.MetaDescription,
            Variants = request.Variants?.Select(v => new ProductVariant
            {
                Size = v.Size,
                Unit = v.Unit,
                Price = v.Price,
                DiscountedPrice = v.DiscountedPrice,
                StockQuantity = v.StockQuantity,
                Sku = v.Sku,
                IsAvailable = v.IsAvailable
            }).ToList() ?? new List<ProductVariant>(),
            Features = request.Features?.Select((f, i) => new ProductFeature
            {
                Feature = f,
                DisplayOrder = i
            }).ToList() ?? new List<ProductFeature>(),
            Images = request.Images?.Select((img, i) => new ProductImage
            {
                ImageData = !string.IsNullOrEmpty(img.ImageBase64) ? Convert.FromBase64String(img.ImageBase64) : null,
                ImageContentType = img.ImageContentType,
                AltText = img.AltText,
                IsPrimary = i == 0,
                DisplayOrder = i
            }).ToList() ?? new List<ProductImage>()
        };

        await _productRepository.AddAsync(product, cancellationToken);
        await _productRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Created product: {ProductName}", product.Name);

        var createdProduct = await _productRepository.GetByIdWithDetailsAsync(product.Id, cancellationToken);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, ApiResponse<ProductDto>.Ok(MapToDto(createdProduct!), "Product created successfully"));
    }

    /// <summary>
    /// Update a product (Admin only)
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ApiResponse<ProductDto>>> UpdateProduct(Guid id, [FromBody] UpdateProductRequest request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(id, cancellationToken);
        if (product == null)
            return NotFound(ApiResponse<ProductDto>.Fail("Product not found"));

        product.Name = request.Name;
        product.Slug = request.Slug;
        product.ShortDescription = request.ShortDescription;
        product.FullDescription = request.FullDescription;
        product.ProductCategoryId = request.ProductCategoryId;
        product.BasePrice = request.BasePrice;
        product.DiscountedPrice = request.DiscountedPrice;
        product.IsFeatured = request.IsFeatured;
        product.IsAvailable = request.IsAvailable;
        product.SeasonStart = request.SeasonStart;
        product.SeasonEnd = request.SeasonEnd;
        product.MetaTitle = request.MetaTitle;
        product.MetaDescription = request.MetaDescription;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product, cancellationToken);
        await _productRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated product: {ProductId}", id);

        return Ok(ApiResponse<ProductDto>.Ok(MapToDto(product), "Product updated successfully"));
    }

    /// <summary>
    /// Delete a product (Admin only)
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteProduct(Guid id, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product == null)
            return NotFound(ApiResponse<bool>.Fail("Product not found"));

        await _productRepository.DeleteAsync(product, cancellationToken);
        await _productRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted product: {ProductId}", id);

        return Ok(ApiResponse<bool>.Ok(true, "Product deleted successfully"));
    }

    /// <summary>
    /// Add variant to product (Admin only)
    /// </summary>
    [HttpPost("{id:guid}/variants")]
    public async Task<ActionResult<ApiResponse<ProductVariantDto>>> AddVariant(Guid id, [FromBody] CreateVariantRequest request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(id, cancellationToken);
        if (product == null)
            return NotFound(ApiResponse<ProductVariantDto>.Fail("Product not found"));

        var variant = new ProductVariant
        {
            ProductId = id,
            Size = request.Size,
            Unit = request.Unit,
            Price = request.Price,
            DiscountedPrice = request.DiscountedPrice,
            StockQuantity = request.StockQuantity,
            Sku = request.Sku,
            IsAvailable = request.IsAvailable
        };

        product.Variants.Add(variant);
        await _productRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Added variant to product: {ProductId}", id);

        return Ok(ApiResponse<ProductVariantDto>.Ok(MapVariantToDto(variant), "Variant added successfully"));
    }

    /// <summary>
    /// Update variant (Admin only)
    /// </summary>
    [HttpPut("{productId:guid}/variants/{variantId:guid}")]
    public async Task<ActionResult<ApiResponse<ProductVariantDto>>> UpdateVariant(Guid productId, Guid variantId, [FromBody] UpdateVariantRequest request, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(productId, cancellationToken);
        if (product == null)
            return NotFound(ApiResponse<ProductVariantDto>.Fail("Product not found"));

        var variant = product.Variants.FirstOrDefault(v => v.Id == variantId);
        if (variant == null)
            return NotFound(ApiResponse<ProductVariantDto>.Fail("Variant not found"));

        variant.Size = request.Size;
        variant.Unit = request.Unit;
        variant.Price = request.Price;
        variant.DiscountedPrice = request.DiscountedPrice;
        variant.StockQuantity = request.StockQuantity;
        variant.Sku = request.Sku;
        variant.IsAvailable = request.IsAvailable;
        variant.UpdatedAt = DateTime.UtcNow;

        await _productRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Updated variant: {VariantId} for product: {ProductId}", variantId, productId);

        return Ok(ApiResponse<ProductVariantDto>.Ok(MapVariantToDto(variant), "Variant updated successfully"));
    }

    /// <summary>
    /// Delete variant (Admin only)
    /// </summary>
    [HttpDelete("{productId:guid}/variants/{variantId:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteVariant(Guid productId, Guid variantId, CancellationToken cancellationToken)
    {
        var product = await _productRepository.GetByIdWithDetailsAsync(productId, cancellationToken);
        if (product == null)
            return NotFound(ApiResponse<bool>.Fail("Product not found"));

        var variant = product.Variants.FirstOrDefault(v => v.Id == variantId);
        if (variant == null)
            return NotFound(ApiResponse<bool>.Fail("Variant not found"));

        product.Variants.Remove(variant);
        await _productRepository.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Deleted variant: {VariantId} from product: {ProductId}", variantId, productId);

        return Ok(ApiResponse<bool>.Ok(true, "Variant deleted successfully"));
    }

    private static ProductDto MapToDto(Product product)
    {
        var primaryImage = product.Images?.FirstOrDefault(i => i.IsPrimary) ?? product.Images?.FirstOrDefault();
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Slug = product.Slug,
            ShortDescription = product.ShortDescription,
            FullDescription = product.FullDescription,
            ProductCategoryId = product.ProductCategoryId,
            ProductCategoryName = product.ProductCategory?.Name,
            BasePrice = product.BasePrice,
            DiscountedPrice = product.DiscountedPrice,
            IsFeatured = product.IsFeatured,
            IsAvailable = product.IsAvailable,
            SeasonStart = product.SeasonStart,
            SeasonEnd = product.SeasonEnd,
            MetaTitle = product.MetaTitle,
            MetaDescription = product.MetaDescription,
            Variants = product.Variants?.Select(MapVariantToDto).ToList() ?? new List<ProductVariantDto>(),
            Features = product.Features?.OrderBy(f => f.DisplayOrder).Select(f => f.Feature).ToList() ?? new List<string>(),
            Images = product.Images?.OrderBy(i => i.DisplayOrder).Select(i => new ProductImageDto
            {
                Id = i.Id,
                ImageBase64 = i.ImageData != null ? Convert.ToBase64String(i.ImageData) : null,
                ImageContentType = i.ImageContentType,
                AltText = i.AltText,
                IsPrimary = i.IsPrimary
            }).ToList() ?? new List<ProductImageDto>(),
            PrimaryImageBase64 = primaryImage?.ImageData != null ? Convert.ToBase64String(primaryImage.ImageData) : null,
            PrimaryImageContentType = primaryImage?.ImageContentType
        };
    }

    private static ProductVariantDto MapVariantToDto(ProductVariant variant)
    {
        return new ProductVariantDto
        {
            Id = variant.Id,
            Size = variant.Size,
            Unit = variant.Unit,
            Price = variant.Price,
            DiscountedPrice = variant.DiscountedPrice,
            StockQuantity = variant.StockQuantity,
            Sku = variant.Sku,
            IsAvailable = variant.IsAvailable
        };
    }
}
