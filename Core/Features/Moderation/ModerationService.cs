using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Emails;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Core.Settings;

namespace LaHistoricalMarkers.Core.Features.Moderation;

public class ModerationService : BaseSqlService
{
    private readonly OtpAuthService authService;
    private readonly SendGridEmailService emailService;
    private readonly NotificationSettings notificationSettings;

    public ModerationService(
        NotificationSettings notificationSettings,
        SendGridEmailService emailService,
        OtpAuthService authService,
        IConnectionStringProvider connectionProvider) : base(connectionProvider)
    {
        this.notificationSettings = notificationSettings;
        this.emailService = emailService;
        this.authService = authService;
    }

    public async Task<bool> SendApprovalEmail(PendingSubmissionDto pending)
    {
        using var connection = GetConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        var otp = await authService.GetOtpForMarker(pending.Id, transaction);

        var tos = notificationSettings.ToEmails.Split(",");
        var templateId = notificationSettings.Template;
        var successful = await emailService.SendTemplatedEmail(tos, templateId, new ApprovalRequestDto(pending)
        {
            Otp = otp,
        });

        transaction.Commit();
        return successful;
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

    public async Task<bool> SendUserReportEmail(UserReportDto reportDto)
    {
        using var connection = GetConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        var otp = await authService.GetOtpForMarker(reportDto.MarkerId, transaction);

        var tos = notificationSettings.ToEmails.Split(",");
        var content = $"The following marker was reported: {reportDto.MarkerId}\n\nThe user reports:\n{reportDto.Report}\n\nlahm://admin/marker/{reportDto.MarkerId}?otp={otp}";
        var successful = await emailService.SendEmail(tos, "User Report", content);

        transaction.Commit();

        return successful;
    }
}