using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace LaHistoricalMarkers.Core.Features.FileStorage;

public class ImageStorageService
{
    private readonly Uri uri;
    private readonly string account;
    private readonly string key;
    private readonly string container;

    public ImageStorageService(Uri uri, string account, string key, string container)
    {
        this.uri = uri;
        this.account = account;
        this.key = key;
        this.container = container;
    }

    public async Task<string> UploadFileAndGetHandle(byte[] fileBytes)
    {
        var fileHandle = $"{Guid.NewGuid()}.png";
        using var memoryStream = new MemoryStream(fileBytes);
        var serviceUri = uri;
        var credential = new StorageSharedKeyCredential(account, key);
        var blobService = new BlobServiceClient(serviceUri, credential);
        var containerService = blobService.GetBlobContainerClient(container);
        containerService.CreateIfNotExists(PublicAccessType.Blob);
        var blobClient = containerService.GetBlobClient(fileHandle);
        var blobHeaders = new BlobHttpHeaders();
        blobHeaders.ContentType = "image/png";
        await blobClient.UploadAsync(memoryStream, blobHeaders);
        return fileHandle;
    }
}