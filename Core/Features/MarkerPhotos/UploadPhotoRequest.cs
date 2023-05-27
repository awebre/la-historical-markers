using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ImageMagick;
using LaHistoricalMarkers.Core.Behaviors;
using LaHistoricalMarkers.Core.Features.FileStorage;
using MediatR;

namespace LaHistoricalMarkers.Core.Features.MarkerPhotos;

public class UploadPhotoRequest : IRequest<Guid>, IIgnoreTransaction
{
    public UploadPhotoRequest(Stream photoStream)
    {
        PhotoStream = photoStream;
    }

    public Stream PhotoStream { get; init; }
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
        AttemptResize(request.PhotoStream);

        var fileHandle = await imageStorageService.UploadFileAndGetHandle(request.PhotoStream);
        var guid = Guid.Parse(fileHandle.Split(".").First());
        return guid;
    }

    private void AttemptResize(Stream stream)
    {
        //TODO: figure out a way to more aggressively reduce file size without destroying image quality
        stream.Position = 0;
        var optimizer = new ImageOptimizer
        {
            OptimalCompression = true,
        };
        optimizer.LosslessCompress(stream);
        stream.Position = 0;
    }
}