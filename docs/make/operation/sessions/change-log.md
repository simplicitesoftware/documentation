---
sidebar_position: 30
title: Change Log
---

Historization
=============

It is possible to easily activate two types of historization on business objects: the change log and the history table.

Change log
----------

The change log records all activities done on the object (who, what changes, at what time). To enable it, the maker must:

- make sure that the system parameter `LOG_ACTIVITY` is enabled ("database": true), which is the default.
- check the "Data History: Change log" option in the business object settings.

:::warning

Currently, it is necessary to manually create a function on the "RedoLog" system object to give access to change-logs to end users.
Be sure to remove module filters to add this function.

:::

Child objects change logs
------------------------

The maker can retrieve redo logs of child objects into the parent **Change log panel**:

- Use the **Link option**: `Reassemble updates history?`

- Or by code:
  
```java
getLink("DemoProduct","demoPrdSupId").setMergeRedologs(true);
```

History table
-------------

The history table records all or part of an object's data in a dedicated table.

Enabling history creates a "Historic" object (e.g. `TrnProductHistoric`) in the same module as the business object.
It contains all the historized fields of the object, plus:

- a reference to the original record
- the historization date
- the user's login
- **[Since 6.3]** a **summary of updates** field, `row_diff`

:::note
The `row_diff` field is calculated on search:
it shows the differences between a record and its previous version (based on `row_id`).

It is currently used by the History panel, but it can also be added to other objects.
:::

When `FeatureFlag.HISTORY_DIFF_MODE` is enabled, this field is automatically added to the generated Historic object.
For Historic objects created before 6.3, add the field to the object fields manually if needed.

The flag is enabled by default and can be disabled through the [FEATURE_FLAGS](/versions/release-notes/v6-3#new-featureflags) system parameter:

```json
{
  "history_diff_mode": false
}
```

The `row_diff` feature can also compare sibling records of any object:

- add the `row_diff` field to the object
- call `setRowDiff(true)` to enable the calculation on search (e.g. in `postLoad`, for panel instances only)
- beware: the calculation runs many SQL queries and is slow, so never use it on large searches

A read-only function is created for the Historic object and must be granted for users to view it.
The object is not added to the model automatically, but the maker can add it manually.

The fields present in the Historic object determine which changes trigger historization.
For example, if the maker removes the "description" field from `TrnProductHistoric`,
the description no longer appears in the history snapshots, and changing the description no longer creates a new history row.

### **[Since 6.3]** New action to generate the Historic object

A new action on object definition is available to build the history object/table:

- Specify if the history is in descending order
- Select the fields to be historized

![](img/changelog1.png)

![](img/changelog2.png)

Then the action creates or updates the history object:

- with technical fields `row_idx`, `created_by_hist` and `created_dt_hist`
- and the foreign key `row_ref_id` to parent object with its referenced key fields
- and the selected fields to be historized on parent updates

This object can be updated manually by designers.

### Conditional historization

The maker can use the **`isHistoric` hook** to add business rules that conditionally trigger historization. This makes it possible to:

- Historize only when specific conditions are met
- Implement custom logic to determine when a snapshot should be created
- Add fine-grained control over what changes are recorded
- Restrict historization to specific user groups or responsibilities

Example:

```java
@Override
public boolean isHistoric() {
    // Only historize if status changes to "Validated"
    return this.getStatus() == "VALIDATED";
};
```

### **[Since 6.3]** Reassemble child updates history

The maker can now display the history of child objects within the parent object's history table:

- Check the **"Reassemble updates history"** option in the link setting
  
  ![](img/redolog.png)

- This will include child object changes in the parent's history view, providing a consolidated view of all related changes

Change Log vs History Table: Key differences
--------------------------------------------

### **Change Log (RedoLogs)** - Technical auditing tool

The **Change Log** is a **technical tracking system** that records every single change made to an object.

**Purpose:**

- Track who did what and when at a granular level
- Provide complete audit trail for technical troubleshooting
- Debugging and system analysis

**Key characteristics:**

- Records **all** changes without filtering
- Cannot be customized with business rules
- **Security consideration:** Shows all field changes, even for fields the current user cannot normally access

:::danger Security Warning

If the maker exposes the Change Log to end-users, they may see **data they don't have permission to view**.

:::

### **History Table** - Business-oriented historization

The **History Table** is designed for **end-users and business purposes**.

**Purpose:**

- Provide a safe, user-friendly view of object evolution
- Track business-relevant changes with custom rules
- Display change summaries without exposing restricted data

**Key characteristics:**

- Can be filtered using the `isHistoric` hook for business logic
- **[Since 6.3]** Includes an **Summary of updates** field showing a summary of changes
- **[Since 6.3]** Can reassemble child object updates for a consolidated view
- Respects field-level permissions and business rules
- Safe to expose to end-users

**Recommendation:** Use the History Table when the maker needs to show change tracking to business users,
as it provides better control over what is recorded and displayed.
