using System;

namespace LaHistoricalMarkers.Data
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
        }
        public string Otp { get; set; }
    }
}