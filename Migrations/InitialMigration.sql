BEGIN TRANSACTION

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

IF COL_LENGTH('LaHistoricalMarkers.dbo.Marker', 'ImageFileName') IS NULL
    EXEC SP_RENAME 'LaHistoricalMarkers.dbo.Marker.ImageUrl', 'ImageFileName', 'COLUMN'

IF COL_LENGTH('LaHistoricalMarkers.dbo.Marker', 'Type') IS NULL
    ALTER TABLE [LaHistoricalMarkers].[dbo].[Marker]
        ADD [Type] VARCHAR(256) NULL;
    GO

UPDATE [LaHistoricalMarkers].[dbo].[Marker]
    SET [Type] = 'Official'
    WHERE [Type] IS NULL

ALTER TABLE [LaHistoricalMarkers].[dbo].[Marker]
ALTER COLUMN [Type] VARCHAR(256) NOT NULL;

COMMIT