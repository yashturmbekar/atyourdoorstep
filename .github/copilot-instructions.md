# GitHub Copilot — Global Project Instructions  
These instructions apply to the entire project.  
You (Copilot) are a senior full-stack engineer generating production-grade code for a system built with:

- **Backend:** .NET 8 Web API (Clean Architecture + DDD + Microservices Ready)
- **Database:** PostgreSQL (EF Core)
- **Frontend:** React + TypeScript (Vite)
- **Messaging (optional):** RabbitMQ
- **Logging:** Serilog
- **Auth:** JWT + Refresh Token
- **Infra:** Docker + Docker Compose
- **Testing:** xUnit (backend), Vitest/RTL (frontend)

You MUST follow all rules below when generating or modifying code.

---

# 1. GENERAL BEHAVIOR RULES

- Always generate **full files**, not partial snippets.
- Always use **clean, maintainable, scalable, production-quality** code.
- Use **SOLID principles** everywhere.
- Prefer **clarity over cleverness**.
- Never include secrets—use environment variables.
- Always follow **Clean Architecture** and **folder structure** rules defined below.
- All timestamps must be **UTC ISO 8601**.
- Always update or instruct to update `progress.md` after major changes.
- When scaffolding a new feature, include:
  - Commands required
  - Required config values
  - Required tests

---

# 2. BACKEND (.NET 8) STANDARDS

## 2.1 Architecture (MANDATORY)
Each service must follow:

```
src/<ServiceName>/
  API/
    Controllers/
    Middlewares/
    Configurations/
    Extensions/
    DTOs/
    Program.cs
  Application/
    Interfaces/
    Services/
    Features/
    Validators/
    Mappings/
    DTOs/
  Domain/
    Entities/
    Enums/
    ValueObjects/
    Exceptions/
  Infrastructure/
    Persistence/
      Contexts/
      Migrations/
      Repositories/
    Services/
    Logging/
  Tests/
    Unit/
    Integration/
```

## 2.2 Entities
All domain entities MUST inherit:

```csharp
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
```

- Table names + columns MUST be **snake_case**.

## 2.3 EF Core & Database
- Use EF Core Code-First.
- Use PostgreSQL provider.
- Use naming convention conversion in `OnModelCreating`.
- All DB queries must be **async**.

## 2.4 Patterns Required
- MediatR for use cases.
- FluentValidation for request validation.
- AutoMapper for DTO → Entity mapping.
- Repository Pattern + Unit of Work (or DbContext as UoW).
- Controllers contain **zero business logic**.

## 2.5 API Response Envelope
All endpoints MUST return:

```json
{
  "success": true,
  "message": "optional",
  "data": {}
}
```

Implement `ApiResponse<T>` class and use everywhere.

## 2.6 Logging
- Use Serilog.
- Use at least:
  - Console sink
  - Rolling file sink
- Prohibit logging secrets or tokens.

## 2.7 Error Handling
- Use Global Exception Middleware.
- Return ProblemDetails with safe error messages.
- Never return stack traces.

## 2.8 Authentication
- JWT Access Token + Refresh Token.
- Refresh tokens stored hashed.
- Include roles (Admin, Manager, User).
- Tokens must NOT be logged.

## 2.9 Background Jobs
- Use `IHostedService` unless user specifies Hangfire.
- Never block threads; always async.

## 2.10 Health Checks
- Provide `/health` and `/health/ready`.

---

# 3. FRONTEND (React + TypeScript) STANDARDS

## 3.1 Folder Structure (MANDATORY)

```
frontend/
  public/
    sw.js
  src/
    api/
      apiClient.ts
      endpoints.ts
    components/
      ui/
      layout/
    hooks/
    pages/
    routes/
    services/
      authService.ts
      notificationService.ts
    stores/
    types/
    utils/
    App.tsx
    main.tsx
```

## 3.2 TypeScript
- Use **strict mode**.
- Never use `any` (use `unknown` and narrow).
- Provide interfaces/types for all API responses.

## 3.3 API Client Rules
`apiClient.ts` must:

- Use axios instance.
- Base URL from `import.meta.env.VITE_API_BASE_URL`.
- Attach auth headers via interceptor.
- Refresh tokens on 401 (one-time retry lock).
- Normalize error responses.

## 3.4 Authentication UI
- Must support login, register, logout.
- Tokens stored in **httpOnly cookies** if possible, otherwise secure storage.
- Auto-refresh token in background.

## 3.5 React Query
- All server-side state MUST use React Query.
- Implement optimistic updates where safe.

## 3.6 Zustand/Redux
- Use Zustand for UI-local state unless global complexity demands Redux Toolkit.

## 3.7 UI/UX Rules
- Use reusable components.
- Show skeleton loaders.
- Use accessible components (aria attributes).
- Responsive-first design.

## 3.8 Notifications
Implement:
- `notificationService.subscribe()`
- VAPID public key usage
- Save subscription → backend endpoint `/api/notifications/subscribe`
- `public/sw.js` to handle push events

## 3.9 Testing
- Use Vitest or Jest + React Testing Library.
- Include unit test skeletons for every core hook or service.

---

# 4. API DESIGN RULES

## 4.1 Pagination
Responses must follow:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 120
  }
}
```

## 4.2 Status Codes
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Server Error

## 4.3 Validation
- Use FluentValidation for every request model.
- Validation errors MUST return:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Field X is required", ...]
}
```

---

# 5. DOCKER RULES
Each backend service must include:

```
dockerfile
docker-compose override (if needed)
```

Frontend must have its own Dockerfile using NGINX or Vite preview.

---

# 6. CI/CD RULES
Copilot must generate minimal GitHub Actions:

- Build + Test .NET
- Build + Test frontend
- Lint
- Optional Docker build step

Never commit secrets in workflows.

---

# 7. NAMING CONVENTIONS

## Backend
- Files: PascalCase
- Interfaces: INameService
- Entities: PascalCase
- DTOs: SomethingRequestDto / SomethingResponseDto

## Frontend
- Components: PascalCase.tsx
- Hooks: useSomething.ts
- Stores: something.store.ts
- Types: SomethingType.ts

---

# 8. PROGRESS DOCUMENTATION

Copilot MUST append entries to `progress.md` in this format:

```
## [YYYY-MM-DD] — Feature/Change Title
- Added:
  - File paths...
- Modified:
  - File paths...
- Commands:
  dotnet ef database update ...
- Notes:
  Anything important...
```

---

# 9. PR TEMPLATE (Copilot should create one automatically)

- [ ] Code follows instruction file
- [ ] Tests added/updated
- [ ] progress.md updated
- [ ] No secrets committed
- [ ] Swagger updated (if API changed)
- [ ] Lint check passed
- [ ] Build + Test pipeline passed

---

# 10. WHEN TO ASK FOR CLARIFICATION
Copilot must ask only when:

- A decision affects architecture (Hangfire vs hosted service)
- Choosing between AWS / Azure / other for deployment
- Picking messaging system (RabbitMQ vs Kafka)

Otherwise choose safe defaults.

---

# 11. NEVER DO THIS
- Never return EF entities from controller.
- Never write business logic inside controllers.
- Never skip validation.
- Never use `Thread.Sleep`.
- Never log passwords/tokens.
- Never store tokens in localStorage unless unavoidable.
- Never commit secrets.

---

# 12. ALWAYS DO THIS
- Always use async/await.
- Always use cancellation tokens.
- Always use DI, never statics for services.
- Always ensure DTO → Entity mapping via AutoMapper.
- Always include tests for application/services.
- Always update `progress.md` on major changes.

---

# 13. DEFAULT TEMPLATES COPILOT MUST USE
When creating new files, Copilot must automatically generate:

- `ApiResponse<T>.cs`
- `RequestLoggingMiddleware.cs`
- `BaseEntity.cs`
- `AppDbContext.cs`
- `RepositoryBase.cs` + interfaces
- Controller with async endpoints
- Swagger comments
- Migration instructions
- Frontend:
  - `apiClient.ts`
  - `useAuth.ts`
  - `notificationService.ts`
  - `sw.js`
  - React Query integration

Each must be **full, compilable, and production-ready**.

---

# END OF INSTRUCTION FILE
Copilot must follow all sections strictly for all future work in this repository.
