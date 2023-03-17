using FastEndpoints;

namespace LAHistoricalMarkers.Web.Endpoints;

public class HealthCheck : EndpointWithoutRequest<string>
{
    public override void Configure()
    {
        Get("/api");
        AllowAnonymous();
        Tags(EndpointTagNames.PublicApi);
    }

    public override Task<string> ExecuteAsync(CancellationToken ct)
    {
        return Task.FromResult("Welcome to Louisiana Historical Markers!");
    }
}