---
sidebar_position: 150
title: Impacts
---

Impacts
=======

**Impacts** define the effect or result produced by a [Constraint](/make/businessobjects/constraints)
when its execution conditions are met. They are used to dynamically alter the behavior, properties,
or visibility of a business object and its attributes, without writing custom code.

Impacts are executed in the order they are configured and can override each other if multiple impacts target the same property.

Types of Impacts
----------------

Impacts can be applied to different levels of a business object:

### 1. **Object-level Impacts**

These affect the entire object and control high-level operations.
Choose **Apply to : Object property**:

- **Action** - Allow or prevent the execution of object actions
- **Copy** – Allow or prevent record duplication
- **Export** – Allow or prevent record export
- **Update all** – Allow or prevent bulk updates
- **Paginated** – Allow or prevent pagination in lists
- **Preset search** – Allow or prevent the use of preset searches
- **Use data form** – Allow or prevent form display.
- **Create** – Allow or prevent record creation.
- **Update** – Allow or prevent record modification.
- **Delete** – Allow or prevent record deletion.

### 2. **Attribute-level Impacts**

These target specific fields (attributes) of the business object.
Choose **Apply to : Field property**:

- **Update** – Allow or prevent a field from being updated
- **Copy** – Allow or prevent a field from being copied
- **Visible** – Show or hide a field on the form
- **Search** – Show or hide the object search
- **Mandatory** – Require a value for the field
- **Filter value** – Apply a filter to the field values
- **Default value** – Automatically populate a field with a computed or predefined value
- **Field value** – Initialize the value of the field
- **List of values** – Define or override the list of selectable values

### 3. **UI Element Visibility Impacts**

These manage the display of related UI components.
Choose **Apply to : Target visibility**:

- **Action** – Show or hide form actions
- **Field area** – Show or hide field areas within a form
- **Link** – Show or hide relationships
- **Object panel** – Toggle visibility of panels or views tied to the object.

How Impacts Work
----------------

When a Constraint's condition evaluates to **true**, its impacts are executed in the order configured.
The **value of the impacted property** is determined by evaluating the "Expression" field linked to the impact:

- For boolean properties (e.g., **visible**, **copy**, **mandatory**), the expression must return `true` or `false`.
- For value properties (e.g., **default value**,**value**), the expression should return the actual value to assign.

Order of Execution
------------------

The execution order is **critical**:

- Impacts run sequentially based on their defined order.
- A later impact can overwrite the result of an earlier one if both target the same property.

**Example**: If one impact hides a field and another later impact makes it visible, the last impact will override the previous one.

Back-end vs Front-end Impacts
-----------------------------

Impacts inherit their execution behavior from the parent constraint:

- **Front-end impacts** are executed in the browser (dynamic UI effects like field visibility).
- **Back-end impacts** are executed on the server (secure enforcement during save/validation).
- **Combined front and back impacts** offer both dynamic UI changes and server-side enforcement.

Best Practices
--------------

- Use **front-end impacts** for improving the user experience (e.g., dynamically showing/hiding fields).
- Always pair **critical business rules** with **back-end impacts** to ensure security and consistency.
- Keep impact order organized to avoid unexpected overrides.

Read more
---------

- [Constraints](/make/businessobjects/constraints)
- [Permissions to override properties](/make/usersrights/permissions)
