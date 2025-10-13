---
sidebar_position: 80
title: Mapping
---

# Mapping

## What is a Mapping?

In **Simplicité**, a *Mapping* allows to copy or link data from one object (A) to another (B), **by value**, not by reference. This mechanism is used to populate fields, filter lists, or simulate relationships between business objects when a direct link does not exist or is not appropriate.

It provides a way to:
- Transfer field values between objects without persisting a relational reference.
- Dynamically populate a list of values via a data service, without saving them to the database.
- Create flexible and decoupled interactions between business objects.

## When should a Mapping be used?

Mappings are useful in several scenarios:

- **No relational link makes sense**: The two objects are conceptually unrelated in database terms, but need to share some data.
- **Copy by value**: You want to duplicate information rather than point to a source (e.g., copying customer info into an invoice).
- **Dynamic data sources**: You want to show values from a service or calculation.  

## Mapping Types

There are three kinds of mappings depending on the direction of the data flow:

- **In Mapping**  
  Filters the *mapped object* using the value from the *source attribute*.  
  → *Used for filtering / selecting data based on a field of the current object.*

- **Out Mapping**  
  Assigns the *mapped attribute* using the value from the *source attribute*.  
  → *Used for copying the value into the target.*

- **In/Out Mapping**  
  Combines both filtering and value transfer:  
  → *Used when the incoming value is used for both selection and data population.*

## How to configure a Mapping?

1. Go to **Business objects > Mapping** or access the Mapping section in the object field configuration.
2. Click **Create** to define a new mapping.
3. Fill in the fields:
   - **Name** – logical name of the mapping.
   - **Object  Linked object Code/ Source field** – The origin of the data.
   - **Mapping linked object Code / Mapped field** – The recipient of the value.
   - **Type** – In, Out, or In/Out.
   - **Module** – The Module to which it belongs.
4. Save and test the behavior in your business object form.

## Advanced configuration with Hooks

To further customize the behavior of a mapping, the following hook can be overridden in your object script:

```java
public void initDataMapSelect(String map, String field, Object value) {
    // Custom logic to define dynamic filtering or mapping logic
}
