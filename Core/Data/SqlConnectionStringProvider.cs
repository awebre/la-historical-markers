namespace LaHistoricalMarkers.Core.Data;

public class SqlConnectionStringProvider : IConnectionStringProvider
{
    private readonly string connectionString;

    public SqlConnectionStringProvider(string connectionString)
    {
        this.connectionString = connectionString;
    }

    public string GetConnectionString()
    {
        return connectionString;
    }
}