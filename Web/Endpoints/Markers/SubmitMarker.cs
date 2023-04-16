using FastEndpoints;
using FluentValidation;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using MediatR;

namespace LAHistoricalMarkers.Web.Endpoints.Markers;

public class SubmitMarker : PublicApiEndpoint<SubmitMarkerRequest, PendingSubmissionDto>
{
    private readonly IMediator mediator;

    public SubmitMarker(
        IMediator mediator)
    {
        this.mediator = mediator;
    }

    public override void Configure()
    {
        Post("/markers");
        base.Configure();
    }

    public override Task<PendingSubmissionDto> ExecuteAsync(SubmitMarkerRequest req, CancellationToken ct)
    {
        return mediator.Send(req, ct);
    }
}

public class MarkerSubmissionValidator : Validator<SubmitMarkerRequest>
{
    public MarkerSubmissionValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required");

        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Description is required");
    }
}