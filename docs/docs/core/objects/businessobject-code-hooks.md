---
sidebar_position: 30
title: Objects code hooks
---

Business objects hooks
======================

This document describes the hooks available to implement **custom business objects logic that goes beyond what can be configured**.

:::info

Hooks are **not mandatory** and it is good practice to use configuration whenever possible.
Other mechanisms exist to add business logic to business objects:

- default value expressions
- calculated fields expressions
- constraints expressions
- state transitions expressions
- etc.

See [this document](/docs/core/expressions) for details on expressions.

:::

Hooks are called by the platform at specific moments in the object's lifecycle.
Technically they are **overridable Java methods**, and the exhaustive list is thus available in the [`ObjectDB` Javadoc](https://platform.simplicite.io/current/javadoc/com/simplicite/util/ObjectDB.html).
However, this document organizes them into four main categories:

- right-related hooks,
- data preparation hooks,
- data processing hooks,
- other hooks

:::tip

Extra sources of documentation and examples:

- [basic code examples](/docs/core/basic-code-examples)
- [advanced code examples](/docs/core/advanced-code-examples)
- [forum](https://communicty.simplicite.io)
- [github](https://github.com/simplicitesoftware)
- [Javadoc](https://platform.simplicite.io/current/javadoc/com/simplicite/util/ObjectDB.html)

:::

Object definition and right-related hooks
-----------------------------------------

### Post load hook

The `postLoad` hook is called **once**, when the object definition is loaded.
It can therefore be used to modify the **static** object definition.

In this context, "static" refers to definition settings that remain constant throughout the duration of the user session,
as opposed to dynamic settings that may be modified by other hooks.

For instance it can be used to:

- Add a filtering search spec based on the user's rights
- Change default field behavior (visibility, updatability, ...) depending on user's rights or depending on the instance
  name (e.g. the instance used by webservices - name is prefixed by `api_` - may hide or make non updatable one field
  which is visible or updatble to UI users)

:::warning

Never trigger an object loading within a `postLoad`, this may result in an uncatchable stack overflow fatal error for your instance

:::

**Example:**

In this example, a restrictive search specification is applied to the object (limiting results to validated records only)
if the user belongs to a specified group.

```simplicite-java
@Override
public void postLoad() {
    if (getGrant().hasResponsibility("MYGROUP"))
        setDefaultSearchSpec(getStatusField().getColumn() + " = 'VALIDATED'");
}
```

### Access rights enabling/disabling hooks

The `isOpenEnable`, `isCreateEnable`, `isCopyEnable`, `isUpdateEnable` and `isDeleteEnable` hooks
allow to dynamically enable/disable open, create, copy, update, delete rights on the object.

They are called for each record (except for `isCreateEnable`). The `row` parameter passed to these hooks is the
current record for which the hook is called.

These hooks do not allow to override the granted rights of the users,
they just allow to **restrict** these rights depending on more complex business rules.

**Examples:**

In the following example, the status of the parent object is evaluated to determine whether creation is permitted or denied.

```simplicite-java
@Override
public boolean isCreateEnable() {
    ObjectDB p = getParentObject();
    if (p != null && "MyParentObject".equals(p.getName()))
        return "VALIDATED".equals(p.getStatus());
    return true;
}

In this example, updates are permitted only when a specific field's value is true.
```simplicite-java
@Override
public boolean isUpdateEnable(String[] row) {
    return Tool.isTrue(row[getFieldIndex("objField1")]);
}
```

In this example, delete permissions follow the same rule as update permissions.

```simplicite-java
@Override
public boolean isDeleteEnable(String[] row) {
    return isUpdateEnable(row);
}
```

### Custom action processing right enabling/disabling hook

The `isActionEnable` hook has a similar use as above right hooks but for custom actions.

It can be called either globally (`row` is null in this case) for global actions or for each record.

As above, this hook does not allow to override the granted rights of the users on custom actions,
it just allow to **restrict** the right depending on more complex business rules.

**Example:**

```java
@Override
public boolean isActionEnable(String[] row, String action) {
    // In this example the custom action is allowed depending on the value of a given object field
    if ("myCustomAction".equals(action))
        return Tool.isTrue(row[getFieldIndex("objField1")]);
    return true;
}
```

> See [this document](/docs/core/custom-actions-examples) for details on how to implement custom actions.

### Publication processing right enabling/disabling hook

The `isPrintTemplateEnable` hook has a similar use as above right hooks but for publications.

**Example:**

```java
@Override
public boolean isPrintTemplateEnable(String[] row, String printTemplateName) {
    // In this example the publication is allowed depending on the value of a given object field
    if ("myPrintTemplate".equals(printtmpl))
        return Tool.isTrue(row[getFieldIndex("objField1")]);
    return true;
}
```

> See [this document](/make/userinterface/objectsrendering/publications) for details on how to implement publications.

### State transitions hook

The `isStateTransitionEnable` hook allows to dynamically enable/disable a state transition.

This hook is called when building the list of possible state transition. It may be useful to implement specific state transition condition rules.

**Example:**

```java
@Override
public boolean isStateTransitionEnable(String fromStatus, String toStatus) {
    // In this example above the transition between `PENDING` state and `VALIDATED` statuses is dynamically allowed to users of `MYGROUP`:
    if ("PENDING".equals(fromStatus) && "VALIDATED".equals(toStatus))
        return getGrant().hasResponsibility("MYGROUP");
    return true;
}
```

### Panel objects hook

The `canReference` hook allows to show/hide linked objects' panels based on custom business rules.

**Example:**

```java
@Override
public boolean canReference(String objectName, String fieldName) {
    // In this example the MyPanelObject's panel is shown only if the user does not belong to MYGROUP
    return ("MyPanelObject".equals(objectName) && !getGrant().hasResponsibility("MYGROUP"));
}
```

### Bulk update hook

The `canUpdateAll` hook allows to dynamically enable/disable the bulk update feature.

**Example:**

```java
@Override
public boolean canUpdateAll(ObjectField fieldName) {
    // In this example, the bulk update feature is allowed to users who does not belong to MYGROUP
    return (!getGrant().hasResponsibility("MYGROUP"));
}
```

### Data history hook

The `isHistoric` hook allows to dynamically restrict the standard historization. By default, this method return true
when the business object has been designed with the historic property.
Above, the data bulk update is allowed to user who does not belong to MYGROUP.

**Example:**

```java
@Override
public boolean isHistoric() {
    // In this example an historization is done only when the object's status had changed
    return !getStatus().equals(getOldStatus());
}
```

Data preparation hooks
----------------------

These data preparation hooks are Object UI-oriented hooks because they are called before displaying
a page for read or write (create, update, delete) of an object item.

- `initCreate` before displaying a create form
- `initCopy` before displaying a copy form
- `initUpdate` before displaying an update form
- `initDelete` before displaying a deletion confirm dialog
- `initAction` before displaying a action confirm dialog

These hooks are useful for dynamically changing the behavior of an object in a particular use context
(e.g. changing one field as updatable depending on the value of another field, forcing a default field values at creation, etc.).

### Create, copy, update and delete preparation hooks

The `initCreate`, `initCopy`, `initUpdate` and `initDelete` hooks are called each time you open a form to create, copy, update or delete.

They allow to define the properties of attributes, hide, initialize them, put them in read-only, etc. just before the form is displayed.

**Examples:**

```java
@Override
public void initCreate() {
    getField("objField1").setUpdatable(true);
    getField("objField2").setUpdatable(getGrant().hasResponsibility("MYGROUP"));
}

@Override
public void initUpdate() {
    String s = getStatus();
    getField("objField1").setUpdatable("PENDING".equals(s) || "VALIDATED".equals(s));
}

@Override
public void initDelete() {
    initUpdate();
}
```

### List preparation hook

The `initList` hook is called each time a list is displayed.

It allows to define the properties of attributes, hide, initialize them, put them in read-only, etc. just before the list is displayed.

**Example:**

```java
@Override
public void initList(ObjectDB parent) {
    getField("objField1").setUpdatable(true);
    getField("objField2").setUpdatable(false);
}
```

<details>
<summary>Rhino JavaScript equivalent</summary>

```javascript
MyObject.initList = function(parent) {
    this.getField("objField1").setUpdatable(true);
    this.getField("objField2").setUpdatable(false);
};
```

</details>

### Search preparation hook

The `initSearch` hook is called before a search form is displayed.

It allows to set field filters for example, etc. just before the search page is displayed.

**Example:**

```java
@Override
public void initSearch() {
    getField("objField1").setFilter("is null or <1000");
    getField("objLogin").setFilter(getGrant().getLogin());
}
```

### Reference lookup preparation hook

The `initRefSelect` hook is called before a reference lookup popup is displayed.

It allows to set field filters or search-spec just before the popup page is displayed:

- the parent object is set to get contextual information
- `this.getParentObjectRefField`: useful to know from which foreign key the list is called from UI
- `parent.getOldValue`: contains DB value of parent field
- `parent.getValue`: contains UI current value of parent field
- useful to filter reference pickers with current parent data

**Example:**

```java
@Override
public void initRefSelect(ObjectDB parent) {
    if (parent!=null
    && "MyParentObject".equals(parent.getName()) // one parent context
    && "myForeignKey".equals(getParentObjectRefField())) // thru one foreign key
    {
        // DB value of a parent field
        String dbValue = parent.getOldValue("myParentField1");
        // current UI value of a parent field (available since 5.3)
        String uiValue = parent.getValue("myParentField1");
        // set a filter to search records without parent or matching with parent DB or current UI value
        getField("objField1").setFilter("is null or ='+Tool.toSQL(uiValue)+' or ='+Tool.toSQL(dbValue)+'");
    }
}
```

The `initDataMapSelect` hook has the same behavior to get referenced data by values.

### Action preparation hooks

When action has confirm fields this hook allows to prepare them before rendering.

**Example:**

```simplicite-java
@Override
public void initAction(Action action) {
    ObjectField f = action.getConfirmField("myFieldName");
    f.setDefaultValue("aValue");
    f.setRequired(true);
}
```

### Other preparation hooks

The `initExport`, `initCrosstab`, `initGraph`, `initAgenda`, `initPrintTemplate` hooks are called before
displaying the result of an export, a pivot table, a chart, an agenda, a publication.

They allow to define field filters for example, field values, etc. just before the result is displayed.

Data processing hooks
---------------------

### Pre and post validation hooks

These `preValidate` and `postValidate` hooks are called before and after the generic data validation
is made by the engine.

The generic validation is made before saving a record (creation or update). It only checks the
compliance of submitted date in regards to the object definition (e.g. it checks the type of the fileds, checks
value of the mandatory fields, apply regular expression checks, ...).

If you have some additional validation logic to add to your business object, such as setting a mandatory
field default value before validation or checking a validated value against a more advance business logic
(e.g. check that an order quantity is higher than a previously ordered quantity).

Information, warning and/or error messages may be returned (only one message or several).
Only error message(s) prevents the actual saving of the record.

**Examples:**

```simplicite-java
@Override
public List<String> preValidate() {
    List<String> msgs = new ArrayList<String>();

    msgs.add(Message.formatError("ERR_TEST0")); // Global error message
    msgs.add(Message.formatInfo("ERR_TEST1", null, "objField1")); // Field error message
    msgs.add(Message.formatWarning("WRN_TEST1", null, "objField2")); // Field warning message

    return msgs; // Return a list of messages
}

@Override
public List<String> postValidate() {
    if (isNew())
        getField("objField1").setValue(getFieldValue("objField2"));

    return null; // No message
}
```

In the above example, the error messages code (`ERR_TEST`) corresponds to a static text
configured in the `TEXT` list.

### Pre and post selection hooks

The `preSelect` and `postSelect` hooks are called before/after selecting the object data (in a list they are called for each list items).

They can be used to implement some business rules to set some field values for example.

**Example:**

```java
@Override
public void preSelect(String rowId, boolean copy) {
    // If the data is selected for a copy set a field with particular value
    if (copy)
        getField("objField1").setValue("value");
    super.preSelect(rowId, copy);
}
```

### Pre and post creation, update, deletion hooks

The `preCreate`, `preUpdate`, `preDelete`, `postCreate`, `postUpdate`, `postDelete` hooks are called before/after creating,
updating, deleting the object data.

The `preSave` hook is called just after the `preCreate` or `preUpdate` hooks (see below).

The `postSave` hook is called just after the `postCreate` or `postUpdate` hooks (se below).

These hooks can be used to implement some business rules to set some field values (that needs to be done after validation)
or just to prevent saving in some particular cases, etc.

In case of creation, the technical row_id field is not yet set (this is actually done in the create() core method).
The default value for row id is 0 at this step.

The pre delete hook is called before deletion. No validation is processed before deletion. Pre and post save are not executed either in this case.

Pre delete hook can be used to implement some business logic to allow or prevent saving in some particular cases, etc.
When it returns a non null single error code, no actual deletion is done.

Post delete hook can be used to implement some business rules after the object is actually deleted.

> **Note**: Cascade deletion of child object is not supposed to be coded as this behavior is configurable at link level.

**Example 1:**

```Java
@Override
    public String preCreate() {
        // Get a system param sequence next value
        this.setFieldValue("objRefField", "REF"+this.getGrant().getNextSystemParamValue("MYSEQUENCEPARAM"));
        return super.preCreate();
    }
```

> **Note**: for this simple case, the same result could be obtained using te following default value expression of the `objRefField` field:
> `[EXPR:"REF"+[GRANT].getNextSystemParamValue("MYSEQUENCEPARAM")]`

**Example 2:**

```Java
@Override
    public String preCreate() {
        // Generate a unique number use as an id. For example an Order number for a Client.
        ObjectField client = this.getField("orderClientId");  // foreign key
        ObjectField number = this.getField("orderNumber");
        String n = this.getGrant().getNextValueForColumnWhere(this.getTable(), number.getColumn(), client.getColumn()+" = "+client.getValue());
        number.setValue(n);
        return super.preCreate();
    }
```

:::note
To generate unique codes based on the **row ID** the right approach is to configure
a default value expression on your field with an expression like
`[EXPR:Tool.format("ABC-%05d", Long.valueOf([ROWID]))]` (in this example the field gets `ABC-00123`
as value at the creation of a record with row ID `123`)
:::

### Pre and post save hooks

The `preSave` and `postSave` hooks are called before/after saving the object data.

In all cases, the `preSave` hook is called after a `preUpdate` or a `preCreate` hook.

In all cases, the `postSave` hook is called after a `postUpdate` or `postCreate` hook.

These hooks can be used to implement some business rules to set some field values (that needs to be done after validation)
or just to prevent saving in some particular cases, etc.

**Example:**

```simplicite-java
@Override
public String postSave() {
    // Update a data of a linked object after
    if (getOldStatus() == "VALIDATED" && getStatus() == "DELIVERED") {
        ObjectDB obj = getGrant().getTmpObject("MyLinkedObject");
        synchronized(obj){
            obj.getLock();
            obj.select(getField("objMyLinkedObjectMyObjectId").getValue());
            obj.getField("otherObjField1").setValue("value");
            try {
                new BusinessObjectTool(obj)/* or obj.getTool() in version 5+ */.validateAndSave();
            } catch (SaveException|ValidateException e) {
                AppLog.error(e, getGrant());
            }

        }

    }
    return super.postSave();
}
```

`postSave`, `postCreate` and `postUpdate` can also return a redirect or a javascript statement.
The javascript override the default behavior and have to reload the form or redirect somewhere.

```java
// Goto this form instead of reloading the current object
String url = HTMLTool.getFormURL("User", null, "1", "nav=add");
return HTMLTool.redirectStatement(url);
```

or

```java
String js =
    // Redirect after a given transition
    "if (action=="MyTransition-WAIT-DONE") {" +
        "$ui.info('Transition done!');" +
        "$ui.displayList(null, object, { nav:'new' });" +
    "} else {" +
        // reload the form
        "$ui.displayForm(null, object, object.getRowId(), { nav:'add' });" +
    "}";
return HTMLTool.javascriptStatement(js);
```

### Pre and post search hooks

The `preSearch` and `postSearch` hooks are called before/after searching the object data: before/after the search core method is called.

Pre search hook is called to add specific filters or order the result: list, pivot table, graph, publication or export.

Post search hook is called after search to add specific code for instance to evaluate simple calculated fields, reorder or remove records.

**Examples:**

```simplicite-java
@Override
public void preSearch() {
    getField("objField1").setFilter("is null or <1000");
    getField("objField2").setOrder(1);
    getField("objField3").setOrder(-2);
    super.preSearch();
}
@Override
public List<String[]> postSearch(List<String[]> rows) {
    int fieldIndex = getFieldIndex("objField1");
    int i=0;
    for(String[] row: rows){
        row[i] = "Value #" + i;
        i++;
    }
    return super.postSearch(rows);

}
```

### Post deletion with message or redirect statement

The `postDelete` and `postDeleteAll` hooks can return a redirect statement.

```java
@Override
public String postDeleteAll() {
    String url = HTMLTool.getFormURL("User", null, "1", "nav=add");
    return HTMLTool.redirectStatement(url);
}

@Override
public String postDelete() {
    String url = HTMLTool.getFormURL("User", null, "1", "nav=add");
    return HTMLTool.redirectStatement(url);
}
```

### Pre and post bulk update and bulk delete hooks

The `preUpdateAll`, `postUpdateAll`, `preDeleteAll` and `postDeleteAll` hooks are called before/after a data bulk update or bulk delete.

These hooks are called to add specific behaviors before/after a bulk update/delete.

**Example:**

```java
@Override
public String preUpdateAll(Parameters params) {
    if (params!=null) {
        // Check values
        if ("123".equals(params.getParameter("objField1")))
            return Message.formatError("ERR_TEST", null, "objField1");
        // force values for each record
        params.setParameter("objField2", "forced value");
        params.setParameter("objDate3", Tool.getCurrentDate());
    }
    return super.preUpdateAll(params);
};
```

### Import hooks

The `preImport` and `postImport` hooks are called before/after a data is imported.

These hooks are called to add specific behaviors before/after an import.

**Examples:**

```Java
@Override
    public String preImport() {
        if (getFieldValue("objField1").equals("value 1")) {
            setFieldValue("objField2", "value 2");
            setFieldValue("objField3", "value 3");
        }
        return super.preImport();
    }
    @Override
    public String postImport() {
        // Send an alert if a null value is imported
        Alert a = getAlert("MYALERT", Alert.TYPE_INFO);
        if (!Tool.isEmpty(a) && getField("objField1").isEmpty())
            a.send(this);
        return super.postImport();
    }
```

### Export hooks

The `isExportAllowed` hook is called before exporting data to deny or confirm the export.

- returns a warning: ask the user to export the data
- returns an error: do not export data with a message
- returns null: export is allowed

**Examples:**

```java
@Override
public String isExportAllowed(String mode, String media, String rowId) {
    // List export by a non-admin user
    if (rowId==null && !getGrant().hasResponsibility("ONE_ADMIN_GROUP")) {
        long max = 5000;
        List<String> ids = canSelectRow() ? getSelectedIds() : null;
        long n = ids==null ? getCount() : ids.size();
        if (n > max)
            return Message.formatSimpleError("Too many records to export:" + n + " (limited to "+max+")");
        if (n > max/5)
            return Message.formatSimpleWarning("Are you sure to export "+n+" records?");
    }
    return null; // ok
}
```

The `preExport` and `postExport` hooks are called before/after data export.

- `preExport`: to force some field filters
- `postExport`: to change some values, remove or add records.

**Examples:**

```java
@Override
public void preExport() {
    if (getGrant().hasResponsibility("ONE_GROUP"))
        setFieldFilter("objField", "Public");
}

@Override
public List<String[]> postExport(List<String[]> rows) {
    if (rows!=null && getGrant().hasResponsibility("ONE_GROUP")) {
        int i = getFieldIndex("objField");
        for (String[] row : rows)
            row[i] = "forced value";
    }
    return rows;
}
```

The `getExportFileName` hook is called to force the exported filename on client side.

**Examples:**

```java
@Override
public String getExportFileName(String type, String name, String row[]) {
    if ("PDF".equals(type) && row!=null)
        return "pdf-" + getFieldValue("objField") + "-" + Tool.getCurrentDate();
    // default based on display or user-key label
    return super.getExportFileName(type, name, row);
}
```

### Pre and post alerts hooks

The `preAlert` and `postAlert` hooks are called before/after the alert is sending.

The `preAlert` hook can be used to change the alert just before sending (change the core message and/or add specific recipients).

**Example:**

```Java
@Override
public String preAlert(Alert a) {
    if (a!=null) {
        a.setSubject("ENU", "Dear [bill_last_name]");
        a.setContent("ENU", "Your bill of [bill_amount] ...");
        a.addRecipient("john@domain.com", Alert.RECIP_TO);
        a.addRecipient(getGrant().getEmail(), Alert.RECIP_CC);
    }
    return super.preAlert(a);
}
```

The `postAlert` hook can be used to implement some business logic just after sending.

**Example:**

```Java
@Override
public String postAlert(Alert a) {
    getField("objField4").setValue("Mail sent !");
    return super.postAlert(a);
}
```

### Send alert with custom attachments

It is possible to send one alert from any other hook and to add specific attachments:

```Java
@Override
public String postSave() {
    Grant g = getGrant();
    // Get the alert definition (with subject, body, recipients... or null if the alert is disabled)
    Alert alert = getAlert("MyAlert", Alert.TYPE_INFO);
    if (!Tool.isEmpty(alert)) {
        // Add attachments from a child object with a document field
        List<DocumentDB> att = new ArrayList();
        ObjectDB a = g.getTmpObject("MyObjectAttachment");
        synchronized(a){
            a.getLock();
            a.resetFilters();
            a.setFieldFilter("MyObject_FK", getRowId());
            for (String[] row : a.search()) {
                a.setValues(row);
                DocumentDB doc = a.getField("MyDocField").getDocument(g);
                if (!Tool.isEmpty(doc)) {
                    AppLog.info("debug attach: "+doc.toString(), g);
                    att.add(doc);
                }
            }
        }

        // Send with custom attachments
        alert.send(this, att);
    }
    return super.postSave();
}
```

### Predefined searches hooks

It is possible to add code during the predefined search creation:

- `preSavePredefinedSearch`: useful to prevent creation or update, or change filters before save
- `postSavePredefinedSearch`: for cascading operations
- `getPredefinedSearches`: override predefined searches accessibility

```Java
@Override
    public String preSavePredefinedSearch(PredefinedSearch ps) {
        // stop creation
        if (ps.getId() == "0" && ps.getName("0")=="something reserved")
            return "ERROR";
        return null; // ok
    }
    @Override
    public List<PredefinedSearch> getPredefinedSearches() {
        // all public + privates
        List<PredefinedSearch> list = getGrant().getPredefinedSearch("MyObject");
        int i =0;
        for (PredefinedSearch ps: list) {
            // remove ungranted searches
            if (ps.getName(ps.getId())=="something reserved") {
                list.remove(i);
            }else{
                i++;
            }
        }
        return list;
    }
```

Other hooks
-----------

### Short label hook

The `getUserKeyLabel` hook can be used to override a business object record's default "short" label
(the one which is displayed on form titles, on indexed search results, on treeviews, ...)

**Example:**

```java
@Override
public String getUserKeyLabel(String[] row) {
    if (this.isTreeviewInstance()) // On treeviews
        return getFieldValue("myFirstLabelField", row) + " - " + getFieldValue("mySecondLabelField", row);
    else // Elsewhere
        return getFieldValue("myThirdLabelField", row);
}
```

### Style hook

It is possible to set style (for instance a CSS class) on a field based on business logic:

```java
@Override
public String getStyle(ObjectField field, String[] row) {
    // style on myFieldDate1
    if (field!=null && row!=null && field.getName().equals("myFieldDate1")) {
        String d1 = row[getFieldIndex("myFieldDate1")];
        String today = Tool.getCurrentDate();
        if (!Tool.isEmpty(d1) && Tool.diffMonth(today, d1) <= 3) {
            // CSS class name added to control (already defined or to define in resource STYLES)
            return "redbg"; // default red background
        }
    }
    // default style
    return super.getStyle(field, row);
}
```

### Help hooks

As of version `3.2 MAINTENANCE06` the `getHelp` and `getCtxHelp` hooks can be use to dynamically create/update main help and contextual helps:

```java
@Override
public String getHelp() {
    if (getGrant().hasResponsibility("MYGROUP"))
        return "This is a custom main help";
    return super.getHelp();
};
@Override
public String getCtxHelp(String context) {
    if (getGrant().hasResponsibility("MYGROUP") && ObjectCtxHelp.CTXHELP_UPDATE.equals(ctx))
        return "This is a custom contextual help";
    return super.getCtxHelp(ctx);
};
```

### Using history

If a `MyObject` business object is historized, there is an additional business object names `MyObjectHistoric` that stores the values of each record.

A new record is created each time one of the common fields of `MyObject` and `MyObjectHistoric` is changed.

To access the historic records of a given record you can use:

```Java
ObjectDB h = this.getGrant().getTmpObject(getHistoricName()); // Get historic object
h.resetFilters();
h.getField("row_ref_id").setFilter(this.getRowId()); // Filter on current row ID
h.getField("row_idx").setOrder(-1); // Reverse order on history index
h.search(false);
```

### Redirection

It is possible to open a given "abstract" father object (e.g. `Vegetable`) record
as its corresponding specialized child object (e.g. `Carrot` or `Cabbage`) record by implementing a father-child redirect hook.

**Example:**

```java
@Override
public String[] getTargetObject(String rowId, String[] row) {

    // prevent redirect in template editor or XML import
    if (editTemplateUsage() || isBatchInstance())
        return null;

    // Propagate the copy Id (not "0")
    if (isCopied())
        rowId = getCopyId();
    // No redirection at creation
    else if (rowId.equals(ObjectField.DEFAULT_ROW_ID))
        return null;

    // select the record if not in memory
    if (row==null && select(rowId))
        row = getValues();

    // target object name
    String target = null;
    if (row!=null) {
        String type = getFieldValue("vegetableType"), row);
        if (type.equals("CARROT"))
            target = "Carrot";
        else if (type.equals("CABBAGE"))
            target = "Cabbage";
    }
    // Unknown target = no redirection
    if (target==null)
        return null;

    // Main instance of target object
    return new String[] { target, "the_ajax_" + target, rowId };
};
```

This mechanism can also be used to do redirection between objects that don't have a father-child relationship.

### Meta-object link

Useful to indicate with inherited object have to be displayed in a panel of a parent object within a meta-object link.

```java
/**
 * Hook to substitute the targeted object of a meta-object link.
 * The method is static to be called during loading without instantiating the object.
 * @param g user rights
 * @param object object name (default target)
 * @param field meta-object field name
 * @param parent parent object name
 * @return The object itself or one of its inherited object linked thru the meta-object field to parent
 */
public static String getTargetMetaObject(Grant g, String object, String field, String parent) {
    // Show only carrots when parent is a carrot farmer
    if ("Vegetable".equals(object) && "CarrotFarmer".equals(parent) && "myMetaObjectField".equals(field))
        return "Carrot";
    return object;
}
```

Inheritance
-----------

Let's say you have a `MyChildObject` that inherits from `MyFatherObject` you can call the hooks of the father object's code
from the child object's code by using the `MyFatherObject.<hook name>.call(this, <hook arguments>)` syntax (the `.call(this,` part
make the call to be done for the child object's scope).

**Example:**

```java
@Override
public String postCreate() {
    super.postCreate();    // Call parent object hook
    // Do something specific to the child object
}
```

Trace Hooks
-----------

As of Simplicité v6.0, hooks traces are activable through the `traceHooks` method to facilitate debugging, lifecycle understanding, etc.

```java
@Override
public void postLoad() {
    // no trace (the default)
    traceHooks(TRACE_HOOKS_NONE);
    // trace only implemented hooks (during test)
    traceHooks(TRACE_HOOKS_IMPLEMENTED);
    // trace only implemented hooks with main parameters (during test)
    traceHooks(TRACE_HOOKS_IMPLEMENTED_ARGS);
    // trace all hooks (verbose for training)
    traceHooks(TRACE_HOOKS_FULL);
}
```

You will get very precise (and verbose) logging:

```text
2025-11-27 10:40:47,741|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(menu_ajax_DemoClient) < postLoad time=0:00:00.000
2025-11-27 10:40:48,762|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) > getUserKeyLabel
2025-11-27 10:40:48,763|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) < getUserKeyLabel time=0:00:00.001
2025-11-27 10:40:48,765|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) > getUserKeyLabel
2025-11-27 10:40:48,766|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) < getUserKeyLabel time=0:00:00.001
2025-11-27 10:40:48,768|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) > getUserKeyLabel
2025-11-27 10:40:48,769|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) < getUserKeyLabel time=0:00:00.001
2025-11-27 10:40:48,771|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) > getUserKeyLabel
2025-11-27 10:40:48,771|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) < getUserKeyLabel time=0:00:00.000
2025-11-27 10:40:50,084|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) > getUserKeyLabel
2025-11-27 10:40:50,086|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(the_ajax_DemoClient) < getUserKeyLabel time=0:00:00.002
2025-11-27 10:40:50,560|⋮|INFO||⋮|⋮|⋮|⋮|⋮|⋮||Hook DemoClient(target_DemoClient) < postLoad time=0:00:00.000
```

It is possible to track hook's duration : log a warning after 2s by default (only in > V6 Version of Simplicité)

```java
@Override
protected void hookBegin(String hook, int maxTime, int maxStack, Object... args) throws HookException {
    // postUpdate may be long because of ...
    if ("postUpdate".equals(hook))
        maxTime = 10000; // warning after 10s in ms

    // default duration is 2s by default
    // default stack is set 20 to stop infinite calls loop => HookException
    super.hookBegin(hook, maxTime, maxStack);
}

@Override
protected long hookEnd(String hook) {
    long time = super.hookEnd(hook);
    // do something if postUpdate is too long
    if (time>10000 && "postUpdate".equals(hook)) {
        // notify the supervisor...
    }
    return time;
}
```

It is possible to track method duration : log a warning after 2s bu default (only in > V6 Version of Simplicité)

```java
// Same for Action method
@Override
protected void methodBegin(String method, int maxTime, int maxStack) throws HookException {
    super.methodBegin(method, maxTime, maxStack);
}
@Override
protected long methodEnd(String method) {
    return super.methodEnd(method);
}
```
