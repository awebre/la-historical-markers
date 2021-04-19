using System;
using System.Data;
using System.Data.SqlClient;

namespace LaHistoricalMarkers.Data
{
    public static class Database
    {
        [Obsolete("This should be replaced by a service inheriting from the BaseSqlService.")]
        public static IDbConnection GetConnection()
        {
            return new SqlConnection(Environment.GetEnvironmentVariable("ConnectionString"));
        }
    }
}