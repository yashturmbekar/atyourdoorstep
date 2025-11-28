FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy shared projects to match relative paths (4 levels up from API folder = /shared/)
COPY ["backend/shared/Domain/Shared.Domain.csproj", "../shared/Domain/"]
COPY ["backend/shared/Application/Shared.Application.csproj", "../shared/Application/"]
COPY ["backend/shared/Infrastructure/Shared.Infrastructure.csproj", "../shared/Infrastructure/"]

# Copy ContentService projects
COPY ["backend/services/ContentService/src/ContentService.Domain/ContentService.Domain.csproj", "ContentService/src/ContentService.Domain/"]
COPY ["backend/services/ContentService/src/ContentService.Application/ContentService.Application.csproj", "ContentService/src/ContentService.Application/"]
COPY ["backend/services/ContentService/src/ContentService.Infrastructure/ContentService.Infrastructure.csproj", "ContentService/src/ContentService.Infrastructure/"]
COPY ["backend/services/ContentService/src/ContentService.API/ContentService.API.csproj", "ContentService/src/ContentService.API/"]

# Restore dependencies
RUN dotnet restore "ContentService/src/ContentService.API/ContentService.API.csproj"

# Copy source code
COPY backend/shared/ ../shared/
COPY backend/services/ContentService/src/ ./ContentService/src/

# Build
WORKDIR "/src/ContentService/src/ContentService.API"
RUN dotnet build "ContentService.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR "/src/ContentService/src/ContentService.API"
RUN dotnet publish "ContentService.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENTRYPOINT ["dotnet", "ContentService.API.dll"]
