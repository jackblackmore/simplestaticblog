---
title: Capturing errors from Process.Start()
tags: Errors
---

May not be good but it works for now

```cs
processStartInfo.RedirectStandardOutput = true;
processStartInfo.RedirectStandardError = true;
processStartInfo.UseShellExecute = false;
Process process = Process.Start(processStartInfo);
```

Capture output to string builder, complete hack for now but will look at something better later

```cs
StringBuilder standardBuilder = new StringBuilder();
StringBuilder errorBuilder = new StringBuilder();


while (!process.StandardOutput.EndOfStream && !process.StandardError.EndOfStream)
        {
            string output = process.StandardOutput.ReadLine();
            string errorOutput = process.StandardError.ReadLine();
            standardBuilder.AppendLine(output);
            errorBuilder.AppendLine(errorOutput);
        }

 process.WaitForExit();

if (errorBuilder.Length > 0)
{
    Exception ex = new Exception(errorBuilder.ToString());
    ex.Data["StandardOutput"] = standardBuilder.ToString();
    throw ex;

}

if (process.ExitCode != 0)
{
    Exception ex = new Exception($"Process didn't exit successfully, ExitCode {process.ExitCode}");
    ex.Data["StandardOutput"] = standardBuilder.ToString();
    throw ex;
}
```