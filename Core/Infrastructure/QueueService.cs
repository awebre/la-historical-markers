using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Storage.Queues;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using LAHistoricalMarkers.Core.Settings;

namespace LaHistoricalMarkers.Core.Infrastructure;

public class QueueService
{
    private readonly QueueSettings queueSettings;

    public QueueService(QueueSettings queueSettings)
    {
        this.queueSettings = queueSettings;
    }

    public async Task EnqueueApprovalEmailMessage(PendingSubmissionDto message)
    {
        await SendMessage(message, queueSettings.ApprovalEmailQueue);
    }

    public async Task EnqueueUserReportEmailMessage(UserReportDto message)
    {
        await SendMessage(message, queueSettings.UserReportEmailQueue);
    }

    private async Task SendMessage<T>(T message, string queueName)
    {
        var queueClient = GetQueueClient(queueName);
        await queueClient.CreateIfNotExistsAsync();
        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        await queueClient.SendMessageAsync(Convert.ToBase64String(bytes));
    }

    private QueueClient GetQueueClient(string queueName)
    {
        return new QueueClient(new Uri(queueSettings.Uri, queueName), new DefaultAzureCredential());
    }
}