# API Documentation

API endpoints and integration guide for the AtYourDoorStep website.

## Overview

This document outlines the API structure and endpoints that can be integrated with the AtYourDoorStep website for dynamic functionality.

## API Service Architecture

The website uses a structured API service layer located in `src/services/api.ts`.

### Base Configuration

```typescript
// src/services/api.ts
export class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  }

  // HTTP methods implementation
  async get<T>(endpoint: string): Promise<T> {
    /* ... */
  }
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    /* ... */
  }
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    /* ... */
  }
  async delete<T>(endpoint: string): Promise<T> {
    /* ... */
  }
}
```

## Planned API Endpoints

### 1. Products API

#### Get All Products

```
GET /api/products
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Ratnagiri Alphonso Mangoes",
      "description": "Premium quality Alphonso mangoes from Ratnagiri",
      "category": "fruits",
      "price": 1200,
      "currency": "INR",
      "unit": "kg",
      "image": "/images/mangoes-carousel.png",
      "availability": "in-stock",
      "season": "march-june",
      "features": [
        "Authentic Ratnagiri Origin",
        "Peak Ripeness",
        "Rich Aroma & Taste"
      ],
      "nutritionalInfo": {
        "calories": 60,
        "vitamins": ["A", "C"],
        "minerals": ["Potassium", "Folate"]
      }
    }
  ]
}
```

#### Get Single Product

```
GET /api/products/:id
```

### 2. Contact API

#### Submit Contact Form

```
POST /api/contact
```

**Request Body:**

```json
{
  "name": "Customer Name",
  "email": "customer@example.com",
  "phone": "+91-9876543210",
  "subject": "product-inquiry",
  "message": "Inquiry about Alphonso mangoes",
  "preferredContact": "email"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Thank you for your inquiry. We'll get back to you within 24 hours.",
  "ticketId": "TKT-2025-001"
}
```

### 3. Newsletter API

#### Subscribe to Newsletter

```
POST /api/newsletter/subscribe
```

**Request Body:**

```json
{
  "email": "customer@example.com",
  "preferences": ["product-updates", "seasonal-offers"]
}
```

### 4. Orders API (Future Implementation)

#### Create Order

```
POST /api/orders
```

**Request Body:**

```json
{
  "customerId": "CUST-001",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unit": "kg"
    }
  ],
  "deliveryAddress": {
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "phone": "+91-9876543210"
  },
  "paymentMethod": "cod"
}
```

#### Get Order Status

```
GET /api/orders/:orderId/status
```

### 5. Reviews API

#### Submit Review

```
POST /api/reviews
```

**Request Body:**

```json
{
  "productId": 1,
  "customerName": "John Doe",
  "rating": 5,
  "comment": "Excellent quality mangoes!",
  "verified": false
}
```

#### Get Product Reviews

```
GET /api/products/:id/reviews
```

## Frontend Integration

### Using the API Service

```typescript
// In a React component
import { useEffect, useState } from 'react';
import { apiService } from '../services';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  // ... other properties
}

export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiService.get<{ data: Product[] }>('/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>₹{product.price}</p>
        </div>
      ))}
    </div>
  );
};
```

### Contact Form Integration

```typescript
// In Contact component
import { useState } from 'react';
import { apiService } from '../services';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiService.post('/contact', formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        <h3>Thank you for your message!</h3>
        <p>We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
```

## Error Handling

### API Error Types

```typescript
// src/types/api.ts
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

### Error Handling Hook

```typescript
// src/hooks/useApiError.ts
import { useState } from 'react';

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred');
    }
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};
```

## Data Validation

### Request Validation

```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+91-\d{10}$/, 'Invalid phone number'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

## Authentication (Future)

### JWT Token Handling

```typescript
// src/services/auth.ts
export class AuthService {
  private tokenKey = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

## Environment Configuration

### Development Setup

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_ENV=development
VITE_ENABLE_API_LOGS=true
```

### Production Setup

```env
# .env.production
VITE_API_BASE_URL=https://api.atyourdoorstep.shop
VITE_APP_ENV=production
VITE_ENABLE_API_LOGS=false
```

## Backend Implementation Guide

### Recommended Tech Stack

- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **JWT**: Authentication
- **Nodemailer**: Email sending
- **Multer**: File uploads

### Basic Server Setup

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing

### API Testing with Jest

```typescript
// src/services/__tests__/api.test.ts
import { apiService } from '../api';

describe('ApiService', () => {
  test('should fetch products successfully', async () => {
    const mockResponse = {
      success: true,
      data: [{ id: 1, name: 'Test Product' }],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await apiService.get('/products');
    expect(result).toEqual(mockResponse);
  });
});
```

## Performance Considerations

### Caching Strategy

```typescript
// src/services/cache.ts
class CacheService {
  private cache = new Map();
  private ttl = 5 * 60 * 1000; // 5 minutes

  set(key: string, value: unknown): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }
}

export const cacheService = new CacheService();
```

## Security Best Practices

1. **Input Validation**: Validate all inputs on both client and server
2. **HTTPS Only**: Use HTTPS in production
3. **Rate Limiting**: Implement API rate limiting
4. **CORS**: Configure CORS properly
5. **Authentication**: Use JWT tokens for authenticated endpoints
6. **Data Sanitization**: Sanitize all user inputs

---

_This API documentation will be updated as new endpoints are implemented._
