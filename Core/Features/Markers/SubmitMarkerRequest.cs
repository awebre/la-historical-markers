using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.FileStorage;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace LaHistoricalMarkers.Core.Features.Markers;

public class SubmitMarkerRequest : MarkerSubmissionDto, IRequest<PendingSubmissionDto>
{
    public List<Guid> ImageGuids { get; set; }
}

public class SubmitMarkerRequestHandler : IRequestHandler<SubmitMarkerRequest, PendingSubmissionDto>
{
    private readonly IConnectionStringProvider connectionStringProvider;
    private readonly ImageStorageService imageStorageService;
    private readonly ILogger<SubmitMarkerRequest> logger;
    private readonly QueueService queueService;
    private readonly QueueSettings queueSettings;

    public SubmitMarkerRequestHandler(
        ImageStorageService imageStorageService,
        IConnectionStringProvider connectionStringProvider,
        QueueService queueService,
        QueueSettings queueSettings,
        ILogger<SubmitMarkerRequest> logger)
    {
        this.imageStorageService = imageStorageService;
        this.connectionStringProvider = connectionStringProvider;
        this.queueService = queueService;
        this.queueSettings = queueSettings;
        this.logger = logger;
    }

    public async Task<PendingSubmissionDto> Handle(SubmitMarkerRequest request, CancellationToken cancellationToken)
    {
        string fileHandle = null;
        if (!string.IsNullOrEmpty(request.Base64Image))
        {
            var fileBytes = Convert.FromBase64String(request.Base64Image);
            fileHandle = await imageStorageService.UploadFileAndGetHandle(fileBytes);
        }
        else
        {
            var fileGuid = request.ImageGuids.FirstOrDefault();
            fileHandle = fileGuid == Guid.Empty ? null : $"{fileGuid.ToString()}.png";
        }

        await using var connection = new SqlConnection(connectionStringProvider.GetConnectionString());
        var id = await connection.QuerySingleAsync<int>(@"
            INSERT INTO [Marker] (
                [Name], 
                [Description], 
                [Location], 
                [IsApproved], 
                [CreatedTimestamp],
                [ImageFileName],
                [Type]
            )
            OUTPUT INSERTED.Id
            VALUES (
                @name,
                @description,
                GEOGRAPHY::Point(@latitude, @longitude, 4326),
                0,
                SYSDATETIMEOFFSET(),
                @imageFileName,
                @type
            )",
            new
            {
                name = request.Name,
                description = request.Description,
                latitude = request.Latitude,
                longitude = request.Longitude,
                imageFileName = fileHandle,
                type = request.Type.ToString()
            });

        foreach (var guid in request.ImageGuids)
        {
            await connection.ExecuteAsync(@"
INSERT INTO [dbo].[MarkerPhotos] (FileGuid, MarkerId)
VALUES (@fileGuid, @markerId)
", new { fileGuid = guid, markerId = id });
        }

        var pending = new PendingSubmissionDto
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ImageFileName = fileHandle,
            DeepLinkBaseUrl = request.DeepLinkBaseUrl,
            Type = request.Type.ToString()
        };

        logger.LogInformation($"DeepLinkBaseUrl: {pending.DeepLinkBaseUrl}");
        await queueService.SendMessage(pending, queueSettings.ApprovalEmailQueue);

        return pending;
    }
}