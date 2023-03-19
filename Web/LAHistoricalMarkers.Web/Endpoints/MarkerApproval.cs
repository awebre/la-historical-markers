using LaHistoricalMarkers.Core.Features.Moderation;
using LAHistoricalMarkers.Web.Endpoints.Configuration;

namespace LAHistoricalMarkers.Web.Endpoints;

public class MarkerApproval : OtpAuthenticedEndpoint<MarkerApprovalRequest, string>
{
    private readonly ModerationService moderationService;
    public MarkerApproval(ModerationService moderationService)
    {
        this.moderationService = moderationService;
    }

    public override void Configure()
    {
        Get("/markers/{markerId}/approval/{isApproved}");
    }

    public override async Task<string> ExecuteAsync(MarkerApprovalRequest req, CancellationToken ct)
    {
        var result = await moderationService.ApproveOrReject(req.IsApproved, req.MarkerId, req.Otp);
        return result switch
        {
            ApprovalResultType.Accepted => "The submission was approved.",
            ApprovalResultType.Rejected => "The submission was rejected.",
            ApprovalResultType.Unauthenticated => "The token has expired or is invalid",
            _ => throw new ArgumentOutOfRangeException(),
        };
    }
}

public class MarkerApprovalRequest : BaseOtpRequest
{
    public int MarkerId { get; set; }

    public bool IsApproved { get; set; }
}