using FastEndpoints;

namespace LAHistoricalMarkers.Web.Endpoints;

public class HealthCheck : EndpointWithoutRequest<string>
{
    public override void Configure()
    {
        Get("/");
        AllowAnonymous();
    }

    public override Task<string> ExecuteAsync(CancellationToken ct)
    {
        return Task.FromResult("We did it!");
    }
}