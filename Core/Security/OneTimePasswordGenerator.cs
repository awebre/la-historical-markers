using System;
using System.Security.Cryptography;

namespace LaHistoricalMarkers.Core.Security;

public static class OneTimePasswordGenerator
{
    public static string Generate()
    {
        using (var randomNumberGenerator = RandomNumberGenerator.Create())
        {
            var randomBytes = new byte[8];
            randomNumberGenerator.GetBytes(randomBytes);
            var uniqueBytes = Guid.NewGuid().ToByteArray();
            var randomUniqueBytes = new byte[uniqueBytes.Length + 8];
            Array.Copy(randomBytes, 0, randomUniqueBytes, 0, randomBytes.Length);
            Array.Copy(uniqueBytes, 0, randomUniqueBytes, randomBytes.Length, uniqueBytes.Length);
            return Convert.ToBase64String(randomUniqueBytes).Trim().Replace("+", "-").Replace("/", "").Replace("=", "");
        }
    }
}