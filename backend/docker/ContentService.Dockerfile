FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5004

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["services/ContentService/src/ContentService.Domain/ContentService.Domain.csproj", "services/ContentService/src/ContentService.Domain/"]
COPY ["services/ContentService/src/ContentService.Application/ContentService.Application.csproj", "services/ContentService/src/ContentService.Application/"]
COPY ["services/ContentService/src/ContentService.Infrastructure/ContentService.Infrastructure.csproj", "services/ContentService/src/ContentService.Infrastructure/"]
COPY ["services/ContentService/src/ContentService.API/ContentService.API.csproj", "services/ContentService/src/ContentService.API/"]

# Restore dependencies
RUN dotnet restore "services/ContentService/src/ContentService.API/ContentService.API.csproj"

# Copy everything else
COPY . .

# Build
WORKDIR "/src/services/ContentService/src/ContentService.API"
RUN dotnet build "ContentService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ContentService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:5004

ENTRYPOINT ["dotnet", "ContentService.API.dll"]
