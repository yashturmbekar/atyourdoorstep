# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Stage 2: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy all project files
COPY ["src/OrderService/API/OrderService.API.csproj", "src/OrderService/API/"]
COPY ["src/OrderService/Infrastructure/OrderService.Infrastructure.csproj", "src/OrderService/Infrastructure/"]
COPY ["src/OrderService/Application/OrderService.Application.csproj", "src/OrderService/Application/"]
COPY ["src/OrderService/Domain/OrderService.Domain.csproj", "src/OrderService/Domain/"]
COPY ["src/Shared/Infrastructure/Shared.Infrastructure.csproj", "src/Shared/Infrastructure/"]
COPY ["src/Shared/Application/Shared.Application.csproj", "src/Shared/Application/"]
COPY ["src/Shared/Domain/Shared.Domain.csproj", "src/Shared/Domain/"]

# Restore dependencies
RUN dotnet restore "src/OrderService/API/OrderService.API.csproj"

# Copy all source code
COPY src/ ./src/

# Build the project
WORKDIR "/src/src/OrderService/API"
RUN dotnet build "OrderService.API.csproj" -c Release -o /app/build

# Stage 3: Publish stage
FROM build AS publish
RUN dotnet publish "OrderService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 4: Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "OrderService.API.dll"]
