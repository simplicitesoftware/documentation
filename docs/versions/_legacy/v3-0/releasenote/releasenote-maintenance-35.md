---
sidebar_position: 280
title: Patch level 35
---

Version 3.0 maintenance 35 release note
=======================================

Changes
-------

- JVM system properties are now taken into account when setting globals
- `Grant.getParameter` returns `toString()` on non `String` values
- Improved index search for HSQLDB (`and` operator is used by default for multiple words, words can be prefixed by `+` to use `or` operator instead)
- Added case-insensitive search support for PostgreSQL using non SQL99 operator `ilike`
- Optimized IP/hostname checking at startup (to limit impact of "slow" DNS lookups)
- Added re-evaluation of field's default values and calculated expressions using `[ROWID]` after row ID is actually set
  (this allows for example default value expression like `[EXPR:Tool.format("ABC-%05d", Long.valueOf([ROWID]))]`
  to set the value of the field to `ABC-00123` at creation of  record with row ID `123`)
- Treeviews now use links translation when available
- Removed error if the `display` disposition hook is not implemented

Fixes
-----

- Fixed synchronize documents algorithm
- Fixed SQL injection vulnerability on index searches (for PostgreSQL and databases without fulltext search capability like HSQLDB)
- Fixed confusion between UI grant and API/IO grants when used within the same server session
- Fixed `select` object: final sort on `row_id` on specific requests has been removed for backward compatibility reasons
- Fixed final stream management in case of stream changes in the adapter's implementation
- Fixed modeler: add a workaround for recent Chrome issue: simple links were sometimes invisible
- Fixed date format in vCalendar events
- Fixed TSV (Tabs-separated values) and PSV (Pipe-separated values) imports from I/O
