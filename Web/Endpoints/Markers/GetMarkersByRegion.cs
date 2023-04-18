using FastEndpoints;
using FluentValidation;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using MediatR;

namespace LAHistoricalMarkers.Web.Endpoints.Markers;

public class GetMarkersByRegion : PublicApiEndpoint<MarkersByRegionRequest, IEnumerable<MarkerDto>>
{
    private readonly IMediator mediator;

    public GetMarkersByRegion(IMediator mediator)
    {
        this.mediator = mediator;
    }

    public override void Configure()
    {
        Get("/markers");
        base.Configure();
    }

    public override async Task<IEnumerable<MarkerDto>> ExecuteAsync(MarkersByRegionRequest req, CancellationToken ct)
    {
        var results = await mediator.Send(
            new GetMarkersByRegionRequest(req.Region!, req.UserLocation, req.TypeFilters),
            ct);
        return results;
    }
}

public class MarkersByRegionRequest
{
    [QueryParam]
    public RegionDto? Region { get; set; } //Validation rules mean that this should never be null

    [QueryParam]
    public UserLocationDto? UserLocation { get; set; }

    [QueryParam]
    public MarkerType[]? TypeFilters { get; set; }
}

public class MarkersByRegionRequestValidator : Validator<MarkersByRegionRequest>
{
    public MarkersByRegionRequestValidator()
    {
        RuleFor(x => x.Region)
            .NotNull();
    }
}