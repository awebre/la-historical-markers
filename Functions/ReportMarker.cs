using System.IO;
using System.Net;
using System.Text.Json;
using LaHistoricalMarkers.Config;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace LaHistoricalMarkers.Functions;

public class ReportMarker
{
    private readonly OtpAuthService authService;
    public ReportMarker(OtpAuthService authService)
    {
        this.authService = authService;
    }

    [Function("report-marker")]
    public UserReportResponse Report(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "markers/report")] HttpRequestData req,
        FunctionContext context)
    {
        using var streamReader = new StreamReader(req.Body);
        var str = streamReader.ReadToEnd();
        var report = JsonSerializer.Deserialize<UserReportDto>(str, DefaultJsonConfiguration.SerializerOptions);

        return new UserReportResponse
        {
            Response = req.CreateResponse(HttpStatusCode.OK),
            QueueMessage = report
        };
    }

    public class UserReportResponse
    {
        public HttpResponseData Response { get; set; }

        [QueueOutput(Queues.UserReportEmailQueue)]
        public UserReportDto QueueMessage { get; set; }
    }
}