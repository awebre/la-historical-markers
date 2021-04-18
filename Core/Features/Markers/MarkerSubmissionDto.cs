using System;

namespace LaHistoricalMarkers.Core.Features.Markers
{
    public class MarkerSubmissionDto
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string Base64Image { get; set; }
    }
}