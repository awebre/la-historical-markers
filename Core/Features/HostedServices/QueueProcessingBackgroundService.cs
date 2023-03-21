using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Azure;
using Azure.Storage.Queues.Models;
using LaHistoricalMarkers.Core.Infrastructure;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace LaHistoricalMarkers.Core.Features.HostedServices;

public abstract class QueueProcessingBackgroundService<TQueueMessage> : BackgroundService
{
    private readonly ILogger<QueueProcessingBackgroundService<TQueueMessage>> logger;
    private readonly QueueService queueService;
    public QueueProcessingBackgroundService(
        QueueService queueService,
        ILogger<QueueProcessingBackgroundService<TQueueMessage>> logger)
    {
        this.queueService = queueService;
        this.logger = logger;
    }

    protected abstract string WorkerName { get; }


    public string QueueName { get; init; }

    protected virtual Task<Response<QueueMessage>> GetQueueMessage()
    {
        return queueService.DequeueMessage(QueueName);
    }

    protected abstract Task<bool> ProcessQueueData(TQueueMessage messageData);

    protected virtual Task SendToPoisonQueue(TQueueMessage messageData)
    {
        return queueService.SendMessage(messageData, QueueName, true);
    }

    protected virtual Task DeleteFromQueue(string messageId, string popReceipt)
    {
        return queueService.DeleteMessageFromQueue(messageId, popReceipt, QueueName);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            logger.LogInformation("{name}: Attempting to dequeue at {time}", WorkerName, DateTimeOffset.Now);
            var response = await GetQueueMessage();
            if (response is null or { Value: null })
            {
                logger.LogInformation("{name}: No response from queue", WorkerName);
                continue;
            }

            var base64 = response.Value.Body.ToString();
            if (string.IsNullOrEmpty(base64))
            {
                logger.LogWarning("{name}: Response didn't have a base64 string", WorkerName);
                continue;
            }
            var json = Encoding.UTF8.GetString(Convert.FromBase64String(base64));
            if (string.IsNullOrEmpty(json))
            {
                logger.LogWarning("{name}: Could not get json from base64 message", WorkerName);
                continue;
            }
            var pending = JsonSerializer.Deserialize<TQueueMessage>(json);
            if (response is { Value: { DequeueCount: > 5 } })
            {
                logger.LogWarning("{name}: Sending to poison queue", WorkerName);
                await SendToPoisonQueue(pending);
                await DeleteFromQueue(response.Value.MessageId, response.Value.PopReceipt);
            }
            else
            {
                logger.LogInformation("{name}: Processing message", WorkerName);
                var successful = await ProcessQueueData(pending);
                if (successful)
                {
                    await DeleteFromQueue(response.Value.MessageId, response.Value.PopReceipt);
                }
            }
        }
        logger.LogInformation("{name} worker ending...", WorkerName);
    }
}