using LaHistoricalMarkers.Core.Features.Markers;

namespace LaHistoricalMarkers.Core.Features.Moderation
{
    public class ApprovalRequestDto : PendingSubmissionDto
    {
        public ApprovalRequestDto(PendingSubmissionDto submission)
        {
            Id = submission.Id;
            Name = submission.Name;
            Description = submission.Description;
            Latitude = submission.Latitude;
            Longitude = submission.Longitude;
            ImageFileName = submission.ImageFileName;
            Type = submission.Type;
            DeepLinkBaseUrl = submission.DeepLinkBaseUrl;
        }
        public string Otp { get; set; }
    }
}