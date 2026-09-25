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

| Method                              | Returns                        | Description                                 |
|-------------------------------------|--------------------------------|---------------------------------------------|
| `$ui.getApp()`                      | `Simplicite.Ajax`              | Current Simplicité session (same as `$app`) |
| `$ui.getGrant()`                    | `Simplicite.Ajax.Grant`        | Current user rights (same as `$grant`)      |
| `$app.getGrant(params)`             | `Promise<Grant>`               | Reload the user rights from the server      |
| `$app.getView(name, params)`        | `Promise<View>`                | View definition by name                     |
| `$app.getUserInfo(login, params)`   | `Promise<Object>`              | User data (login, name, email, picture)     |
| `$app.getBusinessObject(obj, inst)` | `Simplicite.UI.BusinessObject` | Business object instance                    |

Manipulating Business Objects
-----------------------------

### Key Methods

| Method                        | Returns                              | Description                              |
|-------------------------------|--------------------------------------|------------------------------------------|
| `search(filters, params)`     | `Promise<Array<Object>>`             | Search items with filters                |
| `get(rowId, params)`          | `Promise<Object>`                    | Load one item                            |
| `getForCreate(params)`        | `Promise<Object>`                    | Load default item for creation           |
| `getForUpdate(rowId, params)` | `Promise<Object>`                    | Load item for update                     |
| `create(item, params)`        | `Promise<Object>`                    | Create and load new item                 |
| `update(item, params)`        | `Promise<Object>`                    | Update and load item                     |
| `save(item, params)`          | `Promise<Object>`                    | Create or update item                    |
| `del(item, params)`           | `Promise<Object>`                    | Delete item (or row ID)                  |
| `getCount(filters, params)`   | `Promise<Object>`                    | Row count with filters, set in `count`   |
| `getFields()`                 | `Array<Simplicite.Ajax.ObjectField>` | All object fields                        |
| `getField(name, id)`          | `Simplicite.Ajax.ObjectField`        | Specific field by name (and list row ID) |

### Business Object Structure

| Attribute | Description                                                    |
|-----------|----------------------------------------------------------------|
| `count`   | Current search result count                                    |
| `filters` | Current search filters (`filters.filterName`)                  |
| `item`    | Currently loaded item                                          |
| `list`    | Search result array of items                                   |
| `metadata`| Meta data (name, instance, fields)                             |

### Field Access Example

All these methods return a `Promise`:

```javascript
const product = $app.getBusinessObject("DemoProduct");

product.search().then(rows => {
    for (const row of rows) {
      console.log(row.demoPrdName); // Direct field access
      console.log(row.demoPrdSupId__demoSupName); // Linked field access
    }
});
```

Displaying UI Elements
----------------------

Display elements in the WORK area:

| Method                                 | Description                                          |
|----------------------------------------|------------------------------------------------------|
| `displayForm(ctn, obj, rowId, p, cbk)` | Display form for object                              |
| `displayList(ctn, obj, p, cbk)`        | Display list for object                              |
| `displaySearch(ctn, obj, p, cbk)`      | Display search form for object                       |

**Example**:

```javascript
// null container = default work area
$ui.displayForm(null, "DemoProduct", rowId, {
    // "add" : the form to the navigation history, 
    // "new" : to start a new navigation
    // unset : do not change the navigation (e.g. the form is in a view already in nav)
    nav: "add" 
});
```
