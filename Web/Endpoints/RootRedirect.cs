using FastEndpoints;

namespace LAHistoricalMarkers.Web.Endpoints;

public class RootRedirect : EndpointWithoutRequest
{
    public override void Configure()
    {
        Get("");
        AllowAnonymous();
        RoutePrefixOverride("");
    }
    public override Task HandleAsync(CancellationToken ct)
    {
        return SendRedirectAsync("/swagger", cancellation: ct);
    }
}