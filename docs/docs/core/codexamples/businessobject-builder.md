---
sidebar_position: 15
title: BusinessObject builder
---

BusinessObject builder
======================

The `BusinessObject` class (available since version 6.3) is a builder to access business object data from Java code.
It chains the classic data access methods (search, select, create, update, delete, action...)
and is the recommended way to manipulate business objects in back-end code.

Compared to the direct use of an `ObjectDB` instance, the builder:

- is **thread-safe**: each final operation (search, validate, save, delete, action...) runs in its own synchronized block
  on the object lock, so there is no need to write `synchronized (obj.getLock()) { ... }`
- **stacks the data** (filters, values, documents, functions) without applying them to the object instance,
  until the final operation applies them all at once
- applies **all hooks** (init, pre/post validate, save, delete...) and the **undo/redo log**
- can **change the user rights** locally (CRUD) and restores the previous rights after each operation
- implements `AutoCloseable` to be used in a `try`-with-resources block: on close, it destroys the isolated instance
  or restores the previous state of the instance it used

:::tip

The `BusinessObjectTool` (`obj.getTool()`) is deprecated since version 7.0:
existing code should be refactored with this builder.

:::

Basic usage
-----------

A builder is created from the user rights and the object name, in a `try`-with-resources block:

```simplicite-java
try (BusinessObject bo = new BusinessObject(getGrant(), "MyObject")) {
	// same as getGrant().getBusinessObject("MyObject")
	bo
	.forCreate()
	.withValue("myField1", "value1")
	.withValue("myField2", 123)
	.validateAndSave();
}
catch (ValidateException | SaveException e) {
	AppLog.error("There was an error", e);
}
```

Each method returns the builder itself to chain the calls, except the terminal getters (`get`, `getCount`, `stream`, `getObject`).

The checked exceptions to catch depend on the final operations:

| Operation                                                   | Exceptions                           |
|-------------------------------------------------------------|--------------------------------------|
| `forCreateOrUpdate`, `select`, `get`, `values`              | `GetException`                       |
| `search`, `stream`, `count`, `getCount`                     | `SearchException`                    |
| `validate`                                                  | `ValidateException`                  |
| `save`                                                      | `SaveException`                      |
| `validateAndSave`, `validateAndCreate`, `validateAndUpdate` | `ValidateException`, `SaveException` |
| `delete`                                                    | `GetException`, `DeleteException`    |
| `deleteIfExist`, `searchAndDelete`                          | `DeleteException`                    |
| `action`                                                    | `ActionException`                    |

Searches, selections, saves and deletions throw an `ACCESS_DENIED` exception when the user has no read right on the object.

Object instance
---------------

By default, the builder uses:

- an **isolated instance** of the object, destroyed on close,
- or a **pooled instance** when the code is called through the API endpoint, returned to the pool on close.

Out of the API endpoint, a specific instance can be used instead:

```simplicite-java
try (BusinessObject bo = new BusinessObject(getGrant(), "MyObject")) {
	bo.getTmpObject(); // the "tmp" instance of MyObject
	// or bo.getInstance("my_instance_MyObject") for a named instance
	// ...
}
```

The available instance accessors are `getMainObject`, `getPanelObject(refField)`, `getRefObject`, `getDataMapObject`,
`getHomeObject`, `getBatchObject`, `getExportObject`, `getWebServiceObject`, `getTmpObject`, `getProcessObject`,
`getCronObject`, `getJobObject`, `getTreeviewObject(tree)`, `getAgendaObject`, `getModelObject(template)`,
`getMergeObject` and `getMergePanelObject(refField)`.

A builder can also wrap an existing instance with `new BusinessObject(obj)` or `getGrant().getBusinessObject(obj)`.

:::warning

A shared instance (main, panel, tmp... or a wrapped `this`) is used by other parts of the application:
the builder loads records into it, so its current values are replaced.

Use `preserveContext()` to restore its previous definition and data on close:
underlying `obj.getData()` is first serialized then restored on close.

:::

```simplicite-java
try (BusinessObject bo = new BusinessObject(getGrant(), "MyObject")) {
	bo
	.getMainObject()
	.preserveContext() // definition and data restored on close
	// ...
}
```

`preserveContext` is useless on an isolated instance, which is destroyed on close.

The underlying `ObjectDB` instance is available with `getObject()`, for example to read field definitions.
Accessing its values outside the builder methods is not thread-safe.

User rights
-----------

The rights of the current user on the object can be changed for the operations of the builder:

```simplicite-java
bo.withCRUD(true, true, true, false); // create, read, update, delete
bo.withAllAccess(); // same as withCRUD(true, true, true, true)
```

The rights are switched at the beginning of each operation and the previous rights are restored at its end,
and on close.

Searching
---------

### Filters and orders

The filters, the search-spec and the orders are stored by the builder and applied on each search:

```simplicite-java
bo
.filter("myField1", "ABC%") // same syntax as setFieldFilter
.filter("myField2", 123)
.filters(Map.of(
	"myField3", "is not null",
	"myField4", "in (1,5,8)"
))
.withSearchSpec("t.my_column > 100") // SQL where clause, previous search-spec restored on close
.order("myField1", 1)  // ascendant
.order("myField2", -2) // then descendant
.orderNullsFirst("myField2") // or orderNullsLast(field), orderNulls(field, "first"|"last"|null)
```

A `null` filter value means no filter on the field.

By default, the builder resets the previous filters of the instance before searching,
and resets the orders to the object default orders when no order is specified.
To keep the filters or the orders already set on the instance:

```simplicite-java
bo
.keepFilters(true)
.keepOrders(true)
```

### Count

```simplicite-java
long n = bo.filter("myField1", "ABC%").getCount();
// or within a chain
bo.filter("myField1", "ABC%").count(n -> AppLog.info("count = " + n));
```

### Search loop

The `search` method applies a function on each row matching the filters. The function receives:

- the row index (from 0 to count-1),
- the number of rows found,
- the object instance, already loaded with the row values,

and returns `true` to continue the loop or `false` to stop it.

```simplicite-java
try (BusinessObject bo = getGrant().getBusinessObject("User")) {
	bo
	.withAllAccess()
	.filters(Map.of(
		"usr_login", "bob%",
		"usr_lang", "ENU"
	))
	.search((index, count, obj) -> {
		try {
			AppLog.info("updating " + (index+1) + "/" + count + ": " + obj.getFieldValue("usr_login"));

			// the current row is ready to be updated
			bo
			.withValues(Map.of(
				"usr_lang", "FRA",
				"usr_lang_pref", "FRA"))
			.validateAndSave();

			return true; // continue
		}
		catch (ValidateException | SaveException e) {
			AppLog.error("There was an error", e);
			return false; // stop the loop
		}
	});
}
catch (SearchException e) {
	AppLog.error("There was an error", e);
}
```

The search first collects the IDs of the matching rows with a paginated search,
then selects each row before calling the function.
Thus, updating or deleting rows in the function does not corrupt the pagination,
and the memory usage stays low on large volumes.

Within the loop, each row is set in an update context: values given with `withValue(s)` are applied on this row.

`stream(function)` is an alias of `search(function)`.

### In-memory search

`stream()` returns all the matching rows as a `Stream<String[]>`.
The full result is loaded in memory, so it must be limited to small volumes,
or limited with `stream(maxRows)` to get the first `maxRows` rows:

```simplicite-java
try (BusinessObject bo = getGrant().getBusinessObject("User")) {
	bo
	.filter("usr_login", "bob%")
	.stream()
	.forEach(row -> {
		try {
			// a row of the stream is not loaded in the object: select it for update
			bo
			.forUpdate(row)
			.withValue("usr_lang", "FRA")
			.validateAndSave();
		}
		catch (ValidateException | SaveException e) {
			AppLog.error("There was an error", e);
		}
	});
}
catch (SearchException e) {
	AppLog.error("There was an error", e);
}
```

Selecting
---------

A single record can be selected from its row ID or its user-key, and consumed in the synchronized block:

```simplicite-java
try (BusinessObject bo = new BusinessObject(getGrant(), "MyObject")) {
	bo.select(rowId, obj -> AppLog.info("value = " + obj.getFieldValue("myField1")));
	bo.select(Map.of("myKey1", "A", "myKey2", "B"), obj -> { /* ... */ });
}
catch (GetException e) {
	AppLog.error("Record not found", e);
}
```

The `get` methods return the loaded instance instead:

```simplicite-java
ObjectDB obj = bo.get(rowId);            // by row ID
ObjectDB obj = bo.get("myKeyField", "A"); // by single field user-key
ObjectDB obj = bo.get(Map.of("myKey1", "A", "myKey2", "B")); // by user-key
```

:::note

`get` returns the instance outside the synchronized block: its values may change if the instance is shared.
Prefer the `select(..., function)` methods on shared instances.

:::

A `GetException` is thrown when no record is found, or when the user-key matches several records.

Creating, updating and copying
------------------------------

### Context

The record to work on is declared by a `for...` context, before giving its values:

| Method                                                             | Context                                                               |
|--------------------------------------------------------------------|-----------------------------------------------------------------------|
| `forCreate()` / `forCreate(keys)`                                  | New record (with optional user-key values)                            |
| `forCreateIfNotExists(keys)`                                       | New record, no error if the user-key already exists                   |
| `forUpdate(rowId)` / `forUpdate(row)`                              | Existing record by row ID (or by the row of a search result)          |
| `forUpdate(keys)` / `forUpdate(field, value)`                      | Existing record by user-key                                           |
| `forUpdateIfExists(keys)` / `forUpdateIfExists(field, value)`      | Existing record, no error if not found                                |
| `forCreateOrUpdate(keys)` / `forCreateOrUpdate(field, value)`      | Upsert: update the record if the user-key exists, otherwise create it |
| `forCopy(rowId)` / `forCopy(keys)` / `forCopy(field, value)`       | Copy of an existing record                                            |
| `forCopyIfNotExists(rowId)` / `forCopyIfNotExists(keys)`           | Copy, no error if the copied user-key already exists                  |
| `forDelete(rowId)` / `forDelete(keys)` / `forDelete(field, value)` | Existing record to delete                                             |

Only `forCreateOrUpdate` accesses the database immediately, to search the user-key
(it throws a `GetException` when several records match).
The other contexts are resolved by the final operation.

### Values

The values are stacked after the context, and applied on the record during the final operation:

```simplicite-java
bo
.forUpdate(rowId)
.withValue("myField1", "value1")
.withValues(Map.of("myField2", 123, "myField3", true))
.withValueIfNotNull("myField4", value4)  // ignored if null
.withValueIfNotEmpty("myField5", value5) // ignored if null or empty
.withOldValue("myField6", "previous")    // set the field old value
.validateAndSave();
```

`withValues` also accepts:

- a `String[]` of values in the object fields order (e.g. a row of a search result),
- another `ObjectDB` instance, to copy the values of the fields existing in both objects.

:::warning

The values must be given **after** the `for...` context: values given without context are ignored.

:::

Unknown fields are logged as warnings, unless `ignoreUnknownFields()` is called.

### Documents

Document and image fields are set with `withDocument`, from a file, a byte array or an input stream:

```simplicite-java
bo
.forUpdate(rowId)
.withDocument("myDocField", new File("/path/to/file.pdf"))
.withDocument("myImageField", "picture.png", bytes)
.withDocument("myOtherDocField", "data.csv", inputStream)
.validateAndSave();
```

### Functions

Since version 7.0 (backported in 6.3), `withFunction` applies a function on the object
during the `validate`/`save`/`validateAndSave`/`action` synchronized block.

Unlike `then`, which is called after the operation, the `withFunction` functions are called after the record is selected,
the init hooks and the `withValue(s)`/`withDocument` are applied, and just before the validation and save:

```simplicite-java
try (BusinessObject bo = new BusinessObject(getGrant(), "MyObject")) {
	bo
	.forCreateOrUpdate(Map.of("myKeyField", "bob"))
	.withValue("myField1", "value1")
	// applied on the selected record, before validate and save
	.withFunction(obj -> {
		if (obj.isNew())
			obj.setFieldValue("myField2", "created");
		obj.setFieldValue("myField3", obj.getFieldValue("myField1") + "-suffix");
	})
	.validateAndSave()
	// applied after the save
	.then(obj -> AppLog.info("saved row Id = " + obj.getRowId()));
}
catch (GetException | ValidateException | SaveException e) {
	AppLog.error("There was an error", e);
}
```

Several `withFunction` calls can be chained, and they are called in the declared order.
Like `withValue`, it must be called after a `for...` context.

### Notepads

A field with a notepad rendering keeps the history of notes. Use `withNotepad` to prepend a new note
with the current date and the user full name, like the UI does:

```simplicite-java
bo
.forUpdate(rowId)
.withNotepad("myNotepadField", "My new note")
.validateAndSave();
```

:::warning

Do not use `withValue` on a notepad field: it would replace the whole history instead of adding a note.

:::

### Validate and save

The final operation selects the record, applies the init hook (`initCreate`, `initUpdate`, `initCopy` or `initDelete`),
the user-key values of the context, the values, the documents and the functions, then:

| Method                | Operation                                                                              |
|-----------------------|----------------------------------------------------------------------------------------|
| `validate()`          | Validates the record without saving it                                                 |
| `save()`              | Saves the record without validation                                                    |
| `validateAndSave()`   | Validates then saves the record                                                        |
| `validateAndCreate()` | Same as `validateAndSave`, only in a creation or copy context (does nothing otherwise) |
| `validateAndUpdate()` | Same as `validateAndSave`, only in an update context (does nothing otherwise)          |

The validation errors are thrown in a `ValidateException`. The information and warning messages are returned to an optional function,
or later with `returns`:

```simplicite-java
bo
.forCreateOrUpdate("myKeyField", "bob")
.withValue("myField1", "value1")
.validateAndSave(msg -> AppLog.info("save message: " + msg))
.isNew(created -> AppLog.info(created ? "created" : "updated"))
.returns(msg -> AppLog.info("message: " + msg));
```

After a save, the context refers to the saved record (with its new row ID in case of creation):
an action can be invoked on it, or a function applied with `then`.

Several options change the save behavior:

| Method                  | Effect                                                                                |
|-------------------------|---------------------------------------------------------------------------------------|
| `ignoreInitHook()`      | Does not call the init hook after the selection                                       |
| `ignoreRedolog()`       | Does not write the undo/redo log of the operation                                     |
| `ignoreTimestamp()`     | Forces the update without the timestamp check, and keeps the previous timestamp in DB |
| `ignoreUnknownFields()` | Does not log unknown fields as warnings                                               |
| `withOrigin(origin)`    | Origin of the operation in the undo/redo log (`BO` by default)                        |

Each `ignore...` method also accepts a boolean argument.

Deleting
--------

```simplicite-java
try (BusinessObject bo = new BusinessObject(getGrant(), "MyObject")) {
	bo.delete(rowId);                        // by row ID
	bo.delete("myKeyField", "bob");          // by single field user-key
	bo.deleteIfExist(Map.of("myKey1", "A")); // no error if not found

	// search and delete all matching records
	bo
	.filter("myStatus", "CLOSED")
	.searchAndDelete();
}
catch (GetException | DeleteException e) {
	AppLog.error("There was an error", e);
}
```

`delete` throws a `GetException` when the record is not found, `deleteIfExist` ignores it.

Actions
-------

`action` invokes an action of the object, with optional parameters and an optional function to get the returned message.
With a `for...` context, the record is selected and prepared before the action (record action),
otherwise the action is invoked on the object (global action):

```simplicite-java
try (BusinessObject bo = new BusinessObject(getGrant(), "MyObject")) {
	bo
	.getTmpObject()
	.withAllAccess()
	.preserveContext()
	.forCreateOrUpdate(Map.of(
		"myKeyField1", "bob",
		"myKeyField2", "123"))
	.withValue("myField1", "value1")
	.validateAndSave()
	.action("MyActionName",
		Map.of("param1", "value1"),
		msg -> AppLog.info("action result = " + msg));
}
catch (GetException | ValidateException | SaveException | ActionException e) {
	AppLog.error("There was an error", e);
}
```

Other methods
-------------

| Method              | Description                                                                                             |
|---------------------|---------------------------------------------------------------------------------------------------------|
| `then(function)`    | Applies a function on the object instance, in a synchronized block with the builder rights              |
| `values(function)`  | Selects the record of the current context and applies a function on it                                  |
| `isNew(function)`   | Gives `true` to the function when the context is a creation (useful after a `forCreateOrUpdate`)        |
| `returns(function)` | Gives each information/warning message of the last validation/save to the function                      |
| `rowDiff(enabled)`  | Enables the `row_diff` calculation during search, on objects having such a field (e.g. history objects) |

The full list of methods is available in the [Javadoc](https://platform.simplicite.io/current/javadoc/com/simplicite/util/BusinessObject.html).
