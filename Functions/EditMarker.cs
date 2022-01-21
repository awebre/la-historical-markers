using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Functions.Extensions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace LaHistoricalMarkers.Functions;

public class EditMarker
{
    private readonly MarkersService markersService;
    public EditMarker(MarkersService markersService)
    {
        this.markersService = markersService;
    }

    [Function("edit-marker")]
    public async Task<HttpResponseData> GetMarkerById(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "marker/{id}")] HttpRequestData req,
        int id,
        FunctionContext context)
    {
        var query = HttpUtility.ParseQueryString(req.Url.Query);
        var otp = query["otp"];
        using var streamReader = new StreamReader(req.Body);
        var dto = streamReader.ReadToEnd().Deserialize<EditMarkerDto>();
        dto.Id = id;
        var result = await markersService.EditMarker(dto, otp);
        switch (result)
        {
            case EditMarkerResult.Succes:
                return req.CreateResponse(HttpStatusCode.OK);
            case EditMarkerResult.Unauthenticated:
            default:
                return req.CreateResponse(HttpStatusCode.Unauthorized);

        }
    }

}