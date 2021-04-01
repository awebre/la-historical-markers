using System;

namespace LaHistoricalMarkers.Data
{
    public class PendingSubmissionDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Latitude { get; set; }

        public decimal Longitude { get; set; }

        public string ImageUrl { get; set; }
    }
}