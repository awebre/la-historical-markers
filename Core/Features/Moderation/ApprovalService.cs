using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Emails;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Security;

namespace LaHistoricalMarkers.Core.Features.Moderation
{
    public class ApprovalService : BaseSqlService
    {
        private readonly SendGridEmailService emailService;

        public ApprovalService(SendGridEmailService emailService, IConnectionStringProvider connectionProvider) : base(connectionProvider)
        {
            this.emailService = emailService;
        }

        ///<summary>
        /// Gets the current valid OTP for the specified marker or generates one, if none exists
        ///</summary>
        private async Task<string> GetOtpForSubmission(int markerId,
                                                      IDbTransaction transaction)
        {
            var connection = transaction.Connection;
            var otp = await connection.QueryFirstOrDefaultAsync<string>(@"
            SELECT otp.[Value]
                FROM [LaHistoricalMarkers].[dbo].[OneTimePassword] otp
                RIGHT JOIN [LaHistoricalMarkers].[dbo].[MarkerAccess] access
                ON otp.Id = access.Id
                WHERE access.MarkerId = @markerId",
new { markerId = markerId }, transaction);

            if (string.IsNullOrEmpty(otp))
            {
                otp = OneTimePasswordGenerator.Generate();
                var otpId = await connection.QuerySingleAsync<int>(@"
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
                )", new { markerId = markerId, otpId }, transaction);
            }

            return otp;
        }

        public async Task SendApprovalEmail(PendingSubmissionDto pending)
        {
            using var connection = GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            var otp = await GetOtpForSubmission(pending.Id, transaction);

            var tos = Environment.GetEnvironmentVariable("ToEmails").Split(",");
            var templateId = Environment.GetEnvironmentVariable("Template");
            await emailService.SendTemplatedEmail(tos, templateId, new ApprovalRequestDto(pending)
            {
                Otp = otp
            });

            transaction.Commit();
        }
    }
}