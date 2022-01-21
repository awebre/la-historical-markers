using System.Data;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Security;

namespace LaHistoricalMarkers.Core.Features.Authentication;

public class OtpAuthService : BaseSqlService
{
    public OtpAuthService(IConnectionStringProvider connectionProvider) : base(connectionProvider)
    {
    }

    public async Task<AuthResult> GetAuthResult(int markerId, string otp, IDbTransaction transaction)
    {
        var connection = transaction.Connection;
        var otpId = await connection.QueryFirstOrDefaultAsync<int?>(@"
            SELECT otp.Id
                FROM [LaHistoricalMarkers].[dbo].[OneTimePassword] otp
                RIGHT JOIN [LaHistoricalMarkers].[dbo].[MarkerAccess] access
                ON otp.Id = access.OtpId
                WHERE access.MarkerId = @markerId AND otp.Value = @otp",
            new { markerId, otp }, transaction);

        if (!otpId.HasValue)
        {
            return AuthResult.Denied;
        }

        connection.Execute(@"
            DELETE FROM [LaHistoricalMarkers].[dbo].[MarkerAccess]
            WHERE [OtpId] = @otpId", new { otpId = otpId.Value }, transaction);

        connection.Execute(@"
            DELETE FROM [LaHistoricalMarkers].[dbo].[OneTimePassword]
            WHERE [Id] = @otpId", new { otpId = otpId.Value }, transaction);

        return AuthResult.Allowed;
    }

    ///<summary>
    /// Gets the current valid OTP for the specified marker or generates one, if none exists
    ///</summary>
    public async Task<string> GetOtpForMarker(int markerId, IDbTransaction transaction = null)
    {
        var connection = transaction.Connection;
        var otp = await connection.QueryFirstOrDefaultAsync<string>(@"
            SELECT otp.[Value]
                FROM [LaHistoricalMarkers].[dbo].[OneTimePassword] otp
                RIGHT JOIN [LaHistoricalMarkers].[dbo].[MarkerAccess] access
                ON otp.Id = access.Id
                WHERE access.MarkerId = @markerId",
            new { markerId = markerId }, transaction);

        if (string.IsNullOrEmpty(otp))
        {
            otp = OneTimePasswordGenerator.Generate();
            var otpId = await connection.QuerySingleAsync<int>(@"
                INSERT INTO [LaHistoricalMarkers].[dbo].[OneTimePassword](
                    [Value]
                )
                OUTPUT INSERTED.Id
                VALUES (@otp)",
                new { otp }, transaction);
            connection.Execute(@"
                INSERT INTO [LaHistoricalMarkers].[dbo].[MarkerAccess](
                    [MarkerId],
                    [OtpId]
                )
                VALUES (
                    @markerId,
                    @otpId
                )", new { markerId = markerId, otpId }, transaction);
        }

        return otp;
    }
}