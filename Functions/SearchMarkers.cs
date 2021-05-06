using System.Net;
using System.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Functions.Extensions;

namespace LaHistoricalMarkers.Functions
{
    public class Markers
    {
        private readonly MarkersService markersService;
        public Markers(MarkersService markersService)
        {
            this.markersService = markersService;
        }

        [Function("search-markers")]
        public async Task<HttpResponseData> Search([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "markers")] HttpRequestData req,
            FunctionContext executionContext)
        {
            var logger = executionContext.GetLogger("search-markers");
            logger.LogInformation("Request for markers received.");

            var query = HttpUtility.ParseQueryString(req.Url.Query);
            var region = query["region"].Deserialize<RegionDto>();
            var userLocation = query["userLocation"].Deserialize<UserLocationDto>();
            var typeFilters = query["typeFilters"]?.Deserialize<MarkerType[]>(); //type filters are optional to support older clients

            var results = await markersService.GetMarkersByRegion(region, userLocation, typeFilters);

            var json = results.Serialize();
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");

            response.WriteString(json);

            return response;
        }
    }
}
