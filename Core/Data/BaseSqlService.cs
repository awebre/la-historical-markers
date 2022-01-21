using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;

namespace LaHistoricalMarkers.Core.Data;

public class BaseSqlService
{
    private string connectionString;
    public BaseSqlService(IConnectionStringProvider connectionProvider)
    {
        connectionString = connectionProvider.GetConnectionString();
    }

    public IDbConnection GetConnection() => new SqlConnection(connectionString);

    protected async Task<IEnumerable<T>> QueryAsync<T>(string sql, object param)
    {
        using var connection = GetConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        var result = await connection.QueryAsync<T>(sql, param, transaction);
        transaction.Commit();
        return result;
    }

    protected async Task<T> QuerySingleAsync<T>(string sql, object param)
    {
        using var connection = GetConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        var result = await connection.QuerySingleAsync<T>(sql, param, transaction);
        transaction.Commit();
        return result;
    }

    protected async Task<T> QuerySingleOrDefaultAsync<T>(string sql, object param)
    {
        using var connection = GetConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        var result = await connection.QuerySingleOrDefaultAsync<T>(sql, param, transaction);
        transaction.Commit();
        return result;
    }

    protected async Task ExecuteAsync(string sql, object param)
    {
        using var connection = GetConnection();
        connection.Open();
        using var transaction = connection.BeginTransaction();
        var result = await connection.ExecuteAsync(sql, param, transaction);
        transaction.Commit();
    }
}