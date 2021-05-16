using System;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Emails;
using LaHistoricalMarkers.Core.Features.Markers;

namespace LaHistoricalMarkers.Core.Features.Moderation
{
    public class ModerationService : BaseSqlService
    {
        private readonly SendGridEmailService emailService;
        private readonly OtpAuthService authService;

        public ModerationService(
            SendGridEmailService emailService,
            OtpAuthService authService,
            IConnectionStringProvider connectionProvider) : base(connectionProvider)
        {
            this.emailService = emailService;
            this.authService = authService;
        }

        public async Task SendApprovalEmail(PendingSubmissionDto pending)
        {
            using var connection = GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            var otp = await authService.GetOtpForMarker(pending.Id, transaction);

            var tos = Environment.GetEnvironmentVariable("ToEmails").Split(",");
            var templateId = Environment.GetEnvironmentVariable("Template");
            await emailService.SendTemplatedEmail(tos, templateId, new ApprovalRequestDto(pending)
            {
                Otp = otp
            });

            transaction.Commit();
        }

        public async Task<ApprovalResultType> ApproveOrReject(bool approved, int markerId, string otp)
        {
            using var connection = GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            var authResult = await authService.GetAuthResult(markerId, otp, transaction);

            if (authResult == AuthResult.Denied)
            {
                transaction.Commit();
                return ApprovalResultType.Unauthenticated;
            }

            connection.Execute(@"
            UPDATE [LaHistoricalMarkers].[dbo].[Marker]
            SET IsApproved = @approved
            WHERE [Id] = @markerId",
            new { approved, markerId }, transaction);

            transaction.Commit();
            return approved ? ApprovalResultType.Accepted : ApprovalResultType.Rejected;
        }

        public async Task SendUserReportEmail(UserReportDto reportDto)
        {
            using var connection = GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            var otp = await authService.GetOtpForMarker(reportDto.MarkerId, transaction);

            var tos = Environment.GetEnvironmentVariable("ToEmails").Split(",");
            var content = $"The following marker was reported: {reportDto.MarkerId}\n\nThe user reports:\n{reportDto.Report}\n\nlahm://admin/marker/{reportDto.MarkerId}?otp={otp}";
            await emailService.SendEmail(tos, "User Report", content);

            transaction.Commit();
        }
    }
}