using FastEndpoints;
using LaHistoricalMarkers.Core.Features.MarkerPhotos;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using MediatR;

namespace LAHistoricalMarkers.Web.Endpoints.MarkerPhotos;

public class DeleteMarkerPhoto : PublicApiEndpoint<DeleteMarkerPhotoRequest, EmptyResponse>
{
    private readonly IMediator mediator;

    public DeleteMarkerPhoto(IMediator mediator)
    {
        this.mediator = mediator;
    }

    public override void Configure()
    {
        Delete("/marker-photos/{PhotoHandle}");
        base.Configure();
    }

    public override async Task<EmptyResponse> ExecuteAsync(DeleteMarkerPhotoRequest req, CancellationToken ct)
    {
        await mediator.Send(req, ct);
        return new EmptyResponse();
    }
}