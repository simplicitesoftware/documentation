---
sidebar_position: 20
title: Expressions
---

Expressions
===========

It is possible to configure expressions for some of the configuration items:

- Business object field's default values
- Business object calculated field's
- Constraint conditions,
- Etc.

All expressions are using the **Rhino** server-side scripting language.

For ease of use, within the expressions you can also use preprocessed tags (enclosed in brackets `[]`).
These tags are substituted with their script equivalence before the scripted expression is actually evaluated.

Summary
-------

Here is a summary of available preprocessed tags that can be used in expressions.

> **Note**: The comprehensive descriptions below (and the [JavaDoc](https://platform.simplicite.io/current/javadoc/)) contains additional information.

| [Grant level](https://platform.simplicite.io/current/javadoc/com/simplicite/util/GrantCore.html#prepareExpression-java.lang.String-java.lang.String-boolean-boolean-) | [Object level](https://platform.simplicite.io/current/javadoc/com/simplicite/util/ObjectCore.html#prepareExpression-java.lang.String-java.lang.String:A-boolean-boolean-) | [External object level](https://platform.simplicite.io/current/javadoc/com/simplicite/util/ExternalObject.html#prepareExpression-java.lang.String-) |
|:------------------------:|:-------------------------------------------------:|:-------------------------:|
|                          | All of Grant + following:                         | All of Grant + following: |
| `[APPNAME]`              | `[CONTEXT:context]`                               | `[OBJECTID]`              |
| `[ENCODING]`             | `[OBJECTID]`                                      | `[OBJECT]`                |
| `[GRANT]`                | `[OBJECT]`                                        | `[OBJNAME]`               |
| `[LOGIN]`                | `[TABLE]`                                         | `[OBJLABEL]`              |
| `[USERID]`               | `[OBJNAME]`                                       | `[PARAM:parameter name]`  |
| `[LANG]`                 | `[OBJLABEL]`                                      |                           |
| `[HASRESP:group]`        | `[OBJINST]`                                       |                           |
| `[TEXT:code]`            | `[PARENT]`                                        |                           |
| `[SYSPARAM:name]`        | `[PARENTNAME]`                                    |                           |
| `[VERSION[:<module>]]`   | `[PARENTLABEL]`                                   |                           |
| `[ENV:<env var name>]`   | `[PARENTINST]`                                    |                           |
| `[PROP:<JVM prop name>]` | `[CHILDOF:parent object name[:parent ref field]]` |                           |
|                          | `[PANELOF:parent object name[:parent ref field]]` |                           |
|                          | `[REFFROM:object name[:ref field]]`               |                           |
|                          | `[DATAMAPFROM:object name]`                       |                           |
|                          | `[STATUS]`                                        |                           |
|                          | `[OLDSTATUS]`                                     |                           |
|                          | `[STATUSCHANGED]`                                 |                           |
|                          | `[ISNEW]`                                         |                           |
|                          | `[ISCOPIED]`                                      |                           |
|                          | `[ROWID]`                                         |                           |
|                          | `[FIELD:name]`                                    |                           |
|                          | `[COLUMN:input name]`                             |                           |
|                          | `[LABEL:input name]`                              |                           |
|                          | `[VALUE:input name]`                              |                           |
|                          | `[OLDVALUE:input name]`                           |                           |
|                          | `[DISPLAYVALUE:input name]`                       |                           |
|                          | `[DISPLAYOLDVALUE:input name]`                    |                           |
|                          | `[PARAM:parameter name]`                          |                           |

Description
-----------

Configuration items' expressions (e.g. calculated fields, constraints, state transition expressions, etc.) are in fact fragments of **Rhino** script code.

They are similar to the main script you can implement to extend the configuration item behavior.
The main difference is on the bindings namings, for instance for a business object the `this` you use in the main script is available as `obj` in the expressions.

In addition there are some preprocessed tags that are substituted to their corresponding script code at runtime. For instance `[VALUE:myField]` is in fact substituted as `obj.getFieldValue("myField")`. Using substituted tags is therefore not mandatory, consider them as "shorthands" to have easy to read expressions.

Here is the list of available substituted tags that you can use in expressions:

### UI URLs tags

#### Available tags:

- `[HOMEURL]` : Home URL (without quotes)
_ `[EXTOBJECTURL:<external object name>[:<optional URL parameters>]]` : External object URL (without quotes)
- `[EXTOBJECTPUBLICURL:<external object name>[:<optional URL parameters>]]` : External object URL (without quotes)
- `[CONTENTURL:<static content file name>]` : Static content URL (without quotes)
- `[IMAGERESOURCEURL:<resource code>[:<OBJECT|EXTOBJECT|DISPOSITION>:<business object or external object or disposition name>]]` : Image resource URL (without quotes)
- `[ICONRESOURCEURL:<resource code>[:<OBJECT|EXTOBJECT|DISPOSITION>:<business object or external object or disposition name>]]` : Icon resource URL (without quotes)
- `[CSSRESOURCEURL:<resource code>[:<OBJECT|EXTOBJECT|DISPOSITION>:<business object or external object or disposition name>]]` : CSS stylesheet resource URL (without quotes)
- `[JSRESOURCEURL:<resource code>[:<OBJECT|EXTOBJECT|DISPOSITION>:<business object or external object or disposition name>]]` : JavaScript resource URL (without quotes)
- `[HTMLRESOURCEURL:<resource code>[:<OBJECT|EXTOBJECT|DISPOSITION>:<business object or external object or disposition name>]]` : HTML resource URL (without quotes)

### Grant level

#### Available bindings:

- `grant`: the grant object

#### Available tags:

- `[GRANT]`: the user grant
- `[LOGIN]`: the user login
- `[USERID]`: the user row ID
- `[LANG]`: the user language
- `[HASRESP:<group>]` or `[HASRESPONSIBILITY:<group>]`: check if user has specified responsibility
- `[TEXT:<code>]`: value of a static text
- `[SYSPARAM:<name>]`: value of a system parameter (without surrounding quotes because a system parameter can be numeric)
- `[VERSION[:<module>]]`: value of the version of a specified module or value of the `VERSION` system parameter if no module specified
- `[ENV:<environment variable name>[:<default value>]]`: value of the specified environment variable or the specified default value if the environment variable is not set
- `[PROP:<system property name>[:<default value>]]`: value of the specified JVM property or the specified default value if the JVM property is not set
- `[APPLICATION]` or `[APPNAME]`: the application name
- `[ENCODING]`: the application encoding
- `[NOW]` (deprecated) or `[DATE`[:day offset]`]`: current date in service format yyyy-MM-dd (with optional day offset)
- `[TIME`[:millisecond offset]`]`: current time in internal format hh:mm:ss (with optional millisecond offset)
- `[DATETIME`[:millisecond offset]`]`: current datetime in service format yyyy-MM-dd HH:mm:ss (with optional millisecond offset)
- `[MONTH]`: current month in format MM
- `[WEEK]`: current week in format WW
- `[LOV:<list name>:<code>]` or `[LISTVALUE:<list name>:<code>]`: value of a list of values code
- `[TEXT:<code>]`: static text in user language
- `[OBJECT:<object name>[:<optional object instance name>]]`: the specified object (by default it uses temporary instance)

> **Note**: the UI URLs tags are also avilable at grant-level

### Business object level

#### Available bindings:

- `obj`: the object
- `row`: the current row (for lists)
- `parent`: the parent object (if relevant)
- `parentRefField`: the parent object reference field (if relevant)
- `context`: the context

> **Note**: The grant level bindings are also available at business object level.

#### Available tags:

- `[OBJECT]`: the current object
- `[TABLE]`: the current object table name (when applicable)
- `[OBJECTID]`: the current object's row ID
- `[OBJECTNAME]` or `[OBJNAME]`: the current object name
- `[OBJECTLABEL]` or `[OBJLABEL]`: the current object label
- `[OBJECTINSTANCENAME]` or `[OBJINST]`: the current object instance name
- `[PARENTOBJECT]` or `[PARENT]`: the current object parent object
- `[PARENTOBJECTNAME]` or `[PARENTNAME]`: the current object parent object name
- `[PARENTOBJECTLABEL]` or `[PARENTLABEL]`: the current object parent object label
- `[PARENTOBJECTINSTANCENAME]` or `[PARENTINSTANCENAME]` or `[PARENTINST]`: the current object parent object instance name
- `[CHILDOF:<parent object name>[:<optional parent ref field>]]`: check if current object is child object of specified object (thru optional specified ref field)
- `[PANELOF:<parent object name>[:<optional parent ref field>]]`: check if current object is panel child object of specified object (thru optional specified ref field)
- `[REFFROM:<object name>[:<optional ref field>]]` or `[REFERENCEDFROM:<object name>[:<optional ref field>]]`: check if current object is referenced object from specified object (thru optional specified ref field)
- `[DATAMAPFROM:<object name>]` or `[DATAMAPPEDFROM:<object name>]`: check if current object is data mapped object from specified object
- `[CONTEXT:<context>]`: check if in specified context
- `[OBJECTSTATUS]` or `[STATUS]`: the object current status (if object has a status)
- `[OBJECTOLDSTATUS]` or `[OLDSTATUS]`: the old object status if any (if object has a status, not available on lists)
- `[OBJECTSTATUSCHANGED]` or `[STATUSCHANGED]`: check if the object status has changed
- `[ISNEW]`: Check if object is in creation
- `[ISCOPIED]`: Check if object is in creation as a copy
- `[ROWID]`: Row ID value
- `[FIELD:<name>]` or `[INPUT:<input name>]`: the specified field
- `[COLUMN:<field input name>]`: the specified field column name
- `[LABEL:<field input name>]`: the specified field label
- `[VALUE:<field input name>]`: the specified input field current value
- `[OLDVALUE:<field input name>]`: the specified input field old value (not available on lists)
- `[PARAM:<parameter name>]`: object parameter value

> **Note**: The UI URLs and grant level tags are also available at business object level.

### External object level

#### Available bindings:

- `obj`: the external object

> **Note**: The grant level bindings are also available at business object level.

#### Available tags:

- `[OBJECT]`: the current external object
- `[OBJECTID]`: the current external object's row ID
- `[OBJECTNAME]` or `[OBJNAME]`: the current external object name
- `[OBJECTLABEL]` or `[OBJLABEL]`: the current external object label
- `[PARAM:<parameter name>]`: object parameter value

> **Note**: The UI URLs and grant level tags are also available at business object level.

Advanced
--------

It is possible to write complex expressions by using self calling functions such as:

```javascript
(function() {
    var res = "";
    // Do some complex stuff with res
    return res;
})();
```