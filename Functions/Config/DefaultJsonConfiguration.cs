using System;
using System.Text.Json;

namespace LaHistoricalMarkers.Config 
{
    public static class DefaultJsonConfiguration 
    {
        public static JsonSerializerOptions SerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };
    }
}