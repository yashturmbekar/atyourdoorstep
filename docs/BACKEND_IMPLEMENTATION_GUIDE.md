# Backend Implementation - Complete Files Reference

## 📋 What Has Been Created

### ✅ Shared Infrastructure (Completed)

- `BaseEntity.cs` - Base domain entity
- `ApiResponse.cs` - Standard API response wrapper
- `IRepository.cs` & `RepositoryBase.cs` - Generic repository pattern
- `GlobalExceptionMiddleware.cs` - Global error handling
- `RequestLoggingMiddleware.cs` - Request/response logging

### ✅ AuthService (Completed)

**Domain Layer:**

- User, Role, UserRole, RefreshToken entities
- RoleType enum

**Application Layer:**

- DTOs: Register, Login, RefreshToken, AuthResponse, UserDto
- Validators: RegisterRequest, LoginRequest, RefreshToken validators
- Interfaces: IAuthService, ITokenService, Repository interfaces

**Infrastructure Layer:**

- AuthDbContext with EF Core + PostgreSQL
- Repositories: UserRepository, RefreshTokenRepository, RoleRepository
- Services: TokenService (JWT), AuthenticationService
- BCrypt password hashing

**API Layer:**

- AuthController with endpoints:
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/refresh
  - POST /api/auth/revoke
  - GET /api/auth/me
  - POST /api/auth/logout
- Program.cs with full configuration
- Swagger setup with JWT Bearer support

## 🚀 Next Steps - OrderService

Create the following structure:

```
src/OrderService/
├── Domain/
│   ├── Entities/
│   │   ├── Product.cs
│   │   ├── Order.cs
│   │   ├── OrderItem.cs
│   │   └── Customer.cs
│   └── Enums/
│       └── OrderStatus.cs
├── Application/
│   ├── DTOs/
│   ├── Interfaces/
│   └── Validators/
├── Infrastructure/
│   ├── Persistence/
│   │   └── OrderDbContext.cs
│   ├── Repositories/
│   └── Services/
└── API/
    ├── Controllers/
    │   ├── ProductsController.cs
    │   ├── OrdersController.cs
    │   └── CustomersController.cs
    └── Program.cs
```

### Product Entity Example:

```csharp
public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int StockQuantity { get; set; }
    public bool IsAvailable { get; set; } = true;
}
```

### Order Entity Example:

```csharp
public class Order : BaseEntity
{
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public string OrderNumber { get; set; } = string.Empty;
    public OrderStatus Status { get; set; }
    public decimal TotalAmount { get; set; }
    public string DeliveryAddress { get; set; } = string.Empty;
    public DateTime? DeliveredAt { get; set; }
    public List<OrderItem> OrderItems { get; set; } = new();
}
```

## 🔌 API Gateway with YARP

Create `src/Gateway/Program.cs`:

```csharp
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy => policy
    .AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());

app.MapReverseProxy();

app.Run();
```

### Gateway appsettings.json:

```json
{
  "ReverseProxy": {
    "Routes": {
      "auth-route": {
        "ClusterId": "auth-cluster",
        "Match": {
          "Path": "/api/auth/{**catch-all}"
        }
      },
      "orders-route": {
        "ClusterId": "orders-cluster",
        "Match": {
          "Path": "/api/{**catch-all}"
        }
      }
    },
    "Clusters": {
      "auth-cluster": {
        "Destinations": {
          "auth-service": {
            "Address": "http://localhost:5001"
          }
        }
      },
      "orders-cluster": {
        "Destinations": {
          "order-service": {
            "Address": "http://localhost:5002"
          }
        }
      }
    }
  }
}
```

## 🐳 Docker Configuration

### AuthService Dockerfile:

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/AuthService/API/AuthService.API.csproj", "AuthService/API/"]
COPY ["src/AuthService/Application/AuthService.Application.csproj", "AuthService/Application/"]
COPY ["src/AuthService/Domain/AuthService.Domain.csproj", "AuthService/Domain/"]
COPY ["src/AuthService/Infrastructure/AuthService.Infrastructure.csproj", "AuthService/Infrastructure/"]
COPY ["src/Shared/", "Shared/"]
RUN dotnet restore "AuthService/API/AuthService.API.csproj"

COPY src/ .
WORKDIR "/src/AuthService/API"
RUN dotnet build "AuthService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AuthService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AuthService.API.dll"]
```

### docker-compose.yml:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    container_name: atyourdoorstep-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: atyourdoorstep
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  authservice:
    build:
      context: .
      dockerfile: src/AuthService/API/Dockerfile
    container_name: authservice
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=atyourdoorstep_auth;Username=postgres;Password=postgres
      - Jwt__Secret=YourSuperSecretKeyThatIsAtLeast32CharactersLong123456789
      - Jwt__Issuer=AtYourDoorStep
      - Jwt__Audience=AtYourDoorStep
    ports:
      - "5001:80"
    depends_on:
      postgres:
        condition: service_healthy

  orderservice:
    build:
      context: .
      dockerfile: src/OrderService/API/Dockerfile
    container_name: orderservice
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres;Port=5432;Database=atyourdoorstep_orders;Username=postgres;Password=postgres
    ports:
      - "5002:80"
    depends_on:
      postgres:
        condition: service_healthy

  gateway:
    build:
      context: .
      dockerfile: src/Gateway/Dockerfile
    container_name: gateway
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    ports:
      - "5000:80"
    depends_on:
      - authservice
      - orderservice

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend
    ports:
      - "3000:80"
    depends_on:
      - gateway

volumes:
  postgres_data:
```

## ⚛️ Frontend Integration

### Create `frontend/src/api/apiClient.ts`:

```typescript
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Token refresh lock
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token, redirect to login
        window.location.href = "/admin/login";
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        isRefreshing = false;
        processQueue(null);

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError as Error);

        // Clear tokens and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/admin/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data?: T[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
```

### Create `frontend/src/services/authService.ts`:

```typescript
import apiClient, { ApiResponse } from "../api/apiClient";

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  createdAt: string;
}

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/api/auth/register",
      data
    );

    if (response.data.success && response.data.data) {
      // Store tokens
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      return response.data.data;
    }

    throw new Error(response.data.message || "Registration failed");
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      "/api/auth/login",
      data
    );

    if (response.data.success && response.data.data) {
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      return response.data.data;
    }

    throw new Error(response.data.message || "Login failed");
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>("/api/auth/me");

    if (response.data.success && response.data.data) {
      return response.data.data;
    }

    throw new Error("Failed to get user information");
  },

  getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
```

### Environment Configuration

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=AtYourDoorStep
```

Create `frontend/.env.production`:

```env
VITE_API_BASE_URL=https://api.atyourdoorstep.com
VITE_APP_NAME=AtYourDoorStep
```

## 🔧 Required Commands

### Create Solution:

```powershell
cd d:\AtYourDoorStep
dotnet new sln -n AtYourDoorStep
dotnet sln add src/Shared/Domain/Shared.Domain.csproj
dotnet sln add src/Shared/Application/Shared.Application.csproj
dotnet sln add src/Shared/Infrastructure/Shared.Infrastructure.csproj
dotnet sln add src/AuthService/Domain/AuthService.Domain.csproj
dotnet sln add src/AuthService/Application/AuthService.Application.csproj
dotnet sln add src/AuthService/Infrastructure/AuthService.Infrastructure.csproj
dotnet sln add src/AuthService/API/AuthService.API.csproj
```

### Create Migrations:

```powershell
cd src/AuthService/Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../API --output-dir Persistence/Migrations
dotnet ef database update --startup-project ../API
```

### Run Services:

```powershell
# Terminal 1 - AuthService
cd src/AuthService/API
dotnet run

# Terminal 2 - OrderService (after creating it)
cd src/OrderService/API
dotnet run

# Terminal 3 - Gateway (after creating it)
cd src/Gateway
dotnet run

# Terminal 4 - Frontend
cd frontend
npm install axios @tanstack/react-query
npm run dev
```

### Docker:

```powershell
docker-compose up -d
docker-compose logs -f
```

## 📦 Frontend Package Updates

Add to `package.json`:

```json
{
  "dependencies": {
    "axios": "^1.7.9",
    "@tanstack/react-query": "^5.62.11",
    "@tanstack/react-query-devtools": "^5.62.11"
  }
}
```

## ✅ Implementation Checklist

- [x] Shared infrastructure
- [x] AuthService domain entities
- [x] AuthService application layer
- [x] AuthService infrastructure
- [x] AuthService API with controllers
- [x] AuthService configuration
- [ ] OrderService (similar structure to AuthService)
- [ ] Gateway with YARP
- [ ] Push Notification Service
- [ ] Docker configuration
- [ ] Frontend API integration
- [ ] React Query setup
- [ ] Authentication hooks
- [ ] GitHub Actions CI/CD

---

**Next Steps:**

1. Create OrderService following the same pattern as AuthService
2. Setup API Gateway with YARP
3. Create Docker configurations
4. Update frontend with API integration
5. Add push notifications service
6. Setup CI/CD pipelines
