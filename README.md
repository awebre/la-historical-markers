# LA Historical Markers

The purpose of the project is to create a crowd-sourced database of Louisiana's Historical Markers, their contents, and their locations. The end goal is to have a mobile app that can be used to search for these markers, with content created by and (eventually, _hopefully_) updated by anyone. As with any crowd-sourced database, these entries will be moderated and screened.

For the uninitiated, LA Historical Markers are brown, roadside signs that mark a historical structure, person, or place. They can be found across Louisiana and there appears to be no current, definitive, and exhaustive list of these signs, their contents, and their current locations.

# Architecture

In an attempt to minimize cost, this project consists of a SQL Server, Azure Functions, and a React Native client.

In an attempt at simplicity, this project uses Dapper to query the SQL Server and map database records to DTOs that can be sent to the client. I'm imagining there to be very little to no "business logic" as this will mostly be submission of (at most) two forms (create and update). The exact mechanism for approval hasn't been decided upon, but current thinking is anywhere from "update the db directly" to "email with a 'click to approve' link" (we are trying to avoide the cost and complexity of adding some kind of "portal").

# Set Up

## SQL Server

With SQL Server installed and an instance running, you can run `Migrations/InitialMigration.sql` against your current instance. This should create the necessary Database, Table(s), and seed some initial data. If additional migrations are required, create a new SQL file with the required SQL to migrate the DB to the new state.

## Azure Functions

Getting Azure Functions setup locally is as simple as adding the [https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions](VS Code Azure Functions extension). With this extension installed, you should have all of the dependencies and tools needed to run the function(s) locally. This extension will also help you deploy the function(s) to your own Azure Subscription (should you want to test in a "prod-like" environment).

In order for the Azure Function to be configured properly, you will need to add a file called `local.settings.json` to the root of the project. It should contain the following contents:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "ConnectionString": "Server=localhost,1433; Database=LaHistoricalMarkers; User=sa; Password=YourPassword;"
  }
}
```

Note that you will likely need to change the connection string (especially the password), to match your SQL Server instance configuration.

## React Native

I honestly haven't gotten here yet. This is the next step.
