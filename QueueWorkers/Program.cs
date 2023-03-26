using LaHistoricalMarkers.Core.Data;
using LaHistoricalMarkers.Core.Features.Authentication;
using LaHistoricalMarkers.Core.Features.Emails;
using LaHistoricalMarkers.Core.Features.Feedback;
using LaHistoricalMarkers.Core.Features.Moderation;
using LaHistoricalMarkers.Core.Infrastructure;
using LAHistoricalMarkers.Core.Settings;
using LAHistoricalMarkers.QueueWorkers.Workers;

var host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddSingleton<IConnectionStringProvider>(s => new SqlConnectionStringProvider(s.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")));
        services.AddScoped<OtpAuthService>();
        services.AddSingleton<QueueSettings>(s => s.GetRequiredService<IConfiguration>().GetSection(nameof(QueueSettings)).Get<QueueSettings>());
        services.AddScoped<QueueService>();
        services.AddScoped<ModerationService>();
        services.AddScoped<UserFeedbackService>();

        //Bind settings from config
        services.AddSingleton<StorageSettings>(services => services.GetRequiredService<IConfiguration>().GetSection(nameof(StorageSettings)).Get<StorageSettings>());
        services.AddSingleton<QueueSettings>(services => services.GetRequiredService<IConfiguration>().GetSection(nameof(QueueSettings)).Get<QueueSettings>());
        services.AddSingleton<NotificationSettings>(services => services.GetRequiredService<IConfiguration>().GetSection(nameof(NotificationSettings)).Get<NotificationSettings>());

        services.AddScoped<SendGridEmailService>(s =>
        {
            var config = s.GetService<IConfiguration>();
            if (config is null)
            {
                throw new Exception("IConfiguration was not registered");
            }
            return new SendGridEmailService(config.GetSection("SendGrid").Value, config.GetSection("FromEmail").Value);
        });

        services.AddHostedService<ApprovalQueueWorker>();
        services.AddHostedService<UserReportQueueWorker>();
        services.AddHostedService<UserFeedbackQueueWorker>();
    })
    .Build();

host.Run();