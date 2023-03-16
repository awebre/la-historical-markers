using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Security.Policies;

namespace LAHistoricalMarkers.Web.Endpoints;

public class GetMarkerById : Endpoint<MarkerByIdRequest, MarkerByIdResponse>
{
    private readonly MarkersService markersService;
    public GetMarkerById(MarkersService markersService)
    {
        this.markersService = markersService;
    }

    public override void Configure()
    {
        Get("/markers/{id}");
        //TODO: this endpoint doesn't actually need auth,
        //this was just a test
        Policies(CustomPolicies.MarkerAccess);
    }

    public override async Task<MarkerByIdResponse> ExecuteAsync(MarkerByIdRequest req, CancellationToken ct)
    {
        var marker = await markersService.GetMarkerById(req.Id);
        return new MarkerByIdResponse
        {
            Id = marker.Id,
        };
    }
}

public class MarkerByIdResponse
{
    public int Id { get; set; }
}

public class MarkerByIdRequest
{
    public int Id { get; set; }
}