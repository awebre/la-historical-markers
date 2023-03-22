using LaHistoricalMarkers.Core.Features.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace LAHistoricalMarkers.Web.Security.Policies;

public class MarkerAccessHandler : AuthorizationHandler<MarkerAccessPolicyRequirement>
{
    private readonly OtpAuthService authService;
    private readonly IHttpContextAccessor httpContextAccessor;

    public MarkerAccessHandler(
        IHttpContextAccessor httpContextAccessor,
        OtpAuthService authService)
    {
        this.httpContextAccessor = httpContextAccessor;
        this.authService = authService;

    }

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, MarkerAccessPolicyRequirement requirement)
    {
        var otp = context.User.FindFirst(c => c.Type == OtpAuthOptions.OtpClaimType);
        if (otp is null)
        {
            return;
        }

        if (int.TryParse(httpContextAccessor.HttpContext?.GetRouteValue("id")?.ToString(), out var markerId))
        {
            var isValid = await authService.IsOtpValidForMarkerId(markerId, otp.Value);
            if (isValid)
            {
                context.Succeed(requirement);
            }
        }
    }
}