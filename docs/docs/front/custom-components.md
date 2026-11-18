---
sidebar_position: 50
title: Custom Components & Pages
---

Custom Components & Pages
=========================

:::note

This page covers the **code side** of External Objects — patterns and implementation examples.
For configuration (object creation, fields, rights), see [External Objects](/make/userinterface/externalobjects/basic).

:::

Introduction
------------

External Objects are implemented through three resources (`HTML`, `STYLES`, `CLASS`) and an optional Java class.
This page provides code patterns for the two main scenarios:

- [Embedded components](#embedded-components) — UI page or component nature, rendered inside the standard UI
- [Standalone pages](#standalone-pages) — Web Page nature, rendered at their own URL

Embedded components
-------------------

### CLASS resource structure

```javascript
Simplicite.UI.ExternalObjects.MyComponent = class extends Simplicite.UI.ExternalObject {
    async render(params, data = {}) {
        const $content = this.ctn;
        $content.html('<p>Hello World</p>');
    }
};
```

### Accessing Business Objects

```javascript
async render(params, data = {}) {
    const product = $app.getBusinessObject('DemoProduct');
    product.search().then(rows => {
        const list = $('<ul>');
        for (const row of rows) {
            list.append($('<li>').text(row.demoPrdName));
        }
        this.ctn.append(list);
    });
}
```

### Getting the current user

```javascript
const grant = $ui.getGrant();
const login = grant.login;
```

### Displaying native UI elements

```javascript
// Open a record's form in the WORK area
$ui.displayForm(null, 'DemoProduct', rowId, {
    nav: 'add',
    target: 'work'
});
```

### Using standard widgets

To use a predefined Simplicité widget, set the `Class` field on the External Object to the appropriate
widget class and configure it via the `Settings` field. No `CLASS` resource code is needed in this case.

See [Standard Widgets](/docs/misc/widgets) for available widget classes and their expected JSON configuration.

### Creating a widget

Since version 7.0, the UI components of `$widget` (`Slider`, `SwitchButton`, `Toast`, `Cards`, `Counter`...)
extend the base class `Simplicite.UI.Widget`, which can also be extended to create your own reusable widgets:

- the constructor only stores the parameters: an object with the optional `name` (instance name)
  and `ctn` (container where the element is appended), plus the parameters of the widget (`this.params`)
- `draw()` builds and returns the root element (to be implemented)
- `load(element)` loads an optional asynchronous content (records, library...): `replaceElement(newElement)`
  replaces the placeholder built by `draw()`
- `render()` builds the element, appends it to `ctn` and starts the loading; `renderAsync()` also waits for the loading
- `element()`, `ready()` and `close()` give the element, the promise of the loading and remove the widget

```javascript
// Synchronous widget: the element is built from the parameters
class MyBadge extends Simplicite.UI.Widget {
    draw() {
        return $('<span class="badge"/>')
            .text(this.params.label)
            .css("background-color", this.params.color || "");
    }
}

// Asynchronous widget: a placeholder, then the records
class MyProductList extends Simplicite.UI.Widget {
    draw() {
        return $('<div aria-busy="true"/>').text($T("LOADING"));
    }
    async load() {
        const product = $app.getBusinessObject("DemoProduct", "widget_DemoProduct");
        const rows = await product.search(this.params.filters || {});
        this.replaceElement($('<ul class="my-products"/>')
            .append(rows.map(row => $('<li/>').text(row.demoPrdName))));
    }
}

// External Object CLASS resource to be placed in a View
// build the widgets and append them to the container
Simplicite.UI.ExternalObjects.MyComponent = class extends Simplicite.UI.ExternalObject {
    async render(params, data = {}) {
        // synchronous widget: the element is built from the parameters
        new MyBadge({
            label: "New",
            color: "#28a745",
            ctn: this.ctn
        }).render();

        // asynchronous widget: a placeholder, then the records
        const list = new MyProductList({
            name: "products",
            ctn: this.ctn,
            filters: { demoPrdName: "A%" }
        });
        await list.renderAsync();
        $console.log(list.name, list.element().children().length + " products");
    }
};
```

The standard components are used the same way, for example
`new $widget.Slider({ name: "myLevel", value: 50, ctn: this.ctn }).render()`.

Standalone pages
----------------

Standalone pages (Web Page nature) require a Java class as the backend entry point.

### Java class

```java
package com.simplicite.extobjects.MyModule;

import com.simplicite.util.*;
import com.simplicite.util.tools.*;
import com.simplicite.webapp.web.BootstrapWebPage;

public class MyWebPage extends com.simplicite.webapp.web.WebPageExternalObject {
    private static final long serialVersionUID = 1L;

    @Override
    public Object display(Parameters params) {
        try {
            BootstrapWebPage wp = new BootstrapWebPage(params.getRoot(), getDisplay());

            wp.appendJSInclude(HTMLTool.getResourceJSURL(this, "CLASS"));
            wp.appendCSSInclude(HTMLTool.getResourceCSSURL(this, "STYLES"));
            wp.appendHTML(HTMLTool.getResourceHTMLContent(this, "HTML"));

            wp.setReady(getName() + ".render(" + params.toJSONObject() + ");");
            return wp.toString();
        } catch (Exception e) {
            AppLog.error(null, e, getGrant());
            return e.getMessage();
        }
    }
}
```

### Passing server-side data to the front-end

```java
JSONObject p = params.toJSONObject();
p.put("imageUrl", HTMLTool.getResourceImageURL(this, "MY_IMAGE"));
wp.setReady(getName() + ".render(" + p.toString() + ");");
```

```javascript
async render(params) {
    const imageUrl = params.imageUrl;
    this.ctn.append($('<img>').attr('src', imageUrl));
}
```

### Enabling frameworks

`BootstrapWebPage` provides convenience methods for loading common libraries:

| Framework | Method |
| --------- | ------ |
| Vue.js | `wp.appendVue()` |
| Mustache | `wp.appendMustache()` |
| jQuery | `wp.appendJQuery()` |
| Chart.js | `wp.appendChartjs()` |
| Moment.js | `wp.appendMoment()` |

### Vue.js example

```javascript
var MyPage = MyPage || (() => {
    function render(params) {
        const app = typeof $ui !== 'undefined'
            ? $app
            : new Simplicite.Ajax(params.root, 'uipublic');

        Vue.createApp({
            data() { return { products: [] }; },
            mounted() {
                app.getBusinessObject('DemoProduct').search().then(rows => {
                    this.products = rows;
                });
            }
        }).mount('#mypage');
    }
    return { render };
})();
```

Access control
--------------

Standalone pages can be configured for authenticated users or for unauthenticated access depending on
their intended audience. The access model is governed by rights configuration on the External Object.

For public-facing pages (no login required), specific grant configuration is needed.
See [External Objects — Access & Rights](/make/userinterface/externalobjects/basic#access--rights).

Deprecated patterns
-------------------

:::danger

The following patterns come from older platform versions. Do not use them in new projects.

:::

**V5 — namespace pattern** (replaced by class syntax)

```javascript
var CustomComponent = CustomComponent || (function($) {
    function render(url) { /* ... */ }
    return { render: render };
})(jQuery);
```

**Old Ajax instantiation** (replaced by `WebPageExternalObject` and the in-platform global objects)

```javascript
app = new Simplicite.Ajax("", "uipublic");
```

**Old base class for web pages** (replaced by `WebPageExternalObject`)

```java
public class MyPage extends ExternalObject { ... }
```

Related
-------

- [External Objects overview](/make/userinterface/externalobjects/basic)
- [UI page or component](/make/userinterface/externalobjects/uicomponent)
- [Web Page](/make/userinterface/externalobjects/webpage)
- [In-platform Development](/docs/front/platform-dev)
- [Ajax Library](/docs/front/lib-ajax)
- [JSDoc](https://platform.simplicite.io/current/jsdoc/global.html)
- [BootstrapWebPage JavaDoc](https://platform.simplicite.io/current/javadoc/com/simplicite/webapp/web/BootstrapWebPage.html)
