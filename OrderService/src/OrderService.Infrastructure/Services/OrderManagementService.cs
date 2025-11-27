using Microsoft.EntityFrameworkCore;
using OrderService.Application.DTOs;
using OrderService.Application.Interfaces;
using OrderService.Domain.Entities;
using OrderService.Domain.Enums;
using OrderService.Infrastructure.Persistence;

namespace OrderService.Infrastructure.Services;

public class OrderManagementService : IOrderService
{
    private readonly OrderDbContext _context;
    private readonly IOrderRepository _orderRepository;
    private readonly IOrderItemRepository _orderItemRepository;
    private readonly IProductRepository _productRepository;
    private readonly ICustomerRepository _customerRepository;

    public OrderManagementService(
        OrderDbContext context,
        IOrderRepository orderRepository,
        IOrderItemRepository orderItemRepository,
        IProductRepository productRepository,
        ICustomerRepository customerRepository)
    {
        _context = context;
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _productRepository = productRepository;
        _customerRepository = customerRepository;
    }

    public async Task<OrderResponseDto> CreateOrderAsync(CreateOrderRequestDto request, CancellationToken cancellationToken = default)
    {
        // Validate customer exists
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);
        if (customer == null)
        {
            throw new KeyNotFoundException($"Customer with ID {request.CustomerId} not found");
        }

        // Validate all products exist and have sufficient stock
        var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
        var products = new List<Product>();
        
        foreach (var productId in productIds)
        {
            var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
            if (product == null)
            {
                throw new KeyNotFoundException($"Product with ID {productId} not found");
            }
            if (!product.IsAvailable)
            {
                throw new InvalidOperationException($"Product '{product.Name}' is not available");
            }
            products.Add(product);
        }

        // Check stock availability
        foreach (var item in request.Items)
        {
            var product = products.First(p => p.Id == item.ProductId);
            if (product.Stock < item.Quantity)
            {
                throw new InvalidOperationException($"Insufficient stock for product '{product.Name}'. Available: {product.Stock}, Requested: {item.Quantity}");
            }
        }

        // Create order
        var orderNumber = await _orderRepository.GenerateOrderNumberAsync(cancellationToken);
        var order = new Order
        {
            OrderNumber = orderNumber,
            CustomerId = request.CustomerId,
            Status = OrderStatus.Pending,
            DeliveryAddress = request.DeliveryAddress,
            DeliveryCity = request.DeliveryCity,
            DeliveryState = request.DeliveryState,
            DeliveryPostalCode = request.DeliveryPostalCode,
            DeliveryCountry = request.DeliveryCountry,
            Notes = request.Notes
        };

        // Create order items and calculate totals
        decimal subTotal = 0;
        foreach (var itemDto in request.Items)
        {
            var product = products.First(p => p.Id == itemDto.ProductId);
            var price = product.DiscountPrice ?? product.Price;
            var itemSubTotal = price * itemDto.Quantity;

            var orderItem = new OrderItem
            {
                OrderId = order.Id,
                ProductId = product.Id,
                Quantity = itemDto.Quantity,
                Price = price,
                SubTotal = itemSubTotal
            };

            order.OrderItems.Add(orderItem);
            subTotal += itemSubTotal;

            // Reduce stock
            product.Stock -= itemDto.Quantity;
            await _productRepository.UpdateAsync(product, cancellationToken);
        }

        // Calculate order totals (simplified - can be extended)
        order.SubTotal = subTotal;
        order.TaxAmount = subTotal * 0.1m; // 10% tax
        order.ShippingAmount = 5.00m; // Flat shipping fee
        order.TotalAmount = order.SubTotal + order.TaxAmount.Value + order.ShippingAmount.Value;

        await _orderRepository.AddAsync(order, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        // Reload with details
        var createdOrder = await _orderRepository.GetByIdWithDetailsAsync(order.Id, cancellationToken);
        return MapToOrderResponse(createdOrder!);
    }

    public async Task<OrderResponseDto?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id, cancellationToken);
        return order == null ? null : MapToOrderResponse(order);
    }

    public async Task<OrderResponseDto?> GetOrderByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByOrderNumberAsync(orderNumber, cancellationToken);
        return order == null ? null : MapToOrderResponse(order);
    }

    public async Task<List<OrderResponseDto>> GetOrdersByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default)
    {
        var orders = await _orderRepository.GetByCustomerIdAsync(customerId, cancellationToken);
        return orders.Select(MapToOrderResponse).ToList();
    }

    public async Task<List<OrderResponseDto>> GetOrdersByStatusAsync(OrderStatus status, CancellationToken cancellationToken = default)
    {
        var orders = await _orderRepository.GetByStatusAsync(status, cancellationToken);
        return orders.Select(MapToOrderResponse).ToList();
    }

    public async Task<OrderResponseDto> UpdateOrderStatusAsync(Guid id, UpdateOrderStatusRequestDto request, CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id, cancellationToken);
        if (order == null)
        {
            throw new KeyNotFoundException($"Order with ID {id} not found");
        }

        order.Status = request.Status;
        
        if (request.Status == OrderStatus.Shipped)
        {
            order.ShippedAt = DateTime.UtcNow;
            order.TrackingNumber = request.TrackingNumber;
        }
        else if (request.Status == OrderStatus.Delivered)
        {
            order.DeliveredAt = DateTime.UtcNow;
        }

        await _orderRepository.UpdateAsync(order, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToOrderResponse(order);
    }

    public async Task<bool> CancelOrderAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdWithDetailsAsync(id, cancellationToken);
        if (order == null)
        {
            return false;
        }

        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Confirmed)
        {
            throw new InvalidOperationException($"Cannot cancel order in status: {order.Status}");
        }

        // Restore stock
        foreach (var item in order.OrderItems)
        {
            var product = await _productRepository.GetByIdAsync(item.ProductId, cancellationToken);
            if (product != null)
            {
                product.Stock += item.Quantity;
                await _productRepository.UpdateAsync(product, cancellationToken);
            }
        }

        order.Status = OrderStatus.Cancelled;
        await _orderRepository.UpdateAsync(order, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }

    private static OrderResponseDto MapToOrderResponse(Order order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerId = order.CustomerId,
            CustomerName = $"{order.Customer.FirstName} {order.Customer.LastName}",
            Status = order.Status,
            StatusText = order.Status.ToString(),
            TotalAmount = order.TotalAmount,
            SubTotal = order.SubTotal,
            TaxAmount = order.TaxAmount,
            ShippingAmount = order.ShippingAmount,
            DiscountAmount = order.DiscountAmount,
            DeliveryAddress = order.DeliveryAddress,
            DeliveryCity = order.DeliveryCity,
            DeliveryState = order.DeliveryState,
            DeliveryPostalCode = order.DeliveryPostalCode,
            DeliveryCountry = order.DeliveryCountry,
            DeliveredAt = order.DeliveredAt,
            ShippedAt = order.ShippedAt,
            Notes = order.Notes,
            TrackingNumber = order.TrackingNumber,
            Items = order.OrderItems.Select(oi => new OrderItemResponseDto
            {
                Id = oi.Id,
                ProductId = oi.ProductId,
                ProductName = oi.Product.Name,
                Quantity = oi.Quantity,
                Price = oi.Price,
                SubTotal = oi.SubTotal,
                DiscountAmount = oi.DiscountAmount
            }).ToList(),
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };
    }
}
