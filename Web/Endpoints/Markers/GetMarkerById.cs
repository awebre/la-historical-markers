using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints.Markers;

public class GetMarkerById : PublicApiEndpoint<MarkerByIdRequest, MarkerDto>
{
    private readonly MarkersService markersService;
    public GetMarkerById(MarkersService markersService)
    {
        this.markersService = markersService;
    }

    public override void Configure()
    {
        Get("/markers/{id}");
        base.Configure();
    }

    public override async Task<MarkerDto> ExecuteAsync(MarkerByIdRequest req, CancellationToken ct)
    {
        var marker = await markersService.GetMarkerById(req.Id);
        return marker;
    }
}

public class MarkerByIdRequest
{
    public int Id { get; set; }
}