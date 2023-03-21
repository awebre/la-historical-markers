using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class ReportMarker : PublicApiEndpoint<UserReportDto, EmptyResponse>
{
    private readonly QueueService queueService;
    private readonly QueueSettings queueSettings;

    public ReportMarker(QueueService queueService, QueueSettings queueSettings)
    {
        this.queueService = queueService;
        this.queueSettings = queueSettings;

    }
    public override void Configure()
    {
        Post("markers/report");
        base.Configure();
    }

    public override async Task HandleAsync(UserReportDto req, CancellationToken ct)
    {
        await queueService.SendMessage(req, queueSettings.UserReportEmailQueue);
    }
}