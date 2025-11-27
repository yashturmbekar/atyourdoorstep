using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OrderService.Application.DTOs;
using OrderService.Application.Interfaces;
using OrderService.Domain.Enums;
using Shared.Application.DTOs;

namespace OrderService.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Create new order
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> CreateOrder(
        [FromBody] CreateOrderRequestDto request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var order = await _orderService.CreateOrderAsync(request, cancellationToken);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id },
                ApiResponse<OrderResponseDto>.SuccessResponse(order, "Order created successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<OrderResponseDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<OrderResponseDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Get order by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> GetOrder(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _orderService.GetOrderByIdAsync(id, cancellationToken);
        if (order == null)
        {
            return NotFound(ApiResponse<OrderResponseDto>.ErrorResponse("Order not found"));
        }

        return Ok(ApiResponse<OrderResponseDto>.SuccessResponse(order));
    }

    /// <summary>
    /// Get order by order number
    /// </summary>
    [HttpGet("number/{orderNumber}")]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> GetOrderByNumber(string orderNumber, CancellationToken cancellationToken = default)
    {
        var order = await _orderService.GetOrderByOrderNumberAsync(orderNumber, cancellationToken);
        if (order == null)
        {
            return NotFound(ApiResponse<OrderResponseDto>.ErrorResponse("Order not found"));
        }

        return Ok(ApiResponse<OrderResponseDto>.SuccessResponse(order));
    }

    /// <summary>
    /// Get orders by customer ID
    /// </summary>
    [HttpGet("customer/{customerId}")]
    public async Task<ActionResult<ApiResponse<List<OrderResponseDto>>>> GetOrdersByCustomer(
        Guid customerId,
        CancellationToken cancellationToken = default)
    {
        var orders = await _orderService.GetOrdersByCustomerIdAsync(customerId, cancellationToken);
        return Ok(ApiResponse<List<OrderResponseDto>>.SuccessResponse(orders));
    }

    /// <summary>
    /// Get orders by status (Admin/Manager only)
    /// </summary>
    [HttpGet("status/{status}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<List<OrderResponseDto>>>> GetOrdersByStatus(
        OrderStatus status,
        CancellationToken cancellationToken = default)
    {
        var orders = await _orderService.GetOrdersByStatusAsync(status, cancellationToken);
        return Ok(ApiResponse<List<OrderResponseDto>>.SuccessResponse(orders));
    }

    /// <summary>
    /// Update order status (Admin/Manager only)
    /// </summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<ApiResponse<OrderResponseDto>>> UpdateOrderStatus(
        Guid id,
        [FromBody] UpdateOrderStatusRequestDto request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var order = await _orderService.UpdateOrderStatusAsync(id, request, cancellationToken);
            return Ok(ApiResponse<OrderResponseDto>.SuccessResponse(order, "Order status updated successfully"));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ApiResponse<OrderResponseDto>.ErrorResponse(ex.Message));
        }
    }

    /// <summary>
    /// Cancel order
    /// </summary>
    [HttpPost("{id}/cancel")]
    public async Task<ActionResult<ApiResponse<object>>> CancelOrder(Guid id, CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _orderService.CancelOrderAsync(id, cancellationToken);
            if (!result)
            {
                return NotFound(ApiResponse<object>.ErrorResponse("Order not found"));
            }

            return Ok(ApiResponse<object>.SuccessResponse(null!, "Order cancelled successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<object>.ErrorResponse(ex.Message));
        }
    }
}
