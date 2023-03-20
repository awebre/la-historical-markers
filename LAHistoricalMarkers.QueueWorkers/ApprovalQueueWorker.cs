using Azure;
using Azure.Storage.Queues.Models;
using LaHistoricalMarkers.Core.Features.HostedServices;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;

namespace LAHistoricalMarkers.QueueWorkers;

public class ApprovalQueueWorker : QueueProcessingBackgroundService<PendingSubmissionDto>
{
    private readonly ModerationService moderationService;
    private readonly QueueService queueService;

    public ApprovalQueueWorker(
        ILogger<QueueProcessingBackgroundService<PendingSubmissionDto>> logger,
        QueueService queueService,
        ModerationService moderationService) : base(logger)
    {
        this.queueService = queueService;
        this.moderationService = moderationService;
    }
    public override string WorkerName => "Approval Queue";
    public override Task<Response<QueueMessage>> GetQueueMessage()
    {
        return queueService.DequeueApprovalEmailMessage();
    }
    public override Task ProcessQueueData(PendingSubmissionDto messageData)
    {
        return moderationService.SendApprovalEmail(messageData);
    }
    public override Task SendToPoisonQueue(PendingSubmissionDto messageData)
    {
        return queueService.EnqueueApprovalEmailMessage(messageData, true);
    }
}