using Microsoft.AspNetCore.Authentication;

namespace LAHistoricalMarkers.Web.Security;

public class OtpAuthOptions : AuthenticationSchemeOptions
{
    public static string Scheme = "OTP Auth";

    public static string OtpClaimType = "otp";
}