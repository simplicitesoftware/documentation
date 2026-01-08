---
sidebar_position: 35
title: Ajax Library
---

Ajax Library
============

:::warning

This documentation is part of the **Frontend Development** category, designed to guide you through frontend customization within Simplicité.

:::

This guide covers the Ajax Library's core methods and Simplicité's MVC architecture.

MVC Architecture
----------------

Simplicité uses the **Model-View-Controller** pattern for organized, maintainable applications:

- **Model** (`$app`): Backend data handler via `Simplicite.Ajax`
- **View** (`$view`): UI components and rendering via `Simplicite.UI.View`
- **Controller** (`$ui`): Frontend engine coordinating Model and View via `Simplicite.UI.Engine`

Global Objects
--------------

Key objects available in Simplicité:

| Object   | Type                      | Description                                    |
|----------|---------------------------|------------------------------------------------|
| `$ui`    | `Simplicite.UI.Engine`    | Main UI Controller                             |
| `$app`   | `Simplicite.Application`  | Ajax Service / Main Model                      |
| `$view`  | `Simplicite.UI.View`      | View Engine / Main View                        |
| `$grant` | `Simplicite.Ajax.Grant`   | User rights and information                    |
| `$nav`   | `Simplicite.UI.Navigator` | Navigation controller                          |
| `$root`  | `String`                  | Server root URL                                |
| `$tools` | `Simplicite.UI.View`      | Bootstrap-specific methods                     |
| `$T`     | `Function`                | Text translation shorthand                     |

### Access Shortcuts

Most objects are accessible through `$ui`:

```javascript
$ui.app       // Same as $app
$ui.view      // Same as $view
$ui.grant     // Same as $grant (also $app.grant)
$ui.nav       // Same as $nav
$ui.view.tools // Same as $tools
```

Accessing Simplicité Session
----------------------------

### Core Methods

| Method                            | Returns                             | Description                                          |
| --------------------------------- | ----------------------------------- | ---------------------------------------------------- |
| `getApp()`                        | `Simplicite.Ajax`                   | Current Simplicité session                           |
| `getView(cbk, name, params)`      | `Promise<Object>`                   | View definition by name                              |
| `getGrant()`                      | `Simplicite.Ajax.Grant`             | Current user rights                                  |
| `getUserInfo(cbk, login, params)` | `Promise<Object>`                   | User data (login, name, email, picture)              |
| `getBusinessObject(obj, inst)`    | `Simplicite.UI.BusinessObject`      | Business object instance                             |

Manipulating Business Objects
-----------------------------

### Key Methods

| Method                           | Returns                                 | Description                                      |
|----------------------------------|-----------------------------------------|--------------------------------------------------|
| `create(cbk, items, params)`     | `void`                                  | Create and load new item                         |
| `getFields()`                    | `Array<Simplicite.Ajax.ObjectField>`    | All object fields                                |
| `getField(name, id)`             | `Simplicite.Ajax.ObjectField`           | Specific field by name and ID                    |
| `getCount(cbk, filters, params)` | `integer`                               | Row count with filters                           |
| `getForCreate(cbk, params)`      | `void`                                  | Load default item for creation                   |

### Business Object Structure

| Attribute | Description                                                    |
|-----------|----------------------------------------------------------------|
| `count`   | Current search result count                                    |
| `filters` | Current search filters (`filters.filterName`)                  |
| `item`    | Currently loaded item                                          |
| `list`    | Search result array of items                                   |
| `metadata`| Meta data (name, instance, fields)                             |

:::tip

Always manipulate Business Objects within a `search()` method to ensure data is properly loaded.

:::

### Field Access Example

```javascript
product.search(function() {
    for (let i = 0; i < product.count; i++) {
      const prd = product.list[i];
      console.log(prd.demoPrdName);        // Direct field access
      console.log(prd.demoPrdSupId__demoSupName); // Linked field access
    }
}, null, {});
```

Displaying UI Elements
----------------------

Display elements in the WORK area:

| Method                            | Description                                          |
|-----------------------------------|------------------------------------------------------|
| `displayForm(ctn, obj, p, cbk)`   | Display form for object                              |
| `displayList(ctn, obj, p, cbk)`   | Display list for object                              |
| `displaySearch(ctn, obj, p, cbk)` | Display search form for object                       |

**Example**:

```javascript
$ui.displayForm(null, "DemoProduct", rowId, {
    nav: "add",
    target: "work"
});
```
