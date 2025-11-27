using FluentValidation;
using OrderService.Application.DTOs;
using OrderService.Domain.Enums;

namespace OrderService.Application.Validators;

public class CreateOrderRequestValidator : AbstractValidator<CreateOrderRequestDto>
{
    public CreateOrderRequestValidator()
    {
        RuleFor(x => x.CustomerId)
            .NotEmpty().WithMessage("Customer ID is required");

        RuleFor(x => x.Items)
            .NotEmpty().WithMessage("Order must contain at least one item")
            .Must(items => items.Count > 0).WithMessage("Order must contain at least one item");

        RuleForEach(x => x.Items).SetValidator(new CreateOrderItemValidator());

        RuleFor(x => x.DeliveryAddress)
            .MaximumLength(500).WithMessage("Delivery address cannot exceed 500 characters")
            .When(x => !string.IsNullOrEmpty(x.DeliveryAddress));

        RuleFor(x => x.DeliveryCity)
            .MaximumLength(100).WithMessage("Delivery city cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.DeliveryCity));

        RuleFor(x => x.DeliveryState)
            .MaximumLength(100).WithMessage("Delivery state cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.DeliveryState));

        RuleFor(x => x.DeliveryPostalCode)
            .MaximumLength(20).WithMessage("Delivery postal code cannot exceed 20 characters")
            .When(x => !string.IsNullOrEmpty(x.DeliveryPostalCode));

        RuleFor(x => x.DeliveryCountry)
            .MaximumLength(100).WithMessage("Delivery country cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.DeliveryCountry));

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters")
            .When(x => !string.IsNullOrEmpty(x.Notes));
    }
}

public class CreateOrderItemValidator : AbstractValidator<CreateOrderItemDto>
{
    public CreateOrderItemValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required");

        RuleFor(x => x.Quantity)
            .GreaterThan(0).WithMessage("Quantity must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Quantity cannot exceed 1000");
    }
}

public class UpdateOrderStatusRequestValidator : AbstractValidator<UpdateOrderStatusRequestDto>
{
    public UpdateOrderStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid order status");

        RuleFor(x => x.TrackingNumber)
            .MaximumLength(100).WithMessage("Tracking number cannot exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.TrackingNumber));

        RuleFor(x => x.TrackingNumber)
            .NotEmpty().WithMessage("Tracking number is required when shipping")
            .When(x => x.Status == OrderStatus.Shipped);
    }
}
