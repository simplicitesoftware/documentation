---
sidebar_position: 15
title: Basic code examples
---

Basic code examples
===================

These basic guidelines and examples show how to implement **client-side behavior** within the Simplicité responsive UI:
business object `CLASS` resources, disposition scripts, External Object resources, and custom actions.

They apply to JavaScript executed **inside the platform** (not to standalone NPM projects — see [NPM Library](/docs/front/npm-lib)).

For the full API reference, see [Ajax Library](/docs/front/lib-ajax) and the [JSDoc](https://platform.simplicite.io/current/jsdoc/global.html).

Naming conventions
------------------

Recommended naming conventions are:

- Name JavaScript **classes** as you would name a Java class (capital letter at the beginning of each word, e.g. `MyBusinessObject`)
- Name **variables** and **functions** as you would name a Java variable (do not start with a capital letter, e.g. `myFirstName`)
- Use the business object's **technical name** (not its label) when referencing it in code (e.g. `MyObject`, not `My Object`)
- Register business object classes under `Simplicite.UI.BusinessObjects.<objectName>` using the object's technical name

Since version 4, the platform includes automatic naming convention validation (activated by a `SYNTAX` system parameter whose value is `yes` by default).
This is available for objects, functions, groups, domains and actions.

Global objects & MVC Architecture
---------------------------------

Simplicité uses the **Model-View-Controller** (MVC) pattern to structure client-side applications for clarity and maintainability:

- **Model** (`$app`): Backend data, business logic, and Ajax access via `Simplicite.Ajax`
- **View** (`$view`): UI components and rendering via `Simplicite.UI.View`
- **Controller** (`$ui`): Main frontend engine coordinating Model and View via `Simplicite.UI.Engine`

The following global objects are immediately available in any JavaScript resource executed inside the Simplicité responsive UI—no imports needed:

| Object      | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `$ui`       | Main UI controller (`Simplicite.UI.Engine`)                    |
| `$app`      | Ajax service / data model (`Simplicite.Application`)           |
| `$view`     | View engine (`Simplicite.UI.View`)                             |
| `$grant`    | Current user rights and information                            |
| `$nav`      | Navigation controller                                          |
| `$T`        | Translation shorthand (same as `$app.T(...)`)                  |
| `Simplicite`| Platform constants and namespaces                              |

Most of these are also accessible as members of `$ui`:

```javascript
$ui.app    // Same as $app
$ui.view   // Same as $view
$ui.grant  // Same as $grant
$ui.nav    // Same as $nav
```

Business object client-side logic is implemented as a **`CLASS` resource** extending `Simplicite.UI.BusinessObject`:

```javascript
Simplicite.UI.BusinessObjects.MyObject = class extends Simplicite.UI.BusinessObject {
    // UI and Ajax hooks
};
```

`Simplicite.UI.BusinessObject` itself extends `Simplicite.Ajax.BusinessObject`,
so a `CLASS` resource can override both **UI hooks** (form, list, search…) and **Ajax calls** (search, get, save…).

Logging
-------

### Browser console

During development, use the browser console:

```javascript
console.log("Hello world !");
console.warn("Something unexpected");
console.error("An error occurred", exception);
```

### Platform logging

It is also possible to log messages through the Ajax API (displayed according to the configured handlers):

```javascript
$app.debug("Hello world !");   // Debug level message (handler inactive by default)
$app.info("Hello world !");    // Info level message
$app.warning("Hello world !"); // Warning level message
$app.error("Hello world !");   // Error level message
$app.error(exception);         // Error from an exception object
```

Business objects manipulation
-----------------------------

Inside a `CLASS` resource, `this` is the business object instance. You can also access any object through the Ajax API:

```javascript
const obj = $app.getBusinessObject("MyObject");
// or, inside a CLASS method:
// this.search(...), this.get(...), etc.
```

Field names follow the object prefix convention (e.g. `myObjField1`).
Joined fields from linked objects use the `foreignKeyId__linkedFieldName` pattern (e.g. `myObjFkId__linkedFieldName`).

### Loading a single record

Load **one record** from its row ID:

```javascript
this.get(rowId).then(item => {
    const val = item.myObjField1;
    // ...
});
```

After a successful `get`, the loaded record is also available in `this.item`.

Variants exist for specific use cases: `getForCreate()`, `getForUpdate(rowId)`, `getForCopy(rowId)`, `getForDelete(rowId)`.

### Searching

Search **multiple records** with filters.

Without pagination:

```javascript
this.search({
    myObjFkField: rowId,              // Foreign key (exact match)
    myObjField1: "ABC",               // Simple text (exact match)
    myObjField2: "is not null",       // or "is null"
    myObjField3: "in ('1','5','8')",  // or "not in ('1','5','8')"
    myObjField4: "ABC%",              // starts with
    myObjField5: "%ABC",              // ends with
    myObjField6: "%ABC%",             // contains
    myObjField7: "A_B%C",             // like 'A_B%C'
    myObjField8: "like 'ABC%'",       // or "not like 'ABC%'"
    "dmin__myObjDate1": "2024-01-01", // date minimum
    "dmax__myObjDatetime1": "2024-06-26 23:45:23", // date/datetime maximum
    myObjInteger1: ">100 and <200",
    myObjString1: "='abc' or ='def'"
}).then(rows => {
    for (const row of rows) {
        const val = row.myObjField1;
        // ...
    }
});
```

See [Search syntax](/docs/ui/search-syntax) for the full filter syntax.

With pagination to limit memory usage:

```javascript
this.search({ myObjField1: "ABC" }, { page: 0 }).then(rows => {
    // rows = records for page 0
    // this.count = total matching records
    // this.maxpage = number of pages (0 to this.maxpage - 1)
    for (const row of rows) {
        // ...
    }
});
```

To iterate through all pages:

```javascript
async searchAll(filters) {
    let page = 0;
    let rows;
    do {
        rows = await this.search(filters, { page });
        for (const row of rows) {
            // process row
        }
        page++;
    } while (page < this.maxpage);
}
```

Business object `CLASS` resource
--------------------------------

From version 6.0, client-side behavior on standard object pages is implemented through a **`CLASS` JavaScript resource** attached to the business object.

### Setup

1. Open the business object in the designer.
2. Use the **Add resources** action to generate a `CLASS` skeleton and an empty `STYLES` resource.
3. Implement the required hooks by extending `Simplicite.UI.BusinessObject`.

### Main UI hooks

| Hook | When it runs |
| ---- | ------------ |
| `onLoad(locals)` | Object UI instance is created — override `locals` properties before usage |
| `onLoadForm(ctn, obj, p)` | Object form is displayed |
| `onUnloadForm(ctn, obj, p)` | Object form is closed |
| `onLoadListRow(ctn, obj, id, item, row)` | One list row is displayed |
| `onLoadList(ctn, obj, p)` | Object list is displayed |
| `beforeSave(ctn, obj, index, cbk)` | Before calling Ajax `save()` — call `cbk(false)` to cancel |
| `afterSave(ctn, obj, index, cbk)` | After a successful save |

See [Responsive UI — Client side hooks](/docs/ui/responsive#class-hooks-versions-60-only) for the full list of available hooks.

Restrict logic to the main instance when needed:

```javascript
if (this.isMainInstance()) {
    // hooks for the main form/list only
}
```

### Complete example

The following example combines form validation, dynamic field behavior, and save control:

```javascript
/**
 * JS Class MyObject with front hooks
 * @class
 */
Simplicite.UI.BusinessObjects.MyObject = class extends Simplicite.UI.BusinessObject {

    onLoadForm(ctn, obj, p) {
        const amount = $ui.getUIField(ctn, obj, "myObjAmount");
        const check = $ui.getUIField(ctn, obj, "myObjCheck");

        if (parseInt(amount.ui.val()) > 5000) {
            $ui.alert($app.T("MESSAGE_TO_CHECK_THE_AMOUNT"));
            check.ui.val(false);
        }

        const field = $ui.getUIField(ctn, obj, "myObjField1");
        field.ui.on("change", () => {
            const v = field.ui.val();
            const other = $ui.getUIField(ctn, obj, "myObjField2");
            other.ui.visible(v ? Simplicite.VIS_BOTH : Simplicite.VIS_HIDDEN);
            other.ui.updatable(v === "123");
        });

        super.onLoadForm(ctn, obj, p);
    }

    beforeSave(ctn, obj, index, cbk) {
        const amount = $ui.getUIField(ctn, obj, "myObjAmount", index);
        if (parseInt(amount.ui.val()) < 0) {
            $ui.alert($app.T("AMOUNT_MUST_BE_POSITIVE"));
            cbk(false);
            return;
        }
        super.beforeSave(ctn, obj, index, cbk);
    }
};
```

### UI field manipulation

Inside form and list hooks, use the UI engine to access and manipulate fields dynamically.

```javascript
// On a form (no row ID)
const field = $ui.getUIField(ctn, obj, "myObjField1");

// On a list row (with row ID)
const field = $ui.getUIField(ctn, obj, "myObjField1", rowId);

// Read / write value
const val = field.ui.val();
field.ui.val("new value");

// Show / hide
field.ui.visible(Simplicite.VIS_BOTH);   // visible on form and list
field.ui.visible(Simplicite.VIS_HIDDEN);  // hidden
field.ui.visible(Simplicite.VIS_FORM);    // visible on form only
field.ui.visible(Simplicite.VIS_LIST);    // visible on list only

// Read-only / editable
field.ui.updatable(true);
field.ui.updatable(false);
```

Areas and actions of the form have the same kind of `ui` interface:

| Accessor | Main `ui` methods |
| -------- | ----------------- |
| `$ui.getUIField(ctn, obj, name)` | `val()`, `val(value)`, `change(handler)`, `visible(bool)`, `required(bool)`, `updatable(bool)`, `focus()` |
| `$ui.getUIArea(ctn, obj, nameOrPosition)` | `visible(bool, slide)` |
| `$ui.getUIAction(ctn, obj, name)` | `visible(bool)`, `enable(bool)`, `click(handler)` |

### Show/hide and required on field change

Show a field and a whole area, and make another field required, depending on a field value:

```javascript
Simplicite.UI.BusinessObjects.MyObject = class extends Simplicite.UI.BusinessObject {
    onLoadForm(ctn, obj, p) {
        super.onLoadForm(ctn, obj, p);
        const type = $ui.getUIField(ctn, obj, "myObjType");
        const comment = $ui.getUIField(ctn, obj, "myObjComment");
        const reason = $ui.getUIField(ctn, obj, "myObjReason");
        const details = $ui.getUIArea(ctn, obj, "MyObject-Details"); // area name or position

        const apply = slide => {
            const other = type.ui.val() === "OTHER";
            comment.ui.visible(other, slide);    // show the comment only for OTHER
            details?.ui.visible(other, slide);   // same for a whole area
            reason.ui.required(other);           // reason required for OTHER
        };
        apply(false);                            // initial state, without effect
        type.ui.change(() => apply(true));       // then on each change
    }
};
```

### Read-only and computed value

Lock a field and set its value when another field changes:

```javascript
onLoadForm(ctn, obj, p) {
    super.onLoadForm(ctn, obj, p);
    const status = $ui.getUIField(ctn, obj, "myObjStatus");
    const closedOn = $ui.getUIField(ctn, obj, "myObjClosedOn");
    status.ui.change(() => {
        const closed = status.ui.val() === "CLOSED";
        closedOn.ui.updatable(!closed);
        if (closed && !closedOn.ui.val()) {
            const today = new Date();
            // service format YYYY-MM-DD
            const closedOnDate = closedOn.convertDate(today);
            // ui.val will convert to user format (ex DD/MM/YYYY)
            closedOn.ui.val(closedOnDate || "");
        }
    });
}
```

### Actions

Hide or disable an action button, or call an action by script:

```javascript
onLoadForm(ctn, obj, p) {
    super.onLoadForm(ctn, obj, p);
    const validate = $ui.getUIAction(ctn, obj, "MyObjValidate");
    validate?.ui.visible($grant.hasResponsibility("MY_MANAGER"));
    validate?.ui.enable(obj.getFieldValue("myObjStatus") !== "VALIDATED");

    // custom button calling the action with an action field
    $('<button type="button" class="btn btn-secondary"/>').text($T("MY_ACTION"))
        .appendTo($(".form-actionbar", ctn))
        .on("click", async () => {
            const res = await obj.action("MyObjValidate", { values: { myActComment: "OK" } });
            $ui.alert({ type: "info", content: String(res) });
        });
}
```

### Check fields before saving

Compare two fields, focus the wrong one and stop the save with `cbk(false)`:

```javascript
beforeSave(ctn, obj, index, cbk) {
    const start = obj.getFieldValue("myObjStart"), end = obj.getFieldValue("myObjEnd");
    if (start && end && end < start) {
        $ui.alert({ type: "warning", content: $T("MY_END_BEFORE_START") });
        $ui.getUIField(ctn, obj, "myObjEnd").ui.focus();
        return cbk(false);
    }
    super.beforeSave(ctn, obj, index, cbk);
}
```

:::note

The UI rules improve the input, they do not secure the data: keep the same checks on server side
(object hooks or constraints) as the services can be called without the UI.

:::

When displaying a list programmatically, apply filters that the user cannot change:

```javascript
$ui.displayList(null, "MyObject", {
    fixedFilters: {
        myObjField1: "ABC" // filter not changeable by the user
    }
});
```

Override UI options before rendering through `onLoad`:

```javascript
onLoad(locals) {
    locals.form.followLinks = false;
    super.onLoad(locals);
}
```

Others
------

### User rights

Check the current user's responsibilities:

```javascript
if ($grant.hasResponsibility("MY_GROUP")) {
    // ...
}
```

### Translations

Use translated texts instead of hard-coded strings:

```javascript
const label = $T("MY_TEXT_CODE");
// or
const label = $app.T("MY_TEXT_CODE");
```

### Alerts and dialogs

```javascript
$ui.alert("Hello world !");

$ui.alert({
    title: $T("INFO"),
    content: "Hello world !"
});

$ui.confirm({
    title: $T("CONFIRM"),
    content: "Are you sure ?",
    onOk: () => {
        // user confirmed
    },
    onCancel: () => {
        // user canceled
    }
});
```

### Navigation

Open standard UI pages from JavaScript:

```javascript
// Display a record form in the WORK area (null container = work area)
$ui.displayForm(null, "MyObject", rowId, {
    nav: "add" // add the form to the navigation history
});

// Creation form with forced values
$ui.displayForm(null, "MyObject", $app.DEFAULT_ROW_ID, { nav: "add", values: { myObjType: "OTHER" } });

// Read-only form in a container of the page
$ui.displayForm($("#myForm", ctn), "MyObject", rowId, { readonly: true });

// Display a list
$ui.displayList(null, "MyObject", {
    nav: "add"
});

// List with filters with a new navigation entry, and a fixed filter not changeable by the user
$ui.displayList(null, "MyObject", {
    nav: "new",
    filters: { myObjStatus: "OPEN" },  // changeable by the user
    fixedFilters: { myObjType: "A" }   // not changeable by the user
});

// List in a container of the page, with a callback when displayed
$ui.displayList($("#myList", ctn), "MyObject", { fixedFilters: { myObjType: "A" } },
    (obj, p) => console.log(obj.getName() + " list displayed"));

// Display a search form in a popup
$ui.displaySearch(null, "MyObject", {
    position: "popup"
});

// Open an external object in a container
$ui.loadURL(ctn, $app.getExternalObjectURL("MyExternalObject", { param1: "value" }));
```

### Page lifecycle events

Bind functions to global UI events on the disposition `SCRIPT` resource:

```javascript
(function(ui, $) {
    // Engine loaded (before home page)
    $(document).on("ui.loaded", function() {
        ui.options.form.followLinks = false;
    });

    // UI ready (after home page)
    $(document).on("ui.ready", function() {
        if (ui.grant.hasResponsibility("GUEST"))
            $(".main-menu [data-obj='myAdminObject']").remove();
    });

    // Before page unload
    $(document).on("ui.beforeunload", function() {
        // Ajax services are still available
    });
})(window.$ui, jQuery);
```

### Client-side custom actions

A client-side action corresponds to an action with a value in the _URL_ field.
For plain URLs and server-side actions, see [Custom actions examples](/docs/core/codexamples/custom-actions-examples).

Configure the _URL_ field with a JavaScript pseudo-URL (starting with `javascript:`).
Define the handler as a method on the business object `CLASS`:

```javascript
Simplicite.UI.BusinessObjects.MyObject = class extends Simplicite.UI.BusinessObject {

    myCustomAction(ctn, rowId, p) {
        return $ui.alert({
            content: "Hello world !"
        });
    }
};
```

Action _URL_ value:

```javascript
javascript: obj.myCustomAction(ctn, rowId, p)
```

:::note
Client-side custom actions are **not available** through the webservices APIs.
:::

:::note
There are many other methods in `$ui`, `$app`, and `Simplicite.UI` for widgets, exports, publications, and third-party API integration.
Refer to the [JSDoc](https://platform.simplicite.io/current/jsdoc/global.html) and [UI tools code examples](/docs/core/codexamples/ui-tools-code-examples).
:::
