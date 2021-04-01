using System;
using System.Data;
using System.Data.SqlClient;

namespace LaHistoricalMarkers.Data
{
    public static class Database
    {
        public static IDbConnection GetConnection()
        {
            return new SqlConnection(Environment.GetEnvironmentVariable("ConnectionString"));
        }
    }
}