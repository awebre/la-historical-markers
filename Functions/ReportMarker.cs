using System;
using System.IO;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using LaHistoricalMarkers.Config;
using LaHistoricalMarkers.Core.Features.Markers;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace LaHistoricalMarkers.Functions
{
    public class ReportMarker
    {
        private readonly MarkersService markersService;
        public ReportMarker(MarkersService markersService)
        {
            this.markersService = markersService;
        }

        [Function("report-marker")]
        public static async Task<HttpResponseData> Report(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "markers/report")] HttpRequestData req,
            FunctionContext context)
        {
            using var streamReader = new StreamReader(req.Body);
            var str = streamReader.ReadToEnd();
            var report = JsonSerializer.Deserialize<ReportDto>(str, DefaultJsonConfiguration.SerializerOptions);

            //TODO: make this use a dynamic template similar to approvals
            //then consolidate this api behind your own service for consistency
            var apiKey = Environment.GetEnvironmentVariable("SendGrid");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(Environment.GetEnvironmentVariable("FromEmail"), "LA Historical Markers Alert");
            var tos = Environment.GetEnvironmentVariable("ToEmails").Split(",");
            var message = new SendGridMessage();
            message.Subject = "User Report";
            message.PlainTextContent = $"The following marker was reported: {report.MarkerId}\n\nThe user reports:\n{report.Report}";
            message.SetFrom(from);
            foreach (var to in tos)
            {
                message.AddTo(to);
            }

            await client.SendEmailAsync(message);
            return req.CreateResponse(HttpStatusCode.OK);
        }

        public class ReportDto
        {
            public int MarkerId { get; set; }

            public string Report { get; set; }
        }
    }
}