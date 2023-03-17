using FastEndpoints;

namespace LAHistoricalMarkers.Web.Endpoints;

public class RootRedirect : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("");
        AllowAnonymous();
    }
    public override Task HandleAsync(CancellationToken ct)
    {
        return SendRedirectAsync("/swagger", cancellation: ct);
    }
}