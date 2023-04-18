using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using MediatR;

namespace LAHistoricalMarkers.Web.Endpoints.Markers;

public class GetMarkerById : PublicApiEndpoint<GetMarkerByIdRequest, MarkerDto>
{
    private readonly IMediator mediator;

    public GetMarkerById(IMediator mediator)
    {
        this.mediator = mediator;
    }

    public override void Configure()
    {
        Get("/markers/{id}");
        base.Configure();
    }

    public override async Task<MarkerDto> ExecuteAsync(GetMarkerByIdRequest req, CancellationToken ct)
    {
        return await mediator.Send(req, ct);
    }
}