using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.MarkerPhotos;
using MediatR;
using Microsoft.Data.SqlClient;

namespace LaHistoricalMarkers.Core.Features.Markers;

public record GetMarkersByRegionRequest
    (RegionDto Region, UserLocationDto? UserLocation, MarkerType[]? TypeFilters) : IRequest<IEnumerable<MarkerDto>>
{
}

public class GetMarkersByRegionRequestHandler : IRequestHandler<GetMarkersByRegionRequest, IEnumerable<MarkerDto>>
{
    private readonly IConnectionStringProvider connectionStringProvider;

    private readonly IRequestHandler<GetMarkerPhotosByMarkerIdsQuery, List<MarkerPhotoDto>>
        handleMarkerPhotosRequest;

    public GetMarkersByRegionRequestHandler(IConnectionStringProvider connectionStringProvider,
        IRequestHandler<GetMarkerPhotosByMarkerIdsQuery, List<MarkerPhotoDto>> handleMarkerPhotosRequest)
    {
        this.connectionStringProvider = connectionStringProvider;
        this.handleMarkerPhotosRequest = handleMarkerPhotosRequest;
    }

    public async Task<IEnumerable<MarkerDto>> Handle(GetMarkersByRegionRequest request, CancellationToken token)
    {
        //If no type filters are supplied then we assume that an older
        //client is querying us (one that isn't filter-aware)
        var typeFilters = request.TypeFilters?.Any() ?? false ? request.TypeFilters : Enum.GetValues<MarkerType>();

        var latitude = request.Region.Latitude;
        var longitude = request.Region.Longitude;

        //deltas map to 1 degree and represent the total number of degree from edge to edge
        //so we can calculate the lat/long of various edges by adding/subtracting half the delta
        //Note: this is an assumption that SEEMS to work - it may need re-evaluation
        var longitudeDelta = request.Region.LongitudeDelta;
        var latitudeDelta = request.Region.LongitudeDelta;

        var topLat = (latitude + latitudeDelta / 2).ToString(CultureInfo.InvariantCulture);
        var bottomLat = (latitude - latitudeDelta / 2).ToString(CultureInfo.InvariantCulture);
        var leftLong = (longitude - longitudeDelta / 2).ToString(CultureInfo.InvariantCulture);
        var rightLong = (longitude + longitudeDelta / 2).ToString(CultureInfo.InvariantCulture);

        //user lat/long are used to calculate distance
        //if no user lat/long is supplied, we'll use the center of the map
        var userLatitude = request.UserLocation?.Latitude ?? latitude;
        var userLongitude = request.UserLocation?.Longitude ?? longitude;

        await using var connection = new SqlConnection(connectionStringProvider.GetConnectionString());
        await connection.OpenAsync(token);
        var markers = (await connection.QueryAsync<MarkerDto>(@"
            SELECT TOP (1000) [Id]
                ,[Name]
                ,[Description]
                ,[Location].[Lat] AS [Latitude]
                ,[Location].[Long] AS [Longitude]
                ,[ImageFileName]
                ,[IsApproved]
                ,[CreatedTimestamp]
                ,GEOGRAPHY::Point(@userLatitude, @userLongitude, 4326).STDistance([Location]) AS Distance
                ,[Type]
            FROM [Marker]
            WHERE GEOGRAPHY::STPolyFromText('Polygon(( ' + @rightLong + ' ' + @bottomLat + ', ' + @rightLong + ' ' + @topLat + ', ' + @leftLong + ' ' + @topLat + ', ' + @leftLong + ' ' + @bottomLat + ', ' + @rightLong + ' ' + @bottomLat + '))', 4326).STIntersects([Location]) = 1
            AND [Type] IN @typeFilters
            AND [IsApproved] = 1
            ORDER BY Distance",
            new
            {
                latitude,
                longitude,
                topLat,
                bottomLat,
                leftLong,
                rightLong,
                userLatitude,
                userLongitude,
                typeFilters = typeFilters.Select(x => x.ToString())
            })).ToList();


        var markerIds = markers.Select(x => x.Id).ToList();
        var photos = await handleMarkerPhotosRequest.Handle(new GetMarkerPhotosByMarkerIdsQuery(markerIds), token);
        var photosById = photos.GroupBy(x => x.MarkerId).ToList();
        foreach (var marker in markers)
        {
            marker.Photos = photosById.FirstOrDefault(x => x.Key == marker.Id)?.ToList() ?? new List<MarkerPhotoDto>();
        }

        return markers;
    }
}