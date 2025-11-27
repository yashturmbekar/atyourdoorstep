# Stage 1: Base runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Stage 2: Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy Shared projects from parent
COPY ["../Shared/Domain/Shared.Domain.csproj", "Shared/Domain/"]
COPY ["../Shared/Application/Shared.Application.csproj", "Shared/Application/"]
COPY ["../Shared/Infrastructure/Shared.Infrastructure.csproj", "Shared/Infrastructure/"]

# Copy OrderService project files
COPY ["src/OrderService.Api/OrderService.Api.csproj", "OrderService/Api/"]
COPY ["src/OrderService.Infrastructure/OrderService.Infrastructure.csproj", "OrderService/Infrastructure/"]
COPY ["src/OrderService.Application/OrderService.Application.csproj", "OrderService/Application/"]
COPY ["src/OrderService.Domain/OrderService.Domain.csproj", "OrderService/Domain/"]

# Restore dependencies
RUN dotnet restore "OrderService/Api/OrderService.Api.csproj"

# Copy all source code
COPY ../Shared/ ./Shared/
COPY src/ ./OrderService/

# Build the project
WORKDIR "/src/OrderService/Api"
RUN dotnet build "OrderService.Api.csproj" -c Release -o /app/build

# Stage 3: Publish stage
FROM build AS publish
RUN dotnet publish "OrderService.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 4: Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "OrderService.Api.dll"]
