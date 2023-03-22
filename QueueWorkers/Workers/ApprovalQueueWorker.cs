using LaHistoricalMarkers.Core.Features.HostedServices;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;

namespace LAHistoricalMarkers.QueueWorkers.Workers;

public class ApprovalQueueWorker : QueueProcessingBackgroundService<PendingSubmissionDto>
{
    private readonly ILogger<QueueProcessingBackgroundService<PendingSubmissionDto>> logger;
    private readonly ModerationService moderationService;

    public ApprovalQueueWorker(
        ILogger<QueueProcessingBackgroundService<PendingSubmissionDto>> logger,
        QueueSettings queueSettings,
        QueueService queueService,
        ModerationService moderationService) : base(queueService, logger)
    {
        this.logger = logger;
        this.moderationService = moderationService;
        QueueName = queueSettings.ApprovalEmailQueue;
    }

    protected override string WorkerName => "Approval Email Worker";
    protected override async Task<bool> ProcessQueueData(PendingSubmissionDto messageData)
    {
        logger.LogInformation("{name}: sending approval email...", WorkerName);
        var result = await moderationService.SendApprovalEmail(messageData);
        if (result)
        {
            logger.LogInformation("{name}: approval email sent at {time}", WorkerName, DateTimeOffset.UtcNow);
        }
        else
        {
            logger.LogError("{name}: failed to send approval email", WorkerName);
        }

        return result;
    }
}