---
sidebar_position: 20
title: Shared code
---

# Shared Code

## Introduction

**Shared Code** allows developers to create reusable code that can be leveraged across multiple business objects. It provides a flexible way to centralize logic, extend system functionalities, and optimize development efficiency.

Shared Code can be used in various scenarios, including Java class creation, business logic extension, and SQL scripting.

## Features

1. **Java Class Creation**  
   - Develop custom Java classes to implement specific business logic.  
   - Build reusable tools that can be accessed across different objects.  

2. **Extending Base Classes**  
   - Customize and extend system behavior by modifying classes that inherit from `ObjectDB`.  
   - A specific case of Shared Code is **PlatformHooks**, which allows customization of authentication mechanisms.  

3. **Unit Testing**  
   - Implement unit tests to validate business logic and ensure code reliability.  

4. **Custom SQL Execution**  
   - Write and execute specific SQL queries for data retrieval and processing.  
   - Execute SQL scripts for data processing or recovery.  
  
5. **Using Java Libraries**  
   - Import and integrate external Java libraries into the platform.  
   - Extend the platform's capabilities by reusing third-party Java code.  
  
## Configuration

| Field | Description |
| ----- | ----------- |
| **Name** | Unique identifier for the Shared Code |
| **Type** | Defines whether the code is Java, SQL, or another supported type |
| **Source code** | Source code attached |
| **Module** | The module to which the Shared Code belongs |

## How to create a Shared Code?

1. Navigate to the **Settings > Shared Code**.  
2. Click on **Create**.  
3. Define the **Name**.  
4. Select the **Type** (Java, SQL, etc.).  
5. Write or paste the code into the editor.  
6. Save the changes and clear the cache if necessary.  

## Learn more

- [PlatformHooks](/docs/core/platform-hooks)  
- [Unit testing](/docs/core/unit-testing)    
- [Unit test shared code tutorial](/tutorial/enhancing/shared-code)
