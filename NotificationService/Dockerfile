# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["AtYourDoorStep.sln", "."]
COPY ["src/Shared/Domain/Shared.Domain.csproj", "src/Shared/Domain/"]
COPY ["src/Shared/Application/Shared.Application.csproj", "src/Shared/Application/"]
COPY ["src/Shared/Infrastructure/Shared.Infrastructure.csproj", "src/Shared/Infrastructure/"]
COPY ["src/NotificationService/Domain/NotificationService.Domain.csproj", "src/NotificationService/Domain/"]
COPY ["src/NotificationService/Application/NotificationService.Application.csproj", "src/NotificationService/Application/"]
COPY ["src/NotificationService/Infrastructure/NotificationService.Infrastructure.csproj", "src/NotificationService/Infrastructure/"]
COPY ["src/NotificationService/API/NotificationService.API.csproj", "src/NotificationService/API/"]

# Restore dependencies
RUN dotnet restore "src/NotificationService/API/NotificationService.API.csproj"

# Copy source code
COPY src/Shared/ src/Shared/
COPY src/NotificationService/ src/NotificationService/

# Build
WORKDIR "/src/src/NotificationService/API"
RUN dotnet build "NotificationService.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "NotificationService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

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
