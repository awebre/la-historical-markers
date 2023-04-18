using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Markers;
using MediatR;
using Microsoft.Data.SqlClient;

namespace LaHistoricalMarkers.Core.Features.MarkerPhotos;

public record GetMarkerPhotosByMarkerIdsQuery(IList<int> MarkerIds) : IRequest<List<MarkerPhotoDto>>;

public class GetMarkerPhotosByMarkerIdsQueryHandler
    : IRequestHandler<GetMarkerPhotosByMarkerIdsQuery, List<MarkerPhotoDto>>
{
    private readonly IConnectionStringProvider sqlConnectionStringProvider;

    public GetMarkerPhotosByMarkerIdsQueryHandler(IConnectionStringProvider sqlConnectionStringProvider)
    {
        this.sqlConnectionStringProvider = sqlConnectionStringProvider;
    }

    public async Task<List<MarkerPhotoDto>> Handle(GetMarkerPhotosByMarkerIdsQuery request, CancellationToken ct)
    {
        await using var connection = new SqlConnection(sqlConnectionStringProvider.GetConnectionString());
        await connection.OpenAsync(ct);
        return (await connection.QueryAsync<MarkerPhotoDto>(@"
SELECT [FileGuid], [MarkerId] FROM [MarkerPhotos]
WHERE [MarkerId] IN @markerIds
", new { markerIds = request.MarkerIds })).ToList();
    }
}