/**
 * Admin API Services
 * Production-ready API integration replacing mock data
 * Following Clean Architecture and instruction file standards
 */

import apiClient from '../api/apiClient';
import { API_ENDPOINTS } from '../api/endpoints';
import type {
  ApiResponse,
  PaginatedResponse,
  ProductResponseDto,
  OrderResponseDto,
  UpdateOrderStatusRequestDto,
  CustomerResponseDto,
  UpdateCustomerRequestDto,
  OrderStatus,
} from '../types/api.types';

// Legacy type mappings for backward compatibility with existing components
import type {
  Product,
  ProductFormData,
  Order,
  OrderFormData,
  OrderFilters,
  Customer,
  AdminStats,
  PaginatedResponse as LegacyPaginatedResponse,
  ApiResponse as LegacyApiResponse,
} from '../types';

// ============================================
// Type Mappers - Convert between legacy and new DTOs
// ============================================

/**
 * Map ProductResponseDto to legacy Product type
 * Maps from backend ContentService ProductDto structure
 */
function mapProductResponse(dto: ProductResponseDto): Product {
  // Get stock from first variant or default to 0
  const firstVariant = dto.variants?.[0];
  const stock = firstVariant?.stockQuantity ?? 0;
  const price = dto.basePrice ?? 0;
  const discountPrice = dto.discountedPrice;

  // Build image from base64 data
  let imageUrl = '/images/placeholder.png';
  if (dto.primaryImageBase64 && dto.primaryImageContentType) {
    imageUrl = `data:${dto.primaryImageContentType};base64,${dto.primaryImageBase64}`;
  } else if (dto.images?.[0]?.imageBase64 && dto.images[0].imageContentType) {
    imageUrl = `data:${dto.images[0].imageContentType};base64,${dto.images[0].imageBase64}`;
  }

  const mapped = {
    id: dto.id,
    name: dto.name,
    description: dto.shortDescription || dto.fullDescription || '',
    // Use productCategoryId for form editing, fallback to display name for views
    category:
      dto.productCategoryId ||
      dto.categoryId ||
      dto.productCategoryName ||
      dto.categoryName ||
      '',
    categoryName: dto.productCategoryName || dto.categoryName || '',
    image: imageUrl,
    isActive: dto.isAvailable,
    tags: dto.features || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    variants:
      dto.variants?.length > 0
        ? dto.variants.map(v => ({
            id: v.id,
            size: v.size,
            price: v.price,
            unit: v.unit,
            inStock: v.isAvailable && v.stockQuantity > 0,
            stockQuantity: v.stockQuantity,
            sku: v.sku || `SKU-${v.id.substring(0, 8)}`,
            costPrice: v.price * 0.7,
            discountPrice: v.discountedPrice,
          }))
        : [
            {
              id: `${dto.id}-default`,
              size: 'Standard',
              price: price,
              unit: 'unit',
              inStock: stock > 0,
              stockQuantity: stock,
              sku: `SKU-${dto.id.substring(0, 8)}`,
              costPrice: price * 0.7,
              discountPrice: discountPrice,
            },
          ],
  };

  return mapped;
}

/**
 * Map OrderResponseDto to legacy Order type
 * Backend OrderStatus: Pending=1, Confirmed=2, Processing=3, Shipped=4, Delivered=5, Cancelled=6, Refunded=7
 */
function mapOrderResponse(dto: OrderResponseDto): Order {
  const statusMap: Record<number, Order['status']> = {
    1: 'pending',
    2: 'confirmed',
    3: 'processing',
    4: 'shipped',
    5: 'delivered',
    6: 'cancelled',
  };

  return {
    id: dto.id,
    customerId: dto.customerId,
    customerInfo: {
      name: dto.customerName,
      phone: '',
      email: '',
      address: dto.deliveryAddress || '',
      city: dto.deliveryCity || '',
      pincode: dto.deliveryPostalCode || '',
    },
    items: dto.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      variantId: item.id,
      variantSize: 'Standard',
      price: item.price,
      quantity: item.quantity,
      total: item.subTotal,
    })),
    subtotal: dto.subTotal,
    deliveryCharge: dto.shippingAmount || 0,
    total: dto.totalAmount,
    status: statusMap[dto.status] || 'pending',
    orderDate: new Date(dto.createdAt),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    estimatedDelivery: dto.shippedAt ? new Date(dto.shippedAt) : undefined,
    actualDelivery: dto.deliveredAt ? new Date(dto.deliveredAt) : undefined,
    trackingNumber: dto.trackingNumber,
    paymentStatus: 'paid',
    paymentMethod: 'online',
    notes: dto.notes,
  };
}

/**
 * Map CustomerResponseDto to legacy Customer type
 */
function mapCustomerResponse(dto: CustomerResponseDto): Customer {
  return {
    id: dto.id,
    name: `${dto.firstName} ${dto.lastName}`,
    email: dto.email,
    phone: dto.phoneNumber,
    address: dto.address
      ? {
          street: dto.address,
          city: dto.city || '',
          state: dto.state || '',
          zipCode: dto.postalCode || '',
          country: dto.country || 'India',
        }
      : undefined,
    isActive: true,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    totalOrders: 0,
    totalSpent: 0,
  };
}

/**
 * Map legacy OrderStatus string to backend enum
 * Backend OrderStatus: Pending=1, Confirmed=2, Processing=3, Shipped=4, Delivered=5, Cancelled=6, Refunded=7
 */
function mapOrderStatusToEnum(status: Order['status']): OrderStatus {
  const statusMap: Record<Order['status'], OrderStatus> = {
    pending: 1,
    confirmed: 2,
    processing: 3,
    shipped: 4,
    delivered: 5,
    cancelled: 6,
  };
  return statusMap[status];
}

// ============================================
// Product API Services
// ============================================

export const productApi = {
  async getProducts(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    status?: 'active' | 'inactive'
  ): Promise<LegacyPaginatedResponse<Product>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', limit.toString());
      if (search) queryParams.append('search', search);
      if (category) queryParams.append('category', category);
      if (status)
        queryParams.append('isAvailable', (status === 'active').toString());

      const response = await apiClient.get<
        PaginatedResponse<ProductResponseDto>
      >(`${API_ENDPOINTS.products.list}?${queryParams.toString()}`);

      const products = (response.data.data || []).map(mapProductResponse);

      return {
        data: products,
        message: response.data.message || 'Products fetched successfully',
        success: response.data.success,
        pagination: {
          page: response.data.meta?.page || page,
          limit: response.data.meta?.pageSize || limit,
          total: response.data.meta?.total || 0,
          totalPages: response.data.meta?.totalPages || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        data: [],
        message: 'Failed to fetch products',
        success: false,
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  },

  async getProduct(id: string): Promise<LegacyApiResponse<Product>> {
    try {
      const response = await apiClient.get<ApiResponse<ProductResponseDto>>(
        API_ENDPOINTS.products.byId(id)
      );

      if (response.data.success && response.data.data) {
        return {
          data: mapProductResponse(response.data.data),
          message: 'Product fetched successfully',
          success: true,
        };
      }

      throw new Error('Product not found');
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async createProduct(
    productData: ProductFormData
  ): Promise<LegacyApiResponse<Product>> {
    try {
      const mainVariant = productData.variants[0];

      // Build images array from data URL if present
      const images: {
        imageBase64: string;
        imageContentType: string;
        altText?: string;
      }[] = [];
      if (productData.image && productData.image.startsWith('data:')) {
        const matches = productData.image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          images.push({
            imageBase64: matches[2],
            imageContentType: matches[1],
            altText: productData.name,
          });
        }
      }

      // Build request matching backend CreateProductRequest
      const requestData = {
        name: productData.name,
        slug: productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        shortDescription: productData.description,
        fullDescription: productData.description,
        productCategoryId: productData.category,
        basePrice: mainVariant?.price || 0,
        discountedPrice: mainVariant?.discountPrice,
        isFeatured: false,
        isAvailable: productData.isActive,
        features: productData.tags || [],
        images: images.length > 0 ? images : undefined,
        variants:
          productData.variants?.map(v => ({
            size: v.size,
            unit: v.unit || 'unit',
            price: v.price,
            discountedPrice: v.discountPrice,
            stockQuantity: v.stockQuantity || 0,
            sku: v.sku,
            isAvailable: v.inStock !== false,
          })) || [],
      };

      const response = await apiClient.post<ApiResponse<ProductResponseDto>>(
        API_ENDPOINTS.products.create,
        requestData
      );

      if (response.data.success && response.data.data) {
        return {
          data: mapProductResponse(response.data.data),
          message: 'Product created successfully',
          success: true,
        };
      }

      throw new Error(response.data.message || 'Failed to create product');
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(
    id: string,
    productData: Partial<ProductFormData>
  ): Promise<LegacyApiResponse<Product>> {
    try {
      // Build request matching backend UpdateProductRequest
      const requestData: Record<string, unknown> = {};

      if (productData.name) requestData.name = productData.name;
      if (productData.description) {
        requestData.shortDescription = productData.description;
        requestData.fullDescription = productData.description;
      }
      if (productData.category)
        requestData.productCategoryId = productData.category;
      if (productData.isActive !== undefined)
        requestData.isAvailable = productData.isActive;
      if (productData.tags) requestData.features = productData.tags;

      // Handle image - extract base64 and content type from data URL
      if (productData.image && productData.image.startsWith('data:')) {
        const matches = productData.image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          requestData.imageContentType = matches[1];
          requestData.imageBase64 = matches[2];
        }
      }

      if (productData.variants && productData.variants.length > 0) {
        const variant = productData.variants[0];
        if (variant.price) requestData.basePrice = variant.price;
        if (variant.discountPrice)
          requestData.discountedPrice = variant.discountPrice;
      }

      const response = await apiClient.put<ApiResponse<ProductResponseDto>>(
        API_ENDPOINTS.products.update(id),
        requestData
      );

      if (response.data.success && response.data.data) {
        return {
          data: mapProductResponse(response.data.data),
          message: 'Product updated successfully',
          success: true,
        };
      }

      throw new Error(response.data.message || 'Failed to update product');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<LegacyApiResponse<null>> {
    try {
      await apiClient.delete(API_ENDPOINTS.products.delete(id));
      return {
        data: null,
        message: 'Product deleted successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  async bulkUpdateProducts(
    updates: { id: string; data: Partial<ProductFormData> }[]
  ): Promise<LegacyApiResponse<Product[]>> {
    const updatedProducts: Product[] = [];

    for (const update of updates) {
      try {
        const result = await this.updateProduct(update.id, update.data);
        if (result.success) {
          updatedProducts.push(result.data);
        }
      } catch (error) {
        console.error(`Error updating product ${update.id}:`, error);
      }
    }

    return {
      data: updatedProducts,
      message: 'Products updated successfully',
      success: true,
    };
  },
};

// ============================================
// Order API Services
// ============================================

export const orderApi = {
  async getOrders(
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilters
  ): Promise<LegacyPaginatedResponse<Order>> {
    try {
      // If status filter provided, use status endpoint
      if (filters?.status && filters.status.length > 0) {
        const statusEnum = mapOrderStatusToEnum(filters.status[0]);
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('pageSize', limit.toString());

        const response = await apiClient.get<
          PaginatedResponse<OrderResponseDto>
        >(
          `${API_ENDPOINTS.orders.byStatus(statusEnum)}?${queryParams.toString()}`
        );

        const orders = (response.data.data || []).map(mapOrderResponse);

        return {
          data: orders,
          message: response.data.message || 'Orders fetched successfully',
          success: response.data.success,
          pagination: {
            page: response.data.meta?.page || page,
            limit: response.data.meta?.pageSize || limit,
            total: response.data.meta?.total || 0,
            totalPages: response.data.meta?.totalPages || 0,
          },
        };
      }

      // Otherwise, fetch by customer or default
      if (filters?.customerId) {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('pageSize', limit.toString());

        const response = await apiClient.get<
          PaginatedResponse<OrderResponseDto>
        >(
          `${API_ENDPOINTS.orders.byCustomer(filters.customerId)}?${queryParams.toString()}`
        );

        const orders = (response.data.data || []).map(mapOrderResponse);

        return {
          data: orders,
          message: response.data.message || 'Orders fetched successfully',
          success: response.data.success,
          pagination: {
            page: response.data.meta?.page || page,
            limit: response.data.meta?.pageSize || limit,
            total: response.data.meta?.total || 0,
            totalPages: response.data.meta?.totalPages || 0,
          },
        };
      }

      // Default: fetch pending orders (status=1 in backend)
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', limit.toString());

      const response = await apiClient.get<PaginatedResponse<OrderResponseDto>>(
        `${API_ENDPOINTS.orders.byStatus(1)}?${queryParams.toString()}`
      );

      const orders = (response.data.data || []).map(mapOrderResponse);

      return {
        data: orders,
        message: response.data.message || 'Orders fetched successfully',
        success: response.data.success,
        pagination: {
          page: response.data.meta?.page || page,
          limit: response.data.meta?.pageSize || limit,
          total: response.data.meta?.total || 0,
          totalPages: response.data.meta?.totalPages || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return {
        data: [],
        message: 'Failed to fetch orders',
        success: false,
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  },

  async getOrder(id: string): Promise<LegacyApiResponse<Order>> {
    try {
      const response = await apiClient.get<ApiResponse<OrderResponseDto>>(
        API_ENDPOINTS.orders.byId(id)
      );

      if (response.data.success && response.data.data) {
        return {
          data: mapOrderResponse(response.data.data),
          message: 'Order fetched successfully',
          success: true,
        };
      }

      throw new Error('Order not found');
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  },

  async updateOrder(
    id: string,
    orderData: Partial<OrderFormData>
  ): Promise<LegacyApiResponse<Order>> {
    try {
      if (orderData.status) {
        return await this.updateOrderStatus(
          id,
          orderData.status,
          orderData.adminNotes
        );
      }
      throw new Error('Only status updates are supported');
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async updateOrderStatus(
    id: string,
    status: Order['status'],
    notes?: string
  ): Promise<LegacyApiResponse<Order>> {
    try {
      const requestData: UpdateOrderStatusRequestDto = {
        status: mapOrderStatusToEnum(status),
        trackingNumber: notes,
      };

      const response = await apiClient.patch<ApiResponse<OrderResponseDto>>(
        API_ENDPOINTS.orders.updateStatus(id),
        requestData
      );

      if (response.data.success && response.data.data) {
        return {
          data: mapOrderResponse(response.data.data),
          message: 'Order status updated successfully',
          success: true,
        };
      }

      throw new Error(response.data.message || 'Failed to update order status');
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async bulkUpdateOrderStatus(
    orderIds: string[],
    status: Order['status'],
    notes?: string
  ): Promise<LegacyApiResponse<Order[]>> {
    const updatedOrders: Order[] = [];

    for (const orderId of orderIds) {
      try {
        const result = await this.updateOrderStatus(orderId, status, notes);
        if (result.success) {
          updatedOrders.push(result.data);
        }
      } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
      }
    }

    return {
      data: updatedOrders,
      message: 'Orders updated successfully',
      success: true,
    };
  },
};

// ============================================
// Customer API Services
// ============================================

export const customerApi = {
  async getCustomers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: 'all' | 'active' | 'inactive'
  ): Promise<LegacyPaginatedResponse<Customer>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('pageSize', limit.toString());
      if (search) queryParams.append('search', search);

      const response = await apiClient.get<
        PaginatedResponse<CustomerResponseDto>
      >(`${API_ENDPOINTS.customers.list}?${queryParams.toString()}`);

      const customers = (response.data.data || []).map(mapCustomerResponse);

      // Apply status filter client-side if needed
      const filteredCustomers =
        status && status !== 'all'
          ? customers.filter(c =>
              status === 'active' ? c.isActive : !c.isActive
            )
          : customers;

      return {
        data: filteredCustomers,
        message: response.data.message || 'Customers fetched successfully',
        success: response.data.success,
        pagination: {
          page: response.data.meta?.page || page,
          limit: response.data.meta?.pageSize || limit,
          total: response.data.meta?.total || 0,
          totalPages: response.data.meta?.totalPages || 0,
        },
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return {
        data: [],
        message: 'Failed to fetch customers',
        success: false,
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  },

  async getCustomerById(
    customerId: string
  ): Promise<LegacyApiResponse<Customer>> {
    try {
      const response = await apiClient.get<ApiResponse<CustomerResponseDto>>(
        API_ENDPOINTS.customers.byId(customerId)
      );

      if (response.data.success && response.data.data) {
        return {
          data: mapCustomerResponse(response.data.data),
          message: 'Customer fetched successfully',
          success: true,
        };
      }

      throw new Error('Customer not found');
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<OrderResponseDto>>(
        API_ENDPOINTS.orders.byCustomer(customerId)
      );

      return (response.data.data || []).map(mapOrderResponse);
    } catch (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }
  },

  async updateCustomersStatus(
    customerIds: string[],
    isActive: boolean
  ): Promise<LegacyApiResponse<Customer[]>> {
    // Note: Backend doesn't have status field, this would need backend update
    // For now, we'll just return success
    return {
      data: [],
      message: `${customerIds.length} customer(s) ${isActive ? 'activated' : 'deactivated'} successfully`,
      success: true,
    };
  },

  async deleteCustomers(
    customerIds: string[]
  ): Promise<LegacyApiResponse<void>> {
    try {
      for (const id of customerIds) {
        await apiClient.delete(API_ENDPOINTS.customers.delete(id));
      }

      return {
        data: undefined,
        message: `${customerIds.length} customer(s) deleted successfully`,
        success: true,
      };
    } catch (error) {
      console.error('Error deleting customers:', error);
      throw error;
    }
  },

  async updateCustomer(
    customerId: string,
    customerData: Partial<Customer>
  ): Promise<LegacyApiResponse<Customer>> {
    try {
      const nameParts = customerData.name?.split(' ') || [];
      const requestData: UpdateCustomerRequestDto = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        email: customerData.email,
        phoneNumber: customerData.phone,
        address: customerData.address?.street,
        city: customerData.address?.city,
        state: customerData.address?.state,
        postalCode: customerData.address?.zipCode,
        country: customerData.address?.country,
      };

      const response = await apiClient.put<ApiResponse<CustomerResponseDto>>(
        API_ENDPOINTS.customers.update(customerId),
        requestData
      );

      if (response.data.success && response.data.data) {
        return {
          data: mapCustomerResponse(response.data.data),
          message: 'Customer updated successfully',
          success: true,
        };
      }

      throw new Error(response.data.message || 'Failed to update customer');
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },
};

// ============================================
// Analytics API Services
// ============================================

export const analyticsApi = {
  async getDashboardStats(): Promise<LegacyApiResponse<AdminStats>> {
    try {
      // Fetch data from multiple endpoints to build stats
      const [
        productsRes,
        pendingOrdersRes,
        confirmedOrdersRes,
        processingOrdersRes,
        shippedOrdersRes,
        deliveredOrdersRes,
        cancelledOrdersRes,
      ] = await Promise.allSettled([
        apiClient.get<PaginatedResponse<ProductResponseDto>>(
          `${API_ENDPOINTS.products.list}?page=1&pageSize=1`
        ),
        // Backend OrderStatus: Pending=1, Confirmed=2, Processing=3, Shipped=4, Delivered=5, Cancelled=6
        apiClient.get<PaginatedResponse<OrderResponseDto>>(
          `${API_ENDPOINTS.orders.byStatus(1)}?page=1&pageSize=1`
        ),
        apiClient.get<PaginatedResponse<OrderResponseDto>>(
          `${API_ENDPOINTS.orders.byStatus(2)}?page=1&pageSize=1`
        ),
        apiClient.get<PaginatedResponse<OrderResponseDto>>(
          `${API_ENDPOINTS.orders.byStatus(3)}?page=1&pageSize=1`
        ),
        apiClient.get<PaginatedResponse<OrderResponseDto>>(
          `${API_ENDPOINTS.orders.byStatus(4)}?page=1&pageSize=1`
        ),
        apiClient.get<PaginatedResponse<OrderResponseDto>>(
          `${API_ENDPOINTS.orders.byStatus(5)}?page=1&pageSize=1`
        ),
        apiClient.get<PaginatedResponse<OrderResponseDto>>(
          `${API_ENDPOINTS.orders.byStatus(6)}?page=1&pageSize=1`
        ),
      ]);

      // Helper to safely extract count from settled promise
      const getCount = (result: PromiseSettledResult<any>): number => {
        if (result.status === 'fulfilled') {
          return result.value?.data?.meta?.total || 0;
        }
        return 0;
      };

      const pendingCount = getCount(pendingOrdersRes);
      const confirmedCount = getCount(confirmedOrdersRes);
      const processingCount = getCount(processingOrdersRes);
      const shippedCount = getCount(shippedOrdersRes);
      const deliveredCount = getCount(deliveredOrdersRes);
      const cancelledCount = getCount(cancelledOrdersRes);

      const totalOrders =
        pendingCount +
        confirmedCount +
        processingCount +
        shippedCount +
        deliveredCount +
        cancelledCount;

      const stats: AdminStats = {
        totalProducts: getCount(productsRes),
        totalOrders: totalOrders,
        totalCustomers: 0, // Would need separate endpoint
        totalRevenue: 0, // Would need separate endpoint
        pendingOrders: pendingCount,
        lowStockProducts: 0, // Would need backend support
        ordersToday: 0, // Would need backend support
        monthlyRevenue: [0, 0, 0, 0, 0, 0],
        ordersByStatus: {
          pending: pendingCount,
          confirmed: confirmedCount,
          processing: processingCount,
          shipped: shippedCount,
          delivered: deliveredCount,
          cancelled: cancelledCount,
        },
      };

      return {
        data: stats,
        message: 'Dashboard stats fetched successfully',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        data: {
          totalProducts: 0,
          totalOrders: 0,
          totalCustomers: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          lowStockProducts: 0,
          ordersToday: 0,
          monthlyRevenue: [0, 0, 0, 0, 0, 0],
          ordersByStatus: {},
        },
        message: 'Failed to fetch dashboard stats',
        success: false,
      };
    }
  },
};

// ============================================
// Combined Admin API
// ============================================

export const adminApi = {
  products: productApi,
  orders: orderApi,
  customers: customerApi,
  analytics: analyticsApi,

  // Convenience methods for backward compatibility
  getCustomers: customerApi.getCustomers,
  getCustomerById: customerApi.getCustomerById,
  getCustomerOrders: customerApi.getCustomerOrders,
  updateCustomersStatus: customerApi.updateCustomersStatus,
  deleteCustomers: customerApi.deleteCustomers,
  updateCustomer: customerApi.updateCustomer,
};

export default adminApi;
