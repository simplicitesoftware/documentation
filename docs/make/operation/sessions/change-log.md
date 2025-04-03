---
sidebar_position: 30
title: Change Log
---

Historization
====================

It is possible to easily activate two types of historization on business objects: the change log and the history table.

Change log
---------------------------

The change log allows you to log all activities done on the object (who, what changes, at what time). To enable it, you must:
- make sure that the system parameter `LOG_ACTIVITY` is enabled ("database": true), which is the default.
- check the "Data History: Change log" option in the business object settings.

<div class="error">Currently, it is necessary to manually create a function on the "RedoLog" system object to give access to change-logs to end users.Be sure to remove module filters to add this function.</div>

History table
---------------------------

The history table allows you to record all or part of an object in an *ad hoc* table.

Activating the history will result in the creation of a "Historic" object (e.g. `TrnProductHistoric`) in the same module as the business object, with all the fields of the object to be historized, plus:
- a reference to the creating record
- the date of historization
- the user's login

A read-only function is created on this historical object, which must be granted in order to view it. The object is not automatically added to the model, but it is possible to add it manually.

It is the presence of a field in the history object that determines which changes cause historization. For example, if we delete the object field "description" from the `TrnProductHistoric` object, not only will the description not appear in the "snapshot" taken at any time, but the change in description will not create a new row in the history.
