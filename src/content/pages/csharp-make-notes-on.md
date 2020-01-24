---
title:: CSharp point to make notes on
tags: csharp    
---
Bits and bobs to make notes on in CSharp

# Reflection

## Assembly.GetTypes
```cs
    Assembly assembly = Assembly.GetExecutingAssembly();
    Type[] assemblyTypes = assembly.GetTypes();
    foreach(Type t in assemblyTypes)
        Console.WriteLine(t.Name);
```

## Type.GetConstructor & Type.GetMethod
```cs
    Type testType = typeof(TestClass);
    ConstructorInfo ctor = testType.GetConstructor(System.Type.EmptyTypes);
    if(ctor != null)
    {
        object instance = ctor.Invoke(null);
        MethodInfo methodInfo = testType.GetMethod("TestMethod");
        Console.WriteLine(methodInfo.Invoke(instance, new object[] { 10 }));
    }
```

## Activator 
- Used to instantiate a class from a type. 
- Note the use of `Type.GetType()`

```cs
    Type classType = Type.GetType("ActivatorTest.MyTestClass");
    MyTestClass testClass = (MyTestClass) Activator.CreateInstance(classType, "Jack");

    class MyTestClass
    {
        public string Name { get; set; }

        public MyTestClass(string name)
        {
            Name = name;
        }
    }
```


