using System;
using System.Net;
using System.Text.Json;
using System.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Dapper;
using LaHistoricalMarkers.Data;

namespace LaHistoricalMarkers.Functions
{
    public static class Markers
    {
        [Function("search-markers")]
        public static HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "markers")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("search-markers");
            logger.LogInformation("Request for markers received.");
            
            var query = HttpUtility.ParseQueryString(req.Url.Query);

            //latitude and longitude should be safe as strings?
            var latitude = decimal.Parse(query["Latitude"]);
            var longitude = decimal.Parse(query["Longitude"]);

            //deltas map to 1 degree, which is equivalent to ~110km at the equator
            //this may require tweaking (and ideally we could stop guessing)
            var longitudeDelta = decimal.Parse(query["LongitudeDelta"]);
            var latitudeDelta = decimal.Parse(query["LatitudeDelta"]);

            var topLatitude = latitude + latitudeDelta;
            var bottomLatitude = latitude - latitudeDelta;
            var leftLong = longitude - longitudeDelta;
            var rightLong = longitude + longitudeDelta;
            var approxMeters = Math.Max(longitudeDelta, latitudeDelta) * 75 * 1000;

            var results = Database.GetConnection().Query<MarkerDto>(@"
SELECT TOP (10) [Id]
      ,[Name]
      ,[Description]
      ,[Location].[Lat] AS [Latitude]
      ,[Location].[Long] AS [Longitude]
      ,[ImageUrl]
      ,[IsApproved]
      ,[CreatedTimestamp]
      ,GEOGRAPHY::Point(@latitude, @longitude, 4326).STDistance([Location]) AS Distance
FROM [LaHistoricalMarkers].[dbo].[Marker]
WHERE GEOGRAPHY::Point(@latitude, @longitude, 4326).STDistance([Location]) <= @approxMeters
ORDER BY Distance", 
new { latitude, longitude, approxMeters }).AsList();
            
            var json = JsonSerializer.Serialize(results);
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(json);

            return response;
        }
    }
}
