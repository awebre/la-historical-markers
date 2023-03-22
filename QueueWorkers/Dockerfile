FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["./QueueWorkers/LAHistoricalMarkers.QueueWorkers.csproj", "QueueWorkers/"]
RUN dotnet restore "QueueWorkers/LAHistoricalMarkers.QueueWorkers.csproj"
COPY . .
WORKDIR "/src/QueueWorkers"
RUN dotnet build "LAHistoricalMarkers.QueueWorkers.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LAHistoricalMarkers.QueueWorkers.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LAHistoricalMarkers.QueueWorkers.dll"]
