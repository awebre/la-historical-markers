using System.Security.Claims;
using System.Text.Encodings.Web;
using LaHistoricalMarkers.Core.Features.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace LAHistoricalMarkers.Web.Security;

public class OtpAuthHandler : AuthenticationHandler<OtpAuthOptions>
{
    private readonly OtpAuthService otpAuthService;

    public OtpAuthHandler(
        OtpAuthService otpAuthService,
        IOptionsMonitor<OtpAuthOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock) : base(options, logger, encoder, clock)
    {
        this.otpAuthService = otpAuthService;
    }
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var requestOtp = Context.Request.Query["otp"].FirstOrDefault();
        if (string.IsNullOrEmpty(requestOtp))
        {
            return AuthenticateResult.Fail("No OTP supplied");
        }

        var isValid = await otpAuthService.IsOtpValid(requestOtp);
        if (!isValid)
        {
            return AuthenticateResult.Fail("OTP invalid");
        }

        var otpClaim = new Claim(OtpAuthOptions.OtpClaim, requestOtp);
        var principal = new ClaimsPrincipal(new ClaimsIdentity(new[] { otpClaim }, "otp-principal"));

        var ticket = new AuthenticationTicket(principal, Scheme.Name);
        return AuthenticateResult.Success(ticket);
    }
}