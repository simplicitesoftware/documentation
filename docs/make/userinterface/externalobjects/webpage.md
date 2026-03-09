---
sidebar_position: 30
title: Web Page
---

Web Page
========

Introduction
------------

An External Object of nature **Web Page** is a standalone page with full access to Simplicité's backend.
Unlike a [Static Web Site](/make/userinterface/externalobjects/staticsite), a Web Page can read and modify
business data, call internal APIs, and integrate tightly with the application's logic.

It is suited for custom interfaces that need to behave like a full application page:
forms, dashboards, data entry tools, or any scenario requiring complete backend interaction.

For the shared architecture (resources, Java class, rights model), see [External Objects](/make/userinterface/externalobjects/basic).

Configuration
-------------

| Field | Description |
| ----- | ----------- |
| Code | Object's unique identifier. Convention: `ModulePrefix` + `ObjectName` |
| Nature | Must be set to **Web Page** |
| Class | Java class extending `WebPageExternalObject`. The `displayBody` method is the main entry point for server-side rendering |
| Configuration | Optional JSON for custom constants or configuration values, parsed in the Java class |
| UI Widget | Must be set to **No** for Web Pages |
| Module | Module this object belongs to. Determines the object's namespace and governs its packaging and deployment within the application |

Architecture
------------

Web Pages use the same three front-end resources as all External Objects (`HTML`, `STYLES`, `CLASS`),
plus a Java class that serves as the back-end entry point.

### Java class

The Java class extends `WebPageExternalObject` and implements the `displayBody` method,
which controls what is sent to the browser. The typical pattern calls the `CLASS` resource's `render` function:

```java
package com.simplicite.extobjects.MyModule;

import com.simplicite.util.*;
import com.simplicite.util.tools.*;

public class MyWebPage extends com.simplicite.webapp.web.WebPageExternalObject {
    private static final long serialVersionUID = 1L;

    @Override
    public String displayBody(Parameters params) {
        try {
            return javascript(getName() + ".render();");
        } catch (Exception e) {
            AppLog.error(null, e, getGrant());
            return e.getMessage();
        }
    }
}
```

For more complex setups (passing data from server to client, loading additional resources),
use `BootstrapWebPage` to build the response programmatically:

```java
@Override
public Object display(Parameters params) {
    BootstrapWebPage wp = new BootstrapWebPage(params.getRoot(), getDisplay());

    wp.appendJSInclude(HTMLTool.getResourceJSURL(this, "CLASS"));
    wp.appendCSSInclude(HTMLTool.getResourceCSSURL(this, "STYLES"));
    wp.appendHTML(HTMLTool.getResourceHTMLContent(this, "HTML"));

    JSONObject p = params.toJSONObject();
    wp.setReady(getName() + ".render(" + p.toString() + ");");

    return wp.toString();
}
```

### Front-end resources

The `CLASS` resource receives control after the Java class triggers `render()`.
From there, the same patterns as other External Object types apply:
access the container via `this.ctn`, interact with the backend via `getApp()` or the Ajax API.

See [Resources](/make/userinterface/resources) for details on creating and editing resource files.

Related
-------

- [External Objects overview](/make/userinterface/externalobjects/basic)
- [Static Web Site](/make/userinterface/externalobjects/staticsite) — for display-focused, restricted-access pages
- [Resources](/make/userinterface/resources)
- [In-platform Development](/docs/front/platform-dev)
- [Ajax Library](/docs/front/lib-ajax)
- [JSDoc](https://platform.simplicite.io/current/jsdoc/global.html)
- [BootstrapWebPage](https://platform.simplicite.io/current/javadoc/com/simplicite/webapp/web/BootstrapWebPage.html)
- [WebPageExternalObject](https://platform.simplicite.io/current/javadoc/com/simplicite/webapp/web/WebPageExternalObject.html)
