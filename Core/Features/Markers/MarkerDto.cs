using System;
using System.Collections.Generic;

namespace LaHistoricalMarkers.Core.Features.Markers;

public class MarkerDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public decimal Latitude { get; set; }

    public decimal Longitude { get; set; }

    public string ImageFileName { get; set; }

    public bool IsApproved { get; set; }

    public DateTimeOffset CreatedTimestamp { get; set; }

    public decimal Distance { get; set; }

    public MarkerType Type { get; set; }

    public List<MarkerPhotoDto> Photos { get; set; } = new();
}

public record MarkerPhotoDto(string FileGuid, int MarkerId)
{
    public string FileName => $"{FileGuid.ToLower()}.png";
}