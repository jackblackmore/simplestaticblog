---
title: Parsing CSV
tags: general
date: 2018-08-07
---
# Parsing CSVs

## VisualBasic's TextFieldParser

Add a reference to `Microsoft.VisualBasic.dll`
Docs can be found at [https://msdn.microsoft.com/en-us/library/microsoft.visualbasic.fileio.textfieldparser.aspx](https://msdn.microsoft.com/en-us/library/microsoft.visualbasic.fileio.textfieldparser.aspx)


```cs
using (TextFieldParser parser = new TextFieldParser(@"c:\temp\test.csv"))
{
    parser.TextFieldType = FieldType.Delimited;
    parser.SetDelimiters(",");
    while (!parser.EndOfData)
    {
        //Process row
        string[] fields = parser.ReadFields();
        foreach (string field in fields)
        {
            //TODO: Process field
        }
    }
}
```