---
title: Contextual helps
sidebar_position: 160
sidebar_class_name: hidden
---

Contextual helps
================

Introduction
------------

Contextual helps are in-app help messages displayed depending on the object's context. They are displayed in the form's header and in the list's header.

Features
--------

Contextual help allows makers to provide in-app help texts that are specific to business object context.  
These messages appear contextually in the UI to assist users with relevant information or instructions right where they need it.

Configuration
-------------

:::tip
Contextual helps are configured via a dedicated panel in the Business object's configuration.
:::

### Configuration Fields

| Field       | Description                                            |
| ----------- | ------------------------------------------------------ |
| Object code | The object for which the contextual help is configured |
| Context     | The context in which the contextual help is displayed  |
| Language    | The language of the contextual help                    |
| Help        | The help text to display                               |
| Module name | The module name of the contextual help                 |

### Configuration Options

#### Context field

| Option         | Use Case                                                                    |
| -------------- | --------------------------------------------------------------------------- |
| Search         | Displayed on in the object's search form                                    |
| List           | Displayed on the object's list                                              |
| Create form    | Displayed on the object's create form                                       |
| Update form    | Displayed on the object's update form                                       |
| Delete form    | Displayed in the confirmation dialog when deleting an element               |
| Read only form | Displayed on the object's form when the object is read only                 |
| Select         | Displayed on the object's reference selection list                          |
| Mapping        | Displayed on the object's mapping selection list                            |
| Linked list    | Displayed on the object's list when displayed as a panel of a parent object |
| Bulk update    | Displayed on the object's bulk update form                                  |

Using the Java API
------------------

The `setCtxHelp` method can be used to set the contextual help for a given context.

Example : Setting the contextual help for the create form

```java
@Override
   public void initCreate() {
   String help =
            """
            <strong>Welcome!</strong> Please ensure to fill all required fields.<br>
            <ul>
               <li>Point 1</li>
               <li>Point 2</li>
            </ul>
            """;
   setCtxHelp(ObjectCtxHelp.CTXHELP_CREATE, help);
   }
```

Read more
---------

- [Business objects](/make/businessobjects/business-objects)
- [Mapping](/make/businessobjects/mapping)
