using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Feedback;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class PostFeedback : PublicApiEndpoint<FeedbackRequest, EmptyResponse>
{
    private readonly QueueService queueService;
    private readonly QueueSettings queueSettings;

    public PostFeedback(QueueService queueService, QueueSettings queueSettings)
    {
        this.queueService = queueService;
        this.queueSettings = queueSettings;
    }

    public override void Configure()
    {
        Post("/feedback");
        base.Configure();
    }

    public override async Task HandleAsync(FeedbackRequest req, CancellationToken ct)
    {
        await queueService.SendMessage(req, queueSettings.UserFeedbackEmailQueue);
    }
}

public class FeedbackRequest : UserFeedbackDto
{
}