using System;
using System.Net;
using System.IO;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.FileStorage;
using LaHistoricalMarkers.Functions.Extensions;
using Microsoft.Extensions.Logging;
using LaHistoricalMarkers.Core.Infrastructure;

namespace LaHistoricalMarkers.Functions
{
    public class SubmitMarkers
    {
        private readonly MarkersService markersService;
        private readonly ImageStorageService imageStorageService;

        public SubmitMarkers(MarkersService markersService, ImageStorageService imageStorageService)
        {
            this.markersService = markersService;
            this.imageStorageService = imageStorageService;
        }

        [Function("submit-markers")]
        public async Task<SubmissionResponse> Submit([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "markers")] HttpRequestData req,
            FunctionContext context)
        {
            var logger = context.GetLogger("submit-markers");
            using var streamReader = new StreamReader(req.Body);
            var submission = streamReader.ReadToEnd().Deserialize<MarkerSubmissionDto>();
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
            logger.LogInformation($"DeepLinkBaseUrl: {pending.DeepLinkBaseUrl}");
            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteStringAsync(pending.Serialize());
            response.Headers.Add("Content-Type", "application/json");
            return new SubmissionResponse
            {
                QueueMessage = pending,
                Response = response
            };
        }
    }
    public class SubmissionResponse
    {
        [QueueOutput(Queues.ApprovalEmailQueue)]
        public PendingSubmissionDto QueueMessage { get; set; }

        public HttpResponseData Response { get; set; }
    }
}