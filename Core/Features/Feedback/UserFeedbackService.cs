using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Emails;
using LAHistoricalMarkers.Core.Settings;

namespace LaHistoricalMarkers.Core.Features.Feedback;

public class UserFeedbackService
{
    private readonly SendGridEmailService emailService;
    private readonly NotificationSettings notificationSettings;
    public UserFeedbackService(
        NotificationSettings notificationSettings,
        SendGridEmailService emailService)
    {
        this.notificationSettings = notificationSettings;
        this.emailService = emailService;

    }
    public async Task<bool> SendFeedbackEmail(UserFeedbackDto feedbackDto)
    {
        if (string.IsNullOrWhiteSpace(feedbackDto.Feedback))
        {
            return true;
        }

        var tos = notificationSettings.ToEmails.Split(",");
        var content = $"You have new feedback from {(string.IsNullOrEmpty(feedbackDto.Email) ? "a user" : feedbackDto.Email)}:\n\n";
        content += feedbackDto;
        var successful = await emailService.SendEmail(tos, "User Feedback", content);
        return successful;
    }
}