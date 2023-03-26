using System;

namespace LAHistoricalMarkers.Core.Settings;

public class QueueSettings
{
    public Uri Uri { get; set; }

    public string ApprovalEmailQueue { get; set; }

    public string UserReportEmailQueue { get; set; }

    public string UserFeedbackEmailQueue { get; set; }
}