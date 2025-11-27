FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy shared projects
COPY ["backend/shared/Domain/Shared.Domain.csproj", "backend/shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "backend/shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "backend/shared/Infrastructure/"]

# Copy AuthService projects
COPY ["backend/services/AuthService/src/AuthService.Domain/AuthService.Domain.csproj", "backend/services/AuthService/src/AuthService.Domain/"]
COPY ["backend/services/AuthService/src/AuthService.Application/AuthService.Application.csproj", "backend/services/AuthService/src/AuthService.Application/"]
COPY ["backend/services/AuthService/src/AuthService.Infrastructure/AuthService.Infrastructure.csproj", "backend/services/AuthService/src/AuthService.Infrastructure/"]
COPY ["backend/services/AuthService/src/AuthService.Api/AuthService.Api.csproj", "backend/services/AuthService/src/AuthService.Api/"]

# Restore dependencies
RUN dotnet restore "backend/services/AuthService/src/AuthService.Api/AuthService.Api.csproj"

# Copy source code
COPY backend/shared/ ./backend/shared/
COPY backend/services/AuthService/src/ ./backend/services/AuthService/src/

# Build
WORKDIR "/src/backend/services/AuthService/src/AuthService.Api"
RUN dotnet build "AuthService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "AuthService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "AuthService.Api.dll"]

