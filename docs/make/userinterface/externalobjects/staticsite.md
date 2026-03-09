---
sidebar_position: 50
title: Static Web Site
---

Static Web Site
===============

Introduction
------------

An External Object of nature **Static Web Site** is a standalone page designed primarily for display.
It has access to Simplicité's backend, but with restricted capabilities — suited for content that
does not require deep interaction with business data (read-heavy, public-facing, or informational pages).

For interactions that require more backend access (creating or modifying records, advanced API calls),
use a [Web Page](/make/userinterface/externalobjects/webpage) instead.

:::tip

If the page interacts with Simplicité's API, use the [official JavaScript client library](https://www.npmjs.com/package/simplicite).
It is compatible with any web framework (Vue.js, React, Angular, etc.).

:::

For the shared architecture (resources, Java class, rights model), see [External Objects](/make/userinterface/externalobjects/basic).

Configuration
-------------

| Field | Description |
| ----- | ----------- |
| Code | Object's unique identifier. Convention: `ModulePrefix` + `ObjectName` |
| Nature | Must be set to **Static Web Site** |
| Class | Java class extended by this object. Typically left empty or set to `StaticSiteExternalObject` |
| Configuration | Optional JSON for custom constants or configuration values, parsed in the Java class |
| UI Widget | Must be set to **No** for Static Web Sites |
| Module | Module this object belongs to. Determines the object's namespace and governs its packaging and deployment within the application |

Resources
---------

Three resources define the front-end of the page. All logic and rendering is handled client-side —
there is no required Java backend implementation for a Static Web Site.

### HTML

Structure and content of the page, embedded within a `<div id="bs-main" class="container">...</div>`.
Declare layout anchors and placeholders here; populate them dynamically from `CLASS`.

```html
<div id="myStaticPage">
    <!-- Layout anchors -->
</div>
```

### STYLES

Stylesheet for the page. Accepts CSS or LESS syntax.

```css
#myStaticPage {
    /* Custom styles */
}
```

### CLASS

JavaScript file containing rendering logic. The main entry point is the `async render()` method.
Access the HTML container via `this.ctn`, and Simplicité's app instance via `getApp()` or `$app`.

```javascript
Simplicite.UI.ExternalObjects.MyStaticPage = class extends Simplicite.UI.ExternalObject {
    async render(params, data = {}) {
        const $content = this.ctn;
        $content.html("Hello World!");
    }
};
```

See [Resources](/make/userinterface/resources) for details on creating and editing resource files.

Related
-------

- [External Objects overview](/make/userinterface/externalobjects/basic)
- [Web Page](/make/userinterface/externalobjects/webpage) — for full backend interaction
- [Resources](/make/userinterface/resources)
- [JSDoc](https://platform.simplicite.io/current/jsdoc/global.html)
- [StaticSiteExternalObject](https://platform.simplicite.io/current/javadoc/com/simplicite/webapp/web/StaticSiteExternalObject.html)
