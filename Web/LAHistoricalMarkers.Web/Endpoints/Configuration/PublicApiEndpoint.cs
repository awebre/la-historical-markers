using FastEndpoints;

namespace LAHistoricalMarkers.Web.Endpoints.Configuration;

public class PublicApiEndpoint<TRequest, TResponse> : Endpoint<TRequest, TResponse> where TRequest : notnull
{
    public override void Configure()
    {
        AllowAnonymous();
        Tags(EndpointTagNames.PublicApi);
    }
}