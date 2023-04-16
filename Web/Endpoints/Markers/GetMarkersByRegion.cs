using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints.Markers;

public class GetMarkersByRegion : PublicApiEndpoint<MarkersByRegionRequest, IEnumerable<MarkerDto>>
{
    private readonly MarkersService markersService;
    public GetMarkersByRegion(MarkersService markersService)
    {
        this.markersService = markersService;

    }

    public override void Configure()
    {
        Get("/markers");
        base.Configure();
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
    public RegionDto? Region { get; set; }

    [QueryParam]
    public UserLocationDto? UserLocation { get; set; }

    [QueryParam]
    public MarkerType[]? TypeFilters { get; set; }
}