# 🚀 Quick Start Guide - AtYourDoorStep

Get your full-stack microservices application running in **5 minutes**!

---

## Prerequisites Check ✅

Before starting, ensure you have:

- [ ] Docker Desktop installed and running
- [ ] .NET 8 SDK (optional, for local development)
- [ ] Node.js 20+ (optional, for frontend development)

---

## Option 1: Docker (Easiest) 🐳

### Step 1: Clone & Setup

```powershell
# Navigate to your project
cd d:\AtYourDoorStep

# Create environment file
Copy-Item .env.template .env
```

### Step 2: Start Everything

```powershell
docker-compose up -d
```

### Step 3: Verify

```powershell
# Check services are running
docker-compose ps

# View logs
docker-compose logs -f authservice
```

### Step 4: Test the API

Open your browser:

- **Swagger UI:** http://localhost:5001
- **Health Check:** http://localhost:5001/health

### Step 5: Try It Out

**Register a User:**

1. Go to http://localhost:5001
2. Find `POST /api/auth/register`
3. Click "Try it out"
4. Use this payload:

```json
{
  "email": "admin@test.com",
  "password": "Admin123!",
  "firstName": "Admin",
  "lastName": "User"
}
```

5. Click "Execute"

**Login:**

1. Find `POST /api/auth/login`
2. Click "Try it out"
3. Use:

```json
{
  "email": "admin@test.com",
  "password": "Admin123!"
}
```

4. Copy the `accessToken` from response

**Authorize:**

1. Click the green "Authorize" button at top
2. Enter: `Bearer {paste-your-access-token-here}`
3. Click "Authorize"

**Get Current User:**

1. Find `GET /api/auth/me`
2. Click "Try it out"
3. Click "Execute"

**Done!** 🎉 Your authentication is working!

---

## Option 2: Local Development 💻

### Backend Setup

```powershell
# Navigate to AuthService
cd d:\AtYourDoorStep\src\AuthService\Infrastructure

# Create initial migration
dotnet ef migrations add InitialCreate --startup-project ../API

# Apply migration to database
dotnet ef database update --startup-project ../API

# Run the service
cd ../API
dotnet run
```

**AuthService now running at:** http://localhost:5001

### Frontend Setup

```powershell
# Navigate to frontend
cd d:\AtYourDoorStep\frontend

# Install dependencies (if not already done)
npm install

# Install API client dependencies
npm install axios @tanstack/react-query

# Start development server
npm run dev
```

**Frontend now running at:** http://localhost:5173

---

## Quick Commands Reference 📝

### Docker

```powershell
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f authservice

# Rebuild and start
docker-compose up -d --build

# Complete reset (removes database)
docker-compose down -v
```

### Backend (.NET)

```powershell
# Build solution
dotnet build AtYourDoorStep.sln

# Run specific service
dotnet run --project src/AuthService/API

# Watch mode (auto-reload)
dotnet watch run --project src/AuthService/API

# Run tests
dotnet test

# Add migration
dotnet ef migrations add MigrationName --project src/AuthService/Infrastructure --startup-project src/AuthService/API

# Update database
dotnet ef database update --project src/AuthService/Infrastructure --startup-project src/AuthService/API
```

### Frontend (React)

```powershell
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint

# Format code
npm run format
```

---

## Troubleshooting 🔧

### Port Already in Use

**Problem:** Port 5001, 5432, or 5173 is already in use.

**Solution:**

```powershell
# Stop Docker services
docker-compose down

# Check what's using the port
netstat -ano | findstr :5001
netstat -ano | findstr :5432

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Connection Issues

**Problem:** Can't connect to PostgreSQL.

**Solution:**

```powershell
# Check if PostgreSQL container is running
docker ps | findstr postgres

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Migration Errors

**Problem:** Migration fails or database out of sync.

**Solution:**

```powershell
# Remove existing migrations
Remove-Item src/AuthService/Infrastructure/Persistence/Migrations -Recurse -Force

# Recreate migration
cd src/AuthService/Infrastructure
dotnet ef migrations add InitialCreate --startup-project ../API
dotnet ef database update --startup-project ../API
```

### JWT Secret Not Found

**Problem:** "JWT Secret not configured" error.

**Solution:**
Edit `src/AuthService/API/appsettings.json`:

```json
{
  "Jwt": {
    "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong123456789",
    "Issuer": "AtYourDoorStep",
    "Audience": "AtYourDoorStep",
    "ExpiryMinutes": 60
  }
}
```

---

## Service URLs 🌐

| Service         | URL                          | Description                       |
| --------------- | ---------------------------- | --------------------------------- |
| AuthService API | http://localhost:5001        | Authentication endpoints          |
| Swagger UI      | http://localhost:5001        | Interactive API docs              |
| Health Check    | http://localhost:5001/health | Service health status             |
| Frontend        | http://localhost:5173        | React application                 |
| PostgreSQL      | localhost:5432               | Database (use pgAdmin or DBeaver) |

### Database Connection

**Connection String:**

```
Host=localhost
Port=5432
Database=atyourdoorstep_auth
Username=postgres
Password=postgres
```

---

## Testing API with cURL 🧪

### Register

```powershell
curl -X POST http://localhost:5001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test123!\",\"firstName\":\"John\",\"lastName\":\"Doe\"}'
```

### Login

```powershell
curl -X POST http://localhost:5001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test123!\"}'
```

### Get Current User

```powershell
$token = "your-access-token-here"
curl -X GET http://localhost:5001/api/auth/me `
  -H "Authorization: Bearer $token"
```

---

## Next Steps After Setup ✨

1. ✅ Test all authentication endpoints in Swagger
2. ✅ Verify database tables were created
3. ✅ Check logs for any errors
4. ✅ Test frontend login page
5. 📖 Read BACKEND_IMPLEMENTATION_GUIDE.md
6. 🚀 Start building OrderService
7. 🎯 Add API Gateway with YARP

---

## Getting Help 💬

**Documentation:**

- [README.md](./README.md) - Full project overview
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - What was built
- [BACKEND_IMPLEMENTATION_GUIDE.md](./BACKEND_IMPLEMENTATION_GUIDE.md) - Implementation details
- [progress.md](./progress.md) - Development progress

**Common Issues:**

- Check Docker is running: `docker ps`
- Check service logs: `docker-compose logs -f`
- Verify ports are available: `netstat -ano | findstr :5001`

---

## Success Indicators ✅

You'll know everything is working when:

- ✅ Swagger UI loads at http://localhost:5001
- ✅ Health check returns `{"status":"Healthy"}`
- ✅ You can register a user successfully
- ✅ You can login and receive tokens
- ✅ You can access `/api/auth/me` with bearer token
- ✅ No errors in `docker-compose logs`

---

**🎉 Congratulations! Your microservices platform is running!**

Need help? Check the troubleshooting section or review the documentation files.
