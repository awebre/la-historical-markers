using System.Net;
using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Functions.Extensions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;

namespace LaHistoricalMarkers.Functions
{
    public class MarkerById
    {
        private readonly MarkersService markersService;
        public MarkerById(MarkersService markersService)
        {
            this.markersService = markersService;
        }

        [Function("marker-by-id")]
        public async Task<HttpResponseData> GetMarkerById(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "marker/{id}")] HttpRequestData req,
            int id,
            FunctionContext context)
        {
            var marker = await markersService.GetMarkerById(id);
            var json = marker.Serialize();
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(json);

            return response;
        }

    }
}