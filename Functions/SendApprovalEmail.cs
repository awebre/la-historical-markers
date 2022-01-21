using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace LaHistoricalMarkers.Functions;

public class SendApprovalEmail
{
    private readonly ModerationService moderationService;

    public SendApprovalEmail(ModerationService moderationService)
    {
        this.moderationService = moderationService;
    }

    [Function("approval-email")]
    public async Task Send([QueueTrigger(Queues.ApprovalEmailQueue, Connection = "AzureWebJobsStorage")] PendingSubmissionDto pending, FunctionContext context)
    {
        var logger = context.GetLogger("approval-email");

        await moderationService.SendApprovalEmail(pending);

        logger.LogInformation($"la-hm-approvals message proccessed:\nEmail sent.");
    }
}