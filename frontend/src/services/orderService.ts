/**
 * Order Service
 * Handles all order-related API calls to OrderService
 * Following Clean Architecture and instruction file standards
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  ApiResponse,
  PaginatedResponse,
  OrderResponseDto,
  CreateOrderRequestDto,
  UpdateOrderStatusRequestDto,
  OrderStatus,
  OrderQueryParams,
} from '../types/api.types';

/**
 * Order Service - All order-related API operations
 */
export const orderService = {
  /**
   * Create a new order
   * @param data - Order creation data
   * @returns Created order
   */
  async createOrder(
    data: CreateOrderRequestDto
  ): Promise<ApiResponse<OrderResponseDto>> {
    const response = await apiClient.post<ApiResponse<OrderResponseDto>>(
      API_ENDPOINTS.orders.create,
      data
    );
    return response.data;
  },

  /**
   * Get order by ID
   * @param id - Order ID
   * @returns Order details
   */
  async getOrderById(id: string): Promise<ApiResponse<OrderResponseDto>> {
    const response = await apiClient.get<ApiResponse<OrderResponseDto>>(
      API_ENDPOINTS.orders.byId(id)
    );
    return response.data;
  },

  /**
   * Get order by order number
   * @param orderNumber - Order number string
   * @returns Order details
   */
  async getOrderByNumber(
    orderNumber: string
  ): Promise<ApiResponse<OrderResponseDto>> {
    const response = await apiClient.get<ApiResponse<OrderResponseDto>>(
      API_ENDPOINTS.orders.byOrderNumber(orderNumber)
    );
    return response.data;
  },

  /**
   * Get orders by customer ID
   * @param customerId - Customer ID
   * @param params - Query parameters for pagination
   * @returns Paginated list of customer orders
   */
  async getOrdersByCustomer(
    customerId: string,
    params: Omit<OrderQueryParams, 'customerId'> = {}
  ): Promise<PaginatedResponse<OrderResponseDto>> {
    const { page = 1, pageSize = 20 } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    const response = await apiClient.get<PaginatedResponse<OrderResponseDto>>(
      `${API_ENDPOINTS.orders.byCustomer(customerId)}?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get orders by status (Manager/Admin only)
   * @param status - Order status
   * @param params - Query parameters for pagination
   * @returns Paginated list of orders with specified status
   */
  async getOrdersByStatus(
    status: OrderStatus,
    params: Omit<OrderQueryParams, 'status'> = {}
  ): Promise<PaginatedResponse<OrderResponseDto>> {
    const { page = 1, pageSize = 20 } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    const response = await apiClient.get<PaginatedResponse<OrderResponseDto>>(
      `${API_ENDPOINTS.orders.byStatus(status)}?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Update order status (Manager/Admin only)
   * @param id - Order ID
   * @param data - Status update data
   * @returns Updated order
   */
  async updateOrderStatus(
    id: string,
    data: UpdateOrderStatusRequestDto
  ): Promise<ApiResponse<OrderResponseDto>> {
    const response = await apiClient.patch<ApiResponse<OrderResponseDto>>(
      API_ENDPOINTS.orders.updateStatus(id),
      data
    );
    return response.data;
  },

  /**
   * Cancel an order
   * @param id - Order ID
   * @returns Updated order with cancelled status
   */
  async cancelOrder(id: string): Promise<ApiResponse<OrderResponseDto>> {
    const response = await apiClient.post<ApiResponse<OrderResponseDto>>(
      API_ENDPOINTS.orders.cancel(id)
    );
    return response.data;
  },

  /**
   * Bulk update order status (Admin only)
   * @param orderIds - Array of order IDs
   * @param status - New status
   * @param trackingNumber - Optional tracking number
   */
  async bulkUpdateOrderStatus(
    orderIds: string[],
    status: OrderStatus,
    trackingNumber?: string
  ): Promise<ApiResponse<OrderResponseDto>[]> {
    const updatePromises = orderIds.map(id =>
      this.updateOrderStatus(id, { status, trackingNumber })
    );
    return Promise.all(updatePromises);
  },
};

export default orderService;
