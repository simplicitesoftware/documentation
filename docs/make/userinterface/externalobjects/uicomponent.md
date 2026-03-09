---
sidebar_position: 20
title: UI page or component
---

UI page or component
====================

Introduction
------------

An External Object of nature **UI page or component** is a custom component that renders inside Simplicité's standard interface.
It can be placed in views and home pages. When the **UI Widget** option is enabled, it can also be included in dashboards.

For the shared architecture (resources, Java class, rights model), see [External Objects](/make/userinterface/externalobjects/basic).

Features
--------

This nature covers a broad range of embedded UI use cases:

- **Standard widgets** — Simplicité provides a library of predefined widget classes (cards, counters, carousels, etc.)
  usable without writing front-end code, configured entirely through the `Settings` field
- **Custom charts and data visualizations** — by extending a chart class (e.g. `com.simplicite.webapp.web.widgets.ChartjsExternalObject`)
  and providing chart configuration in `Settings`
- **Fully custom components** — any visual element or interactive panel built with HTML, CSS, and JavaScript
  using the platform's resource system

Configuration
-------------

| Field | Description |
| ----- | ----------- |
| Code | Object's unique identifier. Convention: `ModulePrefix` + `ObjectName` (e.g. `TrnMyComponent`) |
| Nature | Must be set to **UI page or component** |
| Class | Java class extended by this object. Leave empty for fully custom components. Set to a predefined widget class when using a [standard widget](/docs/misc/widgets) |
| Settings | Optional JSON configuration. See usage patterns below |
| UI Widget | Controls whether this object can be added to [Dashboard](/make/userinterface/views/dashboard)-type views. Does not affect availability in other view types (home pages, standard views) |
| Module | Module this object belongs to. Determines the object's namespace and governs its packaging and deployment within the application |

### Settings field

The `Settings` field accepts a JSON value and serves two distinct purposes:

#### 1. Predefined widget setup

When the `Class` field references a Simplicité standard widget class, `Settings` holds the JSON structure
expected by that widget to declare its behavior and display options — without requiring custom code.
Refer to the [Standard Widgets](/docs/misc/widgets) documentation for the expected format per widget type.

#### 2. Custom constants

When building a fully custom component, `Settings` can hold any JSON structure you define
(colors, titles, endpoint paths, feature flags, etc.). These values are then parsed in your Java class
via the `param` argument and passed to the front-end as needed.

Related
-------

- [External Objects overview](/make/userinterface/externalobjects/basic)
- [Resources](/make/userinterface/resources)
- [Standard Widgets](/docs/misc/widgets)
- [In-platform Development](/docs/front/platform-dev)
- [Code examples for custom components](/docs/front/custom-components)
