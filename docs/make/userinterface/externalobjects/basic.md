---
sidebar_position: 10
title: Basic
---

Basic
=====

Introduction
------------

External Objects are the primary mechanism for building custom components and interfaces in Simplicité.
They extend the platform beyond its native configuration capabilities — enabling custom UI components,
standalone pages, and integrations that the standard meta-model cannot cover on its own.

:::warning

Before creating an External Object, verify that your use case isn't already handled by native platform features
(views, constraints, actions, publications, etc.). External Objects introduce code and should be reserved
for cases where configuration alone is insufficient.

:::

Natures
-------

Every External Object has a **Nature**, which determines its rendering context and what it can interact with.

| Nature | Usage | Java class |
| ------ | ----- | ---------- |
| [UI page or component](/make/userinterface/externalobjects/uicomponent) | Custom component embedded within Simplicité's standard UI (views, home pages, dashboards) | `ResponsiveExternalObject` |
| [Static Web Site](/make/userinterface/externalobjects/staticsite) | Standalone page with limited backend interaction — suited for display and public-facing content | `StaticSiteExternalObject` |
| [Web Page](/make/userinterface/externalobjects/webpage) | Standalone page with full backend access — suited for custom interfaces requiring read and write operations | `WebPageExternalObject` |

Features
--------

### Use cases

External Objects cover a wide range of use cases, including but not limited to:

- **Custom UI components** — panels, cards, counters, carousels, embedded tools
- **Data visualizations and charts** — using standard widget classes or custom implementations
- **Standalone pages** — full custom interfaces, forms, or dashboards
- **Single-page workflows** — guided processes driven by custom front-end logic
- **Backend integrations** — custom API connectors, data processing, or service bridges

### Similarities with Business Objects

External Objects share several platform features with Business Objects:

- **Object fields** — additional fields can be configured on the External Object for custom metadata or back-office settings
- **Back-office form** — the External Object has a configuration form in the platform for managing settings, resources, and rights
- **Rights and grants** — access follows the same model as Business Objects (see [Access & Rights](#access--rights) below)

Architecture
------------

### Front-end

The front-end of an External Object is built on a web-oriented stack, organized through Simplicité's [Resources](/make/userinterface/resources) system:

| Resource | Role |
| -------- | ---- |
| `HTML` | Structure and content of the component or page |
| `STYLES` | Stylesheet (CSS or LESS) |
| `CLASS` | JavaScript — behavior and rendering logic, typically inside an `async render()` method |

This gives full control over rendering and user interaction, using standard web technologies within the Simplicité runtime.

### Back-end

Each External Object has an associated Java class. For most custom components, backend implementation is not required — the front-end resources are sufficient.

When backend logic is needed (data pre-processing, server-side rendering, external API calls, etc.),
a Java class can be declared for the object. That class extends the base class corresponding to the object's Nature:

| Nature | Base class |
| ------ | ---------- |
| UI page or component | `ResponsiveExternalObject` |
| Static Web Site | `StaticSiteExternalObject` |
| Web Page | `WebPageExternalObject` |

When no custom class is declared, the platform uses the base class directly, which is sufficient for the vast majority of front-end-only components.

:::note

Using a predefined Simplicité widget (via the `Class` field) is a separate case: the `Class` field points to
a specific widget class, and the `Settings` field is used to configure it without writing code.
See [Standard Widgets](/docs/misc/widgets) for details.

:::

Access & Rights
---------------

External Objects follow the same rights model as other platform objects.
An External Object is visible only to users or scopes that have been granted the appropriate rights.

Ensure that the groups requiring access to your External Object have the corresponding function granted.
For objects embedded in views, the External Object must also be explicitly added to the relevant view.

:::tip

If you see `External object __ not granted` when adding a component to a view, the required function has not been assigned to the relevant groups.

:::

Related
-------

- [Resources](/make/userinterface/resources)
- [Standard Widgets](/docs/misc/widgets)
- [Views](/make/userinterface/views/dashboard)
