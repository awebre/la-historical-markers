using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.MarkerPhotos;
using MediatR;
using Microsoft.Data.SqlClient;

namespace LaHistoricalMarkers.Core.Features.Markers;

public record GetMarkerTextSearchRequest(string? Search, UserLocationDto? UserLocation)
    : IRequest<IEnumerable<MarkerDto>>;

public class GetMarkerTextSearchRequestHandler : IRequestHandler<GetMarkerTextSearchRequest, IEnumerable<MarkerDto>>
{
    private readonly IConnectionStringProvider connectionStringProvider;

    private readonly IRequestHandler<GetMarkerPhotosByMarkerIdsQuery, List<MarkerPhotoDto>>
        handleMarkerPhotosRequest;

    public GetMarkerTextSearchRequestHandler(IConnectionStringProvider connectionStringProvider,
        IRequestHandler<GetMarkerPhotosByMarkerIdsQuery, List<MarkerPhotoDto>> handleMarkerPhotosRequest)
    {
        this.connectionStringProvider = connectionStringProvider;
        this.handleMarkerPhotosRequest = handleMarkerPhotosRequest;
    }

    public async Task<IEnumerable<MarkerDto>> Handle(GetMarkerTextSearchRequest request, CancellationToken token)
    {
        await using var connection = new SqlConnection(connectionStringProvider.GetConnectionString());
        await connection.OpenAsync(token);
        var markers = (await connection.QueryAsync<MarkerDto>(@"
            SELECT TOP (50)
                 [Id]
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
            WHERE [IsApproved] = 1 AND ([Name] LIKE @search OR [Description] LIKE @search)
            ORDER BY Distance",
            new
            {
                search = $"%{request.Search}%",
                userLatitude = request.UserLocation?.Latitude,
                userLongitude = request.UserLocation?.Longitude
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