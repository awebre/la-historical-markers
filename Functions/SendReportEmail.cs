using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using Microsoft.Azure.Functions.Worker;
using System.Threading.Tasks;

namespace LaHistoricalMarkers.Functions
{
    public class SendReport
    {
        private readonly ModerationService moderationService;

        public SendReport(ModerationService moderationService)
        {
            this.moderationService = moderationService;
        }

        [Function("send-report-email")]
        public async Task SendReportEmail([QueueTrigger(Queues.UserReportEmailQueue, Connection = "AzureWebJobsStorage")] UserReportDto reportDto,
            FunctionContext context)
        {
            await moderationService.SendUserReportEmail(reportDto);
        }
    }
}
