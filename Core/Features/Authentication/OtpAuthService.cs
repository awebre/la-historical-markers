using System.Data;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;

namespace LaHistoricalMarkers.Core.Features.Authentication
{
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
    }
}