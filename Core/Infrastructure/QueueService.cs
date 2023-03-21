using System;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Azure;
using Azure.Identity;
using Azure.Storage.Queues;
using Azure.Storage.Queues.Models;
using LAHistoricalMarkers.Core.Settings;

namespace LaHistoricalMarkers.Core.Infrastructure;

public class QueueService
{
    private readonly QueueSettings queueSettings;

    public QueueService(QueueSettings queueSettings)
    {
        this.queueSettings = queueSettings;
    }

    public async Task<Response<QueueMessage>> DequeueMessage(string queueName)
    {
        var queueClient = await GetQueueClient(queueName);
        return await queueClient.ReceiveMessageAsync();
    }

    public async Task DeleteMessageFromQueue(string message, string popReceipt, string queueName)
    {
        var queueClient = await GetQueueClient(queueName);
        await queueClient.DeleteMessageAsync(message, popReceipt);
    }

    public async Task SendMessage<T>(T message, string queueName, bool poison = false)
    {
        if (poison)
        {
            queueName = $"{queueName}-poison";
        }
        var queueClient = await GetQueueClient(queueName);
        var bytes = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        await queueClient.SendMessageAsync(Convert.ToBase64String(bytes));
    }

    private async Task<QueueClient> GetQueueClient(string queueName)
    {
        var queueClient = new QueueClient(new Uri(queueSettings.Uri, queueName), new DefaultAzureCredential());
        await queueClient.CreateIfNotExistsAsync();
        return queueClient;
    }
}