IF DB_ID('LaHistoricalMarkers') IS NULL
    CREATE DATABASE [LaHistoricalMarkers];
GO

IF OBJECT_ID('LaHistoricalMarkers.dbo.Marker') IS NULL
    CREATE TABLE [LaHistoricalMarkers].[dbo].[Marker](
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Name] VARCHAR(256) NOT NULL,
        [Description] NVARCHAR(MAX) NOT NULL,
        [Location] GEOGRAPHY NOT NULL,
        [ImageUrl] VARCHAR(MAX),
        [IsApproved] BIT NOT NULL,
        [CreatedTimestamp] DATETIMEOFFSET NOT NULL,
    )
GO

-- TODO: THIS PART SHOULD ONLY CREATE THESE ITEMS IF THEY DON'T EXIST
-- FOR NOW I AM GOING TO COMMENT THEM OUT SO THAT I DON'T ACCIDENTALLY
-- DELETE PRODUCTION DATA

-- DELETE FROM [LaHistoricalMarkers].[dbo].[Marker]
-- INSERT INTO [LaHistoricalMarkers].[dbo].[Marker] (
--     [Name], 
--     [Description], 
--     [Location], 
--     [IsApproved], 
--     [CreatedTimestamp]
-- )
-- VALUES 
--     (
--         'Skirmish of Boutte Station',
--         'Union train with sixty men ambushed by Confederate force of Louisiana militia and volunteers on September 4, 1862. Train escaped to New Orleans. Fourteen Union soldiers killed and twenty-two wounded in the skirmish.',
--         GEOGRAPHY::Point('29.900780', '-90.388458', 4326),
--         1,
--         SYSDATETIMEOFFSET()
--     ),
--     (
--         'Woodland Plantation',
--         'Acquired in 1793 & 1808 by Manual Andry, a commandant of the German Coast. Major 1811 slave uprising organized here. Ory Bros. & A. Lasseigne were last owners of plantation. Its subdivision in 1923 spurred growth of LaPlace.',
--         GEOGRAPHY::Point('30.066353', '-90.480428', 4326),
--         1,
--         SYSDATETIMEOFFSET()
--     )

IF OBJECT_ID('LaHistoricalMarkers.dbo.OneTimePassword') IS NULL
    CREATE TABLE [LaHistoricalMarkers].[dbo].[OneTimePassword](
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [Value] VARCHAR(125) NOT NULL
    )

IF OBJECT_ID('LaHistoricalMarkers.dbo.MarkerAccess') IS NULL
    CREATE TABLE [LaHistoricalMarkers].[dbo].[MarkerAccess](
        [Id] INT IDENTITY(1,1) PRIMARY KEY,
        [MarkerId] INT NOT NULL,
        [OtpId] INT NOT NULL,
        FOREIGN KEY ([MarkerId]) REFERENCES [LaHistoricalMarkers].[dbo].[Marker],
        FOREIGN KEY ([OtpId]) REFERENCES [LaHistoricalMarkers].[dbo].[OneTimePassword]
    )