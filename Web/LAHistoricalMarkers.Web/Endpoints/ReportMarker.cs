using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class ReportMarker : PublicApiEndpoint<UserReportDto, EmptyResponse>
{
    private readonly QueueService queueService;

    public ReportMarker(QueueService queueService)
    {
        this.queueService = queueService;

    }
    public override void Configure()
    {
        Post("markers/report");
        base.Configure();
    }

    public override async Task HandleAsync(UserReportDto req, CancellationToken ct)
    {
        await queueService.EnqueueUserReportEmailMessage(req);
    }
}