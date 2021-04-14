DECLARE @Id INT;
DECLARE @latitude VARCHAR(MAX);
DECLARE @longitude VARCHAR(MAX);

SET @Id = 0;
SET @latitude = '';
SET @longitude =  '';

BEGIN TRANSACTION
-- TODO: If this continues to be used for ad-hoc updates and approvals,
-- update this script so that it also deletes any MarkerAccess/OTP records
UPDATE [dbo].[Marker]
SET [Location] = GEOGRAPHY::Point(@latitude, @longitude, 4326),
    [IsApproved] = 1
  WHERE Id = @Id
-- CHANGE TO COMMIT WHEN READY
ROLLBACK