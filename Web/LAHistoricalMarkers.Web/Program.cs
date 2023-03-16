using FastEndpoints;
using FastEndpoints.Swagger;
using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;
using LAHistoricalMarkers.Web.Security;

var builder = WebApplication.CreateBuilder(args);

//Register custom services
builder.Services.AddSingleton<IConnectionStringProvider>(_ => new SqlConnectionStringProvider(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<OtpAuthService>();


builder.Services.AddFastEndpoints();
builder.Services.AddSwaggerDoc();

//Add custom OTP auth scheme
builder.Services
    .AddAuthentication()
    .AddScheme<OtpAuthOptions, OtpAuthHandler>(OtpAuthOptions.Scheme, _ => { });

var app = builder.Build();
app.UseAuthorization();
app.UseFastEndpoints();
app.UseSwaggerGen();
app.Run();