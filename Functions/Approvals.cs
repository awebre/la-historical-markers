using Dapper;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Security;
using LaHistoricalMarkers.Data;
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
    public static class Approvals
    {
        [Function("approval-email")]
        public static async Task ApprovalEmail([QueueTrigger("la-hm-approvals", Connection = "AzureWebJobsStorage")] PendingSubmissionDto pending,
            FunctionContext context)
        {
            var logger = context.GetLogger("Approvals");

            using var connection = Database.GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();

            var otp = connection.QueryFirstOrDefault<string>(@"
            SELECT otp.[Value]
                FROM [LaHistoricalMarkers].[dbo].[OneTimePassword] otp
                RIGHT JOIN [LaHistoricalMarkers].[dbo].[MarkerAccess] access
                ON otp.Id = access.Id
                WHERE access.MarkerId = @markerId",
            new { markerId = pending.Id }, transaction);

            if (string.IsNullOrEmpty(otp))
            {
                otp = OneTimePasswordGenerator.Generate();
                var otpId = connection.QuerySingle<int>(@"
                INSERT INTO [LaHistoricalMarkers].[dbo].[OneTimePassword](
                    [Value]
                )
                OUTPUT INSERTED.Id
                VALUES (@otp)",
                new { otp }, transaction);
                connection.Execute(@"
                INSERT INTO [LaHistoricalMarkers].[dbo].[MarkerAccess](
                    [MarkerId],
                    [OtpId]
                )
                VALUES (
                    @markerId,
                    @otpId
                )", new { markerId = pending.Id, otpId }, transaction);
            }

            var apiKey = Environment.GetEnvironmentVariable("SendGrid");
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(Environment.GetEnvironmentVariable("FromEmail"), "LA Historical Markers Alert");
            var tos = Environment.GetEnvironmentVariable("ToEmails").Split(",");
            var message = new SendGridMessage();
            message.SetTemplateData(new ApprovalRequestDto(pending)
            {
                Otp = otp
            });
            message.SetTemplateId(Environment.GetEnvironmentVariable("Template"));
            message.SetFrom(from);
            foreach (var to in tos)
            {
                message.AddTo(to);
            }

            await client.SendEmailAsync(message);

            transaction.Commit();
            logger.LogInformation($"C# Queue trigger function processed: \nEmail sent.");
        }

        [Function("marker-approval")]
        public static HttpResponseData Approval(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "marker/{markerId:int}/approval/{approved:bool}")] HttpRequestData req,
            int markerId,
            bool approved,
            FunctionContext executionContext)
        {
            var query = HttpUtility.ParseQueryString(req.Url.Query);
            var otp = query["otp"];

            using var connection = Database.GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            var otpId = connection.QueryFirstOrDefault<int?>(@"
            SELECT otp.Id
                FROM [LaHistoricalMarkers].[dbo].[OneTimePassword] otp
                RIGHT JOIN [LaHistoricalMarkers].[dbo].[MarkerAccess] access
                ON otp.Id = access.OtpId
                WHERE access.MarkerId = @markerId AND otp.Value = @otp",
                new { markerId, otp }, transaction);

            if (!otpId.HasValue)
            {
                var unAuthResp = req.CreateResponse(HttpStatusCode.Unauthorized);
                unAuthResp.Headers.Add("Content-Type", "text/plain");
                unAuthResp.WriteString("The token expired or is invalid.");
                return unAuthResp;
            }

            connection.Execute(@"
            DELETE FROM [LaHistoricalMarkers].[dbo].[MarkerAccess]
            WHERE [OtpId] = @otpId",
            new { otpId = otpId.Value }, transaction);

            connection.Execute(@"
            DELETE FROM [LaHistoricalMarkers].[dbo].[OneTimePassword]
            WHERE [Id] = @otpId", new { otpId = otpId.Value }, transaction);

            connection.Execute(@"
            UPDATE [LaHistoricalMarkers].[dbo].[Marker]
            SET IsApproved = @approved
            WHERE [Id] = @markerId",
            new { approved, markerId }, transaction);

            transaction.Commit();

            var resp = req.CreateResponse(HttpStatusCode.OK);
            resp.Headers.Add("Content-Type", "text/plain");
            resp.WriteString($"The submission was {(approved ? "approved" : "rejected")}.");
            return resp;
        }
    }
}
