FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["LAHistoricalMarkers.ApprovalQueue/LAHistoricalMarkers.ApprovalQueue.csproj", "LAHistoricalMarkers.ApprovalQueue/"]
RUN dotnet restore "LAHistoricalMarkers.ApprovalQueue/LAHistoricalMarkers.ApprovalQueue.csproj"
COPY . .
WORKDIR "/src/LAHistoricalMarkers.ApprovalQueue"
RUN dotnet build "LAHistoricalMarkers.ApprovalQueue.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LAHistoricalMarkers.ApprovalQueue.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LAHistoricalMarkers.ApprovalQueue.dll"]
