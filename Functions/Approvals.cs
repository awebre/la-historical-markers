using Dapper;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace LaHistoricalMarkers.Functions
{
    public class Approvals
    {
        private readonly ApprovalService approvalService;

        public Approvals(ApprovalService approvalService)
        {
            this.approvalService = approvalService;
        }

        [Function("approval-email")]
        public async Task ApprovalEmail([QueueTrigger("la-hm-approvals", Connection = "AzureWebJobsStorage")] PendingSubmissionDto pending,
            FunctionContext context)
        {
            var logger = context.GetLogger("Approvals");

            await approvalService.SendApprovalEmail(pending);

            logger.LogInformation($"C# Queue trigger function processed: \nEmail sent.");
        }

        [Function("marker-approval")]
        public async Task<HttpResponseData> Approval(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "marker/{markerId:int}/approval/{approved:bool}")] HttpRequestData req,
            int markerId,
            bool approved,
            FunctionContext executionContext)
        {
            var query = HttpUtility.ParseQueryString(req.Url.Query);
            var otp = query["otp"];

            var result = await approvalService.ApproveOrReject(approved, markerId, otp);

            var resp = req.CreateResponse(HttpStatusCode.OK);
            resp.Headers.Add("Content-Type", "text/plain");
            switch (result)
            {
                case ApprovalResultType.Accepted:
                    resp.WriteString("The submisssion was approved.");
                    break;
                case ApprovalResultType.Rejected:
                    resp.WriteString("The submisssion was rejected.");
                    break;
                case ApprovalResultType.Unauthenticated:
                    resp.WriteString("The token has expired or is invalid.");
                    break;
                default:
                    throw new ArgumentOutOfRangeException($"Unexpected result type: ${result}");
            }
            return resp;
        }
    }
}
