using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using LAHistoricalMarkers.Core.Settings;

namespace LaHistoricalMarkers.Core.Features.FileStorage;

public class ImageStorageService
{
    private readonly string account;
    private readonly string container;
    private readonly string key;
    private readonly Uri uri;

    public ImageStorageService(StorageSettings storageSettings)
    {
        uri = storageSettings.Uri;
        account = storageSettings.Account;
        key = storageSettings.Key;
        container = storageSettings.Container;
    }

    public async Task<string> UploadFileAndGetHandle(byte[] fileBytes)
    {
        var fileHandle = $"{Guid.NewGuid()}.png";
        using var memoryStream = new MemoryStream(fileBytes);

        var blobClient = await GetBlobClient(fileHandle);
        var blobHeaders = new BlobHttpHeaders();
        blobHeaders.ContentType = "image/png";
        await blobClient.UploadAsync(memoryStream, blobHeaders);
        return fileHandle;
    }

    public async Task Delete(Guid fileGuid)
    {
        var fileHandle = $"{fileGuid}.png";
        var blobClient = await GetBlobClient(fileHandle);
        await blobClient.DeleteIfExistsAsync();
    }

    private async Task<BlobClient> GetBlobClient(string fileHandle)
    {
        var credential = new StorageSharedKeyCredential(account, key);
        var blobService = new BlobServiceClient(uri, credential);
        var containerService = blobService.GetBlobContainerClient(container);
        await containerService.CreateIfNotExistsAsync(PublicAccessType.Blob);
        return containerService.GetBlobClient(fileHandle);
    }
}