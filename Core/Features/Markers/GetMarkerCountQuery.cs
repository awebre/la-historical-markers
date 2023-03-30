using System.Threading;
using System.Threading.Tasks;
using System.Transactions;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using MediatR;
using Microsoft.Data.SqlClient;

namespace LaHistoricalMarkers.Core.Features.Markers;

public class GetMarkerCountQuery : IRequest<int>
{
}

public class GetMarkerCountQueryHandler : IRequestHandler<GetMarkerCountQuery, int>
{
    private readonly IConnectionStringProvider connectionStringProvider;
    public GetMarkerCountQueryHandler(IConnectionStringProvider connectionStringProvider)
    {
        this.connectionStringProvider = connectionStringProvider;
    }

    public async Task<int> Handle(GetMarkerCountQuery request, CancellationToken cancellationToken)
    {
        await using var connection = new SqlConnection(connectionStringProvider.GetConnectionString());
        await connection.OpenAsync(cancellationToken);
        var count = await connection.ExecuteScalarAsync<int>(@"
SELECT COUNT(*) FROM [LaHistoricalMarkers].[dbo].[Marker]
WHERE [IsApproved] = 1
");

        return count;
    }
}