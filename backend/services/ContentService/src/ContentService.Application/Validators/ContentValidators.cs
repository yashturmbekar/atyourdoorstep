using FluentValidation;
using ContentService.Application.DTOs;

namespace ContentService.Application.Validators;

#region ProductCategory Validators

public class CreateProductCategoryRequestValidator : AbstractValidator<CreateProductCategoryRequest>
{
    public CreateProductCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product category name is required")
            .MaximumLength(100).WithMessage("Product category name cannot exceed 100 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Product category slug is required")
            .MaximumLength(100).WithMessage("Product category slug cannot exceed 100 characters")
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").WithMessage("Slug must be URL-friendly (lowercase, hyphens, no spaces)");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.Icon)
            .MaximumLength(50).WithMessage("Icon cannot exceed 50 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

public class UpdateProductCategoryRequestValidator : AbstractValidator<UpdateProductCategoryRequest>
{
    public UpdateProductCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product category name is required")
            .MaximumLength(100).WithMessage("Product category name cannot exceed 100 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Product category slug is required")
            .MaximumLength(100).WithMessage("Product category slug cannot exceed 100 characters")
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").WithMessage("Slug must be URL-friendly");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

#endregion

#region Product Validators

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Product slug is required")
            .MaximumLength(200).WithMessage("Product slug cannot exceed 200 characters")
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").WithMessage("Slug must be URL-friendly");

        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage("Short description is required")
            .MaximumLength(500).WithMessage("Short description cannot exceed 500 characters");

        RuleFor(x => x.FullDescription)
            .MaximumLength(5000).WithMessage("Full description cannot exceed 5000 characters");

        RuleFor(x => x.ProductCategoryId)
            .NotEmpty().WithMessage("Product category is required");

        RuleFor(x => x.BasePrice)
            .GreaterThan(0).WithMessage("Base price must be greater than 0");

        RuleFor(x => x.DiscountedPrice)
            .GreaterThan(0).When(x => x.DiscountedPrice.HasValue)
            .WithMessage("Discounted price must be greater than 0");

        RuleForEach(x => x.Variants)
            .SetValidator(new CreateVariantRequestValidator());
    }
}

public class CreateVariantRequestValidator : AbstractValidator<CreateVariantRequest>
{
    public CreateVariantRequestValidator()
    {
        RuleFor(x => x.Size)
            .NotEmpty().WithMessage("Size is required")
            .MaximumLength(50).WithMessage("Size cannot exceed 50 characters");

        RuleFor(x => x.Unit)
            .NotEmpty().WithMessage("Unit is required")
            .MaximumLength(20).WithMessage("Unit cannot exceed 20 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.DiscountedPrice)
            .GreaterThan(0).When(x => x.DiscountedPrice.HasValue)
            .WithMessage("Discounted price must be greater than 0");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stock quantity must be non-negative");
    }
}

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequest>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters");

        RuleFor(x => x.Slug)
            .NotEmpty().WithMessage("Product slug is required")
            .MaximumLength(200).WithMessage("Product slug cannot exceed 200 characters")
            .Matches(@"^[a-z0-9]+(?:-[a-z0-9]+)*$").WithMessage("Slug must be URL-friendly");

        RuleFor(x => x.ShortDescription)
            .NotEmpty().WithMessage("Short description is required")
            .MaximumLength(500).WithMessage("Short description cannot exceed 500 characters");

        RuleFor(x => x.ProductCategoryId)
            .NotEmpty().WithMessage("Product category is required");

        RuleFor(x => x.BasePrice)
            .GreaterThan(0).WithMessage("Base price must be greater than 0");
    }
}

#endregion

#region Testimonial Validators

public class CreateTestimonialRequestValidator : AbstractValidator<CreateTestimonialRequest>
{
    public CreateTestimonialRequestValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Customer name is required")
            .MaximumLength(100).WithMessage("Customer name cannot exceed 100 characters");

        RuleFor(x => x.CustomerTitle)
            .MaximumLength(100).WithMessage("Customer title cannot exceed 100 characters");

        RuleFor(x => x.CustomerLocation)
            .MaximumLength(100).WithMessage("Customer location cannot exceed 100 characters");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MaximumLength(1000).WithMessage("Content cannot exceed 1000 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

public class UpdateTestimonialRequestValidator : AbstractValidator<UpdateTestimonialRequest>
{
    public UpdateTestimonialRequestValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty().WithMessage("Customer name is required")
            .MaximumLength(100).WithMessage("Customer name cannot exceed 100 characters");

        RuleFor(x => x.Rating)
            .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required")
            .MaximumLength(1000).WithMessage("Content cannot exceed 1000 characters");
    }
}

#endregion

#region Site Settings Validators

public class CreateSiteSettingRequestValidator : AbstractValidator<CreateSiteSettingRequest>
{
    public CreateSiteSettingRequestValidator()
    {
        RuleFor(x => x.Key)
            .NotEmpty().WithMessage("Setting key is required")
            .MaximumLength(100).WithMessage("Setting key cannot exceed 100 characters")
            .Matches(@"^[a-zA-Z0-9_.]+$").WithMessage("Setting key must contain only letters, numbers, dots and underscores");

        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Setting value is required");

        RuleFor(x => x.Group)
            .NotEmpty().WithMessage("Group is required")
            .MaximumLength(50).WithMessage("Group cannot exceed 50 characters");
    }
}

public class UpdateSiteSettingRequestValidator : AbstractValidator<UpdateSiteSettingRequest>
{
    public UpdateSiteSettingRequestValidator()
    {
        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Setting value is required");
    }
}

#endregion

#region Content Block Validators

public class CreateContentBlockRequestValidator : AbstractValidator<CreateContentBlockRequest>
{
    public CreateContentBlockRequestValidator()
    {
        RuleFor(x => x.BlockKey)
            .NotEmpty().WithMessage("Block key is required")
            .MaximumLength(100).WithMessage("Block key cannot exceed 100 characters")
            .Matches(@"^[a-z0-9_.]+$").WithMessage("Block key must be lowercase with dots and underscores only");

        RuleFor(x => x.Page)
            .NotEmpty().WithMessage("Page is required")
            .MaximumLength(50).WithMessage("Page cannot exceed 50 characters");

        RuleFor(x => x.Section)
            .NotEmpty().WithMessage("Section is required")
            .MaximumLength(50).WithMessage("Section cannot exceed 50 characters");

        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

public class UpdateContentBlockRequestValidator : AbstractValidator<UpdateContentBlockRequest>
{
    public UpdateContentBlockRequestValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(200).WithMessage("Title cannot exceed 200 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

#endregion

#region Hero Slide Validators

public class CreateHeroSlideRequestValidator : AbstractValidator<CreateHeroSlideRequest>
{
    public CreateHeroSlideRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Subtitle)
            .MaximumLength(200).WithMessage("Subtitle cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.CtaText)
            .MaximumLength(50).WithMessage("CTA text cannot exceed 50 characters");

        RuleFor(x => x.GradientStart)
            .Matches(@"^#[0-9A-Fa-f]{6}$").When(x => !string.IsNullOrEmpty(x.GradientStart))
            .WithMessage("Gradient start must be a valid hex color");

        RuleFor(x => x.GradientEnd)
            .Matches(@"^#[0-9A-Fa-f]{6}$").When(x => !string.IsNullOrEmpty(x.GradientEnd))
            .WithMessage("Gradient end must be a valid hex color");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

public class UpdateHeroSlideRequestValidator : AbstractValidator<UpdateHeroSlideRequest>
{
    public UpdateHeroSlideRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

#endregion

#region Statistic Validators

public class CreateStatisticRequestValidator : AbstractValidator<CreateStatisticRequest>
{
    public CreateStatisticRequestValidator()
    {
        RuleFor(x => x.Label)
            .NotEmpty().WithMessage("Label is required")
            .MaximumLength(100).WithMessage("Label cannot exceed 100 characters");

        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Value is required")
            .MaximumLength(50).WithMessage("Value cannot exceed 50 characters");

        RuleFor(x => x.Suffix)
            .MaximumLength(20).WithMessage("Suffix cannot exceed 20 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

public class UpdateStatisticRequestValidator : AbstractValidator<UpdateStatisticRequest>
{
    public UpdateStatisticRequestValidator()
    {
        RuleFor(x => x.Label)
            .NotEmpty().WithMessage("Label is required")
            .MaximumLength(100).WithMessage("Label cannot exceed 100 characters");

        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Value is required")
            .MaximumLength(50).WithMessage("Value cannot exceed 50 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

#endregion

#region USP Item Validators

public class CreateUspItemRequestValidator : AbstractValidator<CreateUspItemRequest>
{
    public CreateUspItemRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.Icon)
            .MaximumLength(50).WithMessage("Icon cannot exceed 50 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

public class UpdateUspItemRequestValidator : AbstractValidator<UpdateUspItemRequest>
{
    public UpdateUspItemRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

#endregion

#region Company Story Validators

public class CreateCompanyStorySectionRequestValidator : AbstractValidator<CreateCompanyStorySectionRequest>
{
    public CreateCompanyStorySectionRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Subtitle)
            .MaximumLength(200).WithMessage("Subtitle cannot exceed 200 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");

        RuleForEach(x => x.Items)
            .SetValidator(new CreateCompanyStoryItemRequestValidator());
    }
}

public class CreateCompanyStoryItemRequestValidator : AbstractValidator<CreateCompanyStoryItemRequest>
{
    public CreateCompanyStoryItemRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters");
    }
}

public class UpdateCompanyStorySectionRequestValidator : AbstractValidator<UpdateCompanyStorySectionRequest>
{
    public UpdateCompanyStorySectionRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

#endregion

#region Inquiry Type Validators

public class CreateInquiryTypeRequestValidator : AbstractValidator<CreateInquiryTypeRequest>
{
    public CreateInquiryTypeRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Value is required")
            .MaximumLength(50).WithMessage("Value cannot exceed 50 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

public class UpdateInquiryTypeRequestValidator : AbstractValidator<UpdateInquiryTypeRequest>
{
    public UpdateInquiryTypeRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Value is required")
            .MaximumLength(50).WithMessage("Value cannot exceed 50 characters");

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative");
    }
}

#endregion

#region Delivery Settings Validators

public class CreateDeliverySettingsRequestValidator : AbstractValidator<CreateDeliverySettingsRequest>
{
    public CreateDeliverySettingsRequestValidator()
    {
        RuleFor(x => x.FreeDeliveryThreshold)
            .GreaterThanOrEqualTo(0).WithMessage("Free delivery threshold must be non-negative");

        RuleFor(x => x.StandardDeliveryCharge)
            .GreaterThanOrEqualTo(0).WithMessage("Standard delivery charge must be non-negative");

        RuleFor(x => x.ExpressDeliveryCharge)
            .GreaterThanOrEqualTo(0).When(x => x.ExpressDeliveryCharge.HasValue)
            .WithMessage("Express delivery charge must be non-negative");

        RuleFor(x => x.EstimatedDeliveryDays)
            .GreaterThan(0).WithMessage("Estimated delivery days must be greater than 0");
    }
}

public class UpdateDeliverySettingsRequestValidator : AbstractValidator<UpdateDeliverySettingsRequest>
{
    public UpdateDeliverySettingsRequestValidator()
    {
        RuleFor(x => x.FreeDeliveryThreshold)
            .GreaterThanOrEqualTo(0).WithMessage("Free delivery threshold must be non-negative");

        RuleFor(x => x.StandardDeliveryCharge)
            .GreaterThanOrEqualTo(0).WithMessage("Standard delivery charge must be non-negative");

        RuleFor(x => x.ExpressDeliveryCharge)
            .GreaterThanOrEqualTo(0).When(x => x.ExpressDeliveryCharge.HasValue)
            .WithMessage("Express delivery charge must be non-negative");

        RuleFor(x => x.EstimatedDeliveryDays)
            .GreaterThan(0).WithMessage("Estimated delivery days must be greater than 0");
    }
}

#endregion

#region Contact Submission Validators

public class CreateContactSubmissionRequestValidator : AbstractValidator<CreateContactSubmissionRequest>
{
    public CreateContactSubmissionRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email address")
            .MaximumLength(255).WithMessage("Email cannot exceed 255 characters");

        RuleFor(x => x.Phone)
            .Matches(@"^\+?[0-9\s-]{10,15}$").When(x => !string.IsNullOrEmpty(x.Phone))
            .WithMessage("Invalid phone number format");

        RuleFor(x => x.InquiryType)
            .NotEmpty().WithMessage("Inquiry type is required")
            .MaximumLength(50).WithMessage("Inquiry type cannot exceed 50 characters");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required")
            .MaximumLength(2000).WithMessage("Message cannot exceed 2000 characters");
    }
}

public class UpdateContactSubmissionRequestValidator : AbstractValidator<UpdateContactSubmissionRequest>
{
    public UpdateContactSubmissionRequestValidator()
    {
        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(x => new[] { "new", "read", "replied", "archived" }.Contains(x.ToLower()))
            .WithMessage("Status must be: new, read, replied, or archived");
    }
}

#endregion
