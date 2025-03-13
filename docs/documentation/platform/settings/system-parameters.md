# System Parameters

## Introduction

System Parameters are used to manage **static variables** (e.g., VAT rates) and to **assign or override settings** for end users. They provide a flexible way to configure system-wide values or user-specific preferences without modifying the application code.  

System Parameters help centralize configuration, making it easier to maintain and adjust application behavior dynamically.  

## Features

1. **Global Configuration**
    - System Parameters store static values used throughout the application.  
    - They can define application-wide settings such as VAT rates, default currency, or timeout values.

2. **User-Specific Customization**
    - Parameters can be assigned to individual users to override default system settings.  
    - They enable personalized configurations without modifying core application logic.  

3. **Dynamic Overrides**
    - Designers can use System Parameters to adjust application behavior dynamically.  
    - These parameters can be accessed programmatically to control workflows, visibility, or validation rules.  

## Configuration

| Field | Description |
| ----- | ----------- |
| **Parameter code** | Unique identifier for the System Parameter |
| **Description** | A brief explanation of the parameter's purpose |
| **Value** | The stored value of the parameter (string, number, json, etc.) |
| **Overriden value** | Defines whether the parameter applies system-wide or a specific value |
| **Type** | Type of the system parameter |
| **Module** | The module to which the parameter belongs |

## How System Parameters Manage Application Settings

- **Static Variables**: Used to store constant values like VAT rates, tax rules, or API keys.
- **User**: Override default settings for specific users.
- **Application Settings**: Control system-wide behaviors, such as cache duration, authentication settings, or session timeouts.
- **Configurable Features**: Adjust feature availability using system parameters.  
- **Performance & Limits**: Adjust system limits, such as maximum file upload size or API rate limits.

## How to create a System Parameter?
System Parameters are available in the **Settings** menu and can also be found using the **menu search bar**.

1. Navigate to **Settings > System Parameters**.    
2. Click on **Create**.  
3. Define the **Parameter Name** and provide a **Description**.  
4. Define a Type  
5. Set the **Value** of the parameter (text, number, or json).  
6. Assign the parameter to a **specific user** if needed.  
7. Save the changes and clear the platform's cache to apply updates.  

<div class="warning">
It is required to clear the platform's cache to apply changes made to System Parameters.
</div>

## Learn more

- [System Parameters List](/lesson/docs/core/system-parameters-list)  
