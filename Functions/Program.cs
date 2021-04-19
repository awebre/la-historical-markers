using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using LaHistoricalMarkers.Core.Data;
using System;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.FileStorage;

namespace la_historical_markers
{
    public class Program
    {
        public static void Main()
        {
            var host = new HostBuilder()
                .ConfigureFunctionsWorkerDefaults()
                .ConfigureServices(s =>
                {
                    s.AddSingleton<IConnectionStringProvider>(_ => new SqlConnectionStringProvider(Environment.GetEnvironmentVariable("ConnectionString")));
                    s.AddScoped<MarkersService>();

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
}