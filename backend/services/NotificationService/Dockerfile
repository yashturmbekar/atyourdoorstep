# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy shared projects (4 levels up from Api folder = /shared/)
COPY ["backend/shared/Domain/Shared.Domain.csproj", "../shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "../shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "../shared/Infrastructure/"]

# Copy NotificationService projects
COPY ["backend/services/NotificationService/src/NotificationService.Domain/NotificationService.Domain.csproj", "NotificationService/src/NotificationService.Domain/"]
COPY ["backend/services/NotificationService/src/NotificationService.Application/NotificationService.Application.csproj", "NotificationService/src/NotificationService.Application/"]
COPY ["backend/services/NotificationService/src/NotificationService.Infrastructure/NotificationService.Infrastructure.csproj", "NotificationService/src/NotificationService.Infrastructure/"]
COPY ["backend/services/NotificationService/src/NotificationService.Api/NotificationService.Api.csproj", "NotificationService/src/NotificationService.Api/"]

# Restore dependencies
RUN dotnet restore "NotificationService/src/NotificationService.Api/NotificationService.Api.csproj"

# Copy source code
COPY backend/shared/ ../shared/
COPY backend/services/NotificationService/src/ ./NotificationService/src/

# Build
WORKDIR "/src/NotificationService/src/NotificationService.Api"
RUN dotnet build "NotificationService.Api.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
WORKDIR "/src/NotificationService/src/NotificationService.Api"
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

