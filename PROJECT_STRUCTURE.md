# AtYourDoorStep - Project Structure

This document outlines the complete project structure for the AtYourDoorStep application.

## 📁 Root Directory Structure

```
AtYourDoorStep/
├── 📂 src/                          # Backend microservices (.NET 8)
├── 📂 frontend/           # Frontend application (React + TypeScript)
├── 📂 docker/                       # Docker configuration files
├── 📂 docs/                         # Project documentation
├── 📂 .github/                      # GitHub Actions CI/CD workflows
├── 📄 docker-compose.yml            # Multi-service orchestration
├── 📄 AtYourDoorStep.sln            # .NET solution file
├── 📄 progress.md                   # Development progress tracker
├── 📄 README.md                     # Project overview
├── 📄 .env.template                 # Environment variables template
└── 📄 PROJECT_STRUCTURE.md          # This file
```

---

## 🎯 Backend Structure (src/)

### Complete Backend Architecture

```
src/
├── 📂 Shared/                       # Shared infrastructure & common code
│   ├── 📂 Domain/
│   │   ├── 📂 Entities/
│   │   │   └── BaseEntity.cs        # Base entity with Id, timestamps, soft delete
│   │   └── Shared.Domain.csproj
│   ├── 📂 Application/
│   │   ├── 📂 DTOs/
│   │   │   ├── ApiResponse.cs       # Standard API response wrapper
│   │   │   └── PaginatedResponse.cs # Pagination wrapper
│   │   ├── 📂 Interfaces/
│   │   │   ├── IRepository.cs       # Generic repository interface
│   │   │   └── IUnitOfWork.cs       # Unit of work pattern
│   │   └── Shared.Application.csproj
│   └── 📂 Infrastructure/
│       ├── 📂 Persistence/
│       │   └── RepositoryBase.cs    # Generic repository implementation
│       ├── 📂 Middlewares/
│       │   ├── GlobalExceptionMiddleware.cs
│       │   └── RequestLoggingMiddleware.cs
│       └── Shared.Infrastructure.csproj
│
├── 📂 AuthService/                  # Authentication & User Management
│   ├── 📂 Domain/
│   │   ├── 📂 Entities/
│   │   │   ├── User.cs              # User entity
│   │   │   ├── Role.cs              # Role entity
│   │   │   ├── UserRole.cs          # User-Role junction
│   │   │   └── RefreshToken.cs      # Refresh token entity
│   │   └── AuthService.Domain.csproj
│   ├── 📂 Application/
│   │   ├── 📂 DTOs/
│   │   │   ├── AuthDtos.cs          # Login, Register, Token DTOs
│   │   │   ├── UserDtos.cs          # User CRUD DTOs
│   │   │   └── RoleDtos.cs          # Role management DTOs
│   │   ├── 📂 Validators/
│   │   │   ├── AuthValidators.cs    # FluentValidation for auth
│   │   │   ├── UserValidators.cs    # FluentValidation for users
│   │   │   └── RoleValidators.cs    # FluentValidation for roles
│   │   ├── 📂 Interfaces/
│   │   │   ├── IAuthRepositories.cs # Auth repository interfaces
│   │   │   ├── ITokenService.cs     # Token service interface
│   │   │   └── IAuthenticationService.cs
│   │   └── AuthService.Application.csproj
│   ├── 📂 Infrastructure/
│   │   ├── 📂 Persistence/
│   │   │   ├── AuthDbContext.cs     # EF Core DbContext
│   │   │   └── Migrations/          # EF Core migrations
│   │   ├── 📂 Repositories/
│   │   │   └── AuthRepositories.cs  # User, Role, RefreshToken repos
│   │   ├── 📂 Services/
│   │   │   ├── TokenService.cs      # JWT token generation
│   │   │   └── AuthenticationService.cs # Auth business logic
│   │   └── AuthService.Infrastructure.csproj
│   └── 📂 API/
│       ├── 📂 Controllers/
│       │   ├── AuthController.cs    # /api/auth/* endpoints
│       │   ├── UsersController.cs   # /api/users/* endpoints
│       │   └── RolesController.cs   # /api/roles/* endpoints
│       ├── Program.cs               # Application startup
│       ├── appsettings.json         # Development config
│       ├── appsettings.Production.json
│       └── AuthService.API.csproj
│
├── 📂 OrderService/                 # Order Management, Products, Customers
│   ├── 📂 Domain/
│   │   ├── 📂 Entities/
│   │   │   ├── Product.cs           # Product entity
│   │   │   ├── Customer.cs          # Customer entity
│   │   │   ├── Order.cs             # Order entity
│   │   │   └── OrderItem.cs         # Order-Product junction
│   │   ├── 📂 Enums/
│   │   │   └── OrderStatus.cs       # Order status enum
│   │   └── OrderService.Domain.csproj
│   ├── 📂 Application/
│   │   ├── 📂 DTOs/
│   │   │   ├── ProductDtos.cs       # Product CRUD DTOs
│   │   │   ├── CustomerDtos.cs      # Customer CRUD DTOs
│   │   │   └── OrderDtos.cs         # Order CRUD DTOs
│   │   ├── 📂 Validators/
│   │   │   ├── ProductValidators.cs
│   │   │   ├── CustomerValidators.cs
│   │   │   └── OrderValidators.cs
│   │   ├── 📂 Interfaces/
│   │   │   ├── IOrderRepositories.cs
│   │   │   └── IOrderService.cs
│   │   └── OrderService.Application.csproj
│   ├── 📂 Infrastructure/
│   │   ├── 📂 Persistence/
│   │   │   ├── OrderDbContext.cs    # EF Core DbContext
│   │   │   └── Migrations/          # EF Core migrations
│   │   ├── 📂 Repositories/
│   │   │   └── OrderRepositories.cs # Product, Customer, Order repos
│   │   ├── 📂 Services/
│   │   │   └── OrderManagementService.cs # Order business logic
│   │   └── OrderService.Infrastructure.csproj
│   └── 📂 API/
│       ├── 📂 Controllers/
│       │   ├── ProductsController.cs   # /api/products/* endpoints
│       │   ├── CustomersController.cs  # /api/customers/* endpoints
│       │   └── OrdersController.cs     # /api/orders/* endpoints
│       ├── Program.cs
│       ├── appsettings.json
│       ├── appsettings.Production.json
│       └── OrderService.API.csproj
│
└── 📂 Gateway/                      # API Gateway (YARP Reverse Proxy)
    ├── Program.cs                   # Gateway startup with YARP config
    ├── appsettings.json             # Route definitions (dev)
    ├── appsettings.Production.json  # Route definitions (prod)
    └── Gateway.csproj
```

---

## 🎨 Frontend Structure (frontend/)

### Complete Frontend Architecture

```
frontend/
├── 📂 public/                       # Static assets
│   ├── 📂 api/                      # Static JSON data
│   │   ├── metadata.json
│   │   └── 📂 content/
│   │       ├── about.json
│   │       ├── products.json
│   │       ├── services.json
│   │       └── testimonials.json
│   ├── 📂 images/                   # Image assets
│   ├── manifest.json                # PWA manifest
│   ├── robots.txt
│   ├── sitemap.xml
│   └── content-sitemap.xml
│
├── 📂 src/                          # React + TypeScript source
│   ├── 📂 api/                      # API client configuration
│   │   ├── apiClient.ts             # Axios instance with interceptors
│   │   └── endpoints.ts             # API endpoint definitions
│   │
│   ├── 📂 assets/                   # Images, fonts, etc.
│   │
│   ├── 📂 components/               # React components
│   │   ├── 📂 admin/                # Admin dashboard components
│   │   │   ├── 📂 AdminDashboard/
│   │   │   ├── 📂 AdminLayout/
│   │   │   ├── 📂 AdminLogin/
│   │   │   ├── 📂 Analytics/
│   │   │   ├── 📂 CustomerManagement/
│   │   │   ├── 📂 OrderManagement/
│   │   │   ├── 📂 ProductForm/
│   │   │   ├── 📂 ProductManagement/
│   │   │   ├── 📂 Settings/
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 common/               # Reusable UI components
│   │   │   ├── 📂 About/
│   │   │   ├── 📂 Button/
│   │   │   ├── 📂 Card/
│   │   │   ├── 📂 Cart/
│   │   │   ├── 📂 CategoryProductCatalog/
│   │   │   ├── 📂 ContactForm/
│   │   │   ├── 📂 Footer/
│   │   │   ├── 📂 Header/
│   │   │   ├── 📂 Hero/
│   │   │   ├── 📂 Layout/
│   │   │   ├── 📂 Navbar/
│   │   │   ├── 📂 ProductCard/
│   │   │   ├── 📂 ProductCatalog/
│   │   │   ├── 📂 ProductGrid/
│   │   │   ├── 📂 SEO/
│   │   │   ├── 📂 ServiceCard/
│   │   │   ├── 📂 ServiceList/
│   │   │   ├── 📂 TestimonialCard/
│   │   │   ├── 📂 Testimonials/
│   │   │   └── index.ts
│   │   │
│   │   ├── 📂 ThemeDemo/            # Theme demonstration
│   │   ├── Accordion.js
│   │   └── index.ts
│   │
│   ├── 📂 constants/                # Application constants
│   │   ├── products.ts              # Product data
│   │   ├── socialMedia.ts           # Social media links
│   │   └── index.ts
│   │
│   ├── 📂 contexts/                 # React Context providers
│   │   ├── AdminAuthContext.tsx     # Admin authentication state
│   │   ├── CartContext.tsx          # Shopping cart state
│   │   └── ThemeContext.tsx         # Theme state
│   │
│   ├── 📂 hooks/                    # Custom React hooks
│   │   ├── useAdminAuth.ts          # Admin auth hook
│   │   ├── useCart.ts               # Cart hook
│   │   ├── useSEO.ts                # SEO hook
│   │   ├── useTheme.ts              # Theme hook
│   │   ├── useThemeContext.ts       # Theme context hook
│   │   └── index.ts
│   │
│   ├── 📂 pages/                    # Page components
│   │   ├── HomePage.tsx
│   │   ├── OrderPage.tsx
│   │   ├── OrderPage.css
│   │   ├── ThemeDemoPage.tsx
│   │   ├── AdminDashboardPage.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── AdminProductsPage.tsx
│   │   ├── AdminProductFormPage.tsx
│   │   ├── AdminProductEditPage.tsx
│   │   ├── AdminOrdersPage.tsx
│   │   ├── AdminCustomersPage.tsx
│   │   ├── AdminAnalyticsPage.tsx
│   │   ├── AdminSettingsPage.tsx
│   │   └── index.ts
│   │
│   ├── 📂 services/                 # Business logic services
│   │   ├── api.ts                   # API service functions
│   │   ├── adminApi.ts              # Admin API functions
│   │   └── index.ts
│   │
│   ├── 📂 styles/                   # Global styles
│   │   ├── globals.css              # Global CSS
│   │   ├── base.css                 # Base styles
│   │   ├── theme.css                # Theme variables
│   │   ├── theme-utilities.css      # Theme utility classes
│   │   ├── animations.css           # CSS animations
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── 📂 theme/                    # Theme configuration
│   │   ├── theme.config.ts          # Theme config
│   │   └── index.ts
│   │
│   ├── 📂 types/                    # TypeScript type definitions
│   │   └── index.ts
│   │
│   ├── 📂 utils/                    # Utility functions
│   │   ├── seo.ts                   # SEO utilities
│   │   └── index.ts
│   │
│   ├── App.tsx                      # Main App component
│   ├── App.css
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts                # Vite environment types
│
├── 📂 docs/                         # Frontend documentation
│   ├── 📂 assets/
│   ├── 📂 guides/
│   ├── 📂 seo/
│   └── 📂 technical/
│
├── 📂 .github/                      # GitHub Actions workflows
│   └── 📂 workflows/
│
├── 📄 index.html                    # HTML entry point
├── 📄 package.json                  # npm dependencies
├── 📄 package-lock.json
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 tsconfig.app.json
├── 📄 tsconfig.node.json
├── 📄 vite.config.ts                # Vite configuration
├── 📄 eslint.config.js              # ESLint configuration
├── 📄 .prettierrc                   # Prettier configuration
├── 📄 Dockerfile                    # Frontend Docker build
├── 📄 nginx.conf                    # NGINX configuration
├── 📄 .env                          # Development environment
├── 📄 .env.production               # Production environment
└── 📄 README.md
```

---

## 🐳 Docker Structure (docker/)

```
docker/
├── AuthService.Dockerfile           # AuthService multi-stage build
├── OrderService.Dockerfile          # OrderService multi-stage build
├── Gateway.Dockerfile               # Gateway multi-stage build
└── init-db.sql                      # PostgreSQL initialization script
```

---

## 📚 Documentation Structure (docs/)

```
docs/
├── BACKEND_IMPLEMENTATION_GUIDE.md  # Backend setup guide
├── COMMANDS.md                      # Common commands reference
├── IMPLEMENTATION_SUMMARY.md        # Implementation summary
└── QUICKSTART.md                    # Quick start guide
```

---

## 🔧 Configuration Files

### Root Level Configuration

- **AtYourDoorStep.sln** - .NET solution file (all backend projects)
- **docker-compose.yml** - Multi-service orchestration
- **.env.template** - Environment variables template
- **progress.md** - Development progress tracker
- **README.md** - Project overview

### Backend Configuration (per service)

- **{Service}.csproj** - Project file
- **appsettings.json** - Development configuration
- **appsettings.Production.json** - Production configuration

### Frontend Configuration

- **package.json** - npm dependencies and scripts
- **vite.config.ts** - Vite bundler configuration
- **tsconfig.json** - TypeScript compiler options
- **eslint.config.js** - Code linting rules
- **.env** - Development environment variables
- **.env.production** - Production environment variables

---

## 🚀 Key Architectural Patterns

### Backend

1. **Clean Architecture** - Domain, Application, Infrastructure, API layers
2. **CQRS Pattern** - Command/Query separation in services
3. **Repository Pattern** - Data access abstraction
4. **Unit of Work** - Transaction management
5. **Dependency Injection** - IoC container for loose coupling
6. **Middleware Pipeline** - Cross-cutting concerns (logging, errors)
7. **API Gateway Pattern** - YARP reverse proxy

### Frontend

1. **Component-Based Architecture** - Reusable React components
2. **Context API** - Global state management
3. **Custom Hooks** - Reusable logic
4. **Service Layer** - API communication abstraction
5. **Atomic Design** - Component hierarchy (atoms → molecules → organisms)

---

## 📦 Database Structure

### Databases

- **atyourdoorstep_auth** - AuthService database
  - Tables: users, roles, user_roles, refresh_tokens
- **atyourdoorstep_orders** - OrderService database
  - Tables: products, customers, orders, order_items

### Naming Convention

- **snake_case** for all database objects (tables, columns, indexes)
- **PascalCase** for C# entities and properties
- Automatic conversion via EF Core configuration

---

## 🔐 Security Practices

1. **JWT Authentication** - Stateless token-based auth
2. **Refresh Tokens** - Secure token rotation
3. **Password Hashing** - BCrypt with salt
4. **CORS Configuration** - Whitelist allowed origins
5. **Environment Variables** - No secrets in code
6. **HTTPS Only** - Production configuration
7. **SQL Injection Prevention** - Parameterized queries (EF Core)
8. **XSS Prevention** - Content Security Policy

---

## 📝 Naming Conventions

### Backend (.NET)

- **Files**: PascalCase.cs
- **Classes**: PascalCase
- **Interfaces**: IPascalCase
- **Methods**: PascalCase
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE or PascalCase
- **Private fields**: \_camelCase

### Frontend (TypeScript/React)

- **Components**: PascalCase.tsx
- **Hooks**: useCamelCase.ts
- **Services**: camelCase.ts
- **Constants**: UPPER_SNAKE_CASE or camelCase
- **Types/Interfaces**: PascalCase

### Database

- **Tables**: snake_case (plural)
- **Columns**: snake_case
- **Indexes**: idx_table_column
- **Foreign Keys**: fk_table1_table2

---

## 🔄 Data Flow

### Authentication Flow

```
Frontend → Gateway:5000 → AuthService:5001 → PostgreSQL
   ↓
JWT Token
   ↓
Subsequent requests include Bearer token
```

### Order Flow

```
Frontend → Gateway:5000 → OrderService:5002 → PostgreSQL
                ↓
        JWT Validation (Gateway)
                ↓
        Business Logic (Service)
                ↓
        Database Transaction
```

---

## 🎯 Port Assignments

- **5000** - Gateway (API Gateway)
- **5001** - AuthService (Authentication)
- **5002** - OrderService (Orders, Products, Customers)
- **5432** - PostgreSQL (Database)
- **3000** - Frontend (Production NGINX)
- **5173** - Frontend (Development Vite)

---

## 📊 Technology Stack Summary

### Backend

- **.NET 8** - Framework
- **ASP.NET Core** - Web API
- **Entity Framework Core 8** - ORM
- **PostgreSQL** - Database
- **Npgsql** - PostgreSQL provider
- **FluentValidation** - Input validation
- **Serilog** - Logging
- **JWT Bearer** - Authentication
- **YARP** - Reverse proxy
- **Swagger/OpenAPI** - API documentation

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Routing
- **Context API** - State management
- **CSS Modules** - Styling

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD
- **NGINX** - Web server (production)

---

## 📈 Scalability Considerations

1. **Microservices Architecture** - Independent scaling
2. **Database per Service** - Data isolation
3. **API Gateway** - Load balancing capability
4. **Docker Containers** - Horizontal scaling
5. **Stateless Services** - Session independence
6. **CDN Ready** - Static asset delivery
7. **Connection Pooling** - Database efficiency

---

## 🔍 Monitoring & Logging

- **Serilog** - Structured logging
- **Request/Response Logging** - Gateway and services
- **Health Checks** - Service availability monitoring
- **Error Tracking** - Global exception handling
- **Performance Metrics** - Request duration tracking

---

This structure follows industry best practices for:

- Clean Architecture principles
- Domain-Driven Design (DDD)
- SOLID principles
- Separation of Concerns
- Scalability and Maintainability
