using FastEndpoints;
using LaHistoricalMarkers.Core.Features.MarkerPhotos;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using MediatR;

namespace LAHistoricalMarkers.Web.Endpoints.MarkerPhotos;

public class PostMarkerPhoto : PublicApiEndpoint<PostPhotoRequest, PostPhotoResponse>
{
    private readonly IMediator mediator;

    public PostMarkerPhoto(IMediator mediator)
    {
        this.mediator = mediator;
    }

    public override void Configure()
    {
        Post("/marker-photos");
        AllowFileUploads();
        base.Configure();
    }

    public override async Task<PostPhotoResponse> ExecuteAsync(PostPhotoRequest req, CancellationToken ct)
    {
        using var stream = new MemoryStream();
        await req.File.CopyToAsync(stream, ct);
        var bytes = stream.ToArray();
        var result = await mediator.Send(new UploadPhotoRequest(bytes), ct);
        return new PostPhotoResponse
        {
            PhotoGuid = result
        };
    }
}

public class PostPhotoResponse
{
    public Guid PhotoGuid { get; set; }
}

public class PostPhotoRequest
{
    public IFormFile File { get; set; }
}

public class PostPhotoRequestValidator : Validator<PostPhotoRequest>
{
}