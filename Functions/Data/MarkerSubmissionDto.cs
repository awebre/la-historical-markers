using System;

namespace LaHistoricalMarkers.Data
{
    public class MarkerSubmissionDto
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }
    }
}