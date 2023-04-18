using System;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.FileStorage;
using MediatR;
using Microsoft.Data.SqlClient;

namespace LaHistoricalMarkers.Core.Features.MarkerPhotos;

public class DeleteMarkerPhotoRequest : IRequest
{
    public Guid PhotoHandle { get; set; }
}

public class DeleteMarkerPhotoRequestHandler : IRequestHandler<DeleteMarkerPhotoRequest>
{
    private readonly IConnectionStringProvider connectionStringProvider;
    private readonly ImageStorageService imageStorageService;

    public DeleteMarkerPhotoRequestHandler(
        ImageStorageService imageStorageService,
        IConnectionStringProvider connectionStringProvider)
    {
        this.imageStorageService = imageStorageService;
        this.connectionStringProvider = connectionStringProvider;
    }

    public async Task Handle(DeleteMarkerPhotoRequest request, CancellationToken cancellationToken)
    {
        await imageStorageService.Delete(request.PhotoHandle);
        await using var connection = new SqlConnection(connectionStringProvider.GetConnectionString());
        await connection.OpenAsync(cancellationToken);
        await connection.ExecuteAsync(@"
DELETE FROM [dbo].[MarkerPhotos]
WHERE [FileGuid] = @fileGuid
", new { fileGuid = request.PhotoHandle });
    }
}