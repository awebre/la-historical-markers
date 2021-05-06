using System;
using System.Net;
using System.Text.Json;
using System.IO;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using LaHistoricalMarkers.Config;
using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.FileStorage;

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
    }
    public class SubmissionResponse
    {
        [QueueOutput("la-hm-approvals")]
        public PendingSubmissionDto QueueMessage { get; set; }

        public HttpResponseData Response { get; set; }
    }
}