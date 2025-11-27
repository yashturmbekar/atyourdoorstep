using OrderService.Application.DTOs;
using OrderService.Domain.Enums;

namespace OrderService.Application.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CreateOrderAsync(CreateOrderRequestDto request, CancellationToken cancellationToken = default);
    Task<OrderResponseDto?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<OrderResponseDto?> GetOrderByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);
    Task<List<OrderResponseDto>> GetOrdersByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
    Task<List<OrderResponseDto>> GetOrdersByStatusAsync(OrderStatus status, CancellationToken cancellationToken = default);
    Task<OrderResponseDto> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusRequestDto request, CancellationToken cancellationToken = default);
    Task<bool> CancelOrderAsync(Guid id, CancellationToken cancellationToken = default);
}
