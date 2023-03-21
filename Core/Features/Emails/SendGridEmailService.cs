using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace LaHistoricalMarkers.Core.Features.Emails;

public class SendGridEmailService
{
    private readonly string apiKey;
    private readonly string fromEmail;

    public SendGridEmailService(string apiKey, string fromEmail)
    {
        this.apiKey = apiKey;
        this.fromEmail = fromEmail;
    }

    public async Task<bool> SendTemplatedEmail<T>(string[] tos, string templateId, T data)
    {
        var client = GetClient();
        var message = GetDefaultMessage();
        message.SetTemplateData(data);
        message.SetTemplateId(templateId);
        foreach (var to in tos)
        {
            message.AddTo(to);
        }

        var response = await client.SendEmailAsync(message);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> SendEmail(string[] tos, string subject, string content)
    {
        var client = GetClient();
        var message = GetDefaultMessage();
        message.Subject = subject;
        message.PlainTextContent = content;
        foreach (var to in tos)
        {
            message.AddTo(to);
        }

        var result = await client.SendEmailAsync(message);
        return result.IsSuccessStatusCode;
    }

    private SendGridClient GetClient()
    {
        return new SendGridClient(apiKey);
    }

    private SendGridMessage GetDefaultMessage()
    {
        var from = new EmailAddress(fromEmail, "LA Historical Markers Alert");
        var message = new SendGridMessage();
        message.SetFrom(from);
        return message;
    }
}