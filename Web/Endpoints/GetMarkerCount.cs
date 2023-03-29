using FastEndpoints;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using MediatR;

namespace LAHistoricalMarkers.Web.Endpoints;

public class GetMarkerCount : PublicApiEndpoint<EmptyRequest, int>
{
    private readonly IMediator mediator;

    public GetMarkerCount(IMediator mediator)
    {
        this.mediator = mediator;
    }

    public override void Configure()
    {
        Get("/markers/count");
        base.Configure();
    }

    public override Task<int> ExecuteAsync(EmptyRequest req, CancellationToken ct)
    {
        return mediator.Send(new GetMarkerCountQuery(), ct);
    }
}