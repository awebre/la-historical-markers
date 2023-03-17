using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Metadata;

namespace LAHistoricalMarkers.Web.Endpoints;

public class GetMarkerById : Endpoint<MarkerByIdRequest, MarkerDto>
{
    private readonly MarkersService markersService;
    public GetMarkerById(MarkersService markersService)
    {
        this.markersService = markersService;
    }

    public override void Configure()
    {
        Get("/api/markers/{id}");
        AllowAnonymous();
        Tags(EndpointTagNames.PublicApi);
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