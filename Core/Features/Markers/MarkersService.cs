using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;

namespace LaHistoricalMarkers.Core.Features.Markers
{
    public class MarkersService : BaseSqlService
    {
        public MarkersService(IConnectionStringProvider connectionProvider) : base(connectionProvider)
        {
        }

        public async Task<IEnumerable<MarkerDto>> GetMarkersByRegion(RegionDto region, UserLocationDto userLocation)
        {
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

            //user lat/long are used to calculate distance
            //if no user lat/long is supplied, we'll use the center of the map
            var userLatitude = userLocation?.Latitude ?? latitude;
            var userLongitude = userLocation?.Longitude ?? longitude;

            return (await QueryAsync<MarkerDto>(@"
            SELECT TOP (1000) [Id]
                ,[Name]
                ,[Description]
                ,[Location].[Lat] AS [Latitude]
                ,[Location].[Long] AS [Longitude]
                ,[ImageFileName]
                ,[IsApproved]
                ,[CreatedTimestamp]
                ,GEOGRAPHY::Point(@userLatitude, @userLongitude, 4326).STDistance([Location]) AS Distance
                ,[Type]
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
            })).AsList();
        }

        public async Task<PendingSubmissionDto> AddMarkerSubmission(MarkerSubmissionDto submission, string fileHandle)
        {
            var id = await QuerySingleAsync<int>(@"
            INSERT INTO [LaHistoricalMarkers].[dbo].[Marker] (
                [Name], 
                [Description], 
                [Location], 
                [IsApproved], 
                [CreatedTimestamp],
                [ImageFileName],
                [Type]
            )
            OUTPUT INSERTED.Id
            VALUES (
                @name,
                @description,
                GEOGRAPHY::Point(@latitude, @longitude, 4326),
                0,
                SYSDATETIMEOFFSET(),
                @imageFileName,
                @type
            )",
            new
            {
                name = submission.Name,
                description = submission.Description,
                latitude = submission.Latitude,
                longitude = submission.Longitude,
                imageFileName = fileHandle,
                type = submission.Type.ToString()
            });

            return new PendingSubmissionDto
            {
                Id = id,
                Name = submission.Name,
                Description = submission.Description,
                Latitude = submission.Latitude,
                Longitude = submission.Longitude,
                ImageFileName = fileHandle,
                Type = submission.Type.ToString()
            };
        }
    }
}