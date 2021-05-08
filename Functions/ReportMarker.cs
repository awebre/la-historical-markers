using System;
using System.IO;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using LaHistoricalMarkers.Config;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Markers;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace LaHistoricalMarkers.Functions
{
    public class ReportMarker
    {
        private readonly OtpAuthService authService;
        public ReportMarker(OtpAuthService authService)
        {
            this.authService = authService;
        }

        [Function("report-marker")]
        public async Task<HttpResponseData> Report(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "markers/report")] HttpRequestData req,
            FunctionContext context)
        {
            using var streamReader = new StreamReader(req.Body);
            var str = streamReader.ReadToEnd();
            var report = JsonSerializer.Deserialize<ReportDto>(str, DefaultJsonConfiguration.SerializerOptions);
            using var connection = authService.GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            var otp = await authService.GetOtpForMarker(report.MarkerId, transaction);

            //TODO: make this use a dynamic template similar to approvals
            //and add queue functionality
            var apiKey = Environment.GetEnvironmentVariable("SendGrid");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(Environment.GetEnvironmentVariable("FromEmail"), "LA Historical Markers Alert");
            var tos = Environment.GetEnvironmentVariable("ToEmails").Split(",");
            var message = new SendGridMessage();
            message.Subject = "User Report";
            message.PlainTextContent = $"The following marker was reported: {report.MarkerId}\n\nThe user reports:\n{report.Report}\n\nlahm://admin/marker/{report.MarkerId}?otp={otp}";
            message.SetFrom(from);
            foreach (var to in tos)
            {
                message.AddTo(to);
            }

            await client.SendEmailAsync(message);
            transaction.Commit();
            return req.CreateResponse(HttpStatusCode.OK);
        }

        public class ReportDto
        {
            public int MarkerId { get; set; }

            public string Report { get; set; }
        }
    }
}