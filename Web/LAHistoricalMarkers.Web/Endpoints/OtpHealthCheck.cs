using FastEndpoints;
using LAHistoricalMarkers.Web.Endpoints.Metadata;

namespace LAHistoricalMarkers.Web.Endpoints;

public class OtpHealthCheck : EndpointWithoutRequest<string>
{
    public override void Configure()
    {
        Get("/api/otp");
        Tags(EndpointTagNames.PublicApi);
    }

    public override Task<string> ExecuteAsync(CancellationToken ct)
    {
        return Task.FromResult("You have a valid otp!");
    }
}