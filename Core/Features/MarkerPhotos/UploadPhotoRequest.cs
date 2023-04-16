using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.FileStorage;
using MediatR;

namespace LaHistoricalMarkers.Core.Features.MarkerPhotos;

public class UploadPhotoRequest : IRequest<Guid>
{
    public UploadPhotoRequest(byte[] photoBytes)
    {
        PhotoBytes = photoBytes;
    }

    public byte[] PhotoBytes { get; init; }
}

public class UploadPhotoRequestHandler : IRequestHandler<UploadPhotoRequest, Guid>
{
    private readonly ImageStorageService imageStorageService;

    public UploadPhotoRequestHandler(ImageStorageService imageStorageService)
    {
        this.imageStorageService = imageStorageService;
    }

    public async Task<Guid> Handle(UploadPhotoRequest request, CancellationToken cancellationToken)
    {
        var fileHandle = await imageStorageService.UploadFileAndGetHandle(request.PhotoBytes);
        var guid = Guid.Parse(fileHandle.Split(".").First());
        return guid;
    }
}