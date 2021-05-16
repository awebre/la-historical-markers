using System;
using System.IO;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using LaHistoricalMarkers.Config;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
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
        public async Task<UserReportResponse> Report(
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
            transaction.Commit();
            var userReport = new UserReportEmailPayload
            {
                MarkerId = report.MarkerId,
                Report = report.Report,
                Otp = otp
            };

            return new UserReportResponse
            {
                Response = req.CreateResponse(HttpStatusCode.OK),
                UserReport = userReport
            };
        }

        public class UserReportResponse
        {
            public HttpResponseData Response { get; set; }

            [QueueOutput("user-reports")]
            public UserReportEmailPayload UserReport { get; set; }
        }

        public class ReportDto
        {
            public int MarkerId { get; set; }

            public string Report { get; set; }
        }
    }
}