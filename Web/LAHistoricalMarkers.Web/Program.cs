using FastEndpoints;
using FastEndpoints.Swagger;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.FileStorage;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using LAHistoricalMarkers.Web.Security;
using LAHistoricalMarkers.Web.Security.Policies;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

//Register custom services
builder.Services.AddSingleton<IConnectionStringProvider>(_ => new SqlConnectionStringProvider(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<OtpAuthService>();
builder.Services.AddScoped<MarkersService>();
builder.Services.AddScoped<QueueService>();

//Bind settings from config
builder.Services.AddSingleton<StorageSettings>(services => services.GetRequiredService<IConfiguration>().GetSection(nameof(StorageSettings)).Get<StorageSettings>());
builder.Services.AddSingleton<QueueSettings>(services => services.GetRequiredService<IConfiguration>().GetSection(nameof(QueueSettings)).Get<QueueSettings>());

builder.Services.AddScoped<ImageStorageService>(s =>
{
    var storageSettings = s.GetService<StorageSettings>();
    if (storageSettings is null)
    {
        throw new Exception($"{nameof(StorageSettings)} must be populated via Configuration");
    }
    return new ImageStorageService(storageSettings.Uri, storageSettings.Account, storageSettings.Key, storageSettings.Container);
});


builder.Services.AddFastEndpoints();
builder.Services.AddSwaggerDoc(s =>
{
    s.EndpointFilter(e => e.EndpointTags?.Contains(EndpointTagNames.PublicApi) is true);
});

//Add custom OTP auth scheme
builder.Services
    .AddAuthentication()
    .AddScheme<OtpAuthOptions, OtpAuthHandler>(OtpAuthOptions.Scheme, _ => { });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(CustomPolicies.MarkerAccess, policy => policy.Requirements.Add(new MarkerAccessPolicyRequirement()));
});
builder.Services.AddSingleton<IAuthorizationHandler, MarkerAccessHandler>();

var app = builder.Build();
app.UseAuthorization();
app.UseFastEndpoints(c =>
{
    c.Endpoints.RoutePrefix = "api";
});
app.UseSwaggerGen();
app.Run();