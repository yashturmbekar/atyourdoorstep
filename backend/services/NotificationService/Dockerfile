# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy shared projects
COPY ["backend/shared/Domain/Shared.Domain.csproj", "backend/shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "backend/shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "backend/shared/Infrastructure/"]

# Copy NotificationService projects
COPY ["backend/services/NotificationService/src/NotificationService.Domain/NotificationService.Domain.csproj", "backend/services/NotificationService/src/NotificationService.Domain/"]
COPY ["backend/services/NotificationService/src/NotificationService.Application/NotificationService.Application.csproj", "backend/services/NotificationService/src/NotificationService.Application/"]
COPY ["backend/services/NotificationService/src/NotificationService.Infrastructure/NotificationService.Infrastructure.csproj", "backend/services/NotificationService/src/NotificationService.Infrastructure/"]
COPY ["backend/services/NotificationService/src/NotificationService.Api/NotificationService.Api.csproj", "backend/services/NotificationService/src/NotificationService.Api/"]

# Restore dependencies
RUN dotnet restore "backend/services/NotificationService/src/NotificationService.Api/NotificationService.Api.csproj"

# Copy source code
COPY backend/shared/ ./backend/shared/
COPY backend/services/NotificationService/src/ ./backend/services/NotificationService/src/

# Build
WORKDIR "/src/backend/services/NotificationService/src/NotificationService.Api"
RUN dotnet build "NotificationService.Api.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "NotificationService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# Create logs directory
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.Api.dll"]

