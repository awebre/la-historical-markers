using FastEndpoints;

namespace LAHistoricalMarkers.Web.Endpoints;

public class OtpHealthCheck : EndpointWithoutRequest<string>
{
    public override void Configure()
    {
        Get("otp");
    }

    public override Task<string> ExecuteAsync(CancellationToken ct)
    {
        return Task.FromResult("You have a valid otp!");
    }
}