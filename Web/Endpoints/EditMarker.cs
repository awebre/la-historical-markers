using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class EditMarker : OtpAuthenticedEndpoint<EditMarkerRequest, EmptyResponse>
{
    private readonly MarkersService markersService;

    public EditMarker(MarkersService markersService)
    {
        this.markersService = markersService;

    }
    public override void Configure()
    {
        Put("markers/{markerId}");
    }

    public override async Task HandleAsync(EditMarkerRequest req, CancellationToken ct)
    {
        var markerDto = new EditMarkerDto
        {
            Id = req.MarkerId,
            Name = req.Name,
            Description = req.Description,
            IsApproved = req.IsApproved,
            Latitude = req.Latitude,
            Longitude = req.Longitude,
            Type = req.Type,
        };
        await markersService.EditMarker(markerDto, req.Otp);
    }
}

public class EditMarkerRequest : BaseOtpRequest
{
    public int MarkerId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public bool IsApproved { get; set; }

    public MarkerType Type { get; set; }
}