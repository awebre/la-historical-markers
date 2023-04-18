using FastEndpoints;
using FastEndpoints.Swagger;
using LaHistoricalMarkers.Core.Behaviors;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Emails;
using LaHistoricalMarkers.Core.Features.FileStorage;
using LaHistoricalMarkers.Core.Features.Markers;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;
using LAHistoricalMarkers.Web.Endpoints.Configuration;
using LAHistoricalMarkers.Web.Security;
using LAHistoricalMarkers.Web.Security.Policies;
using MediatR;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);

//Register custom services
builder.Services.AddLogging();
builder.Services.AddSingleton<IConnectionStringProvider>(s =>
    new SqlConnectionStringProvider(s.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<OtpAuthService>();
builder.Services.AddScoped<MarkersService>();
builder.Services.AddScoped<QueueService>();
builder.Services.AddScoped<ModerationService>();

builder.Services.AddMediatR(config => config.RegisterServicesFromAssemblyContaining<MarkerDto>())
    .AddScoped(typeof(IPipelineBehavior<,>), typeof(TransactionScopePipelineBehavior<,>));

//Bind settings from config
builder.Services.AddSingleton<StorageSettings>(services =>
    services.GetRequiredService<IConfiguration>().GetSection(nameof(StorageSettings)).Get<StorageSettings>());
builder.Services.AddSingleton<QueueSettings>(services =>
    services.GetRequiredService<IConfiguration>().GetSection(nameof(QueueSettings)).Get<QueueSettings>());
builder.Services.AddSingleton<NotificationSettings>(services =>
    services.GetRequiredService<IConfiguration>().GetSection(nameof(NotificationSettings)).Get<NotificationSettings>());

builder.Services.AddScoped<ImageStorageService>(s =>
{
    var storageSettings = s.GetService<StorageSettings>();
    if (storageSettings is null) throw new Exception($"{nameof(StorageSettings)} must be populated via Configuration");
    return new ImageStorageService(storageSettings);
});

//TODO: this app doesn't actually use sendgrid, so we need to decouple things a little better
builder.Services.AddScoped<SendGridEmailService>(s =>
{
    var config = s.GetService<IConfiguration>();
    if (config is null) throw new Exception("IConfiguration was not registered");
    return new SendGridEmailService(config.GetSection("SendGrid").Value, config.GetSection("FromEmail").Value);
});


builder.Services.AddFastEndpoints();
builder.Services.AddSwaggerDoc(s =>
{
    s.EndpointFilter(e =>
    {
        //Locally, we want the ability to test all endpoints via Swagger
        if (builder.Environment.IsEnvironment("local")) return true;

        return e.EndpointTags?.Contains(EndpointTagNames.PublicApi) is true;
    });
}, shortSchemaNames: true);

//Add custom OTP auth scheme
builder.Services
    .AddAuthentication()
    .AddScheme<OtpAuthOptions, OtpAuthHandler>(OtpAuthOptions.Scheme, _ => { });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(CustomPolicies.MarkerAccess,
        policy => policy.Requirements.Add(new MarkerAccessPolicyRequirement()));
});
builder.Services.AddSingleton<IAuthorizationHandler, MarkerAccessHandler>();

var app = builder.Build();
app.UseAuthorization();
app.UseFastEndpoints(c =>
{
    c.Endpoints.RoutePrefix = "api";
    c.Endpoints.ShortNames = true;
});
app.UseSwaggerGen();
app.Run();