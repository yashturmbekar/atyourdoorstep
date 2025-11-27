using FluentValidation;
using OrderService.Application.DTOs;

namespace OrderService.Application.Validators;

public class CreateProductRequestValidator : AbstractValidator<CreateProductRequestDto>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description is required")
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");

        RuleFor(x => x.Category)
            .NotEmpty().WithMessage("Category is required")
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Stock cannot be negative");

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("Image URL cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.Sku)
            .MaximumLength(50).WithMessage("SKU cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Sku));

        RuleFor(x => x.DiscountPrice)
            .GreaterThan(0).WithMessage("Discount price must be greater than 0")
            .LessThan(x => x.Price).WithMessage("Discount price must be less than regular price")
            .When(x => x.DiscountPrice.HasValue);

        RuleFor(x => x.DiscountPercentage)
            .InclusiveBetween(1, 100).WithMessage("Discount percentage must be between 1 and 100")
            .When(x => x.DiscountPercentage.HasValue);
    }
}

public class UpdateProductRequestValidator : AbstractValidator<UpdateProductRequestDto>
{
    public UpdateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters")
            .When(x => !string.IsNullOrEmpty(x.Name));

        RuleFor(x => x.Description)
            .MaximumLength(2000).WithMessage("Description cannot exceed 2000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0")
            .When(x => x.Price.HasValue);

        RuleFor(x => x.Category)
            .MaximumLength(100).WithMessage("Category cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.Category));

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Stock cannot be negative")
            .When(x => x.Stock.HasValue);

        RuleFor(x => x.ImageUrl)
            .MaximumLength(500).WithMessage("Image URL cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.ImageUrl));

        RuleFor(x => x.Sku)
            .MaximumLength(50).WithMessage("SKU cannot exceed 50 characters")
            .When(x => !string.IsNullOrEmpty(x.Sku));

        RuleFor(x => x.DiscountPrice)
            .GreaterThan(0).WithMessage("Discount price must be greater than 0")
            .When(x => x.DiscountPrice.HasValue);

        RuleFor(x => x.DiscountPercentage)
            .InclusiveBetween(1, 100).WithMessage("Discount percentage must be between 1 and 100")
            .When(x => x.DiscountPercentage.HasValue);
    }
}
