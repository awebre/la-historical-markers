using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using LaHistoricalMarkers.Core.Data;
using System;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.FileStorage;
using LaHistoricalMarkers.Core.Features.Emails;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Features.Authentication;

namespace LaHistoricalMarkers;

public class Program
{
    public static void Main()
    {
        var host = new HostBuilder()
            .ConfigureFunctionsWorkerDefaults()
            .ConfigureServices(s =>
            {
                s.AddSingleton<IConnectionStringProvider>(_ => new SqlConnectionStringProvider(Environment.GetEnvironmentVariable("ConnectionString")));

                s.AddScoped<SendGridEmailService>(_ => new SendGridEmailService(Environment.GetEnvironmentVariable("SendGrid"), Environment.GetEnvironmentVariable("FromEmail")));
                s.AddScoped<MarkersService>();
                s.AddScoped<ModerationService>();
                s.AddScoped<OtpAuthService>();

                var uri = new Uri(Environment.GetEnvironmentVariable("StorageUri"));
                var storageAccount = Environment.GetEnvironmentVariable("StorageAccount");
                var storageKey = Environment.GetEnvironmentVariable("StorageKey");
                var storageContainer = Environment.GetEnvironmentVariable("StorageContainer");
                s.AddScoped<ImageStorageService>(_ => new ImageStorageService(uri, storageAccount, storageKey, storageContainer));
            })
            .Build();

        host.Run();
    }
}