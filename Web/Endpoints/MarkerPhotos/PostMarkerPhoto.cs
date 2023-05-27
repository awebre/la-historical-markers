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
        AllowFileUploads(true); //turns off buffering
        base.Configure();
    }

    public override async Task<PostPhotoResponse> ExecuteAsync(PostPhotoRequest req, CancellationToken ct)
    {
        var firstFormSection = await FormFileSectionsAsync(ct).FirstOrDefaultAsync(ct);
        if (firstFormSection is not null)
        {
            var tempHandle = Guid.NewGuid();
            await using (var fs = File.Create(Path.Combine(Path.GetTempPath(), tempHandle.ToString()), 4096,
                             FileOptions.DeleteOnClose))
            {
                await firstFormSection.Section.Body.CopyToAsync(fs, 1024 * 64, ct);
                fs.Position = 0;
                var result = await mediator.Send(new UploadPhotoRequest(fs), ct);
                return new PostPhotoResponse
                {
                    PhotoGuid = result
                };
            }
        }

        return new PostPhotoResponse();
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