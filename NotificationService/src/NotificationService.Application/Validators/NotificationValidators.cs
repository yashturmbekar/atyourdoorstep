using FluentValidation;
using NotificationService.Application.DTOs;

namespace NotificationService.Application.Validators;

public class SubscribeRequestValidator : AbstractValidator<SubscribeRequestDto>
{
    public SubscribeRequestValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required");

        RuleFor(x => x.Endpoint)
            .NotEmpty().WithMessage("Endpoint is required")
            .Must(uri => Uri.TryCreate(uri, UriKind.Absolute, out _))
            .WithMessage("Endpoint must be a valid URL");

        RuleFor(x => x.P256dh)
            .NotEmpty().WithMessage("P256dh key is required");

        RuleFor(x => x.Auth)
            .NotEmpty().WithMessage("Auth key is required");
    }
}

public class SendNotificationRequestValidator : AbstractValidator<SendNotificationRequestDto>
{
    public SendNotificationRequestValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("UserId is required");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Body is required")
            .MaximumLength(1000).WithMessage("Body must not exceed 1000 characters");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid notification type");
    }
}

public class BroadcastNotificationRequestValidator : AbstractValidator<BroadcastNotificationRequestDto>
{
    public BroadcastNotificationRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Body)
            .NotEmpty().WithMessage("Body is required")
            .MaximumLength(1000).WithMessage("Body must not exceed 1000 characters");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid notification type");
    }
}
