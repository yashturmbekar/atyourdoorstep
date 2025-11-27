FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy shared projects
COPY ["backend/shared/Domain/Shared.Domain.csproj", "Shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "Shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "Shared/Infrastructure/"]

# Copy AuthService projects
COPY ["backend/services/AuthService/src/AuthService.Domain/AuthService.Domain.csproj", "AuthService/Domain/"]
COPY ["backend/services/AuthService/src/AuthService.Application/AuthService.Application.csproj", "AuthService/Application/"]
COPY ["backend/services/AuthService/src/AuthService.Infrastructure/AuthService.Infrastructure.csproj", "AuthService/Infrastructure/"]
COPY ["backend/services/AuthService/src/AuthService.Api/AuthService.Api.csproj", "AuthService/Api/"]

# Restore dependencies
RUN dotnet restore "AuthService/Api/AuthService.Api.csproj"

# Copy source code
COPY backend/shared/ ./Shared/
COPY backend/services/AuthService/src/ ./AuthService/src/

# Build
WORKDIR "/src/AuthService/src/AuthService.Api"
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

