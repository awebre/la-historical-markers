using System.Text.Json;
using LaHistoricalMarkers.Config;

namespace LaHistoricalMarkers.Functions.Extensions
{
    public static class JsonSerializerExtensions
    {
        public static string Serialize<T>(this T obj)
        {
            return JsonSerializer.Serialize(obj, DefaultJsonConfiguration.SerializerOptions);
        }

        public static T Deserialize<T>(this string json)
        {
            return JsonSerializer.Deserialize<T>(json, DefaultJsonConfiguration.SerializerOptions);
        }
    }
}