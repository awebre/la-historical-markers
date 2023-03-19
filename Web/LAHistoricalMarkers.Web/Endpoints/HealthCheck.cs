using FastEndpoints;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class HealthCheck : PublicApiEndpoint<EmptyRequest, string>
{
    public override void Configure()
    {
        Get("");
        base.Configure();
    }

    public override Task<string> ExecuteAsync(EmptyRequest req, CancellationToken ct)
    {
        return Task.FromResult("Welcome to Louisiana Historical Markers!");
    }
}