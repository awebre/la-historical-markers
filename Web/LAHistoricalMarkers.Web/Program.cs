using FastEndpoints;
using FastEndpoints.Swagger;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Markers;
using LAHistoricalMarkers.Web.Security;
using LAHistoricalMarkers.Web.Security.Policies;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

//Register custom services
builder.Services.AddSingleton<IConnectionStringProvider>(_ => new SqlConnectionStringProvider(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<OtpAuthService>();
builder.Services.AddScoped<MarkersService>();


builder.Services.AddFastEndpoints();
builder.Services.AddSwaggerDoc();

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
app.UseFastEndpoints();
app.UseSwaggerGen();
app.Run();