using System;
using Azure.Core;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using System.Net;
using System.Text.Json;
using System.Web;
using System.IO;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using LaHistoricalMarkers.Config;
using SendGrid;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Functions.Extensions;
using LaHistoricalMarkers.Core.Features.FileStorage;

namespace LaHistoricalMarkers.Functions
{
    public class Markers
    {
        private readonly MarkersService markersService;
        private readonly ImageStorageService imageStorageService;

        public Markers(MarkersService markersService, ImageStorageService imageStorageService)
        {
            this.markersService = markersService;
            this.imageStorageService = imageStorageService;
        }

        [Function("search-markers")]
        public async Task<HttpResponseData> Search([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "markers")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("search-markers");
            logger.LogInformation("Request for markers received.");

            var query = HttpUtility.ParseQueryString(req.Url.Query);
            var region = query["region"].Deserialize<RegionDto>();
            var userLocation = query["userLocation"].Deserialize<UserLocationDto>();
            var typeFilters = query["typeFilters"]?.Deserialize<MarkerType[]>(); //type filters are optional to support older clients

            var results = await markersService.GetMarkersByRegion(region, userLocation, typeFilters);

            var json = results.Serialize();
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(json);

            return response;
        }

        [Function("submit-markers")]
        public async Task<SubmissionResponse> Submit([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "markers")] HttpRequestData req,
            FunctionContext context)
        {
            using var streamReader = new StreamReader(req.Body);
            var str = streamReader.ReadToEnd();
            var submission = JsonSerializer.Deserialize<MarkerSubmissionDto>(str, DefaultJsonConfiguration.SerializerOptions);
            if (string.IsNullOrEmpty(submission.Name) || string.IsNullOrEmpty(submission.Description))
            {
                return new SubmissionResponse
                {
                    Response = req.CreateResponse(HttpStatusCode.BadRequest)
                };
            }

            string fileHandle = null;
            if (!string.IsNullOrEmpty(submission.Base64Image))
            {
                var fileBytes = Convert.FromBase64String(submission.Base64Image);
                fileHandle = await imageStorageService.UploadFileAndGetHandle(fileBytes);
            }

            var pending = await markersService.AddMarkerSubmission(submission, fileHandle);
            return new SubmissionResponse
            {
                QueueMessage = pending,
                Response = req.CreateResponse(HttpStatusCode.OK)
            };
        }

        [Function("report-marker")]
        public static async Task<HttpResponseData> Report([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "markers/report")] HttpRequestData req,
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

        public class SubmissionResponse
        {
            [QueueOutput("la-hm-approvals")]
            public PendingSubmissionDto QueueMessage { get; set; }

            public HttpResponseData Response { get; set; }
        }

        public class ReportDto
        {
            public int MarkerId { get; set; }

            public string Report { get; set; }
        }
    }
}
