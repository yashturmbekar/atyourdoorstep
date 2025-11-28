namespace ContentService.Application.DTOs;

#region Category DTOs

public record CreateCategoryRequest(
    string Name,
    string Slug,
    string? Description,
    string? Icon,
    string? ImageUrl,
    int DisplayOrder = 0,
    bool IsActive = true,
    Guid? ParentId = null
);

public record UpdateCategoryRequest(
    string Name,
    string Slug,
    string? Description,
    string? Icon,
    string? ImageUrl,
    int DisplayOrder,
    bool IsActive,
    Guid? ParentId
);

public class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public int ProductCount { get; set; }
}

// Response aliases for service interfaces
public class CategoryResponse : CategoryDto { }

public class PublicCategoryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public string? ImageUrl { get; set; }
    public int ProductCount { get; set; }
}

#endregion

#region Product DTOs

public class CreateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? FullDescription { get; set; }
    public Guid CategoryId { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? SeasonStart { get; set; }
    public string? SeasonEnd { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public List<CreateVariantRequest>? Variants { get; set; }
    public List<string>? Features { get; set; }
    public List<CreateProductImageRequest>? Images { get; set; }
}

public class UpdateProductRequest
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? FullDescription { get; set; }
    public Guid CategoryId { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsAvailable { get; set; }
    public string? SeasonStart { get; set; }
    public string? SeasonEnd { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
}

public class CreateVariantRequest
{
    public string Size { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public int StockQuantity { get; set; } = 100;
    public string? Sku { get; set; }
    public bool IsAvailable { get; set; } = true;
}

public class UpdateVariantRequest
{
    public string Size { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Sku { get; set; }
    public bool IsAvailable { get; set; }
}

public class CreateProductImageRequest
{
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
}

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? FullDescription { get; set; }
    public Guid CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsAvailable { get; set; }
    public string? SeasonStart { get; set; }
    public string? SeasonEnd { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? PrimaryImageUrl { get; set; }
    public List<ProductVariantDto> Variants { get; set; } = new();
    public List<string> Features { get; set; } = new();
    public List<ProductImageDto> Images { get; set; } = new();
}

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string Size { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public int StockQuantity { get; set; }
    public string? Sku { get; set; }
    public bool IsAvailable { get; set; }
}

public class ProductImageDto
{
    public Guid Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string? AltText { get; set; }
    public bool IsPrimary { get; set; }
}

// Response aliases for service interfaces
public class ProductResponse : ProductDto { }
public class ProductVariantResponse : ProductVariantDto { }
public class ProductImageResponse : ProductImageDto { }

public class ProductListResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? CategoryName { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsAvailable { get; set; }
    public string? PrimaryImageUrl { get; set; }
}

public class PublicProductResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string? FullDescription { get; set; }
    public string? CategoryName { get; set; }
    public string? CategorySlug { get; set; }
    public decimal BasePrice { get; set; }
    public decimal? DiscountedPrice { get; set; }
    public string? SeasonStart { get; set; }
    public string? SeasonEnd { get; set; }
    public string? PrimaryImageUrl { get; set; }
    public List<ProductVariantDto> Variants { get; set; } = new();
    public List<string> Features { get; set; } = new();
    public List<ProductImageDto> Images { get; set; } = new();
}

#endregion

#region Testimonial DTOs

public class CreateTestimonialRequest
{
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerTitle { get; set; }
    public string? CustomerLocation { get; set; }
    public string? CustomerImageUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; } = 5;
    public string? ProductPurchased { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; }
}

public class UpdateTestimonialRequest
{
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerTitle { get; set; }
    public string? CustomerLocation { get; set; }
    public string? CustomerImageUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? ProductPurchased { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
}

public class TestimonialDto
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerTitle { get; set; }
    public string? CustomerLocation { get; set; }
    public string? CustomerImageUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? ProductPurchased { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
}

// Response aliases for service interfaces
public class TestimonialResponse : TestimonialDto { }

public class PublicTestimonialResponse
{
    public Guid Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? CustomerTitle { get; set; }
    public string? CustomerLocation { get; set; }
    public string? CustomerImageUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string? ProductPurchased { get; set; }
}

#endregion

#region Site Settings DTOs

public class CreateSiteSettingRequest
{
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = "general";
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
}

public class SiteSettingDto
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string Group { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublic { get; set; }
}

// Additional request types
public class UpdateSiteSettingRequest
{
    public string Value { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPublic { get; set; } = true;
}

// Response aliases for service interfaces
public class SiteSettingResponse : SiteSettingDto { }

public class SiteSettingsGroupResponse
{
    public string Group { get; set; } = string.Empty;
    public List<SiteSettingDto> Settings { get; set; } = new();
}

public class PublicSiteInfoResponse
{
    public string CompanyName { get; set; } = string.Empty;
    public string? TagLine { get; set; }
    public string? Logo { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public Dictionary<string, string> SocialLinks { get; set; } = new();
}

#endregion

#region Content Block DTOs

public class CreateContentBlockRequest
{
    public string BlockKey { get; set; } = string.Empty;
    public string Page { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateContentBlockRequest
{
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class ContentBlockDto
{
    public Guid Id { get; set; }
    public string BlockKey { get; set; } = string.Empty;
    public string Page { get; set; } = string.Empty;
    public string Section { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Content { get; set; }
    public string? ImageUrl { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

// Response aliases for service interfaces
public class ContentBlockResponse : ContentBlockDto { }

#endregion

#region Hero Slide DTOs

public class CreateHeroSlideRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? GradientStart { get; set; }
    public string? GradientEnd { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public List<string>? Features { get; set; }
}

public class UpdateHeroSlideRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? GradientStart { get; set; }
    public string? GradientEnd { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class HeroSlideDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? GradientStart { get; set; }
    public string? GradientEnd { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public List<string> Features { get; set; } = new();
}

// Response aliases for service interfaces
public class HeroSlideResponse : HeroSlideDto { }

public class PublicHeroSlideResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? GradientStart { get; set; }
    public string? GradientEnd { get; set; }
    public string? CtaText { get; set; }
    public string? CtaLink { get; set; }
    public List<string> Features { get; set; } = new();
}

#endregion

#region Statistic DTOs

public class CreateStatisticRequest
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Suffix { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateStatisticRequest
{
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Suffix { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class StatisticDto
{
    public Guid Id { get; set; }
    public string Label { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Suffix { get; set; }
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

// Response aliases for service interfaces
public class StatisticResponse : StatisticDto { }

#endregion

#region USP Item DTOs

public class CreateUspItemRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateUspItemRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class UspItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

// Response aliases for service interfaces
public class UspItemResponse : UspItemDto { }

#endregion

#region Company Story DTOs

public class CreateCompanyStorySectionRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public List<CreateCompanyStoryItemRequest>? Items { get; set; }
}

public class UpdateCompanyStorySectionRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class CreateCompanyStoryItemRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
}

public class CompanyStorySectionDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? ImageUrl { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
    public List<CompanyStoryItemDto> Items { get; set; } = new();
}

public class CompanyStoryItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Icon { get; set; }
    public int DisplayOrder { get; set; }
}

// Response aliases for service interfaces
public class CompanyStorySectionResponse : CompanyStorySectionDto { }
public class CompanyStoryItemResponse : CompanyStoryItemDto { }

#endregion

#region Inquiry Type DTOs

public class CreateInquiryTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdateInquiryTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

public class InquiryTypeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; }
}

// Response aliases for service interfaces
public class InquiryTypeResponse : InquiryTypeDto { }

#endregion

#region Delivery Settings DTOs

public class CreateDeliverySettingsRequest
{
    public decimal FreeDeliveryThreshold { get; set; }
    public decimal StandardDeliveryCharge { get; set; }
    public decimal? ExpressDeliveryCharge { get; set; }
    public int EstimatedDeliveryDays { get; set; } = 3;
    public int? ExpressDeliveryDays { get; set; }
}

public class DeliverySettingsDto
{
    public Guid Id { get; set; }
    public decimal FreeDeliveryThreshold { get; set; }
    public decimal StandardDeliveryCharge { get; set; }
    public decimal? ExpressDeliveryCharge { get; set; }
    public int EstimatedDeliveryDays { get; set; }
    public int? ExpressDeliveryDays { get; set; }
    public bool IsActive { get; set; }
}

// Additional request types
public class UpdateDeliverySettingsRequest
{
    public decimal FreeDeliveryThreshold { get; set; }
    public decimal StandardDeliveryCharge { get; set; }
    public decimal? ExpressDeliveryCharge { get; set; }
    public int EstimatedDeliveryDays { get; set; }
    public int? ExpressDeliveryDays { get; set; }
}

// Response aliases for service interfaces
public class DeliverySettingsResponse : DeliverySettingsDto { }

public class PublicDeliveryChargesResponse
{
    public decimal FreeDeliveryThreshold { get; set; }
    public decimal StandardDeliveryCharge { get; set; }
    public decimal? ExpressDeliveryCharge { get; set; }
    public int EstimatedDeliveryDays { get; set; }
    public int? ExpressDeliveryDays { get; set; }
}

#endregion

#region Contact Submission DTOs

public class CreateContactSubmissionRequest
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string InquiryType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class UpdateContactStatusRequest
{
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
}

public class ContactSubmissionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string InquiryType { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

// Additional request types
public class UpdateContactSubmissionRequest
{
    public string Status { get; set; } = string.Empty;
    public string? AdminNotes { get; set; }
}

// Response aliases for service interfaces
public class ContactSubmissionResponse : ContactSubmissionDto { }

#endregion
