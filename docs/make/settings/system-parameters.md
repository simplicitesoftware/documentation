---
sidebar_position: 10
title: System parameters
---

# System Parameters

## Introduction

System Parameters are used to manage **static variables** (e.g., VAT rates) and to **assign or override settings** for end users. They provide a flexible way to configure system-wide values or user-specific preferences without modifying the application code.

System Parameters help centralize configuration, making it easier to maintain and adjust application behavior dynamically.

## Features

### Global configuration

- System Parameters store static values used throughout the application.
- They can define application-wide settings such as VAT rates, default currency, or timeout values.

### User-level customization

- Parameters can be assigned to individual users to override default system settings.
- They enable personalized configurations without modifying core application logic.

### Disposition-level customization

- Parameters can be assigned to individual users to override default system settings.
- They enable per-disposition configurations without modifying core application logic.

### Loading principles and usage

- The system parameters are loaded from the database for each user (including the system admin singleton user) taking
  into account the above user-level and disposition-level system parameters potential customizations.
- Designers can use system parameters to adjust application behavior dynamically (if the value is updatable, see above).
- The system parameters can be accessed programmatically to control workflows, visibility, or validation rules.
    - When you invoke the `Grant.getParameter("<system param name>")` method you get the actual **loaded** value for the user.
    - When you invoke the `Grant.getSystemParam("<system param name>")` you get the **raw** main system parameter value from the database, regardless of the user.
    - When you invoke the `Grant.getUserSystemParam("<system param name>")` you get the **raw** user-level system parameter value from the database, regardless of the user.

### Environment variables substitutions

As of version 6.2 it is possible to use environment variables and/or JVM properties to partially alter the value of a system
parameter using the `[ENV:<environment variable name>]` and `[PROP:<JVM property name>]` substitutions tags.

The values of the designated environment variable and/or JVM properties are substituted when loading the system parameters.

> **Attention**: if you read the **raw** value from the database using `Grant.getSystemParam("<system parameter name>")` the returned value
> does not take into account these substitutions but you can use the `Tool.replaceEnvVars/replaceProperties/replaceEnvVarsAndProperties` helper methods to do so.

The typical usage of these substitutions is to avoid storing secrets in the database, e.g. client ID/secrets or certificates of an external authentication
providers in the `AUTH_PROVIDERS` system parameter:

```json
[
	(...)
	{
		"name": "[PROP:my_provider]",
		"type": "oauth2",
		"client_id": "[ENV:MY_CLIENT_ID]",
		"client_secret": "[ENV:MY_CLIENT_SECRET]",
		(...)
	},
	(...)
]
```

### Environment variables overrides

As of version 6.2 it is possible to use environment variables to override the value of a given system
parameter using the corresponding environment variable named `SIMPLICITE_SYSPARAM_<system parameter name>`.
This is a **forced** and **global** override of the system parameter value which can't be updated at runtime (at UI level the form is also set read-only).

> **Attention**: if you read the **raw** value from the database using `Grant.getSystemParam("<system parameter name>")` the returned value
> does not take into account this override

## Configuration

| Field                | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| **Parameter code**   | Unique identifier for the System Parameter                            |
| **Description**      | A brief explanation of the parameter's purpose                        |
| **Value**            | The stored value of the parameter (string, number, json, etc.)        |
| **Overridden value** | Defines whether the parameter applies system-wide or a specific value |
| **Type**             | Type of the system parameter                                          |
| **Module**           | The module to which the parameter belongs                             |

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

- [System Parameters List](/docs/core/system-parameters-list)
