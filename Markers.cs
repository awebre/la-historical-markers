using System.Collections.Generic;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Dapper;
using LaHistoricalMarkers.Data;

namespace LaHistoricalMarkers.Functions
{
    public static class Markers
    {
        [Function("Markers")]
        public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("Markers");
            logger.LogInformation("C# HTTP trigger function processed a request.");

            var results = Database.GetConnection().Query<MarkerDto>(
@"SELECT TOP (10) [Id]
      ,[Name]
      ,[Description]
      ,[Location].[Lat] AS [Latitude]
      ,[Location].[Long] AS [Longitude]
      ,[ImageUrl]
      ,[IsApproved]
      ,[CreatedTimestamp] FROM [LaHistoricalMarkers].[dbo].[Marker]").AsList();
            
            var json = JsonSerializer.Serialize(results);
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(json);

            return response;
        }
    }
}
