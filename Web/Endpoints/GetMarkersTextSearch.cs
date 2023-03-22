using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class GetMarkersTextSearch : PublicApiEndpoint<MarkerTextSearchRequest, IEnumerable<MarkerDto>>
{
    private readonly MarkersService markersService;
    public GetMarkersTextSearch(MarkersService markersService)
    {
        this.markersService = markersService;
    }

    public override void Configure()
    {
        Get("/markers/search/{search}");
        base.Configure();
    }

    public override async Task<IEnumerable<MarkerDto>> ExecuteAsync(MarkerTextSearchRequest req, CancellationToken ct)
    {
        var markers = await markersService.GetMarkersBySearchTerm(req.Search, req.UserLocation);
        return markers;
    }
}

public class MarkerTextSearchRequest
{
    public string Search { get; set; }

    [QueryParam]
    public UserLocationDto? UserLocation { get; set; }
}