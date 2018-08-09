---
title: Serialization 
tags: general
date: 2018-08-02
---

# XML Serialization
- Uses `System.Xml.Serialization`
- Creates clean XML that can be used and edited as a configuration file

### Serialize()

### DeSerialize()

### Example Class

```cs
    public class MyClass()
    {
        [XmlElement] public string Name { get; set;}
        [XmlAttribute("Age")] public int Age { get; set; }
    }
```


# Data Contract Serialization
- Uses `System.Runtime.Serialization`
- Benefit over XmlSerializer is it allows you to serialize dictionaries
- Downside is it creates _dirtier_ XML

### Serialize()
Example also uses DeflateStream to provide compression of the output, you'll no longer be able to edit as a text file but can massively reduce the filesize if direct access is not required. 

```cs
    public static void DataContractSerialize<T>(T obj, string filePath, bool compression = true)
    {

        using (FileStream fileStream = File.Open(filePath, FileMode.Create, FileAccess.ReadWrite))
        {
            if (compression)
            {
                using (DeflateStream compressionStream = new DeflateStream(fileStream, CompressionMode.Compress))
                {
                    DataContractSerializer serializer = new DataContractSerializer(typeof(T));
                    serializer.WriteObject(compressionStream, obj);
                }
            }
            else
            {
                DataContractSerializer serializer = new DataContractSerializer(typeof(T));
                serializer.WriteObject(fileStream, obj);
            }
        }

    }
```

### DeSerialize()

```cs
    public static T DataContractDeSerialize<T>(string filePath, bool compression = true)
    {
        // TODO: Add encryption
        // https://msdn.microsoft.com/en-us/library/system.security.cryptography.cryptostream(v=vs.110).aspx

        DataContractSerializer serializer = new DataContractSerializer(typeof(T));
        T serializedData;
        using (FileStream fileStream = File.Open(filePath, FileMode.Open, FileAccess.Read))
        {
            if (compression)
            {
                using (DeflateStream decompressionStream = new DeflateStream(fileStream, CompressionMode.Decompress))
                {
                    serializedData = (T) serializer.ReadObject(decompressionStream);
                }
            }
            else
            {
                serializedData = (T) serializer.ReadObject(fileStream);
            }
        }

        return serializedData;
    }
```

### Example Class

```cs
    [DataContract(Namespace = "")] // This strips namespace out of the serialized data
    public class MyClass 
    {
        [DataMember] public string Name { get; set; }
        [DataMember] public Dictionary<string, string> ExampleDictionary { get; set; }

    }

    [DataContract(Namespace = "")]
    public enum MyEnum
    {
        [EnumMember] Entry1 = 1,
        [EnumMember] Entry2 = 2
    }

```

# Binary Serialization

### Serialize()

```cs
    public static void BinarySerialize<T>(T obj, string filePath)
    {
        using (FileStream fileStream = new FileStream(filePath, FileMode.Create))
        {
            BinaryFormatter formatter = new BinaryFormatter();
            formatter.Serialize(fileStream, obj);
        }
    }
```

### DeSerialize

```cs
    public static T BinaryDeSerialize<T>(string filePath)
    {
        using (FileStream fs = new FileStream(filePath, FileMode.Open))
        {
            BinaryFormatter formatter = new BinaryFormatter();
            return (T) formatter.Deserialize(fs);
        }
    }

```

### Example Class

```cs
    [Serializeable()] // This strips namespace out of the serialized data
    public class MyClass 
    {
        [DataMember]
        public Dictionary<string, string> ExampleDictionary { get; set; }
        [DataMember]
        public string AnotherProperty { get; set; }

    }
```