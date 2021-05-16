namespace LaHistoricalMarkers.Core.Features.Moderation
{
    public class UserReportEmailPayload
    {
        public int MarkerId { get; set; }

        public string Report { get; set; }

        public string Otp { get; set; }
    }
}
