using LaHistoricalMarkers.Core.Features.HostedServices;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;

namespace LAHistoricalMarkers.QueueWorkers.Workers;

public class UserReportQueueWorker : QueueProcessingBackgroundService<UserReportDto>
{
    private readonly ModerationService moderationService;
    public UserReportQueueWorker(
        ModerationService moderationService,
        QueueService queueService,
        QueueSettings queueSettings,
        ILogger<QueueProcessingBackgroundService<UserReportDto>> logger) : base(queueService, logger)
    {
        this.moderationService = moderationService;
        QueueName = queueSettings.UserReportEmailQueue;
    }
    protected override string WorkerName => "User Report Email Worker";
    protected override Task<bool> ProcessQueueData(UserReportDto messageData)
    {
        return moderationService.SendUserReportEmail(messageData);
    }
}