---
title: Cancelling async Tasks after timeout
tags: async, task
date: 2018-11-23
---

# Cancelling async Tasks after timeout

Found both examples on stack overflow obviously: [https://stackoverflow.com/questions/34764279/cancel-execution-of-command-if-it-takes-too-long](https://stackoverflow.com/questions/34764279/cancel-execution-of-command-if-it-takes-too-long)

## Using an extension method

### Extension Method
```cs
public static class ExtensionMethods 
{
    public static async Task TimeoutAfter(this Task task, int millisecondsTimeout)
    {
        if (task == await Task.WhenAny(task, Task.Delay(millisecondsTimeout)))
            await task;
        else
            throw new TimeoutException();
    }
}
```

### Usage
 - We can also use `Task.WaitAll(Task)` rather than awaiting the Task

```cs
try
{
    await Task.Run( () => { _wordDocument.UpdateDocumentFields(); }).TimeoutAfter(2000); // TODO: What does this do?! It works though
}
catch (TimeoutException ex)
{
    MessageBox.Show("Timed out");
}
```

## Using .Wait(timeout)

```cs
try 
{
    if ( !Task.Run( () => { _wordDocument.UpdateDocumentFields(); }).Wait( 2000 ) )
    {
        throw new TimeoutException();
    }
}
catch (TimeoutException ex)
{
    MessageBox.Show("Timed out");
}
```