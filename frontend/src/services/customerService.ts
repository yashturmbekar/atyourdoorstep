/**
 * Customer Service
 * Handles all customer-related API calls to OrderService
 * Following Clean Architecture and instruction file standards
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  ApiResponse,
  PaginatedResponse,
  CustomerResponseDto,
  CreateCustomerRequestDto,
  UpdateCustomerRequestDto,
  CustomerQueryParams,
} from '../types/api.types';

/**
 * Customer Service - All customer-related API operations
 */
export const customerService = {
  /**
   * Get paginated list of customers (Manager/Admin only)
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of customers
   */
  async getCustomers(
    params: CustomerQueryParams = {}
  ): Promise<PaginatedResponse<CustomerResponseDto>> {
    const { page = 1, pageSize = 20, search } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    if (search) queryParams.append('search', search);

    const response = await apiClient.get<
      PaginatedResponse<CustomerResponseDto>
    >(`${API_ENDPOINTS.customers.list}?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get customer by ID
   * @param id - Customer ID
   * @returns Customer details
   */
  async getCustomerById(id: string): Promise<ApiResponse<CustomerResponseDto>> {
    const response = await apiClient.get<ApiResponse<CustomerResponseDto>>(
      API_ENDPOINTS.customers.byId(id)
    );
    return response.data;
  },

  /**
   * Get customer by user ID (for authenticated user)
   * @param userId - User ID from Auth service
   * @returns Customer profile linked to user
   */
  async getCustomerByUserId(
    userId: string
  ): Promise<ApiResponse<CustomerResponseDto>> {
    const response = await apiClient.get<ApiResponse<CustomerResponseDto>>(
      API_ENDPOINTS.customers.byUserId(userId)
    );
    return response.data;
  },

  /**
   * Create a new customer
   * @param data - Customer creation data
   * @returns Created customer
   */
  async createCustomer(
    data: CreateCustomerRequestDto
  ): Promise<ApiResponse<CustomerResponseDto>> {
    const response = await apiClient.post<ApiResponse<CustomerResponseDto>>(
      API_ENDPOINTS.customers.create,
      data
    );
    return response.data;
  },

  /**
   * Update customer details
   * @param id - Customer ID
   * @param data - Customer update data
   * @returns Updated customer
   */
  async updateCustomer(
    id: string,
    data: UpdateCustomerRequestDto
  ): Promise<ApiResponse<CustomerResponseDto>> {
    const response = await apiClient.put<ApiResponse<CustomerResponseDto>>(
      API_ENDPOINTS.customers.update(id),
      data
    );
    return response.data;
  },

  /**
   * Delete a customer (Admin only)
   * @param id - Customer ID
   */
  async deleteCustomer(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.customers.delete(id)
    );
    return response.data;
  },

  /**
   * Bulk delete customers (Admin only)
   * @param ids - Array of customer IDs to delete
   */
  async bulkDeleteCustomers(ids: string[]): Promise<ApiResponse<void>[]> {
    const deletePromises = ids.map(id => this.deleteCustomer(id));
    return Promise.all(deletePromises);
  },
};

export default customerService;
