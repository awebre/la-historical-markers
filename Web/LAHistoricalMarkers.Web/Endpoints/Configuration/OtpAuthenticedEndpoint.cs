using FastEndpoints;

namespace LAHistoricalMarkers.Web.Endpoints.Configuration;

public class OtpAuthenticedEndpoint<TRequest, TResponse> : Endpoint<TRequest, TResponse>
    where TRequest : BaseOtpRequest
{
}

public abstract class BaseOtpRequest
{
    [QueryParam]
    public string Otp { get; set; }
}