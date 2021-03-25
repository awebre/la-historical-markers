using System;
using System.Data;
using System.Data.SqlClient;

namespace LaHistoricalMarkers.Data
{
    public static class Database 
    {
        private static IDbConnection dbConnection = null;

        public static IDbConnection GetConnection()
        {
            if(dbConnection == null)
            {
                var connectionString = Environment.GetEnvironmentVariable("ConnectionString");
                dbConnection = new SqlConnection(connectionString);
            }
            return dbConnection;
        }
    }
}