using FastEndpoints;
using FluentValidation;
using LaHistoricalMarkers.Core.Features.FileStorage;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class SubmitMarker : PublicApiEndpoint<MarkerSubmissionRequest, PendingSubmissionDto>
{
    private readonly ImageStorageService imageStorageService;
    private readonly ILogger<SubmitMarker> logger;
    private readonly MarkersService markersService;
    private readonly QueueService queueService;
    public SubmitMarker(
        ImageStorageService imageStorageService,
        MarkersService markersService,
        QueueService queueService,
        ILogger<SubmitMarker> logger)
    {
        this.imageStorageService = imageStorageService;
        this.markersService = markersService;
        this.queueService = queueService;
        this.logger = logger;
    }

    public override void Configure()
    {
        Post("/markers");
        base.Configure();
    }

    public override async Task<PendingSubmissionDto> ExecuteAsync(MarkerSubmissionRequest req, CancellationToken ct)
    {
        string? fileHandle = null;
        if (!string.IsNullOrEmpty(req.Base64Image))
        {
            var fileBytes = Convert.FromBase64String(req.Base64Image);
            fileHandle = await imageStorageService.UploadFileAndGetHandle(fileBytes);
        }

        var pending = await markersService.AddMarkerSubmission(req, fileHandle);
        logger.LogInformation($"DeepLinkBaseUrl: {pending.DeepLinkBaseUrl}");
        await queueService.EnqueueApprovalEmailMessage(pending);

        return pending;
    }
}

public class MarkerSubmissionRequest : MarkerSubmissionDto
{
}

public class MarkerSubmissionValidator : Validator<MarkerSubmissionRequest>
{
    public MarkerSubmissionValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required");
    }
}