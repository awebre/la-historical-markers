using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Azure;
using Azure.Identity;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;
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

    public async Task EnqueueApprovalEmailMessage(PendingSubmissionDto message, bool poison = false)
    {
        if (poison)
        {
            await SendMessage(message, $"{queueSettings.ApprovalEmailQueue}-poison");
        }
        else
        {
            await SendMessage(message, queueSettings.ApprovalEmailQueue);
        }
    }

    public async Task EnqueueUserReportEmailMessage(UserReportDto message, bool poison = false)
    {
        if (poison)
        {
            await SendMessage(message, $"{queueSettings.UserReportEmailQueue}-poison");
        }
        else
        {
            await SendMessage(message, queueSettings.UserReportEmailQueue);
        }
    }

    public Task<Response<QueueMessage>> DequeueApprovalEmailMessage()
    {
        return DequeueMessage(queueSettings.ApprovalEmailQueue);
    }

    public Task<Response<QueueMessage>> DequeueUserReportEmailMessage()
    {
        return DequeueMessage(queueSettings.UserReportEmailQueue);
    }

    private async Task<Response<QueueMessage>> DequeueMessage(string queueName)
    {
        var queueClient = GetQueueClient(queueName);
        await queueClient.CreateIfNotExistsAsync();
        return await queueClient.ReceiveMessageAsync();
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
        var options = new QueueClientOptions
        {
            MessageEncoding = QueueMessageEncoding.Base64,
        };
        return new QueueClient(new Uri(queueSettings.Uri, queueName), new DefaultAzureCredential());
    }
}