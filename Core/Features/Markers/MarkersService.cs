using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;

namespace LaHistoricalMarkers.Core.Features.Markers
{
    public class MarkersService : BaseSqlService
    {
        private readonly OtpAuthService authService;

        public MarkersService(OtpAuthService authService, IConnectionStringProvider connectionProvider) : base(connectionProvider)
        {
            this.authService = authService;
        }

        public async Task<IEnumerable<MarkerDto>> GetMarkersByRegion(RegionDto region, UserLocationDto userLocation, MarkerType[] typeFilters = null)
        {
            //If no type filters are supplied then we assume that an older
            //client is querying us (one that isn't filter-aware)
            if (typeFilters == null || !typeFilters.Any())
            {
                typeFilters = Enum.GetValues<MarkerType>();
            }

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
            AND [Type] IN @typeFilters
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
                userLongitude,
                typeFilters = typeFilters.Select(x => x.ToString())
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

        public async Task<MarkerDto> GetMarkerById(int id)
        {
            var marker = await QuerySingleOrDefaultAsync<MarkerDto>(@"
            SELECT TOP (1) [Id]
                ,[Name]
                ,[Description]
                ,[Location].[Lat] AS [Latitude]
                ,[Location].[Long] AS [Longitude]
                ,[ImageFileName]
                ,[IsApproved]
                ,[CreatedTimestamp]
                ,[Type]
            FROM [LaHistoricalMarkers].[dbo].[Marker]
            WHERE [Id] = @id
            ", new { id });

            return marker;
        }

        public async Task<EditMarkerResult> EditMarker(EditMarkerDto markerDto, string otp)
        {
            using var connection = GetConnection();
            connection.Open();
            using var transaction = connection.BeginTransaction();
            var authResult = await authService.GetAuthResult(markerDto.Id, otp, transaction);

            if (authResult == AuthResult.Denied)
            {
                transaction.Commit();
                return EditMarkerResult.Unauthenticated;
            }

            connection.Execute(@"
UPDATE [dbo].[Marker]
SET 
    [Name] = @name,
    [Description] = @description,
    [Location] = GEOGRAPHY::Point(@latitude, @longitude, 4326),
    [Type] = @type,
    [IsApproved] = @isApproved
WHERE Id = @id",
            new
            {
                id = markerDto.Id,
                name = markerDto.Name,
                description = markerDto.Description,
                latitude = markerDto.Latitude,
                longitude = markerDto.Longitude,
                type = markerDto.Type.ToString(),
                isApproved = markerDto.IsApproved
            }, transaction);
            transaction.Commit();
            return EditMarkerResult.Succes;
        }
    }
}