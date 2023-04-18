using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using MediatR;

namespace LAHistoricalMarkers.Web.Endpoints.Markers;

public class GetMarkersTextSearch : PublicApiEndpoint<MarkerTextSearchRequest, IEnumerable<MarkerDto>>
{
    private readonly IMediator mediator;

    public GetMarkersTextSearch(IMediator mediator)
    {
        this.mediator = mediator;
    }

    public override void Configure()
    {
        Get("/markers/search/{search}");
        base.Configure();
    }

    public override async Task<IEnumerable<MarkerDto>> ExecuteAsync(MarkerTextSearchRequest req, CancellationToken ct)
    {
        var markers = await mediator.Send(new GetMarkerTextSearchRequest(req.Search, req.UserLocation), ct);
        return markers;
    }
}

public class MarkerTextSearchRequest
{
    public string? Search { get; set; }

    [QueryParam]
    public UserLocationDto? UserLocation { get; set; }
}