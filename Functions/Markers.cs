using System;
using System.Net;
using System.Text.Json;
using System.Web;
using System.IO;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using Dapper;
using LaHistoricalMarkers.Data;

namespace LaHistoricalMarkers.Functions
{
    public static class Markers
    {
        private static JsonSerializerOptions serializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        [Function("search-markers")]
        public static HttpResponseData Search([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "markers")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("search-markers");
            logger.LogInformation("Request for markers received.");

            var query = HttpUtility.ParseQueryString(req.Url.Query);

            var region = JsonSerializer.Deserialize<RegionDto>(query["region"], serializerOptions);
            var latitude = region.Latitude;
            var longitude = region.Longitude;

            //deltas map to 1 degree and represent the total number of degree from edge to edge
            //so we can calculate the lat/long of various edges by adding/subtracting half the delta
            //Note: this is an assumption that SEEMS to work - it may need re-evaluation
            var longitudeDelta = region.LongitudeDelta;
            var latitudeDelta = region.LongitudeDelta;

            var topLat = (latitude + (latitudeDelta / 2)).ToString();
            var bottomLat = (latitude - (latitudeDelta / 2)).ToString();
            var leftLong = (longitude - (longitudeDelta / 2)).ToString();
            var rightLong = (longitude + (longitudeDelta / 2)).ToString();


            var userLocation = JsonSerializer.Deserialize<UserLocationDto>(query["userLocation"], serializerOptions);
            //user lat/long are used to calculate distance
            //if no user lat/long is supplied, we'll use the center of the map
            var userLatitude = userLocation?.Latitude ?? latitude;
            var userLongitude = userLocation?.Longitude ?? longitude;

            var results = Database.GetConnection().Query<MarkerDto>(@"
SELECT TOP (10) [Id]
      ,[Name]
      ,[Description]
      ,[Location].[Lat] AS [Latitude]
      ,[Location].[Long] AS [Longitude]
      ,[ImageUrl]
      ,[IsApproved]
      ,[CreatedTimestamp]
      ,GEOGRAPHY::Point(@userLatitude, @userLongitude, 4326).STDistance([Location]) AS Distance
FROM [LaHistoricalMarkers].[dbo].[Marker]
WHERE GEOGRAPHY::STPolyFromText('Polygon(( ' + @rightLong + ' ' + @bottomLat + ', ' + @rightLong + ' ' + @topLat + ', ' + @leftLong + ' ' + @topLat + ', ' + @leftLong + ' ' + @bottomLat + ', ' + @rightLong + ' ' + @bottomLat + '))', 4326).STIntersects([Location]) = 1
AND [IsApproved] = 1
ORDER BY Distance",
new
{
    latitude,
    longitude,
    topLat,
    bottomLat,
    leftLong,
    rightLong,
    userLatitude,
    userLongitude
}).AsList();

            var json = JsonSerializer.Serialize(results, serializerOptions);
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(json);

            return response;
        }

        [Function("submit-markers")]
        public static HttpResponseData Submit([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "markers")] HttpRequestData req,
            [Queue("la-hm-approvals"), StorageAccount("AzureWebJobsStorage")] ICollector<string> msg,
            FunctionContext context)
        {
            using var streamReader = new StreamReader(req.Body);
            var submission = JsonSerializer.Deserialize<MarkerSubmissionDto>(streamReader.ReadToEnd(), serializerOptions);
            if (string.IsNullOrEmpty(submission.Name) || string.IsNullOrEmpty(submission.Description))
            {
                return req.CreateResponse(HttpStatusCode.BadRequest);
            }

            var id = Database.GetConnection().QuerySingle<int>(@"
INSERT INTO [LaHistoricalMarkers].[dbo].[Marker] (
    [Name], 
    [Description], 
    [Location], 
    [IsApproved], 
    [CreatedTimestamp]
)
OUTPUT INSERTED.Id
VALUES (
    @name,
    @description,
    GEOGRAPHY::Point(@latitude, @longitude, 4326),
    0,
    SYSDATETIMEOFFSET()
)",
new
{
    name = submission.Name,
    description = submission.Description,
    latitude = submission.Latitude,
    longitude = submission.Longitude
});
            var pending = new PendingSubmissionDto
            {
                Id = id,
                Name = submission.Name,
                Description = submission.Description,
                Latitude = submission.Latitude,
                Longitude = submission.Longitude,
            };

            msg.Add(JsonSerializer.Serialize(pending));

            return req.CreateResponse(HttpStatusCode.OK);
        }
    }
}
