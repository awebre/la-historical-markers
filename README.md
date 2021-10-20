# LA Historical Markers

The purpose of the project is to create a crowd-sourced database of Louisiana's Historical Markers, their contents, and their locations. The end goal is to have a mobile app that can be used to search for these markers, with content created by and (eventually, _hopefully_) updated by anyone. As with any crowd-sourced database, these entries will be moderated and screened.

For the uninitiated, LA Historical Markers are brown, roadside signs that mark a historical structure, person, or place. They can be found across Louisiana and there appears to be no current, definitive, and exhaustive list of these signs, their contents, and their current locations.

# Architecture

In an attempt to minimize cost, this project consists of a SQL Server, Azure Functions, Azure Storage, and a React Native client.

In an attempt at simplicity, this project uses Dapper to query the SQL Server and map database records to DTOs that can be sent to the client. I'm imagining there to be very little to no "business logic" as this will mostly be submission of (at most) two forms (create and update).

The general idea is:
Azure Functions are used to query the SQL Server and take actions such as sending out email notifications to an admin for pending approvals.
Azure Storage Queues are used for communication between functions (this gives us the ability to retry via data kept in poison queues).
The React Native (Expo) calls out to the Azure Functions and "things happen."

# Set Up

## SQL Server

With SQL Server installed and an instance running, you can run `Migrations/InitialMigration.sql` against your current instance. This should create the necessary Database, Table(s), and seed some initial data. For now, additional migrations can be added directly to this file, but long term we will probably need to break this out to multiple files and ensure some kind of order of operations.

## Azure Functions Back End

**Note:** this project targets .NET 5. As such, the .NET 5 SDKs will need to be installed. This has far reaching implications, as it is the first .NET release to run in an isolated process within Azure Functions (more on that [here](https://techcommunity.microsoft.com/t5/apps-on-azure/net-on-azure-functions-roadmap/ba-p/2197916) and [here](https://docs.microsoft.com/en-us/azure/azure-functions/dotnet-isolated-process-guide)).

Getting Azure Functions setup locally is as simple as adding the [VS Code Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions). With this extension installed, you should have all of the dependencies and tools needed to run the function(s) locally. This extension will also help you deploy the function(s) to your own Azure Subscription (should you want to test in a "prod-like" environment).

With the extension installed, open `la-hm-functions.code-workspace` in VS Code (if prompted to initialize this Azure Function for use in VS Code, accept). In order for the Azure Function to be configured properly, you will need to add a file called `local.settings.json` to the root (`Functions`) folder. It should contain the following contents:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "ConnectionString": "Server=localhost,1433; Database=LaHistoricalMarkers; User=sa; Password=YourPassword;",
    "SendGrid": "YOUR_SEND_GRID_API_KEY",
    "FromEmail": "you@email.net",
    "ToEmails": "testaccount1@email.net,testaccount2@email.net",
    "Template": "SEND_GRID_EMAIL_TEMPLATE",
    "StorageKey": "Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==",
    "StorageAccount": "devstoreaccount1",
    "StorageUri": "http://127.0.0.1:10000/devstoreaccount1",
    "StorageContainer": "marker-photos"
  }
}
```

The `AzureWebJobsStorage` key is used to configure the blob and queue storage that is used by this app. The value that is supplied in this example is the configuration for the Azurite Emulator, which allows you to develop using a local version of Azure Storage. In order for this to work, you will want to download and start the [Azurite VS Code Extension](https://marketplace.visualstudio.com/items?itemName=Azurite.azurite).

The `FUNCTIONS_WORKING_RUNTIME` key specifies that this function runs in an isolated process. **This means that many of the standard .NET Azure Function Bindings do not work - support for those should expand in .NET 6**

The `ConnectionString` key should be used to configure your connection to a SQL Database. Note: you will need to change the connection string (especially the password), to match your SQL Server instance configuration.

The next four items after the connection string are configuration for SendGrid. The API Key and the Template should be created and managed from your SendGrid account.

The last four items are used to configure the Azure Blob Storage Client, which we use to store images. Similar to the `AzureWebJobStorage` key, the configuration shown here is exactly what should be used for local dev against the Azurite Emulator. Please note that local dev on iOS will not display images, as Apple does not allow requests over http (even in simulators).

With these components installed and the settings file added (and updated), you should be able to click Run (or F5) and the functions should spin up for you to test locally.

Note: you can also run the functions from within the root of the repository itself by simply clicking run.
If you'd like to run the functions in "watch" mode, you can run `dotnet watch msbuild /t:RunFunctions` in the `Functions` folder.

## Expo Mobile App

The mobile app was created using Expo, so running it is as simple as making sure you have have Expo installed and running `expo start`.

Note: A Google Maps Android SDK api key is required to get the MapView to display on Android. Please see expo documentation [MapView](https://docs.expo.io/versions/latest/sdk/map-view/) (aka react-native-maps). This api key will need to be added to `app.config.ts`, but **should not be committed to source control**.

On an "unrelated" note, Expo could use some work around environment variables.
