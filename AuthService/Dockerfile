FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy shared projects from parent
COPY ["../Shared/Domain/Shared.Domain.csproj", "Shared/Domain/"]
COPY ["../Shared/Application/Shared.Application.csproj", "Shared/Application/"]
COPY ["../Shared/Infrastructure/Shared.Infrastructure.csproj", "Shared/Infrastructure/"]

# Copy AuthService projects
COPY ["src/AuthService.Domain/AuthService.Domain.csproj", "AuthService/Domain/"]
COPY ["src/AuthService.Application/AuthService.Application.csproj", "AuthService/Application/"]
COPY ["src/AuthService.Infrastructure/AuthService.Infrastructure.csproj", "AuthService/Infrastructure/"]
COPY ["src/AuthService.Api/AuthService.Api.csproj", "AuthService/Api/"]

# Restore dependencies
RUN dotnet restore "AuthService/Api/AuthService.Api.csproj"

# Copy source code
COPY ../Shared/ ./Shared/
COPY src/ ./AuthService/

# Build
WORKDIR "/src/AuthService/Api"
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
