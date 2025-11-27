# AtYourDoorStep - Full-Stack Microservices Application

[![Backend CI/CD](https://github.com/yourusername/atyourdoorstep/workflows/Backend%20CI/CD/badge.svg)](https://github.com/yourusername/atyourdoorstep/actions)
[![Frontend CI/CD](https://github.com/yourusername/atyourdoorstep/workflows/Frontend%20CI/CD/badge.svg)](https://github.com/yourusername/atyourdoorstep/actions)

Modern doorstep delivery platform built with **Clean Architecture**, **Domain-Driven Design**, and **Microservices**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         API Gateway (YARP)                   │
│                     http://localhost:5000                    │
└───────────────┬─────────────────────┬───────────────────────┘
                │                     │
        ┌───────▼────────┐    ┌──────▼────────┐
        │  AuthService   │    │ OrderService  │
        │    Port 5001   │    │   Port 5002   │
        └───────┬────────┘    └───────┬───────┘
                │                     │
                └──────────┬──────────┘
                           │
                    ┌──────▼──────┐
                    │  PostgreSQL │
                    │   Port 5432 │
                    └─────────────┘
```

## 📁 Project Structure

```
AtYourDoorStep/
├── 📂 src/                          # Backend microservices (.NET 8)
│   ├── Shared/                      # Common infrastructure
│   ├── AuthService/                 # Authentication service
│   ├── OrderService/                # Order management service
│   └── Gateway/                     # API Gateway (YARP)
├── 📂 frontend/           # Frontend (React + TypeScript)
├── 📂 docker/                       # Dockerfiles
├── 📂 docs/                         # Documentation
├── 📂 .github/workflows/            # CI/CD pipelines
├── docker-compose.yml               # Multi-service orchestration
└── AtYourDoorStep.sln              # .NET solution file
```

📖 **Detailed structure:** See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

## 🚀 Tech Stack

### Backend

- **.NET 8** - Web API
- **PostgreSQL** - Primary database
- **EF Core** - ORM with Code-First migrations
- **JWT** - Authentication with refresh tokens
- **Serilog** - Structured logging
- **FluentValidation** - Request validation
- **AutoMapper** - Object mapping
- **YARP** - API Gateway
- **Swagger/OpenAPI** - API documentation

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Query** - Server state management
- **React Router** - Client-side routing

### Infrastructure

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **NGINX** - Frontend web server
- **GitHub Actions** - CI/CD pipelines

## 📋 Features

### ✅ Implemented

- **Authentication Service**
  - User registration with email/password
  - Login with JWT + Refresh Token
  - Token refresh and revocation
  - Role-based authorization (Admin, Manager, User)
  - Password hashing with BCrypt
- **Shared Infrastructure**

  - Generic repository pattern
  - Unit of Work pattern
  - Global exception handling
  - Request/Response logging
  - API response standardization
  - Snake_case database naming

- **Development Tools**
  - Docker Compose for local development
  - Health check endpoints
  - Swagger UI for API testing
  - Auto-migrations in development

### 🚧 In Progress

- **Order Service** (Products, Orders, Customers)
- **API Gateway** with YARP
- **Push Notifications** service
- **Email Service** wrapper

## 🛠️ Getting Started

### Prerequisites

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 20+** - [Download](https://nodejs.org/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **PostgreSQL 16** (if not using Docker)

### Quick Start with Docker

1. **Clone the repository**

```powershell
git clone https://github.com/yourusername/atyourdoorstep.git
cd atyourdoorstep
```

2. **Create environment file**

```powershell
cp .env.template .env
# Edit .env with your configuration
```

3. **Start all services**

```powershell
docker-compose up -d
```

4. **Verify services**

```powershell
docker-compose ps
```

Services will be available at:

- **AuthService**: http://localhost:5001
- **Swagger UI**: http://localhost:5001
- **PostgreSQL**: localhost:5432

### Local Development (Without Docker)

#### Backend Setup

1. **Restore dependencies**

```powershell
dotnet restore AtYourDoorStep.sln
```

2. **Update database connection**

   - Edit `src/AuthService/API/appsettings.json`
   - Set your PostgreSQL connection string

3. **Run migrations**

```powershell
cd src/AuthService/Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../API
dotnet ef database update --startup-project ../API
```

4. **Run AuthService**

```powershell
cd src/AuthService/API
dotnet run
```

#### Frontend Setup

1. **Install dependencies**

```powershell
cd frontend
npm install
```

2. **Configure environment**

```powershell
# .env file is already configured for local development
# VITE_API_BASE_URL=http://localhost:5000
```

3. **Start development server**

```powershell
npm run dev
```

Frontend will be available at: http://localhost:5173

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {access-token}
```

Full API documentation available at Swagger UI: http://localhost:5001

## 🗂️ Project Structure

```
AtYourDoorStep/
├── src/
│   ├── Shared/                       # Shared infrastructure
│   │   ├── Domain/                   # Base entities
│   │   ├── Application/              # Interfaces, DTOs
│   │   └── Infrastructure/           # Repositories, Middlewares
│   │
│   ├── AuthService/                  # Authentication microservice
│   │   ├── Domain/                   # Entities, Enums
│   │   ├── Application/              # DTOs, Validators, Interfaces
│   │   ├── Infrastructure/           # DbContext, Repositories, Services
│   │   └── API/                      # Controllers, Program.cs
│   │
│   └── OrderService/                 # Order management (TODO)
│       ├── Domain/
│       ├── Application/
│       ├── Infrastructure/
│       └── API/
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/                      # API client
│   │   ├── services/                 # Business services
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page components
│   │   └── hooks/                    # Custom hooks
│   └── public/
│
├── docker/                           # Docker configurations
│   ├── AuthService.Dockerfile
│   └── init-db.sql
│
├── .github/workflows/                # CI/CD pipelines
├── docker-compose.yml                # Multi-service orchestration
├── progress.md                       # Development progress
└── BACKEND_IMPLEMENTATION_GUIDE.md   # Implementation guide
```

## 🔧 Configuration

### Backend Configuration

Configuration is managed through `appsettings.json` and environment variables:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=atyourdoorstep_auth;..."
  },
  "Jwt": {
    "Secret": "your-secret-key-min-32-chars",
    "Issuer": "AtYourDoorStep",
    "Audience": "AtYourDoorStep",
    "ExpiryMinutes": 60
  }
}
```

### Frontend Configuration

Environment variables in `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=AtYourDoorStep
```

## 🧪 Testing

### Backend Tests

```powershell
dotnet test AtYourDoorStep.sln --configuration Release
```

### Frontend Tests

```powershell
cd frontend
npm run test
```

## 📦 Deployment

### Docker Deployment

```powershell
# Build all services
docker-compose build

# Deploy to production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Manual Deployment

See [BACKEND_IMPLEMENTATION_GUIDE.md](./BACKEND_IMPLEMENTATION_GUIDE.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow [copilot-instructions.md](.github/copilot-instructions.md)
- Use Clean Architecture principles
- Write unit tests for services
- Update `progress.md` for major changes

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **AtYourDoorStep Team**

## 🙏 Acknowledgments

- Clean Architecture by Robert C. Martin
- Domain-Driven Design by Eric Evans
- Microsoft .NET Documentation
- React Documentation

## 📞 Support

For support, email support@atyourdoorstep.com or open an issue on GitHub.

---

**Built with ❤️ using Clean Architecture and Modern Best Practices**
