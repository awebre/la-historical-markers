using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using MediatR;
using Microsoft.Data.SqlClient;

namespace LaHistoricalMarkers.Core.Features.Markers;

public class GetMarkerByIdRequest : IRequest<MarkerDto>
{
    public int Id { get; set; }
}

public class GetMarkerByIdRequestHandler : IRequestHandler<GetMarkerByIdRequest, MarkerDto>
{
    private readonly IConnectionStringProvider connectionStringProvider;

    public GetMarkerByIdRequestHandler(IConnectionStringProvider connectionStringProvider)
    {
        this.connectionStringProvider = connectionStringProvider;
    }

    public async Task<MarkerDto> Handle(GetMarkerByIdRequest request, CancellationToken cancellationToken)
    {
        await using var connection = new SqlConnection(connectionStringProvider.GetConnectionString());
        await connection.OpenAsync(cancellationToken);
        var marker = await connection.QuerySingleAsync<MarkerDto>(@"
            SELECT TOP (1) [Id]
                ,[Name]
                ,[Description]
                ,[Location].[Lat] AS [Latitude]
                ,[Location].[Long] AS [Longitude]
                ,[ImageFileName]
                ,[IsApproved]
                ,[CreatedTimestamp]
                ,[Type]
            FROM [Marker]
            WHERE [Id] = @id
            ", new { id = request.Id });

        marker.Photos = (await connection.QueryAsync<MarkerPhotoDto>(@"
SELECT [FileGuid], [MarkerId] FROM [MarkerPhotos]
WHERE [MarkerId] = @markerId
", new { markerId = request.Id })).ToList();

        return marker;
    }
}