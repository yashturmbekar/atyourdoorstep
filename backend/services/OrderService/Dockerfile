# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Stage 2: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy Shared projects
COPY ["backend/shared/Domain/Shared.Domain.csproj", "backend/shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "backend/shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "backend/shared/Infrastructure/"]

# Copy OrderService project files
COPY ["backend/services/OrderService/src/OrderService.Domain/OrderService.Domain.csproj", "backend/services/OrderService/src/OrderService.Domain/"]
COPY ["backend/services/OrderService/src/OrderService.Application/OrderService.Application.csproj", "backend/services/OrderService/src/OrderService.Application/"]
COPY ["backend/services/OrderService/src/OrderService.Infrastructure/OrderService.Infrastructure.csproj", "backend/services/OrderService/src/OrderService.Infrastructure/"]
COPY ["backend/services/OrderService/src/OrderService.Api/OrderService.Api.csproj", "backend/services/OrderService/src/OrderService.Api/"]

# Restore dependencies
RUN dotnet restore "backend/services/OrderService/src/OrderService.Api/OrderService.Api.csproj"

# Copy all source code
COPY backend/shared/ ./backend/shared/
COPY backend/services/OrderService/src/ ./backend/services/OrderService/src/

# Build the project
WORKDIR "/src/backend/services/OrderService/src/OrderService.Api"
RUN dotnet build "OrderService.Api.csproj" -c Release -o /app/build

# Stage 3: Publish stage
FROM build AS publish
WORKDIR "/src/backend/services/OrderService/src/OrderService.Api"
RUN dotnet publish "OrderService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 4: Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "OrderService.Api.dll"]

