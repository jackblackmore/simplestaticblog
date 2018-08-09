---
title: Custom NLOG Target To Email And Attach Log Files
tags: NLog
date: 2018-08-09
---

# Custom NLOG Target To Email And Attach Log Files

- Bare bones custom NLOG target that will send emails and attach logs as the built in mailing target doesn't allow attachments
- The target caches all log events until the extension method `SendMail()` is called on the Logger
- Will Look for the highest log level that's cached and then attach all relevant log files to the email and send

## Usage
```cs
Target.Register<NLogMailTarget.NLogMailTarget>("NLogMailTarget");
_logger.SendMail();
```
## 

## Sample Config File:
```XML
<target name="logMail" xsi:type="NLogMailTarget" 
        Host="my.smtp.host.com"
        From="jack@blackmore.com"
        To="jack@blackmore.com"
        Subject="Some logs files"/>
```

## Custom Target code
```cs
namespace NLogMailTarget
{
    public static class ExtensionMethods
    {
        public static void SendMail(this Logger logger)
        {
            NLogMailTarget mailTarget =
                logger.Factory.Configuration.ConfiguredNamedTargets.FirstOrDefault(x => x is NLogMailTarget) as NLogMailTarget;
            mailTarget?.SendMail();
        }
    }

    [Target("NLogMailTarget")]
    public sealed class NLogMailTarget : TargetWithLayout
    {
        private List<LogItem> _loggedItems;
        private bool _sendingMail;

        [RequiredParameter]
        public string From { get; set; }

        [RequiredParameter]
        public string Host { get; set; }

        [RequiredParameter]
        public string Subject { get; set; }

        [RequiredParameter]
        public string To { get; set; }


        public NLogMailTarget()
        {
            _sendingMail = false;
            _loggedItems = new List<LogItem>();
        }

        public void SendMail()
        {
            if (_loggedItems.Count == 0 || _sendingMail)
                return;

            _sendingMail = true;
            LogLevel maxLogLevel = GetMaxLogLevelFromLoggedEvents();
            List<string> attachments = ListActiveLogFiles(maxLogLevel);

            SmtpClient smtpClient = new SmtpClient(Host);

            using (MailMessage message = new MailMessage())
            {
                message.From = new MailAddress(From);
                message.To.Add(To);
                message.Subject = $"{Subject}: {maxLogLevel.Name}";

                message.IsBodyHtml = false;
                message.Body = GenerateMailBodyFromLoggedItems();
                smtpClient.UseDefaultCredentials = true;
                smtpClient.Timeout = 60 * 5 * 1000;

                if (attachments.Count > 0)
                {
                    foreach (string attachment in attachments)
                    {
                        message.Attachments.Add(new Attachment(attachment));
                    }
                }

                smtpClient.Send(message);
            }

            _loggedItems.Clear();
        }

        protected override void Write(LogEventInfo logEvent)
        {
            _loggedItems.Add(new LogItem(logEvent, Layout.Render(logEvent)));
        }

        private List<string> ListActiveLogFiles(LogLevel maxLogLevel)
        {
            List<string> attachments = new List<string>();

            IEnumerable<FileTarget> targets = LoggingConfiguration.LoggingRules
                .Where(r => r.Levels.Any(l => l.Ordinal <= maxLogLevel.Ordinal))
                .SelectMany(r => r.Targets).OfType<FileTarget>();

            foreach (FileTarget target in targets)
            {
                string logPath = target.FileName.Render(new LogEventInfo());
                if (File.Exists(logPath))
                    attachments.Add(logPath);
            }

            return attachments;
        }

        private LogLevel GetMaxLogLevelFromLoggedEvents()
        {
            int maxLogLevelOrdinal = 0;
            LogLevel maxLogLevel = null;

            foreach (LogItem loggedItem in _loggedItems)
            {
                if (loggedItem.LogLevel.Ordinal > maxLogLevelOrdinal)
                {
                    maxLogLevelOrdinal = loggedItem.LogLevel.Ordinal;
                    maxLogLevel = loggedItem.LogLevel;
                }
            }

            return maxLogLevel;
        }

        private string GenerateMailBodyFromLoggedItems()
        {
            // TODO: Update to generate a formatted HTML body.

            string body = "";
            foreach (LogItem loggedItem in _loggedItems)
            {
                body += $"{loggedItem.Message}\r\n";
            }

            return body;
        }

        private class LogItem
        {
            public LogLevel LogLevel { get; set; }

            public string Message { get; set; }

            public LogItem(string logStatus, int logLevel, string message)
            {
                Message = message;
            }

            public LogItem(LogEventInfo logEvent, string message)
            {
                LogLevel = logEvent.Level;
                Message = message;
            }
        }
    }
}
```