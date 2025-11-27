FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy shared projects
COPY ["src/Shared/Domain/Shared.Domain.csproj", "Shared/Domain/"]
COPY ["src/Shared/Application/Shared.Application.csproj", "Shared/Application/"]
COPY ["src/Shared/Infrastructure/Shared.Infrastructure.csproj", "Shared/Infrastructure/"]

# Copy AuthService projects
COPY ["src/AuthService/Domain/AuthService.Domain.csproj", "AuthService/Domain/"]
COPY ["src/AuthService/Application/AuthService.Application.csproj", "AuthService/Application/"]
COPY ["src/AuthService/Infrastructure/AuthService.Infrastructure.csproj", "AuthService/Infrastructure/"]
COPY ["src/AuthService/API/AuthService.API.csproj", "AuthService/API/"]

# Restore dependencies
RUN dotnet restore "AuthService/API/AuthService.API.csproj"

# Copy source code
COPY src/ .

# Build
WORKDIR "/src/AuthService/API"
RUN dotnet build "AuthService.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "AuthService.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "AuthService.API.dll"]
