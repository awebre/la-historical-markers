using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace LaHistoricalMarkers.Functions
{
    public static class Approvals
    {
        [Function("Approvals")]
        public static void Run([QueueTrigger("la-hm-approvals", Connection = "AzureWebJobsStorage")] string myQueueItem,
            FunctionContext context)
        {
            var logger = context.GetLogger("Approvals");
            logger.LogInformation($"C# Queue trigger function processed: {myQueueItem}");
        }
    }
}
