FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy shared projects to match relative paths (4 levels up from Api folder = /shared/)
COPY ["backend/shared/Domain/Shared.Domain.csproj", "../shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "../shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "../shared/Infrastructure/"]

# Copy AuthService projects
COPY ["backend/services/AuthService/src/AuthService.Domain/AuthService.Domain.csproj", "AuthService/src/AuthService.Domain/"]
COPY ["backend/services/AuthService/src/AuthService.Application/AuthService.Application.csproj", "AuthService/src/AuthService.Application/"]
COPY ["backend/services/AuthService/src/AuthService.Infrastructure/AuthService.Infrastructure.csproj", "AuthService/src/AuthService.Infrastructure/"]
COPY ["backend/services/AuthService/src/AuthService.Api/AuthService.Api.csproj", "AuthService/src/AuthService.Api/"]

# Restore dependencies
RUN dotnet restore "AuthService/src/AuthService.Api/AuthService.Api.csproj"

# Copy source code
COPY backend/shared/ ../shared/
COPY backend/services/AuthService/src/ ./AuthService/src/

# Build
WORKDIR "/src/AuthService/src/AuthService.Api"
RUN dotnet build "AuthService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/AuthService/src/AuthService.Api"
RUN dotnet publish "AuthService.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "AuthService.Api.dll"]

