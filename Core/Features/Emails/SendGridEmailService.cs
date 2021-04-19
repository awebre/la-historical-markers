using System;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace LaHistoricalMarkers.Core.Features.Emails
{
    public class SendGridEmailService
    {
        private readonly string apiKey;
        private readonly string fromEmail;

        public SendGridEmailService(string apiKey, string fromEmail)
        {
            this.apiKey = apiKey;
            this.fromEmail = fromEmail;
        }

        public async Task SendTemplatedEmail<T>(string[] tos, string templateId, T data)
        {
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(fromEmail, "LA Historical Markers Alert");
            var message = new SendGridMessage();
            message.SetTemplateData(data);
            message.SetTemplateId(templateId);
            message.SetFrom(from);
            foreach (var to in tos)
            {
                message.AddTo(to);
            }

            await client.SendEmailAsync(message);
        }
    }
}