---
sidebar_position: 35
title: In-platform Development
---

In-platform Development
=======================

Introduction
------------

When developing within Simplicité — writing `CLASS` resources for External Objects, custom dispositions,
or any JavaScript executed inside the platform — you have direct access to the Simplicité runtime
through a set of global objects.

This page covers the in-platform JavaScript context.
For standalone applications connecting to Simplicité from outside, see [NPM Library](/docs/front/npm-lib).

Global objects
--------------

The following objects are available in any JavaScript resource executed within the platform:

| Object | Type | Description |
| ------ | ---- | ----------- |
| `$ui` | `Simplicite.UI.Engine` | Main UI controller — entry point for most operations |
| `$app` | `Simplicite.Application` | Ajax service / data model |
| `$view` | `Simplicite.UI.View` | View engine |
| `$grant` | `Simplicite.Ajax.Grant` | Current user rights and information |
| `$nav` | `Simplicite.UI.Navigator` | Navigation controller |
| `$tools` | `Simplicite.UI.View` | Bootstrap utility methods |
| `$T` | `Function` | Translation shorthand |

Most objects are also accessible through `$ui`:

```javascript
$ui.app    // same as $app
$ui.view   // same as $view
$ui.grant  // same as $grant
$ui.nav    // same as $nav
```

For the full API reference, see [Ajax Library](/docs/front/lib-ajax).

Writing a CLASS resource
------------------------

The `CLASS` resource is the JavaScript entry point of an External Object.
It defines a class extending `Simplicite.UI.ExternalObject` with an `async render()` method:

```javascript
Simplicite.UI.ExternalObjects.MyComponent = class extends Simplicite.UI.ExternalObject {
    async render(params, data = {}) {
        const $content = this.ctn; // root container of the component
        $content.html('<p>Hello World</p>');
    }
};
```

Access the root container via `this.ctn`. Use standard DOM manipulation or jQuery to build your UI from there.

Working with Business Objects
-----------------------------

### Accessing an object

```javascript
const product = $app.getBusinessObject('DemoProduct');
```

### Searching

```javascript
product.search({ demoPrdSupId__demoSupCode: 'BIM' }).then(rows => {
    for (const row of rows) {
        console.log(row.demoPrdName, row.demoPrdUnitPrice);
    }
});
```

### Field naming conventions

| Pattern | Example | Description |
| ------- | ------- | ----------- |
| `objPrefixFieldName` | `demoPrdName` | Standard field on the object |
| `foreignKeyId__linkedFieldName` | `demoPrdSupId__demoSupName` | Joined field from a linked object |

Check **Business Objects > [Your Object] > Object Fields** in the back-office for the exact field names available on any given object.

### Displaying native UI elements

```javascript
// Display a record's form in the WORK area
$ui.displayForm(null, 'DemoProduct', rowId, {
    nav: 'add',
    target: 'work'
});

// Display a list
$ui.displayList(null, 'DemoProduct', null, {
    target: 'work'
});
```

Access control
--------------

External Objects are visible only to users who have been granted the appropriate rights.
For objects intended to be accessible without a user session, specific access configuration is required.

Refer to [External Objects — Access & Rights](/make/userinterface/externalobjects/basic#access--rights).

Related
-------

- [Ajax Library](/docs/front/lib-ajax) — full in-platform API reference
- [Custom Components & Pages](/docs/front/custom-components) — code examples for External Objects
- [NPM Library](/docs/front/npm-lib) — for standalone applications
- [JSDoc](https://platform.simplicite.io/current/jsdoc/global.html)
