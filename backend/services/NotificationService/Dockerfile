# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy shared projects
COPY ["backend/shared/Domain/Shared.Domain.csproj", "Shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "Shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "Shared/Infrastructure/"]

# Copy NotificationService projects
COPY ["backend/services/NotificationService/src/NotificationService.Domain/NotificationService.Domain.csproj", "NotificationService/Domain/"]
COPY ["backend/services/NotificationService/src/NotificationService.Application/NotificationService.Application.csproj", "NotificationService/Application/"]
COPY ["backend/services/NotificationService/src/NotificationService.Infrastructure/NotificationService.Infrastructure.csproj", "NotificationService/Infrastructure/"]
COPY ["backend/services/NotificationService/src/NotificationService.Api/NotificationService.Api.csproj", "NotificationService/Api/"]

# Restore dependencies
RUN dotnet restore "NotificationService/Api/NotificationService.Api.csproj"

# Copy source code
COPY backend/shared/ ./Shared/
COPY backend/services/NotificationService/src/ ./NotificationService/src/

# Build
WORKDIR "/src/NotificationService/src/NotificationService.Api"
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

