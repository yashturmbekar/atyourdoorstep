namespace OrderService.Application.DTOs;

public class CreateProductRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? Sku { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int? DiscountPercentage { get; set; }
}

public class UpdateProductRequestDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? Category { get; set; }
    public int? Stock { get; set; }
    public string? ImageUrl { get; set; }
    public bool? IsAvailable { get; set; }
    public string? Sku { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int? DiscountPercentage { get; set; }
}

public class ProductResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public int Stock { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; }
    public string? Sku { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int? DiscountPercentage { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
