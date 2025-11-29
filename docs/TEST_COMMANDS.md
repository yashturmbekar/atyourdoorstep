# 🧪 Test Commands - AtYourDoorStep

Complete guide for running tests locally for both frontend and backend.

---

## 📋 Table of Contents

- [Backend (.NET) Testing](#backend-net-testing)
  - [Prerequisites](#prerequisites)
  - [Run All Tests](#run-all-tests)
  - [Run Tests by Service](#run-tests-by-service)
  - [Test with Coverage](#test-with-coverage)
  - [Watch Mode](#watch-mode)
  - [Filtering Tests](#filtering-tests)
- [Frontend (React) Testing](#frontend-react-testing)
  - [Setup](#setup)
  - [Running Tests](#running-tests)
  - [Code Quality Checks](#code-quality-checks)
- [Test Frameworks & Libraries](#test-frameworks--libraries)

---

## 🔧 Backend (.NET) Testing

### Prerequisites

Ensure you have the .NET 8 SDK installed:

```powershell
dotnet --version
# Should output 8.x.x
```

### Run All Tests

From the solution root directory:

```powershell
# Run all tests in the solution
dotnet test AtYourDoorStep.sln

# Run with detailed output
dotnet test AtYourDoorStep.sln --verbosity normal

# Run with detailed test results
dotnet test AtYourDoorStep.sln --logger "console;verbosity=detailed"
```

### Run Tests by Service

#### AuthService Tests

```powershell
# Unit Tests
dotnet test backend/services/AuthService/tests/AuthService.UnitTests/AuthService.UnitTests.csproj

# Integration Tests
dotnet test backend/services/AuthService/tests/AuthService.IntegrationTests/AuthService.IntegrationTests.csproj

# All AuthService Tests
dotnet test backend/services/AuthService/tests/
```

#### OrderService Tests

```powershell
# Unit Tests
dotnet test backend/services/OrderService/tests/OrderService.UnitTests/OrderService.UnitTests.csproj

# Integration Tests
dotnet test backend/services/OrderService/tests/OrderService.IntegrationTests/OrderService.IntegrationTests.csproj

# All OrderService Tests
dotnet test backend/services/OrderService/tests/
```

#### NotificationService Tests

```powershell
# Unit Tests
dotnet test backend/services/NotificationService/tests/NotificationService.UnitTests/NotificationService.UnitTests.csproj

# Integration Tests
dotnet test backend/services/NotificationService/tests/NotificationService.IntegrationTests/NotificationService.IntegrationTests.csproj

# All NotificationService Tests
dotnet test backend/services/NotificationService/tests/
```

#### ContentService Tests

```powershell
# Unit Tests
dotnet test backend/services/ContentService/tests/ContentService.UnitTests/ContentService.UnitTests.csproj

# Integration Tests
dotnet test backend/services/ContentService/tests/ContentService.IntegrationTests/ContentService.IntegrationTests.csproj

# All ContentService Tests
dotnet test backend/services/ContentService/tests/
```

### Test with Coverage

Generate code coverage reports:

```powershell
# Run tests with coverage collection
dotnet test AtYourDoorStep.sln --collect:"XPlat Code Coverage"

# Run specific service with coverage
dotnet test backend/services/AuthService/tests/AuthService.UnitTests/AuthService.UnitTests.csproj --collect:"XPlat Code Coverage"

# Generate coverage report (requires reportgenerator tool)
# Install: dotnet tool install -g dotnet-reportgenerator-globaltool
reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coveragereport" -reporttypes:Html

# Open coverage report
start coveragereport/index.html
```

### Watch Mode

Auto-run tests on file changes:

```powershell
# Watch all tests
dotnet watch test --project AtYourDoorStep.sln

# Watch specific service tests
dotnet watch test --project backend/services/AuthService/tests/AuthService.UnitTests/AuthService.UnitTests.csproj

# Watch with hot reload
dotnet watch test --project backend/services/OrderService/tests/OrderService.UnitTests/OrderService.UnitTests.csproj --hot-reload
```

### Filtering Tests

Run specific tests by name or category:

```powershell
# Run tests matching a filter
dotnet test --filter "FullyQualifiedName~AuthService"

# Run tests by display name
dotnet test --filter "DisplayName~Login"

# Run tests by class name
dotnet test --filter "ClassName=AuthServiceTests"

# Run tests by method name
dotnet test --filter "Method=Should_Return_Token_When_Valid_Credentials"

# Run tests by trait/category
dotnet test --filter "Category=Unit"
dotnet test --filter "Category=Integration"

# Combine filters
dotnet test --filter "FullyQualifiedName~AuthService&Category=Unit"
```

### Additional Test Options

```powershell
# Run tests in parallel
dotnet test --parallel

# Run tests without build
dotnet test --no-build

# Run tests with specific configuration
dotnet test --configuration Release

# Output test results to file
dotnet test --logger "trx;LogFileName=test_results.trx"

# Output test results as JUnit XML (for CI/CD)
dotnet test --logger "junit;LogFileName=test_results.xml"

# Fail fast - stop on first failure
dotnet test --blame-hang-timeout 60s
```

---

## ⚛️ Frontend (React) Testing

### Setup

Navigate to frontend directory and install dependencies:

```powershell
cd frontend
npm install
```

### Running Tests

> **Note:** The frontend currently uses Vite without a test runner configured. To add testing, install Vitest:

```powershell
# Install Vitest and testing utilities
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Add test script to package.json (if not present)
# "test": "vitest",
# "test:coverage": "vitest --coverage",
# "test:ui": "vitest --ui"
```

Once configured, run tests with:

```powershell
# Run tests once
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- src/hooks/useAuth.test.ts

# Run tests matching pattern
npm test -- --grep "useAuth"
```

### Code Quality Checks

These commands help ensure code quality (currently available):

```powershell
# ESLint - Check for code issues
npm run lint

# ESLint - Fix auto-fixable issues
npm run lint -- --fix

# Prettier - Format code
npm run format

# Prettier - Check formatting (no changes)
npm run format:check

# TypeScript - Type checking only
npx tsc --noEmit

# TypeScript - Type checking with watch
npx tsc --noEmit --watch

# RAG API Validation (project-specific)
npm run validate-rag

# Build with validation
npm run build-with-validation
```

### Recommended Test Structure

When adding tests, follow this structure:

```
frontend/
  src/
    hooks/
      useAuth.ts
      useAuth.test.ts      # Unit test for hook
    components/
      Button/
        Button.tsx
        Button.test.tsx    # Component test
    services/
      authService.ts
      authService.test.ts  # Service test
    __tests__/             # Integration tests
      App.test.tsx
```

---

## 📦 Test Frameworks & Libraries

### Backend Test Stack

| Package                                | Version | Purpose                      |
| -------------------------------------- | ------- | ---------------------------- |
| xUnit                                  | 2.6.2   | Test framework               |
| FluentAssertions                       | 6.12.0  | Fluent assertion library     |
| Moq                                    | 4.20.70 | Mocking framework            |
| coverlet.collector                     | 6.0.0   | Code coverage                |
| Microsoft.NET.Test.Sdk                 | 17.8.0  | Test SDK                     |
| Microsoft.AspNetCore.Mvc.Testing       | 8.0.11  | Integration testing          |
| Microsoft.EntityFrameworkCore.InMemory | 8.0.11  | In-memory database for tests |

### Frontend Test Stack (Recommended)

| Package                     | Purpose                     |
| --------------------------- | --------------------------- |
| Vitest                      | Test runner (Vite-native)   |
| @testing-library/react      | React component testing     |
| @testing-library/jest-dom   | DOM assertions              |
| @testing-library/user-event | User interaction simulation |
| jsdom                       | DOM environment             |

---

## 🚀 Quick Reference

### One-Liners

```powershell
# Run all backend tests
dotnet test AtYourDoorStep.sln

# Run all unit tests only
dotnet test AtYourDoorStep.sln --filter "FullyQualifiedName~UnitTests"

# Run all integration tests only
dotnet test AtYourDoorStep.sln --filter "FullyQualifiedName~IntegrationTests"

# Run frontend lint + type check
cd frontend; npm run lint; npx tsc --noEmit

# Full quality check (backend + frontend)
dotnet test AtYourDoorStep.sln; cd frontend; npm run lint; npm run format:check; npx tsc --noEmit
```

### CI/CD Ready Commands

```powershell
# Backend: Test with coverage and XML output
dotnet test AtYourDoorStep.sln --collect:"XPlat Code Coverage" --logger "trx" --results-directory ./TestResults

# Frontend: Lint and build
cd frontend; npm ci; npm run lint; npm run build
```

---

## 🔗 Related Documentation

- [COMMANDS.md](./COMMANDS.md) - General development commands
- [QUICKSTART.md](./QUICKSTART.md) - Getting started guide
- [BACKEND_IMPLEMENTATION_GUIDE.md](./BACKEND_IMPLEMENTATION_GUIDE.md) - Backend architecture details

---

**💡 Tip:** Run tests frequently during development to catch issues early!
