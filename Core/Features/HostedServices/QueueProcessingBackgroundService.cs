using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Azure;
using Azure.Storage.Queues.Models;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace LaHistoricalMarkers.Core.Features.HostedServices;

public abstract class QueueProcessingBackgroundService<TQueueMessage> : BackgroundService
{
    private readonly ILogger<QueueProcessingBackgroundService<TQueueMessage>> logger;
    public QueueProcessingBackgroundService(ILogger<QueueProcessingBackgroundService<TQueueMessage>> logger)
    {
        this.logger = logger;

    }

    public abstract string WorkerName { get; }

    public abstract Task<Response<QueueMessage>> GetQueueMessage();

    public abstract Task ProcessQueueData(TQueueMessage messageData);

    public abstract Task SendToPoisonQueue(TQueueMessage messageData);

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
            }
            else
            {
                logger.LogInformation("{name}: Processing message", WorkerName);
                await ProcessQueueData(pending);
            }
        }
        logger.LogInformation("{name} worker ending...", WorkerName);
    }
}