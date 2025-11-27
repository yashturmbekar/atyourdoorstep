import type {
  Product,
  ProductFormData,
  Order,
  OrderFormData,
  OrderFilters,
  Customer,
  AdminStats,
  PaginatedResponse,
  ApiResponse,
} from '../types';

// Mock customer data
const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Alphonso Mangoes',
    category: 'alphonso',
    description:
      'Fresh, premium quality Alphonso mangoes - the king of mangoes. Sweet, juicy, and aromatic.',
    image: '/images/mangoes-carousel.png',
    isActive: true,
    tags: ['fresh', 'premium', 'seasonal'],
    weight: 2,
    seoTitle: 'Premium Alphonso Mangoes - Fresh & Sweet',
    seoDescription:
      'Order fresh premium Alphonso mangoes online. Best quality guaranteed.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
    variants: [
      {
        id: 'var-1',
        size: '2 dozen',
        price: 1600,
        unit: 'kg',
        inStock: true,
        stockQuantity: 50,
        sku: 'MAN-ALF-2DOZ',
        costPrice: 1200,
      },
    ],
  },
  // Add more mock products...
];

const mockOrders: Order[] = [
  {
    id: 'ord-1',
    customerInfo: {
      name: 'John Doe',
      phone: '9876543210',
      email: 'john@example.com',
      address: '123 Main Street',
      city: 'Mumbai',
      pincode: '400001',
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Premium Alphonso Mangoes',
        variantId: 'var-1',
        variantSize: '2 dozen',
        price: 1600,
        quantity: 1,
        total: 1600,
      },
    ],
    subtotal: 1600,
    deliveryCharge: 50,
    total: 1650,
    status: 'pending',
    orderDate: new Date('2024-06-25'),
    createdAt: new Date('2024-06-25'),
    updatedAt: new Date('2024-06-25'),
    estimatedDelivery: new Date('2024-06-27'),
    paymentStatus: 'pending',
    paymentMethod: 'cod',
    trackingNumber: '',
  },
  // Add more mock orders...
];

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '9876543210',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
    },
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-20'),
    totalOrders: 5,
    totalSpent: 12500,
    lastOrderDate: new Date('2024-06-15'),
  },
  {
    id: 'cust-2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '9876543211',
    address: {
      street: '456 Oak Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India',
    },
    isActive: true,
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-06-18'),
    totalOrders: 3,
    totalSpent: 8900,
    lastOrderDate: new Date('2024-06-10'),
  },
  {
    id: 'cust-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '9876543212',
    isActive: false,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-05-15'),
    totalOrders: 1,
    totalSpent: 2500,
    lastOrderDate: new Date('2024-03-20'),
  },
  {
    id: 'cust-4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '9876543213',
    address: {
      street: '789 Pine Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
    },
    isActive: true,
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-06-22'),
    totalOrders: 8,
    totalSpent: 18750,
    lastOrderDate: new Date('2024-06-20'),
  },
  {
    id: 'cust-5',
    name: 'David Brown',
    email: 'david.brown@email.com',
    phone: '9876543214',
    address: {
      street: '321 Cedar Lane',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600001',
      country: 'India',
    },
    isActive: true,
    createdAt: new Date('2024-05-08'),
    updatedAt: new Date('2024-06-19'),
    totalOrders: 2,
    totalSpent: 4200,
    lastOrderDate: new Date('2024-06-05'),
  },
];

// Product API Services
export const productApi = {
  // Get all products with pagination and filtering
  async getProducts(
    page: number = 1,
    limit: number = 10,
    search?: string,
    category?: string,
    status?: 'active' | 'inactive'
  ): Promise<PaginatedResponse<Product>> {
    // Mock implementation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

    let filteredProducts = [...mockProducts];

    if (search) {
      filteredProducts = filteredProducts.filter(
        product =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category === category
      );
    }

    if (status) {
      const isActive = status === 'active';
      filteredProducts = filteredProducts.filter(
        product => product.isActive === isActive
      );
    }

    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedProducts,
      message: 'Products fetched successfully',
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Get single product by ID
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const product = mockProducts.find(p => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }

    return {
      data: product,
      message: 'Product fetched successfully',
      success: true,
    };
  },

  // Create new product
  async createProduct(
    productData: ProductFormData
  ): Promise<ApiResponse<Product>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      variants: productData.variants.map((variant, index) => ({
        ...variant,
        id: `var-${Date.now()}-${index}`,
      })),
    };

    mockProducts.push(newProduct);

    return {
      data: newProduct,
      message: 'Product created successfully',
      success: true,
    };
  },

  // Update existing product
  async updateProduct(
    id: string,
    productData: Partial<ProductFormData>
  ): Promise<ApiResponse<Product>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    const updatedProduct: Product = {
      ...mockProducts[productIndex],
      ...productData,
      updatedAt: new Date(),
      variants: productData.variants
        ? productData.variants.map((variant, index) => ({
            ...variant,
            id: variant.sku
              ? `var-${variant.sku}`
              : `var-${Date.now()}-${index}`,
          }))
        : mockProducts[productIndex].variants,
    };

    mockProducts[productIndex] = updatedProduct;

    return {
      data: updatedProduct,
      message: 'Product updated successfully',
      success: true,
    };
  },

  // Delete product
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const productIndex = mockProducts.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    mockProducts.splice(productIndex, 1);

    return {
      data: null,
      message: 'Product deleted successfully',
      success: true,
    };
  },

  // Bulk update products
  async bulkUpdateProducts(
    updates: { id: string; data: Partial<ProductFormData> }[]
  ): Promise<ApiResponse<Product[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedProducts: Product[] = [];

    for (const update of updates) {
      const productIndex = mockProducts.findIndex(p => p.id === update.id);
      if (productIndex !== -1) {
        const updatedProduct: Product = {
          ...mockProducts[productIndex],
          ...update.data,
          updatedAt: new Date(),
          variants: update.data.variants
            ? update.data.variants.map((variant, index) => ({
                ...variant,
                id: variant.sku
                  ? `var-${variant.sku}`
                  : `var-${Date.now()}-${index}`,
              }))
            : mockProducts[productIndex].variants,
        };
        mockProducts[productIndex] = updatedProduct;
        updatedProducts.push(updatedProduct);
      }
    }

    return {
      data: updatedProducts,
      message: 'Products updated successfully',
      success: true,
    };
  },
};

// Order API Services
export const orderApi = {
  // Get all orders with pagination and filtering
  async getOrders(
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilters
  ): Promise<PaginatedResponse<Order>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredOrders = [...mockOrders];

    if (filters?.status && filters.status.length > 0) {
      filteredOrders = filteredOrders.filter(order =>
        filters.status!.includes(order.status)
      );
    }

    if (filters?.paymentStatus && filters.paymentStatus.length > 0) {
      filteredOrders = filteredOrders.filter(order =>
        filters.paymentStatus!.includes(order.paymentStatus)
      );
    }

    if (filters?.search) {
      filteredOrders = filteredOrders.filter(
        order =>
          order.customerInfo.name
            .toLowerCase()
            .includes(filters.search!.toLowerCase()) ||
          order.customerInfo.phone.includes(filters.search!) ||
          order.id.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.dateRange) {
      filteredOrders = filteredOrders.filter(
        order =>
          order.orderDate >= filters.dateRange!.from &&
          order.orderDate <= filters.dateRange!.to
      );
    }

    const total = filteredOrders.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      data: paginatedOrders,
      message: 'Orders fetched successfully',
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Get single order by ID
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const order = mockOrders.find(o => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }

    return {
      data: order,
      message: 'Order fetched successfully',
      success: true,
    };
  },

  // Update order
  async updateOrder(
    id: string,
    orderData: Partial<OrderFormData>
  ): Promise<ApiResponse<Order>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const updatedOrder = {
      ...mockOrders[orderIndex],
      ...orderData,
    };

    mockOrders[orderIndex] = updatedOrder;

    return {
      data: updatedOrder,
      message: 'Order updated successfully',
      success: true,
    };
  },

  // Update order status
  async updateOrderStatus(
    id: string,
    status: Order['status'],
    notes?: string
  ): Promise<ApiResponse<Order>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const orderIndex = mockOrders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }

    const updatedOrder = {
      ...mockOrders[orderIndex],
      status,
      adminNotes: notes || mockOrders[orderIndex].adminNotes,
    };

    if (status === 'delivered') {
      updatedOrder.actualDelivery = new Date();
    }

    mockOrders[orderIndex] = updatedOrder;

    return {
      data: updatedOrder,
      message: 'Order status updated successfully',
      success: true,
    };
  },

  // Bulk update order status
  async bulkUpdateOrderStatus(
    orderIds: string[],
    status: Order['status'],
    notes?: string
  ): Promise<ApiResponse<Order[]>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedOrders: Order[] = [];

    for (const orderId of orderIds) {
      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        const updatedOrder = {
          ...mockOrders[orderIndex],
          status,
          adminNotes: notes || mockOrders[orderIndex].adminNotes,
        };

        if (status === 'delivered') {
          updatedOrder.actualDelivery = new Date();
        }

        mockOrders[orderIndex] = updatedOrder;
        updatedOrders.push(updatedOrder);
      }
    }

    return {
      data: updatedOrders,
      message: 'Orders updated successfully',
      success: true,
    };
  },
};

// Customer API Services
export const customerApi = {
  // Get all customers with pagination and filtering
  getCustomers: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: 'all' | 'active' | 'inactive'
  ): Promise<PaginatedResponse<Customer>> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    let filteredCustomers = [...mockCustomers];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(
        customer =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer =>
        status === 'active' ? customer.isActive : !customer.isActive
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const customers = filteredCustomers.slice(startIndex, endIndex);

    return {
      data: customers,
      message: 'Customers fetched successfully',
      success: true,
      pagination: {
        page,
        limit,
        total: filteredCustomers.length,
        totalPages: Math.ceil(filteredCustomers.length / limit),
      },
    };
  },

  // Get customer by ID
  getCustomerById: async (
    customerId: string
  ): Promise<ApiResponse<Customer>> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    const customer = mockCustomers.find(c => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return {
      data: customer,
      message: 'Customer fetched successfully',
      success: true,
    };
  },

  // Get orders for a specific customer
  getCustomerOrders: async (customerId: string): Promise<Order[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));

    // This would normally filter orders by customerId
    // For now, return some mock orders
    return mockOrders.filter(
      order =>
        order.customerInfo.email?.includes('john') && customerId === 'cust-1'
    );
  },

  // Update customer status (activate/deactivate)
  updateCustomersStatus: async (
    customerIds: string[],
    isActive: boolean
  ): Promise<ApiResponse<Customer[]>> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedCustomers: Customer[] = [];

    customerIds.forEach(customerId => {
      const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
      if (customerIndex !== -1) {
        mockCustomers[customerIndex] = {
          ...mockCustomers[customerIndex],
          isActive,
          updatedAt: new Date(),
        };
        updatedCustomers.push(mockCustomers[customerIndex]);
      }
    });

    return {
      data: updatedCustomers,
      message: `${updatedCustomers.length} customer(s) ${isActive ? 'activated' : 'deactivated'} successfully`,
      success: true,
    };
  },

  // Delete customers
  deleteCustomers: async (
    customerIds: string[]
  ): Promise<ApiResponse<void>> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    customerIds.forEach(customerId => {
      const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
      if (customerIndex !== -1) {
        mockCustomers.splice(customerIndex, 1);
      }
    });

    return {
      data: undefined,
      message: `${customerIds.length} customer(s) deleted successfully`,
      success: true,
    };
  },

  // Update customer details
  updateCustomer: async (
    customerId: string,
    customerData: Partial<Customer>
  ): Promise<ApiResponse<Customer>> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const customerIndex = mockCustomers.findIndex(c => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Customer not found');
    }

    const updatedCustomer: Customer = {
      ...mockCustomers[customerIndex],
      ...customerData,
      updatedAt: new Date(),
    };

    mockCustomers[customerIndex] = updatedCustomer;

    return {
      data: updatedCustomer,
      message: 'Customer updated successfully',
      success: true,
    };
  },
};

// Analytics API Services
export const analyticsApi = {
  // Get dashboard stats
  async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const stats: AdminStats = {
      totalProducts: mockProducts.length,
      totalOrders: mockOrders.length,
      totalCustomers: new Set(
        mockOrders.map(o => o.customerInfo.email || o.customerInfo.phone)
      ).size,
      totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
      lowStockProducts: mockProducts.filter(p =>
        p.variants.some(v => (v.stockQuantity || 0) < 10)
      ).length,
      ordersToday: mockOrders.filter(o => {
        const orderDate = new Date(o.orderDate);
        const today = new Date();
        return orderDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
      }).length,
      monthlyRevenue: [15000, 18000, 22000, 19000, 25000, 30000], // Last 6 months
      ordersByStatus: {
        pending: mockOrders.filter(o => o.status === 'pending').length,
        confirmed: mockOrders.filter(o => o.status === 'confirmed').length,
        processing: mockOrders.filter(o => o.status === 'processing').length,
        shipped: mockOrders.filter(o => o.status === 'shipped').length,
        delivered: mockOrders.filter(o => o.status === 'delivered').length,
        cancelled: mockOrders.filter(o => o.status === 'cancelled').length,
      },
    };

    return {
      data: stats,
      message: 'Dashboard stats fetched successfully',
      success: true,
    };
  },
};

// Combined Admin API
export const adminApi = {
  products: productApi,
  orders: orderApi,
  customers: customerApi,
  analytics: analyticsApi,
  // Convenience methods
  getCustomers: customerApi.getCustomers,
  getCustomerById: customerApi.getCustomerById,
  getCustomerOrders: customerApi.getCustomerOrders,
  updateCustomersStatus: customerApi.updateCustomersStatus,
  deleteCustomers: customerApi.deleteCustomers,
  updateCustomer: customerApi.updateCustomer,
};
