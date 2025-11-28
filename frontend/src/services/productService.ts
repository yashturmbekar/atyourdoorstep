/**
 * Product Service
 * Handles all product-related API calls to OrderService
 * Following Clean Architecture and instruction file standards
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  ApiResponse,
  PaginatedResponse,
  ProductResponseDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
  ProductQueryParams,
} from '../types/api.types';

/**
 * Product Service - All product-related API operations
 */
export const productService = {
  /**
   * Get paginated list of products
   * @param params - Query parameters for filtering and pagination
   * @returns Paginated list of products
   */
  async getProducts(
    params: ProductQueryParams = {}
  ): Promise<PaginatedResponse<ProductResponseDto>> {
    const { page = 1, pageSize = 20, category, search, isAvailable } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('pageSize', pageSize.toString());

    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);
    if (isAvailable !== undefined)
      queryParams.append('isAvailable', isAvailable.toString());

    const response = await apiClient.get<PaginatedResponse<ProductResponseDto>>(
      `${API_ENDPOINTS.products.list}?${queryParams.toString()}`
    );

    return response.data;
  },

  /**
   * Get a single product by ID
   * @param id - Product ID
   * @returns Product details
   */
  async getProductById(id: string): Promise<ApiResponse<ProductResponseDto>> {
    const response = await apiClient.get<ApiResponse<ProductResponseDto>>(
      API_ENDPOINTS.products.byId(id)
    );
    return response.data;
  },

  /**
   * Get all product categories
   * @returns List of category names
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      API_ENDPOINTS.products.categories
    );
    return response.data;
  },

  /**
   * Create a new product (Admin only)
   * @param data - Product creation data
   * @returns Created product
   */
  async createProduct(
    data: CreateProductRequestDto
  ): Promise<ApiResponse<ProductResponseDto>> {
    const response = await apiClient.post<ApiResponse<ProductResponseDto>>(
      API_ENDPOINTS.products.create,
      data
    );
    return response.data;
  },

  /**
   * Update an existing product (Admin only)
   * @param id - Product ID
   * @param data - Product update data
   * @returns Updated product
   */
  async updateProduct(
    id: string,
    data: UpdateProductRequestDto
  ): Promise<ApiResponse<ProductResponseDto>> {
    const response = await apiClient.put<ApiResponse<ProductResponseDto>>(
      API_ENDPOINTS.products.update(id),
      data
    );
    return response.data;
  },

  /**
   * Delete a product (Admin only)
   * @param id - Product ID
   */
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ENDPOINTS.products.delete(id)
    );
    return response.data;
  },

  /**
   * Bulk delete products (Admin only)
   * @param ids - Array of product IDs to delete
   */
  async bulkDeleteProducts(ids: string[]): Promise<ApiResponse<void>[]> {
    const deletePromises = ids.map(id => this.deleteProduct(id));
    return Promise.all(deletePromises);
  },
};

export default productService;
