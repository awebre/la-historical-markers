using LaHistoricalMarkers.Core.Features.Feedback;
using LaHistoricalMarkers.Core.Features.HostedServices;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;

namespace LAHistoricalMarkers.QueueWorkers.Workers;

public class UserFeedbackQueueWorker : QueueProcessingBackgroundService<UserFeedbackDto>
{
    private readonly UserFeedbackService feedbackService;
    public UserFeedbackQueueWorker(
        UserFeedbackService feedbackService,
        QueueService queueService,
        QueueSettings queueSettings,
        ILogger<QueueProcessingBackgroundService<UserFeedbackDto>> logger) : base(queueService, logger)
    {
        this.feedbackService = feedbackService;
        QueueName = queueSettings.UserFeedbackEmailQueue;
    }
    protected override string WorkerName => "User Feedback Email Worker";
    protected override Task<bool> ProcessQueueData(UserFeedbackDto messageData)
    {
        return feedbackService.SendFeedbackEmail(messageData);
    }
}