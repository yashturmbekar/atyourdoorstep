using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NotificationService.Application.DTOs;
using NotificationService.Application.Interfaces;
using Shared.Application.DTOs;

namespace NotificationService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly IValidator<SubscribeRequestDto> _subscribeValidator;
    private readonly IValidator<SendNotificationRequestDto> _sendValidator;
    private readonly IValidator<BroadcastNotificationRequestDto> _broadcastValidator;

    public NotificationsController(
        INotificationService notificationService,
        IValidator<SubscribeRequestDto> subscribeValidator,
        IValidator<SendNotificationRequestDto> sendValidator,
        IValidator<BroadcastNotificationRequestDto> broadcastValidator)
    {
        _notificationService = notificationService;
        _subscribeValidator = subscribeValidator;
        _sendValidator = sendValidator;
        _broadcastValidator = broadcastValidator;
    }

    [HttpPost("subscribe")]
    public async Task<ActionResult<ApiResponse<SubscriptionResponseDto>>> Subscribe(
        [FromBody] SubscribeRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _subscribeValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<SubscriptionResponseDto>.ErrorResponse(
                "Validation failed",
                validation.Errors.Select(e => e.ErrorMessage).ToList()
            ));
        }

        var result = await _notificationService.SubscribeAsync(request, cancellationToken);
        return Ok(ApiResponse<SubscriptionResponseDto>.SuccessResponse(result, "Subscription created successfully"));
    }

    [HttpDelete("unsubscribe/{userId:guid}")]
    public async Task<ActionResult<ApiResponse<bool>>> Unsubscribe(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var result = await _notificationService.UnsubscribeAsync(userId, cancellationToken);
        if (!result)
        {
            return NotFound(ApiResponse<bool>.ErrorResponse("Subscription not found"));
        }

        return Ok(ApiResponse<bool>.SuccessResponse(true, "Unsubscribed successfully"));
    }

    [HttpPost("send")]
    public async Task<ActionResult<ApiResponse<NotificationResponseDto>>> SendNotification(
        [FromBody] SendNotificationRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _sendValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<NotificationResponseDto>.ErrorResponse(
                "Validation failed",
                validation.Errors.Select(e => e.ErrorMessage).ToList()
            ));
        }

        var result = await _notificationService.SendNotificationAsync(request, cancellationToken);
        return Ok(ApiResponse<NotificationResponseDto>.SuccessResponse(result, "Notification sent"));
    }

    [HttpPost("broadcast")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<int>>> BroadcastNotification(
        [FromBody] BroadcastNotificationRequestDto request,
        CancellationToken cancellationToken)
    {
        var validation = await _broadcastValidator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return BadRequest(ApiResponse<int>.ErrorResponse(
                "Validation failed",
                validation.Errors.Select(e => e.ErrorMessage).ToList()
            ));
        }

        var count = await _notificationService.BroadcastNotificationAsync(request, cancellationToken);
        return Ok(ApiResponse<int>.SuccessResponse(count, $"Notification sent to {count} subscribers"));
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<NotificationResponseDto>>>> GetUserNotifications(
        Guid userId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken cancellationToken = default)
    {
        var request = new GetNotificationsRequestDto(userId, page, pageSize);
        var notifications = await _notificationService.GetUserNotificationsAsync(request, cancellationToken);
        return Ok(ApiResponse<IEnumerable<NotificationResponseDto>>.SuccessResponse(notifications));
    }

    [HttpPut("mark-read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(
        [FromBody] MarkAsReadRequestDto request,
        CancellationToken cancellationToken)
    {
        var result = await _notificationService.MarkAsReadAsync(request, cancellationToken);
        if (!result)
        {
            return NotFound(ApiResponse<bool>.ErrorResponse("Notification not found"));
        }

        return Ok(ApiResponse<bool>.SuccessResponse(true, "Notification marked as read"));
    }

    [HttpGet("unread-count/{userId:guid}")]
    public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount(
        Guid userId,
        CancellationToken cancellationToken)
    {
        var count = await _notificationService.GetUnreadCountAsync(userId, cancellationToken);
        return Ok(ApiResponse<int>.SuccessResponse(count));
    }
}
