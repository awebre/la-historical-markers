using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;

namespace LaHistoricalMarkers.Core.Data
{
    public class BaseSqlService
    {
        private string connectionString;
        public BaseSqlService(IConnectionStringProvider connectionProvider)
        {
            connectionString = connectionProvider.GetConnectionString();
        }

        private IDbConnection GetConnection() => new SqlConnection(connectionString);

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object param)
        {
            using var db = GetConnection();
            return await db.QueryAsync<T>(sql, param);
        }
    }
}