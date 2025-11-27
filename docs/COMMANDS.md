# 📝 Commands Cheat Sheet - AtYourDoorStep

Quick reference for all common commands you'll need.

---

## 🐳 Docker Commands

### Basic Operations

```powershell
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f authservice
docker-compose logs -f postgres

# Check service status
docker-compose ps

# Restart a service
docker-compose restart authservice

# Execute command in container
docker-compose exec authservice bash
docker-compose exec postgres psql -U postgres

# View resource usage
docker stats
```

### Database Operations

```powershell
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d atyourdoorstep_auth

# Backup database
docker-compose exec postgres pg_dump -U postgres atyourdoorstep_auth > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres atyourdoorstep_auth < backup.sql

# List databases
docker-compose exec postgres psql -U postgres -c "\l"

# List tables
docker-compose exec postgres psql -U postgres -d atyourdoorstep_auth -c "\dt"
```

---

## 🔧 .NET Commands

### Solution Management

```powershell
# Build entire solution
dotnet build AtYourDoorStep.sln

# Build in Release mode
dotnet build AtYourDoorStep.sln --configuration Release

# Clean solution
dotnet clean AtYourDoorStep.sln

# Restore packages
dotnet restore AtYourDoorStep.sln

# Add project to solution
dotnet sln add src/NewService/API/NewService.API.csproj
```

### Running Services

```powershell
# Run AuthService
cd src/AuthService/API
dotnet run

# Run with watch (auto-reload)
dotnet watch run

# Run specific configuration
dotnet run --configuration Release

# Run on specific port
dotnet run --urls "http://localhost:5001"
```

### Package Management

```powershell
# Add NuGet package
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Serilog.AspNetCore

# Add package with version
dotnet add package AutoMapper --version 13.0.1

# Remove package
dotnet remove package PackageName

# List installed packages
dotnet list package

# Update packages
dotnet list package --outdated
dotnet add package PackageName
```

### Testing

```powershell
# Run all tests
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test src/AuthService/Tests/AuthService.Tests.csproj

# Run tests in watch mode
dotnet watch test
```

---

## 🗄️ Entity Framework Commands

### Migrations

```powershell
# Create new migration
cd src/AuthService/Infrastructure
dotnet ef migrations add MigrationName --startup-project ../API

# Apply migrations to database
dotnet ef database update --startup-project ../API

# Apply specific migration
dotnet ef database update MigrationName --startup-project ../API

# Rollback to previous migration
dotnet ef database update PreviousMigrationName --startup-project ../API

# Remove last migration (if not applied)
dotnet ef migrations remove --startup-project ../API

# List all migrations
dotnet ef migrations list --startup-project ../API

# Generate SQL script
dotnet ef migrations script --startup-project ../API --output migration.sql

# Drop database
dotnet ef database drop --startup-project ../API
```

### Database Commands

```powershell
# Update database to latest
dotnet ef database update --startup-project ../API

# Create database without applying migrations
dotnet ef database update 0 --startup-project ../API

# Get database context info
dotnet ef dbcontext info --startup-project ../API

# Scaffold existing database (reverse engineer)
dotnet ef dbcontext scaffold "Host=localhost;Database=mydb;Username=postgres;Password=pass" Npgsql.EntityFrameworkCore.PostgreSQL --startup-project ../API
```

---

## ⚛️ React/Frontend Commands

### Development

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Install specific package
npm install axios
npm install @tanstack/react-query
npm install -D typescript

# Start development server
npm run dev

# Start on different port
npm run dev -- --port 3000

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```powershell
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format code
npm run format

# Check formatting
npm run format:check

# Type checking
npx tsc --noEmit
```

### Package Management

```powershell
# Update packages
npm update

# Check for outdated packages
npm outdated

# Install latest versions
npm install package@latest

# Remove package
npm uninstall package-name

# Clear cache
npm cache clean --force
```

---

## 🔍 Debugging & Diagnostics

### Check Ports

```powershell
# Check if port is in use
netstat -ano | findstr :5001
netstat -ano | findstr :5432
netstat -ano | findstr :5173

# Kill process by PID
taskkill /PID <process-id> /F

# List all listening ports
netstat -ano | findstr LISTENING
```

### View Logs

```powershell
# Backend logs (Serilog)
Get-Content src/AuthService/API/logs/authservice-*.log -Wait

# Docker logs
docker-compose logs -f authservice

# Last 100 lines
docker-compose logs --tail=100 authservice

# Logs since timestamp
docker-compose logs --since 2024-01-01T12:00:00 authservice
```

### Health Checks

```powershell
# Check AuthService health
curl http://localhost:5001/health

# Check readiness
curl http://localhost:5001/health/ready

# Check PostgreSQL
docker-compose exec postgres pg_isready -U postgres

# Test API endpoint
curl http://localhost:5001/api/auth/me -H "Authorization: Bearer TOKEN"
```

---

## 🔐 Git Commands

### Basic Operations

```powershell
# Check status
git status

# Add files
git add .
git add src/AuthService/

# Commit changes
git commit -m "Add AuthService implementation"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Create and switch to branch
git checkout -b feature/order-service

# Switch branch
git checkout main

# Merge branch
git merge feature/order-service
```

### Stashing

```powershell
# Stash changes
git stash

# List stashes
git stash list

# Apply stash
git stash apply

# Apply and remove stash
git stash pop

# Drop stash
git stash drop
```

---

## 📊 Performance & Monitoring

### Docker Resource Usage

```powershell
# View container stats
docker stats

# View specific container
docker stats authservice

# Disk usage
docker system df

# Clean unused resources
docker system prune

# Clean everything (including volumes)
docker system prune -a --volumes
```

### .NET Performance

```powershell
# Run with performance profiling
dotnet run --configuration Release

# Memory usage
dotnet-counters monitor --process-id <pid>

# CPU sampling
dotnet-trace collect --process-id <pid>
```

---

## 🚀 Deployment Commands

### Production Build

```powershell
# Backend
dotnet publish src/AuthService/API/AuthService.API.csproj -c Release -o ./publish/authservice

# Frontend
cd frontend
npm run build

# Docker production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### GitHub Actions

```powershell
# Test workflow locally (with act)
act -W .github/workflows/backend.yml

# Validate workflow syntax
gh workflow view backend.yml
```

---

## 🧪 Testing & Validation

### API Testing with curl

```powershell
# Register
curl -X POST http://localhost:5001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@test.com\",\"password\":\"Test123!\",\"firstName\":\"John\",\"lastName\":\"Doe\"}'

# Login
curl -X POST http://localhost:5001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@test.com\",\"password\":\"Test123!\"}'

# Get user (with token)
$token = "your-token-here"
curl -X GET http://localhost:5001/api/auth/me `
  -H "Authorization: Bearer $token"
```

### Database Queries

```powershell
# Connect to database
docker-compose exec postgres psql -U postgres -d atyourdoorstep_auth

# Inside psql:
SELECT * FROM users;
SELECT * FROM roles;
SELECT * FROM user_roles;
SELECT * FROM refresh_tokens;

# Count records
SELECT COUNT(*) FROM users;

# Exit psql
\q
```

---

## 🛠️ Maintenance Commands

### Cleanup

```powershell
# Clean .NET build artifacts
dotnet clean
Remove-Item -Recurse -Force **/bin, **/obj

# Clean frontend build
cd frontend
Remove-Item -Recurse -Force node_modules, dist
npm install

# Clean Docker
docker system prune -a
docker volume prune
```

### Reset Everything

```powershell
# Complete reset (use with caution!)
docker-compose down -v
Remove-Item -Recurse -Force src/AuthService/Infrastructure/Persistence/Migrations
dotnet clean
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
cd ..

# Recreate database
cd src/AuthService/Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../API
dotnet ef database update --startup-project ../API
```

---

## 📋 Useful One-Liners

```powershell
# Quick start everything
docker-compose up -d && docker-compose logs -f

# Rebuild and restart
docker-compose down && docker-compose up -d --build

# View all running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Backend watch mode with logs
dotnet watch run --project src/AuthService/API | Tee-Object -FilePath logs.txt

# Frontend dev with API proxy
cd frontend && npm run dev

# Database backup with timestamp
docker-compose exec postgres pg_dump -U postgres atyourdoorstep_auth > "backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sql"
```

---

## 🔗 Quick URLs

```
AuthService API:      http://localhost:5001
Swagger UI:           http://localhost:5001
Health Check:         http://localhost:5001/health
Frontend:             http://localhost:5173
PostgreSQL:           localhost:5432
```

---

**💡 Pro Tip:** Bookmark this file for quick reference while developing!

Save this command for quick access:

```powershell
notepad d:\AtYourDoorStep\COMMANDS.md
```
