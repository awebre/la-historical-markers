using Dapper;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace LaHistoricalMarkers.Functions
{
    public class SendReport
    {
        [Function("send-report-email")]
        public async Task SendReportEmail([QueueTrigger("user-reports", Connection = "AzureWebJobsStorage")] UserReportEmailPayload payload,
            FunctionContext context)
        {
            //TODO: make this use a dynamic template similar to approvals
            //and add queue functionality
            var apiKey = Environment.GetEnvironmentVariable("SendGrid");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(Environment.GetEnvironmentVariable("FromEmail"), "LA Historical Markers Alert");
            var tos = Environment.GetEnvironmentVariable("ToEmails").Split(",");
            var message = new SendGridMessage();
            message.Subject = "User Report";
            message.PlainTextContent = $"The following marker was reported: {payload.MarkerId}\n\nThe user reports:\n{payload.Report}\n\nlahm://admin/marker/{payload.MarkerId}?otp={payload.Otp}";
            message.SetFrom(from);
            foreach (var to in tos)
            {
                message.AddTo(to);
            }

            await client.SendEmailAsync(message);
        }
    }
}
