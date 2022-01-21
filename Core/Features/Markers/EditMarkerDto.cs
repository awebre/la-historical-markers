namespace LaHistoricalMarkers.Core.Features.Markers;

public class EditMarkerDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public bool IsApproved { get; set; }

    public MarkerType Type { get; set; }
}