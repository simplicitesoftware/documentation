---
sidebar_position: 10
title: System parameters
---

System parameters
=================

Introduction
------------

System Parameters are used to manage **static variables** (e.g., VAT rates) and to **assign or override settings** for end users.
They provide a flexible way to configure system-wide values or user-specific preferences without modifying the application code.

System Parameters help centralize configuration, making it easier to maintain and adjust application behavior dynamically.

How to create a system parameter?
---------------------------------

System Parameters are available in the **Settings** menu and can also be found using the **menu search bar**.

1. Navigate to **Settings > System Parameters**.
2. Click on **Create**.
3. Define the **Parameter Name** and provide a **Description**.
4. Define a Type
5. Set the **Value** of the parameter (text, number, or json).
6. Assign the parameter to a **specific user** if needed.
7. Save the changes and clear the platform's cache to apply updates.

:::warning
It is required to clear the platform's cache to apply changes made to System Parameters.
:::

Configuration
-------------

| Field                | Description                                                           |
| -------------------- | --------------------------------------------------------------------- |
| **Parameter code**   | Unique identifier for the System Parameter                            |
| **Description**      |                                                                       |
| **Value**            | The stored value of the parameter (string, number, json, etc.)        |
| **Overridden value** | _Cf. Overrides section below_                                         |
| **Type**             | Type of the system parameter                                          |
| **Module**           | The module to which the parameter belongs                             |

### Type

:::warning

All variables except those of the **Private** and **Runtime** type are to be considered publicly accessible,
as **they are readable through JS code to any connected user**.

:::

The type can be one of the following:

- for **PUBLIC / NON SENSITIVE** parameters:
  - Application: recommended default
  - Look & Feel: _deprecated, do not use_
  - Logger: _deprecated, do not use_
  - Easy mode: _deprecated, do not use_
- for **PRIVATE / SENSITIVE** parameters:
  - Private: recommended default
  - Runtime

Overrides
---------

The default value for a system parameter is what is found in the **value** field, but there are a number of ways to override the value:

- user parameters
- disposition parameters
- overridden values
- environment variables

### User parameter

Parameters can be assigned to individual users to override default system settings.
They enable personalized configurations without modifying core application logic.
It's usually set through code via application logic and not part of the app configuration.

### Disposition parameter

This override is made at the disposition level, typically for UI parameters.
It's usually part of the app configuration.

### Overridden value

This field (`sys_value2`) is part of the System Parameter object but is **not exportable**, which means that the value will not end up in the module configuration.
It is useful when the system parameter:

1. differs _per environment_
2. can be set through the UI or data import

### Environment variables

:::note

This features are only available as of v6.2

:::

:::danger

This features only apply to the **loaded value** of the system parameters (ie accessed through `getParameter`).
If you use the **raw value** APIs (`getSystemParam` & `getUserSystemParam`), you will not get the substituted value.

:::

In many cases, a system parameter is better managed through environment variables:

- often the preferred method of configuration for operation teams with little to no knowledge of Simplicité
- in a CI/CD pipeline, configuring the app through the UI is not practical
- there are cases where parameters are used **before** they are practical to import or read in the database
- etc.

There are multiple mechanisms to use environment variables in system parameters.

#### Environment variables overrides

This is the simplest way. Just override the value of a system parameter by using the name of the system parameter prefixed by `SIMPLICITE_SYSPARAM_`.

For example for the `SAVE_TOAST` system parameter, a `SIMPLICITE_SYSPARAM_SAVE_TOAST` needs to be created.

This is a **forced** and **global** override of the system parameter value which can't be updated at runtime (at UI level the form is also set read-only).

#### Environment variables substitutions

System parameters accept substitutions of the following substitution tags:

- `[ENV:<environment variable name>[:<default value>]]`
- `[PROP:<JVM property name>[:<default value>]]`

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

Usage
--------

### Loading principles

- The system parameters are loaded from the database for each user (including the system admin singleton user) taking
  into account the above user-level and disposition-level system parameters potential customizations.
- Designers can use system parameters to adjust application behavior dynamically (if the value is updatable, see above).
- The system parameters can be accessed programmatically to control workflows, visibility, or validation rules.
  - When you invoke the `Grant.getParameter("<system param name>")` method you get the actual **loaded** value for the user.
  - When you invoke the `Grant.getSystemParam("<system param name>")` you get the **raw** main system parameter
    value from the database, regardless of the user.
  - When you invoke the `Grant.getUserSystemParam("<system param name>")` you get the **raw** user-level
    system parameter value from the database, regardless of the user.

### Use Cases

- **Static Variables**: Used to store constant values like VAT rates, tax rules, or API keys.
- **User parameters**: Override default settings for specific users.
- **Application Settings**: Control system-wide behaviors, such as cache duration, authentication settings, or session timeouts.
- **Configurable Features**: Adjust feature availability using system parameters.
- **Performance & Limits**: Adjust system limits, such as maximum file upload size or API rate limits.

Learn more
----------

- [System Parameters List](/docs/core/system-parameters-list)
