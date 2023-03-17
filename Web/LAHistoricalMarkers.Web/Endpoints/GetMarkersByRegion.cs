using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;

namespace LAHistoricalMarkers.Web.Endpoints;

public class GetMarkersByRegion : Endpoint<MarkersByRegionRequest, IEnumerable<MarkerDto>>
{
    private readonly MarkersService markersService;
    public GetMarkersByRegion(MarkersService markersService)
    {
        this.markersService = markersService;

    }

    public override void Configure()
    {
        Get("/api/markers");
        AllowAnonymous();
        Tags(EndpointTagNames.PublicApi);
    }

    public override async Task<IEnumerable<MarkerDto>> ExecuteAsync(MarkersByRegionRequest req, CancellationToken ct)
    {
        var results = await markersService.GetMarkersByRegion(req.Region, req.UserLocation, req.TypeFilters);
        return results;
    }
}

public class MarkersByRegionRequest
{
    [QueryParam]
    public RegionDto Region { get; set; }

    [QueryParam]
    public UserLocationDto UserLocation { get; set; }

    [QueryParam]
    public MarkerType[] TypeFilters { get; set; }
}