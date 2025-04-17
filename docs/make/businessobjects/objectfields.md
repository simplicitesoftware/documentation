---
sidebar_position: 40
title: Object Fields
---

# Object Fields

## What is an Object Field?

In Simplicité®, the **Object Field** is the link that connects a [Field](/make/businessobjects/fields) (global attribute) to a [Business Object](/make/businessobjects/business-objects). This is a core part of the platform's **meta-model**: an N-N relationship between Objects and Fields.

Each Object Field instance allows:
- Linking a **Field** to a **Business Object** creating the column in the object table  
- Overriding the properties of that Field **only for the given object** (translation, mandatory status, display properties, etc.)
- Controlling visibility and behavior of the field in context

## Understanding Object Fields

This layered design promotes **reusability** and **customization**:

- A single Field (e.g., `comment`) can be reused across hundreds of objects
- You can **override** the field's label, visibility, default value, etc., depending on the object
- Some Fields may exist without being linked to any object (used in actions, processes, etc.)
- Some Object Fields are used to **bring in joined data** from related objects (e.g., product price shown on an order)

## Creating Fields and Object Fields

When you add a Field to a Business Object through the **template editor**, you're actually creating a **[Field](/make/businessobjects/fields)** and an **Object Field**.   
We strongly recommend that you create Fields and object fields using the template editor.  
:::note
The template editor translates the field into the designer's language. You will need to pass over the translations for the other languages.   
:::
This object field stores all contextual information about the field for that object:

| Field property (global) | Can be overridden in Object Field? |
|-------------------------|------------------------------------|
| Logical name            | ✖ No                              |
| Type                    | ✖ No                              |
| Length                  | ✖ No                              |
| Classification          | ✖ No                              |
| Precision               | ✖ No                              |
| Minimum size            | ✖ No                              |
| Copy enabled            | ✖ No                              |
| Indexable               | ✖ No                              |
| Auto completion         | ✖ No                              |
| Allows to group by      | ✖ No                              |
| Bulk update             | ✖ No                              |
| List summation          | ✖ No                              |
| Auto-increment syntax   | ✖ No                              |
| Case                    | ✖ No                              |
| Rendering               | ✖ No                              |
| Right to left           | ✖ No                              |
| Label (translation)     | ✔ Yes                             |
| Mandatory status        | ✔ Yes                             |
| Default value           | ✔ Yes                             |
| Visibility              | ✔ Yes                             |
| Updatable status        | ✔ Yes                             |
| Functional key          | ✔ Yes                             |
| Search                  | ✔ Yes                             |
| Required Search         | ✔ Yes                             |
| Extended                | ✔ Yes                             |
| Extended on list        | ✔ Yes                             |
| Exportable              | ✔ Yes                             |



## One Field, multiple uses

A single Field can be:

- Used in **multiple** Business Objects via Object Fields  
- Used in a **single** Business Object with different roles (base field, joined field, calculated field, etc.)  
- **Not used** in any Business Object (yet still useful for workflows, tasks, custom scripts...)

Examples:
- `comment` → used on all forms for notes  
- `status` → reused in multiple workflow-related objects  
- `totalAmount` → a calculated field only used in the "Order" object  
- `actionTempField` → an internal field used only by an action, never shown on a form

## Key use cases

### 1. Field override per object

You want a `description` field to be optional in Product but mandatory in Article:

- Create one Field: `description` (type: text)
- Create two Object Fields:
  - Product → `description` (not mandatory)
  - Article → `description` (mandatory = true)

### 2. Reusing joined fields

You want to display the Supplier name on the Product form:

- Product has a foreign key to Supplier
- Use a **joined Object Field** to bring in `supplierName` from Supplier
- You can then use this joined field in list, form, search, etc.

### 3. Fields used outside of Business Objects

Some fields exist without being tied to a Business Object. For example:

- Fields used in **process attributes**
- Fields in a **scripted action form**
- Temporary fields used for **batch processing**

## Summary

| Concept          | Description                                         |
|------------------|-----------------------------------------------------|
| Field            | The global definition (name, type, size, etc.)      |
| Object Field     | The contextual use of the field in an object        |
| Object-Field link | N-N relationship between object and field          |
| Overridable?     | Label, mandatory status, visibility, etc.           |
| Optional link    | A Field may be linked to 0, 1 or N objects          |

## See also

- [Business Objects](/make/businessobjects/business-objects)
- [Fields](/make/businessobjects/fields)
- [Calculated Fields](/make/businessobjects/fields#calculated-fields)
