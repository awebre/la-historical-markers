using System.Net;
using System.Web;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using System.Threading.Tasks;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Functions.Extensions;

namespace LaHistoricalMarkers.Functions
{
    public class MarkerTextSearch
    {
        private readonly MarkersService markersService;
        public MarkerTextSearch(MarkersService markersService)
        {
            this.markersService = markersService;
        }

        [Function("search-by-name")]
        public async Task<HttpResponseData> Search([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "markers/search/{search}")] HttpRequestData req,
            string search,
            FunctionContext executionContext)
        {
            var results = await markersService.GetMarkersBySearchTerm(search);
            var json = results.Serialize();
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "application/json; charset=utf-8");
            response.WriteString(json);
            return response;
        }
    }
}
